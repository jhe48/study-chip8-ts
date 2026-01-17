import { CPU } from './cpu';
import { Display } from './display';
import { Keyboard } from './keyboard';
import { Memory } from './memory';

export class Emulator {
  cpu: CPU;
  display: Display;
  keyboard: Keyboard;
  memory: Memory;

  constructor(rom: Uint8Array) {
    this.memory = new Memory();
    this.display = new Display();
    this.keyboard = new Keyboard();
    this.cpu = new CPU(this.memory, this.keyboard, this.display);

    this.memory.loadRom(rom);

    this.run();
  }

  run() {
    this.cpu.cycle();
    this.display.render();
    requestAnimationFrame(() => this.run());
  }

}
