# Technical Details

This section provides an overview of the technical architecture and technologies used to build Farmhand.

## 1. Architecture

Farmhand is a Progressive Web App (PWA) built with modern web technologies. This allows it to be played in a web browser or installed on a device for offline play. The architecture is designed to be modular, scalable, and maintainable.

*   **Component-Based UI:** The user interface is built using a component-based architecture with React. This allows for a high degree of code reuse and a clear separation of concerns.
*   **Decoupled Game Logic:** The core game logic is completely decoupled from the UI. It is implemented as a set of pure functions (reducers) that take the current game state and an action, and return a new game state. This makes the game logic easy to test and reason about.
*   **Centralized State Management:** The entire state of the game is stored in a single, immutable object. This makes it easy to track changes to the state over time and simplifies the process of saving and loading the game.

## 2. Technologies Used

*   **Frontend Framework:** [React](https://reactjs.org/) - A popular JavaScript library for building user interfaces.
*   **Build Tool:** [Vite](https://vitejs.dev/) - A fast and modern build tool for web development.
*   **UI Components:** [Material-UI](https://mui.com/) - A library of pre-built React components that implement Google's Material Design.
*   **Multiplayer:** [WebRTC](https://webrtc.org/) (via the [Trystero](https://github.com/dmotz/trystero) library) - A technology that enables real-time communication between web browsers, used for the game's peer-to-peer multiplayer.
*   **Offline Storage:** [localForage](https://github.com/localForage/localForage) - A library that provides a simple, asynchronous API for offline data storage in web browsers.
*   **Native Application:** [Electron](https://www.electronjs.org/) - A framework for building cross-platform desktop applications with web technologies.
*   **Art and Animation:** [Piskel](https://www.piskelapp.com/) - A free online editor for animated sprites and pixel art.

## 3. State Management

The management of the game state is a critical part of Farmhand's architecture.

*   **The State Object:** The entire game state is contained within a single JavaScript object, referred to as `farmhand.state`. This object includes everything from the player's inventory and money to the state of every plot on their farm.
*   **Immutability:** The state object is treated as immutable. This means that it is never modified directly. Instead, whenever a change needs to be made, a new state object is created with the updated values. This approach prevents a wide range of bugs and makes the game's behavior more predictable.
*   **Reducers:** All changes to the game state are handled by a set of functions called "reducers." Each reducer is responsible for a specific type of action (e.g., `harvestPlot`, `purchaseItem`). It takes the current state and an action payload as input, and returns a new state object.
*   **Versioning and Migration:** The `farmhand.state` object has a version number associated with it. This allows the game to handle changes to the data structure between updates. When a new version of the game is released with a different state structure, a migration function is used to automatically update the player's save data to the new format.
