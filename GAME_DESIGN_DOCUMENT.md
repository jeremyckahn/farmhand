# Introduction

## 1. High-Level Overview

**Farmhand** is a charming and accessible farming simulation game where players take on the role of a modern farmer, building a thriving agricultural enterprise from the ground up. It combines classic resource management with a relaxed, player-driven pace, making it suitable for both quick check-ins and longer play sessions. The game is designed to be cross-platform, with a responsive UI that works equally well on desktop and mobile devices.

## 2. Game Concept

The core concept of Farmhand is to provide a satisfying and engaging farming experience that is both deep and approachable. Players start with a small, humble plot of land and a handful of tools. Through careful planning, hard work, and smart business decisions, they can expand their farm, unlock new crops and animals, and become a successful agriculturalist. The game emphasizes a sense of progression and accomplishment, with a clear path from a small-time farmer to a farming tycoon.

## 3. Genre

*   **Primary Genre:** Farming Simulation
*   **Secondary Genres:** Resource Management, Casual Game

## 4. Target Audience

Farmhand is aimed at a broad audience of players who enjoy relaxing, creative, and rewarding games. The primary target audience includes:

*   Fans of classic farming simulation games like *Stardew Valley*, *Harvest Moon*, and *Animal Crossing*.
*   Casual gamers looking for a game that can be played in short bursts.
*   Players who enjoy resource management and optimization challenges.
*   Mobile gamers looking for a deep and engaging experience on their phone or tablet.

The game's charming pixel art style and non-violent gameplay make it suitable for all ages.

## 5. What Makes it Fun? (The Core Fantasy)

The fun in Farmhand comes from several key elements:

*   **The Joy of Cultivation:** The simple, satisfying loop of tilling the soil, planting seeds, watering crops, and watching them grow is a core part of the game's appeal.
*   **A Sense of Ownership and Accomplishment:** Players have a high degree of control over their farm's layout and development. Seeing their farm grow from a small plot to a large, bustling enterprise is a powerful motivator.
*   **Economic Strategy:** The game isn't just about farming; it's also about business. Players must make smart decisions about what to plant, when to sell, and how to invest their earnings. The dynamic market and loan system add a layer of strategic depth.
*   **Constant Progression:** There's always something new to unlock or upgrade in Farmhand. Whether it's a new crop, a better tool, or a new crafting recipe, the game constantly rewards players with new content and goals.
*   **Social Interaction:** The multiplayer system allows players to connect with friends, visit each other's farms, and even influence the global market. This adds a social dimension to the game that enhances its longevity.
# Core Gameplay Loop

The gameplay in Farmhand is built around a simple yet addictive core loop. This loop is designed to be easy to understand for new players, while also offering enough depth to keep experienced players engaged. The loop can be broken down into the following stages:

## 1. Plant & Grow (The Work Phase)

This is the foundation of the game. In this phase, the player performs the essential tasks of a farmer:

*   **Prepare the Land:** The player uses tools like the hoe and shovel to till the soil and prepare it for planting.
*   **Plant Seeds:** The player purchases or uses seeds from their inventory to plant crops in their fields.
*   **Nurture the Crops:** The player must water their crops daily to ensure they grow. They can also use fertilizers to speed up growth or gain other benefits.
*   **Protect the Farm:** The player must deal with threats like weeds, which can choke out crops, and crows, which can eat them. Tools like the scythe and scarecrows are used to mitigate these threats.

## 2. Harvest & Collect (The Reward Phase)

After a certain number of in-game days, the player's crops will be ready for harvest. This is the payoff for their hard work:

*   **Harvesting:** The player uses a scythe to harvest their mature crops, which are then added to their inventory. The yield of the harvest can be increased by upgrading the scythe.
*   **Collecting Animal Products:** If the player owns cows, they can collect milk from them daily. The quality and quantity of milk can be influenced by how well the cows are cared for.

## 3. Sell & Earn (The Economic Phase)

Once the player has a collection of goods, they can sell them to earn money:

*   **The Market:** The player can sell their crops, animal products, and other items at the in-game market.
*   **Price Fluctuations:** The market is dynamic, with prices for goods changing daily. There are also random price events that can dramatically increase or decrease the value of certain items. This encourages players to be strategic about when they sell their goods.
*   **Multiplayer Impact:** In multiplayer games, the collective actions of all players can influence the market, creating a shared economic environment.

