import { beforeAll, vi } from 'vitest';

beforeAll(() => {
  HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
    // Mock the 2D rendering context methods used in Display class
    clearRect: vi.fn(),
    fillRect: vi.fn(),
    // Add other methods if your Display class uses them, e.g.,
    // fillStyle: null,
    // strokeStyle: null,
    // beginPath: vi.fn(),
    // stroke: vi.fn(),
    // moveTo: vi.fn(),
    // lineTo: vi.fn(),
    // closePath: vi.fn(),
  }));
});