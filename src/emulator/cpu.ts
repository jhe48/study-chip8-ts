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
  private stack: Uint16Array;
  private sp: number; // Stack pointer

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
    this.stack = new Uint16Array(16);
    this.sp = 0;

    this.delayTimer = 0;
    this.soundTimer = 0;
    this.paused = false;
  }

  private push(value: number) {
    if (this.sp >= 16) {
      throw new Error('Stack overflow');
    }
    this.stack[this.sp] = value;
    this.sp++;
  }

  private pop(): number {
    if (this.sp === 0) {
      throw new Error('Stack underflow');
    }
    this.sp--;
    return this.stack[this.sp];
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
  }

  updateTimers(): void {
    if (this.delayTimer > 0) {
      this.delayTimer--;
    }
    if (this.soundTimer > 0) {
      this.soundTimer--;
    }
  }

  getSoundTimer(): number {
    return this.soundTimer;
  }

  getDelayTimer(): number {
    return this.delayTimer;
  }

  isPaused(): boolean {
    return this.paused;
  }

  pause(): void {
    this.paused = true;
  }

  resume(): void {
    this.paused = false;
  }

  private executeOpcode(opcode: number) {
    const x = (opcode & 0x0F00) >> 8;
    const y = (opcode & 0x00F0) >> 4;
    const kk = opcode & 0x00FF;
    const nnn = opcode & 0x0FFF;

    switch (opcode & 0xF000) {
      case 0x0000:
        switch (opcode) {
          case 0x00EE:
            this.pc = this.pop();
            break;
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
      case 0x2000:
        this.push(this.pc);
        this.pc = nnn;
        break;
      case 0x3000:
        if (this.V[x] === kk) {
          this.pc += 2;
        }
        break;
      case 0x4000:
        if (this.V[x] !== kk) {
          this.pc += 2;
        }
        break;
      case 0x5000:
        if (this.V[x] === this.V[y]) {
          this.pc += 2;
        }
        break;
      case 0x6000:
        this.V[x] = kk;
        break;
      case 0x7000:
        this.V[x] += kk;
        break;
      case 0x8000:
        switch (opcode & 0x000F) {
          case 0x0000:
            this.V[x] = this.V[y];
            break;
          case 0x0001:
            this.V[x] |= this.V[y];
            break;
          case 0x0002:
            this.V[x] &= this.V[y];
            break;
          case 0x0003:
            this.V[x] ^= this.V[y];
            break;
          case 0x0004:
            this.V[0xF] = (this.V[x] + this.V[y] > 255) ? 1 : 0;
            this.V[x] += this.V[y];
            break;
          case 0x0005:
            this.V[0xF] = (this.V[x] > this.V[y]) ? 1 : 0;
            this.V[x] -= this.V[y];
            break;
          case 0x0006:
            this.V[0xF] = this.V[x] & 0x1;
            this.V[x] >>= 1;
            break;
          case 0x0007:
            this.V[0xF] = (this.V[y] > this.V[x]) ? 1 : 0;
            this.V[x] = this.V[y] - this.V[x];
            break;
          case 0x000E:
            this.V[0xF] = (this.V[x] & 0x80) >> 7;
            this.V[x] <<= 1;
            break;
          default:
            console.log(`Unknown opcode: 0x${opcode.toString(16)}`);
        }
        break;
      case 0x9000:
        if (this.V[x] !== this.V[y]) {
          this.pc += 2;
        }
        break;
      case 0xA000:
        this.I = nnn;
        break;
      case 0xD000: {
        const n = opcode & 0x000F;
        this.display.draw(this.V, this.memory, this.I, x, y, n);
        break;
      }
      case 0xE000:
        switch (kk) {
          case 0x9E:
            if (this.keyboard.isKeyPressed(this.V[x])) {
              this.pc += 2;
            }
            break;
          case 0xA1:
            if (!this.keyboard.isKeyPressed(this.V[x])) {
              this.pc += 2;
            }
            break;
          default:
            console.log(`Unknown opcode: 0x${opcode.toString(16)}`);
        }
        break;
      case 0xF000:
        switch (kk) {
          case 0x07:
            this.V[x] = this.delayTimer;
            break;
          case 0x0A: {
            this.paused = true;
            const keyPressed = this.keyboard.getKeyPressed();
            if (keyPressed !== -1) {
              this.V[x] = keyPressed;
              this.paused = false;
            }
            break;
          }
          case 0x15:
            this.delayTimer = this.V[x];
            break;
          case 0x18:
            this.soundTimer = this.V[x];
            break;
          case 0x1E:
            this.I += this.V[x];
            break;
          case 0x29:
            this.I = this.V[x] * 5; // Font sprites are 5 bytes high
            break;
          case 0x33:
            this.memory.writeByte(this.I, Math.floor(this.V[x] / 100));
            this.memory.writeByte(this.I + 1, Math.floor((this.V[x] / 10) % 10));
            this.memory.writeByte(this.I + 2, this.V[x] % 10);
            break;
          case 0x55:
            for (let i = 0; i <= x; i++) {
              this.memory.writeByte(this.I + i, this.V[i]);
            }
            break;
          case 0x65:
            for (let i = 0; i <= x; i++) {
              this.V[i] = this.memory.readByte(this.I + i);
            }
            break;
          default:
            console.log(`Unknown opcode: 0x${opcode.toString(16)}`);
        }
        break;
      default:
        console.log(`Unknown opcode: 0x${opcode.toString(16)}`);
    }
  }

}
