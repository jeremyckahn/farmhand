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
