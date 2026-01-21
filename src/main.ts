import './style.css'
import { Emulator } from './emulator';

const DEFAULT_TITLE = 'CHIP-8 Emulator';
let emulator: Emulator | null = null;

function updatePageTitle(romName?: string): void {
  if (romName) {
    const displayName = romName.replace(/\.(ch8|c8|rom)$/i, '');
    document.title = `${displayName} - ${DEFAULT_TITLE}`;
  } else {
    document.title = DEFAULT_TITLE;
  }
}

document.getElementById('load-rom')!.addEventListener('click', () => {
  const romFileInput = document.getElementById('rom-file') as HTMLInputElement;
  const file = romFileInput.files?.[0];

  if (!file) {
    alert('Please select a ROM file.');
    return;
  }

  if (emulator) {
    emulator.stop();
    updatePageTitle();
  }

  const reader = new FileReader();
  reader.onload = (event) => {
    const rom = new Uint8Array(event.target!.result as ArrayBuffer);
    emulator = new Emulator(rom);
    updatePageTitle(file.name);
  };
  reader.readAsArrayBuffer(file);
});