## 4. Upgrade & Expand (The Progression Phase)

The money earned from selling goods is used to improve and expand the farm:

*   **Buying New Seeds and Items:** The player can purchase a wide variety of new seeds and items from the shop, allowing them to grow different crops and access new gameplay mechanics.
*   **Upgrading Tools:** The player can upgrade their tools at the workshop, making them more efficient. For example, an upgraded watering can can water multiple plots at once.
*   **Expanding the Farm:** The player can purchase new fields to expand their farming operations.
*   **Investing in Infrastructure:** The player can purchase items like sprinklers to automate watering, or hugging machines to improve cow happiness.

## 5. The Loop Repeats

This core loop forms the backbone of the Farmhand experience. Each cycle of the loop allows the player to become more efficient, unlock new possibilities, and grow their farm into a larger and more impressive enterprise. The game's day/night cycle and seasonal changes add variety to this loop, ensuring that there's always something new to do and see.
# Game Mechanics

This section details the various systems and mechanics that make up the core gameplay of Farmhand.

## 1. Farming

Farming is the heart of Farmhand. It involves planting and harvesting crops for profit.

### 1.1. Crops

The game features a wide variety of crops that the player can grow. Each crop has a unique set of properties:

*   **Growth Time:** The number of in-game days it takes for a crop to mature. This is defined by a `cropTimeline` array, which specifies the duration of each growth stage.
*   **Seed Cost:** The price to purchase the crop's seeds from the shop.
*   **Base Value:** The base price for which the mature crop can be sold. This value can be affected by market fluctuations.
*   **Tiers:** Crops are categorized into tiers, with higher-tier crops generally being more profitable but also more difficult or expensive to grow.
*   **Watering:** All crops must be watered daily. A crop that is not watered will not advance to its next growth stage.
*   **Regrowth:** Some crops, like corn and tomatoes, can be harvested multiple times. After the first harvest, they will return to an earlier growth stage and produce more crops after a few more days.
*   **Special Properties:** Some crops have special properties. For example, grapes can be used to make wine, and some crops can be used in cooking recipes.

### 1.2. The Field

The player's farm is represented by a grid of plots. This is where all planting and growing takes place.

*   **Plots:** Each square in the grid is a plot. A plot can be in several states:
    *   **Fallow:** An empty, unprepared plot.
    *   **Tilled:** A plot that has been prepared with a hoe and is ready for planting.
    *   **Planted:** A plot that has a seed planted in it.
    *   **Watered:** A planted plot that has been watered for the day.
    *   **Fertilized:** A plot that has had fertilizer applied to it.
*   **Expansion:** The player starts with a single field. They can purchase additional fields to expand their farm and increase their planting capacity.
*   **Field Items:** Players can place special items on their fields to help with farming:
    *   **Sprinklers:** Automatically water adjacent plots every day.
    *   **Scarecrows:** Prevent crows from eating crops. A single scarecrow protects an entire field.

### 1.3. Tools

The player has a set of tools to help them with their farming tasks. Each tool can be upgraded to improve its efficiency.

*   **Hoe:** Used to till the soil and prepare it for planting. Upgrading the hoe allows the player to till multiple plots at once.
*   **Watering Can:** Used to water crops. Upgrading the watering can increases its water capacity and allows the player to water multiple plots at once.
*   **Scythe:** Used to harvest mature crops and clear weeds. Upgrading the scythe increases the number of crops harvested from a single plot.
*   **Shovel:** Used to clear plots of unwanted crops or items. Upgrading the shovel allows the player to clear multiple plots at once.

### 1.4. Threats

*   **Weeds:** Weeds can randomly appear in empty plots. If not cleared, they can spread to adjacent plots.
*   **Crows:** Crows can randomly appear and eat crops. They can be prevented by placing a scarecrow in the field.
*   **Storms:** Storms are random weather events that can damage crops and disable scarecrows for a day.

## 2. Animal Husbandry

In addition to growing crops, players can also raise animals on their farm. Currently, the only available animal is the cow.

### 2.1. Cows

Cows are a valuable source of daily income and add another layer of activity to the game.

