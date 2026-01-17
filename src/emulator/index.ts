import { CPU } from './cpu';
import { Display } from './display';
import { Keyboard } from './keyboard';
import { Memory } from './memory';

export class Emulator {
  cpu: CPU;
  display: Display;
  keyboard: Keyboard;
  memory: Memory;

  private keyMap: Map<string, number> = new Map([
    ['1', 0x1], ['2', 0x2], ['3', 0x3], ['4', 0xC],
    ['q', 0x4], ['w', 0x5], ['e', 0x6], ['r', 0xD],
    ['a', 0x7], ['s', 0x8], ['d', 0x9], ['f', 0xE],
    ['z', 0xA], ['x', 0x0], ['c', 0xB], ['v', 0xF],
  ]);

  private running: boolean;

  constructor(rom: Uint8Array) {
    this.memory = new Memory();
    this.display = new Display();
    this.keyboard = new Keyboard();
    this.cpu = new CPU(this.memory, this.keyboard, this.display);

    this.memory.loadRom(rom);
    this.running = false;

    this.start();
  }

  start() {
    this.running = true;
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    this.run();
  }

  stop() {
    this.running = false;
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
  }

  onKeyDown = (event: KeyboardEvent) => {
    const chip8Key = this.keyMap.get(event.key);
    if (chip8Key !== undefined) {
      this.keyboard.setKey(chip8Key, true);
    }
  };

  onKeyUp = (event: KeyboardEvent) => {
    const chip8Key = this.keyMap.get(event.key);
    if (chip8Key !== undefined) {
      this.keyboard.setKey(chip8Key, false);
    }
  };

  run() {
    if (!this.running) {
      return;
    }

    this.cpu.cycle();
    this.display.render();
    requestAnimationFrame(() => this.run());
  }

}
