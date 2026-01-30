# TM-Lang Editor

A modern, interactive web-based editor for [TM-Lang](https://github.com/Mystery-Coder/TM-Lang). Write, compile, and visualize Turing Machine programs.

- **Live Code Editor**: Syntax-highlighted editor with real-time feedback
- **WebAssembly Compiler**: Compile TM-Lang code directly in the browser
- **Interactive Visualizer**: Watch your Turing Machine execute step-by-step
- **State Machine Diagram**: Visual representation of states and transitions
- **Tape Visualization**: Real-time tape updates during simulation
- **C Code Export**: Generate optimized C code from your TM programs

## Features

### Real-Time Compilation

Compile TM-Lang programs instantly using WebAssembly-powered compiler. Get immediate feedback on syntax errors and compilation status.

### Visual Simulation

- Interactive tape viewer showing current position and symbols
- State machine graph with highlighted current state
- Step-by-step execution control
- Simulation speed adjustment
- Export GraphViz SVG or PNG

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **UI Components**: Custom components with Radix UI primitives
- **Icons**: Lucide React
- **Compiler**: TM-Lang WebAssembly module
