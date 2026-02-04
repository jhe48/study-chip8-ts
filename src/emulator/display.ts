export interface ColorTheme {
  background: string;
  foreground: string;
  name: string;
}

export const COLOR_THEMES: Record<string, ColorTheme> = {
  classic: { background: '#000000', foreground: '#ffffff', name: 'Classic' },
  green: { background: '#001100', foreground: '#33ff33', name: 'Green Phosphor' },
  amber: { background: '#1a1000', foreground: '#ffb000', name: 'Amber' },
  blue: { background: '#000011', foreground: '#33aaff', name: 'Blue' }
};

export class Display {
  private pixels: Uint8Array;
  private readonly width = 64;
  private readonly height = 32;
  private readonly scale = 10;
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private theme: ColorTheme = COLOR_THEMES.classic;

  constructor() {
    this.pixels = new Uint8Array(this.width * this.height);
    this.canvas = document.getElementById('display') as HTMLCanvasElement;
    this.context = this.canvas.getContext('2d')!;
    this.clear();
  }

  clear() {
    this.context.fillStyle = this.theme.background;
    this.context.fillRect(0, 0, this.width * this.scale, this.height * this.scale);
    for (let i = 0; i < this.pixels.length; i++) {
      this.pixels[i] = 0;
    }
  }

  setTheme(themeName: string): void {
    const newTheme = COLOR_THEMES[themeName];
    if (newTheme) {
      this.theme = newTheme;
      this.render();
    }
  }

  getThemeName(): string {
    for (const [name, theme] of Object.entries(COLOR_THEMES)) {
      if (theme === this.theme) return name;
    }
    return 'classic';
  }

  getPixel(x: number, y: number): number {
    return this.pixels[x + y * this.width];
  }

  setPixel(x: number, y: number, value: number) {
    this.pixels[x + y * this.width] = value;
  }

  draw(V: Uint8Array, memory: any, I: number, x: number, y: number, n: number) {
    V[0xF] = 0;

    for (let i = 0; i < n; i++) {
      const spriteByte = memory.readByte(I + i);
      for (let j = 0; j < 8; j++) {
        if ((spriteByte & (0x80 >> j)) !== 0) {
          const xCoord = (V[x] + j) % this.width;
          const yCoord = (V[y] + i) % this.height;
          const pixel = this.getPixel(xCoord, yCoord);

          if (pixel === 1) {
            V[0xF] = 1;
          }

          this.setPixel(xCoord, yCoord, pixel ^ 1);
        }
      }
    }
  }

  render() {
    this.context.fillStyle = this.theme.background;
    this.context.fillRect(0, 0, this.width * this.scale, this.height * this.scale);

    this.context.fillStyle = this.theme.foreground;
    for (let i = 0; i < this.pixels.length; i++) {
      if (this.pixels[i] === 1) {
        const x = (i % this.width) * this.scale;
        const y = Math.floor(i / this.width) * this.scale;
        this.context.fillRect(x, y, this.scale, this.scale);
      }
    }
  }

  getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

}
