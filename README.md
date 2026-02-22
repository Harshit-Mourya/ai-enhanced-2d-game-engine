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
Input → Game Loop → State Update → SVG Rendering

---

## 🛠 Tech Stack

- **Frontend Framework:** React (Vite)
- **Language:** JavaScript
- **Rendering:** SVG
- **Styling:** CSS (UI-agnostic engine design)
- **Version Control:** Git & GitHub

---

## 🧠 Design Philosophy

- The **engine** is independent of game themes, colors, and UI styling.
- Game-specific behavior (movement rules, visuals, themes) is handled at the application level.
- The architecture is designed to be extensible for AI, physics, and advanced gameplay systems.

---

## 🔮 Planned Features (Next Phases)

- Redux-based state management
- Physics and collision systems
- AI enemy behavior using Finite State Machines (FSM)
- Pathfinding algorithms (BFS / A\*)
- Rule-based adaptive difficulty system
- Multiple demo games (e.g., Pacman-style, platformer-style)
- Optional backend support for user progress persistence

---

## 🎓 Academic Context

This project also serves as a research-oriented study in:

- Real-time web-based game engines
- Feasibility of React and Redux for game engine architecture
- Lightweight, explainable AI techniques for browser-based games

---

## 📌 Note

This repository currently represents the **foundation phase** of the engine.  
Advanced gameplay mechanics and AI systems will be added incrementally in future phases.

---

## 👤 Author

**Harshit Mourya**  
MCA Student  
Major Project – AI-Enhanced Real-Time 2D Game Engine

This project is developed as part of the MCA curriculum, focusing on real-time web-based game engine design and AI-ready architecture.
