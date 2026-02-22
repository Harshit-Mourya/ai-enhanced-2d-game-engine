# AI-Enhanced Real-Time 2D Game Engine

A browser-based, reusable 2D game engine built using **React**, **JavaScript**, and **SVG**, designed to explore real-time game loops, state-driven rendering, and future integration of lightweight AI techniques for adaptive gameplay.

This project is being developed as an **MCA Major Project** and focuses on engine architecture rather than a single game.

---

## 🚀 Project Overview

Traditional browser-based games often lack reusable architecture and clear separation between game logic and rendering.  
This project aims to design a **generic, engine-level system** that can be used to build multiple types of 2D games in the browser.

The engine is:

- Game-type agnostic
- UI/theme independent
- Fully browser-based
- Designed for real-time interaction

A simple demo game is included to demonstrate engine functionality.

---

## 🧱 Current Status: Foundation Phase ✅

The foundation phase of the engine is complete and demonstrates the core real-time pipeline.

### Implemented Features

- Real-time game loop using `requestAnimationFrame`
- Controlled loop lifecycle (start / stop)
- Centralized engine-owned game state
- SVG-based rendering pipeline using React
- Keyboard input handling (← ↑ ↓ →)
- 2D player movement within bounded game area
- Clean separation between engine logic and demo application logic

### Demo

The current demo displays a movable square controlled using arrow keys, serving as a proof-of-concept for:
