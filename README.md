# Chip-8 Emulator

This is a fully functional Chip-8 emulator built with TypeScript and rendered on an HTML5 canvas. It allows you to load and play classic Chip-8 games in your web browser.

![IBM Logo](https://i.imgur.com/8a1ZVX8.png)

## Features

-   Full Chip-8 opcode implementation
-   Dynamic ROM loading from a local file
-   Keyboard input handling
-   Sound and delay timers
-   Basic UI with instructions
-   Unit tests for core components

## How to Run

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd <your-repo-name>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the development server:**
    ```bash
    npm run dev
    ```

4.  **Open your browser** and navigate to the URL provided by Vite (usually `http://localhost:5173/`).

## Where to Find ROMs

You can find a wide variety of public domain Chip-8 games and test ROMs at the [Chip-8 Archive](https://johnearnest.github.io/chip8Archive/). Download the ROM files (usually with a `.ch8` extension) and use the "Load ROM" button in the emulator to play them.

## Controls

The emulator uses the following keyboard mapping to represent the original Chip-8 hexadecimal keypad:

| Keyboard | Chip-8 Key |
| :------: | :--------: |
|  `1` `2` `3` `4`  |  `1` `2` `3` `C`  |
|  `Q` `W` `E` `R`  |  `4` `5` `6` `D`  |
|  `A` `S` `D` `F`  |  `7` `8` `9` `E`  |
|  `Z` `X` `C` `V`  |  `A` `0` `B` `F`  |

## Technologies Used

-   TypeScript
-   Vite
-   Vitest for unit testing

## Future Ideas

While this project is focused on Chip-8, building a Game Boy emulator would be a great next challenge, involving a different and more complex architecture (a Z80-like CPU).
