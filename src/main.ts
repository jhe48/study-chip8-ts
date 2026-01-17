import './style.css'
import { Emulator } from './emulator';

let emulator: Emulator | null = null;

document.getElementById('load-rom')!.addEventListener('click', () => {
  const romFileInput = document.getElementById('rom-file') as HTMLInputElement;
  const file = romFileInput.files?.[0];

  if (!file) {
    alert('Please select a ROM file.');
    return;
  }

  if (emulator) {
    emulator.stop();
  }

  const reader = new FileReader();
  reader.onload = (event) => {
    const rom = new Uint8Array(event.target!.result as ArrayBuffer);
    emulator = new Emulator(rom);
  };
  reader.readAsArrayBuffer(file);
});