*   **Acquisition:** Players can purchase cows from the shop. Each cow has a unique, randomly generated name.
*   **Housing:** Cows are kept in a cow pen, which can be accessed from the main farm view.
*   **Feeding:** Cows must be fed daily with cow feed, which can be purchased from the shop. A cow that is not fed may lose weight and produce lower-quality milk.
*   **Happiness:** Each cow has a happiness level, which can be increased by hugging it daily. Happier cows produce better milk.
*   **Milk Production:** Cows produce milk every day. The type and quality of the milk depends on several factors, including the cow's happiness, weight, and breed. There are several grades of milk (C, B, and A), as well as special types like "Rainbow Milk" and "Chocolate Milk."
*   **Automation:** Players can purchase a "Hugging Machine" to automatically hug their cows, ensuring their happiness level stays high.
*   **Breeding:** Players can breed their cows to produce offspring. The breeding system allows for the possibility of creating cows with better traits, such as higher-quality milk production.

## 3. Economy

The economy is a central part of Farmhand. Managing finances effectively is key to building a successful farm.

### 3.1. Currency

The game uses a single, unnamed currency for all transactions. All monetary values are handled by the `Dinero.js` library to ensure precision and avoid floating-point errors.

### 3.2. The Shop

The shop is where players can spend their money to purchase items that will help them grow their farm. The shop's inventory includes:

*   **Seeds:** A variety of crop seeds. More seeds are unlocked as the player levels up.
*   **Tools:** Basic farming tools.
*   **Field Items:** Sprinklers, scarecrows, and other items that can be placed on the field.
*   **Animals:** Cows and other animals.
*   **Consumables:** Cow feed, fertilizers, etc.

### 3.3. The Market

The market is where players sell their goods to earn money.

*   **Selling:** Players can sell any item from their inventory at the market.
*   **Price Fluctuations:** The prices of most goods fluctuate on a daily basis. This is determined by a random algorithm.
*   **Price Events:** The game features random price events that can cause a dramatic, temporary increase or decrease in the value of a specific item. These events are announced to the player at the start of the day.
*   **Multiplayer Market:** In a multiplayer game, the market is shared among all players. The collective selling of a particular item can drive its price down, creating a more dynamic and realistic economic simulation.

### 3.4. Loans

Players who are short on cash can take out a loan from the bank.

*   **Borrowing:** Players can borrow a certain amount of money, which is instantly added to their balance.
*   **Interest:** Loans accrue interest at the end of each day. The interest rate is fixed.
*   **Repayment:** Players can repay their loan at any time. The loan must be fully repaid before another loan can be taken out.

## 4. Crafting

Crafting allows players to turn their raw materials into more valuable items and upgrade their equipment.

### 4.1. The Workshop

The workshop is the main hub for crafting and upgrading. It is divided into several tabs:

*   **Forge:** This is where players can upgrade their tools. Upgrading a tool requires specific materials (like bronze, iron, gold, or silver ingots) and a certain amount of money. Ingots can be crafted from ore, which is found in the mine.
*   **Kitchen:** The kitchen allows players to cook dishes using the crops they've grown. Cooked dishes are generally more valuable than their individual ingredients and can provide special buffs or effects when consumed (though this mechanic is not yet fully implemented).
*   **Recycling:** The recycling tab allows players to break down unwanted items into their component parts. This is a good way to recover some value from obsolete equipment or excess materials.

### 4.2. The Cellar

The cellar is used for aging and fermenting goods, which significantly increases their value.

*   **Winemaking:** Players can use grapes to produce wine. The process involves:
    1.  Crushing grapes into juice.
    2.  Adding yeast to the juice.
    3.  Aging the wine in kegs.
    The final value of the wine is determined by the type of grape used, the quality of the ingredients, and the length of the aging process.
*   **Fermentation:** Other crops can be fermented in kegs to create artisanal products. For example, cucumbers can be turned into pickles, and cabbage can be turned into kimchi. Each fermentation recipe requires specific ingredients and a certain amount of time to complete.

## 5. Progression

Farmhand features a robust progression system that keeps players engaged and motivated.

### 5.1. Experience and Levels

