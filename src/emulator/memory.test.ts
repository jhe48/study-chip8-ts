import { describe, it, expect, beforeEach } from 'vitest';
import { Memory } from './memory';

describe('Memory', () => {
  let memory: Memory;

  beforeEach(() => {
    memory = new Memory();
  });

  it('should initialize with 4KB of memory', () => {
    expect(memory).toBeDefined();
    // Assuming 4096 is the expected size based on constructor
    expect((memory as any).memory.length).toBe(4096); 
  });

  it('should load the font set into memory', () => {
    // Check a few known font set bytes
    expect(memory.readByte(0x50)).toBe(0xF0); // First byte of '0'
    expect(memory.readByte(0x51)).toBe(0x90); // Second byte of '0'
    expect(memory.readByte(0x55)).toBe(0x20); // First byte of '1'
  });

  it('should write a byte to memory', () => {
    memory.writeByte(0x00, 0xFF);
    expect(memory.readByte(0x00)).toBe(0xFF);
  });

  it('should read a byte from memory', () => {
    (memory as any).memory[0x100] = 0xAB;
    expect(memory.readByte(0x100)).toBe(0xAB);
  });

  it('should load a ROM into memory starting at 0x200', () => {
    const romData = new Uint8Array([0x12, 0x34, 0x56, 0x78]);
    memory.loadRom(romData);

    expect(memory.readByte(0x200)).toBe(0x12);
    expect(memory.readByte(0x201)).toBe(0x34);
    expect(memory.readByte(0x202)).toBe(0x56);
    expect(memory.readByte(0x203)).toBe(0x78);
  });
});
