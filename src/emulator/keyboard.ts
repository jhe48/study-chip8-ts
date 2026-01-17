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
}