*   **Gaining Experience:** Players earn experience points (XP) for almost every action they take, including:
    *   Harvesting crops
    *   Collecting animal products
    *   Crafting items
    *   Completing achievements
*   **Leveling Up:** When a player accumulates enough XP, they level up. The amount of XP required to reach the next level increases with each level.
*   **Level Unlocks:** Each new level unlocks new content for the player, such as:
    *   New seeds in the shop
    *   New crafting recipes
    *   Upgrades for tools and buildings
    *   Increased sprinkler range

### 5.2. Achievements

The game features an achievement system that provides players with long-term goals and rewards.

*   **Milestones:** Achievements are awarded for reaching specific milestones, such as:
    *   Harvesting a certain number of a specific crop.
    *   Earning a certain amount of money.
    *   Reaching a certain level.
    *   Crafting a certain number of items.
*   **Rewards:** Completing an achievement rewards the player with a significant amount of XP and sometimes a special item or unlock.

## 6. Multiplayer

Farmhand includes a multiplayer mode that allows players to connect and play together.

### 6.1. Peer-to-Peer Networking

The multiplayer system is built on a peer-to-peer (P2P) architecture using WebRTC. This means that players connect directly to each other, rather than through a central server. This approach is cost-effective and resilient.

### 6.2. Shared Market

In a multiplayer session, all players share the same market. This creates a dynamic, shared economy where the actions of one player can affect all others. For example, if one player sells a large quantity of a certain crop, the price of that crop will go down for everyone in the session.

### 6.3. Farm Visitation (Future Feature)

The P2P architecture lays the groundwork for players to visit each other's farms. While not fully implemented, the vision for this feature includes:

*   Viewing other players' farm layouts.
*   Trading items directly with other players.
*   Collaborative farming projects.

### 6.4. Chat

Players in a multiplayer session can communicate with each other using the in-game chat system.
# Game Assets

This section provides an overview of the art and audio assets used in Farmhand.

## 1. Art Style

Farmhand features a charming and colorful pixel art style. The art is created using Piskel, a free online editor for animated sprites and pixel art. The style is simple and clean, which makes the game easy to read and understand, even on small screens.

## 2. Sprites

The game uses a variety of sprites to represent the different objects and characters in the world.

*   **Crops:** Each crop has a set of sprites to represent its different stages of growth, from a small sprout to a fully mature plant.
*   **Items:** Every item in the game has a unique sprite that is displayed in the inventory, shop, and other UI elements. This includes raw materials, crafted goods, tools, and special items.
*   **Animals:** The cows have a set of sprites for different poses and actions, such as walking, eating, and sleeping. There are also different color variations for different breeds of cows.
*   **Characters:** While the player is represented by a first-person perspective, future updates may include player avatars and non-player characters (NPCs) with their own unique sprites.
*   **Environmental Details:** The game world is decorated with various environmental sprites, such as trees, rocks, and flowers, to make it feel more alive.

## 3. User Interface (UI)

The UI is designed to be clean, intuitive, and mobile-friendly. It uses a combination of custom-designed UI elements and components from the Material-UI library.

*   **Icons:** The UI makes extensive use of icons to represent actions, items, and information in a clear and concise way.
*   **Windows and Menus:** The game's menus and windows have a consistent design, with a simple, flat aesthetic and a clear visual hierarchy.
*   **Backgrounds:** Different screens and areas of the game have unique background images to give them a distinct look and feel.

## 4. Audio (Sound Effects and Music)

(Note: This section is based on the assumption of a complete GDD. The actual implementation of audio in the codebase has not been fully explored.)

Audio plays a crucial role in creating an immersive and satisfying gameplay experience.

*   **Sound Effects (SFX):** The game will feature a variety of sound effects to provide feedback for player actions, such as:
    *   The "swoosh" of a scythe.
    *   The "glug" of a watering can.
    *   The "cha-ching" of a sale.
    *   The "moo" of a cow.
*   **Background Music (BGM):** Each area of the game will have its own unique background music to set the mood:
    *   A relaxing, pastoral theme for the farm.
    *   An upbeat, bustling theme for the shop.
    *   A mysterious, ambient theme for the mine.
*   **UI Sounds:** The UI will have a set of sounds for common interactions, such as button clicks, notifications, and achievements.
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
