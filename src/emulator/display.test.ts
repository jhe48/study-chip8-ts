import { describe, it, expect, beforeEach } from 'vitest';
import { Display } from './display';
import { Memory } from './memory';
import { CPU } from './cpu';
import { Keyboard } from './keyboard';

describe('Display', () => {
  let display: Display;
  let memory: Memory;
  let cpu: CPU;
  let keyboard: Keyboard;

  beforeEach(() => {
    // Mock the canvas element as it's not available in JSDOM
    document.body.innerHTML = '<canvas id="display"></canvas>';
    display = new Display();
    memory = new Memory();
    keyboard = new Keyboard();
    cpu = new CPU(memory, keyboard, display); // CPU needs Display, Memory, Keyboard
  });

  it('should initialize with a clear screen', () => {
    expect((display as any).pixels.every((pixel: number) => pixel === 0)).toBe(true);
  });

  it('should clear the screen', () => {
    (display as any).pixels[0] = 1;
    display.clear();
    expect((display as any).pixels.every((pixel: number) => pixel === 0)).toBe(true);
  });

  it('should set and get a pixel', () => {
    display.setPixel(0, 0, 1);
    expect(display.getPixel(0, 0)).toBe(1);
    display.setPixel(0, 0, 0);
    expect(display.getPixel(0, 0)).toBe(0);
  });

  it('should draw a sprite and set VF to 0 if no collision', () => {
    // Simple 1x1 sprite, no collision
    const romData = new Uint8Array([0xF0]); // Example sprite data
    memory.loadRom(romData); // Load sprite data into memory

    const V = (cpu as any).V;
    display.draw(V, memory, 0x200, 0, 0, 1); // Draw sprite at (0,0) from address 0x200 (where ROM is loaded)

    // Check if pixel (0,0) is set
    expect(display.getPixel(0, 0)).toBe(1);
    // Check if VF is 0 (no collision)
    expect(V[0xF]).toBe(0);
  });

  it('should draw a sprite and set VF to 1 if collision occurs', () => {
    // Simple 1x1 sprite, cause collision
    const romData = new Uint8Array([0xF0]); // Example sprite data
    memory.loadRom(romData);

    // Set pixel (0,0) before drawing to cause collision
    display.setPixel(0, 0, 1);

    const V = (cpu as any).V;
    display.draw(V, memory, 0x200, 0, 0, 1);

    // Check if pixel (0,0) is XORed (should be 0 now)
    expect(display.getPixel(0, 0)).toBe(0);
    // Check if VF is 1 (collision)
    expect(V[0xF]).toBe(1);
  });
});
