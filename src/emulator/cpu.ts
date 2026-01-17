import { Memory } from './memory';
import { Keyboard } from './keyboard';
import { Display } from './display';

export class CPU {
  private memory: Memory;
  private keyboard: Keyboard;
  private display: Display;

  // Registers
  private V: Uint8Array;
  private I: number;
  private pc: number;

  // Timers
  private delayTimer: number;
  private soundTimer: number;

  private paused: boolean;

  constructor(memory: Memory, keyboard: Keyboard, display: Display) {
    this.memory = memory;
    this.keyboard = keyboard;
    this.display = display;

    this.V = new Uint8Array(16);
    this.I = 0;
    this.pc = 0x200; // Programs start at 0x200

    this.delayTimer = 0;
    this.soundTimer = 0;
    this.paused = false;
  }

  private fetchOpcode(): number {
    const high = this.memory.readByte(this.pc);
    const low = this.memory.readByte(this.pc + 1);
    return (high << 8) | low;
  }

  cycle() {
    if (this.paused) {
      return;
    }

    const opcode = this.fetchOpcode();
    this.pc += 2;

    this.executeOpcode(opcode);

    if (this.delayTimer > 0) {
      this.delayTimer--;
    }

    if (this.soundTimer > 0) {
      this.soundTimer--;
    }
  }

  private executeOpcode(opcode: number) {
    const x = (opcode & 0x0F00) >> 8;
    const y = (opcode & 0x00F0) >> 4;
    const kk = opcode & 0x00FF;
    const nnn = opcode & 0x0FFF;

    switch (opcode & 0xF000) {
      case 0x0000:
        switch (opcode) {
          case 0x00E0:
            this.display.clear();
            break;
          default:
            console.log(`Unknown opcode: 0x${opcode.toString(16)}`);
        }
        break;
      case 0x1000:
        this.pc = nnn;
        break;
      case 0x6000:
        this.V[x] = kk;
        break;
      case 0x7000:
        this.V[x] += kk;
        break;
      case 0xA000:
        this.I = nnn;
        break;
      case 0xD000: {
        const n = opcode & 0x000F;
        this.display.draw(this.V, this.memory, this.I, x, y, n);
        break;
      }
      default:
        console.log(`Unknown opcode: 0x${opcode.toString(16)}`);
    }
  }

}
