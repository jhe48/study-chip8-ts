import './style.css'
import { Emulator } from './emulator';


async function init() {
  const response = await fetch('ibm-logo.ch8');
  const romHex = await response.text();
  const rom = new Uint8Array(romHex.match(/../g)!.map(h => parseInt(h, 16)));

  const emulator = new Emulator(rom);
}

document.addEventListener('DOMContentLoaded', init);

