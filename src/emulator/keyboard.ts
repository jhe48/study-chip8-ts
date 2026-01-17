export class Keyboard {
  private keys: Array<boolean>;

  constructor() {
    this.keys = new Array(16).fill(false);
  }

  isKeyPressed(keyCode: number): boolean {
    return this.keys[keyCode];
  }

  setKey(keyCode: number, isPressed: boolean): void {
    this.keys[keyCode] = isPressed;
  }

  getKeyPressed(): number {
    for (let i = 0; i < this.keys.length; i++) {
      if (this.keys[i]) {
        return i;
      }
    }
    return -1;
  }
}
