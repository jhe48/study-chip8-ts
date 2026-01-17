export class Display {
  private pixels: Uint8Array;
  private readonly width = 64;
  private readonly height = 32;
  private readonly scale = 10;
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;

  constructor() {
    this.pixels = new Uint8Array(this.width * this.height);
    this.canvas = document.getElementById('display') as HTMLCanvasElement;
    this.context = this.canvas.getContext('2d')!;
    this.clear();
  }

  clear() {
    this.context.fillStyle = 'black';
    this.context.fillRect(0, 0, this.width * this.scale, this.height * this.scale);
    for (let i = 0; i < this.pixels.length; i++) {
      this.pixels[i] = 0;
    }
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
    this.context.fillStyle = 'black';
    this.context.fillRect(0, 0, this.width * this.scale, this.height * this.scale);

    this.context.fillStyle = 'white';
    for (let i = 0; i < this.pixels.length; i++) {
      if (this.pixels[i] === 1) {
        const x = (i % this.width) * this.scale;
        const y = Math.floor(i / this.width) * this.scale;
        this.context.fillRect(x, y, this.scale, this.scale);
      }
    }
  }

}
