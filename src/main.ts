import './style.css'
import { Emulator } from './emulator';
import type { EmulatorState } from './emulator';
import { getHistory, addToHistory, getRomData } from './romHistory';
import type { RomHistoryEntry } from './romHistory';

const DEFAULT_TITLE = 'CHIP-8 Emulator';
const THEME_STORAGE_KEY = 'chip8-theme';
const SPEED_STORAGE_KEY = 'chip8-speed';

let emulator: Emulator | null = null;

// DOM Elements
const canvas = document.getElementById('display') as HTMLCanvasElement;
const statusBadge = document.getElementById('status-badge')!;
const themeSelect = document.getElementById('theme-select') as HTMLSelectElement;
const speedSlider = document.getElementById('speed-slider') as HTMLInputElement;
const speedValue = document.getElementById('speed-value')!;
const fullscreenBtn = document.getElementById('fullscreen-btn')!;
const muteBtn = document.getElementById('mute-btn')!;
const historyList = document.getElementById('history-list')!;
const romFileInput = document.getElementById('rom-file') as HTMLInputElement;
const loadRomBtn = document.getElementById('load-rom')!;

function updatePageTitle(romName?: string): void {
  if (romName) {
    const displayName = romName.replace(/\.(ch8|c8|rom)$/i, '');
    document.title = `${displayName} - ${DEFAULT_TITLE}`;
  } else {
    document.title = DEFAULT_TITLE;
  }
}

function updateStatusBadge(state: EmulatorState): void {
  statusBadge.textContent = state.charAt(0).toUpperCase() + state.slice(1);
  statusBadge.className = state;
}

function loadROM(file: File): void {
  if (emulator) {
    emulator.stop();
    updatePageTitle();
  }

  const reader = new FileReader();
  reader.onload = (event) => {
    const rom = new Uint8Array(event.target!.result as ArrayBuffer);
    emulator = new Emulator(rom);

    // Apply saved settings
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme) {
      emulator.display.setTheme(savedTheme);
    }
    emulator.setCyclesPerFrame(parseInt(speedSlider.value, 10));

    updatePageTitle(file.name);
    updateStatusBadge(emulator.getState());
    addToHistory(file.name, rom);
    renderHistoryList();
  };
  reader.readAsArrayBuffer(file);
}

function loadROMFromHistory(entry: RomHistoryEntry): void {
  if (emulator) {
    emulator.stop();
    updatePageTitle();
  }

  const rom = getRomData(entry);
  emulator = new Emulator(rom);

  // Apply saved settings
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (savedTheme) {
    emulator.display.setTheme(savedTheme);
  }
  emulator.setCyclesPerFrame(parseInt(speedSlider.value, 10));

  updatePageTitle(entry.name);
  updateStatusBadge(emulator.getState());
}

function renderHistoryList(): void {
  const history = getHistory();
  historyList.innerHTML = '';

  history.forEach(entry => {
    const li = document.createElement('li');
    li.textContent = entry.name;
    li.addEventListener('click', () => loadROMFromHistory(entry));
    historyList.appendChild(li);
  });
}

// ROM loading via button
loadRomBtn.addEventListener('click', () => {
  const file = romFileInput.files?.[0];
  if (!file) {
    alert('Please select a ROM file.');
    return;
  }
  loadROM(file);
});

// Drag and drop
canvas.addEventListener('dragover', (e) => {
  e.preventDefault();
  canvas.classList.add('drag-over');
});

canvas.addEventListener('dragleave', () => {
  canvas.classList.remove('drag-over');
});

canvas.addEventListener('drop', (e) => {
  e.preventDefault();
  canvas.classList.remove('drag-over');

  const file = e.dataTransfer?.files[0];
  if (file && /\.(ch8|c8|rom)$/i.test(file.name)) {
    loadROM(file);
  }
});

// Theme selector
themeSelect.addEventListener('change', () => {
  const theme = themeSelect.value;
  localStorage.setItem(THEME_STORAGE_KEY, theme);
  if (emulator) {
    emulator.display.setTheme(theme);
  }
});

// Speed slider
speedSlider.addEventListener('input', () => {
  const speed = parseInt(speedSlider.value, 10);
  speedValue.textContent = speed.toString();
  localStorage.setItem(SPEED_STORAGE_KEY, speed.toString());
  if (emulator) {
    emulator.setCyclesPerFrame(speed);
  }
});

// Fullscreen
fullscreenBtn.addEventListener('click', () => {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    canvas.requestFullscreen();
  }
});

// Mute toggle
muteBtn.addEventListener('click', () => {
  if (emulator) {
    const muted = !emulator.audio.isMuted();
    emulator.audio.setMuted(muted);
    muteBtn.textContent = muted ? 'Unmute' : 'Mute';
  }
});

// Keyboard shortcuts
window.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && emulator) {
    e.preventDefault();
    if (emulator.getState() === 'running') {
      emulator.pause();
    } else if (emulator.getState() === 'paused') {
      emulator.resume();
    }
    updateStatusBadge(emulator.getState());
  }
});

// Initialize on page load
function init(): void {
  // Load saved theme
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (savedTheme) {
    themeSelect.value = savedTheme;
  }

  // Load saved speed
  const savedSpeed = localStorage.getItem(SPEED_STORAGE_KEY);
  if (savedSpeed) {
    speedSlider.value = savedSpeed;
    speedValue.textContent = savedSpeed;
  }

  // Render history list
  renderHistoryList();

  // Set initial status
  updateStatusBadge('stopped');
}

init();
