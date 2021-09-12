export const PROGRESS_SAVED_MESSAGE = 'Progress saved!'
export const RAIN_MESSAGE = 'It rained in the night!'
export const STORM_MESSAGE = 'There was a storm in the night!'
export const STORM_DESTROYS_SCARECROWS_MESSAGE =
  'There was a storm in the night! No scarecrows survived!'
export const FARM_PRODUCTS_TOOLTIP_TEXT =
  'This figure only includes sales of grown crops, crafted items, and animal products.'
export const DATA_DELETED = 'Your local game data has been deleted.'
export const INVALID_DATA_PROVIDED = 'Invalid Farmhand data provided.'
export const UPDATE_AVAILABLE =
  "A game update is available! Click this message to reload and see what's new."
export const SERVER_ERROR =
  "There was an issue communicating with the server. You can keep playing offline, and you'll be reconnected as soon as things improve."
export const CONNECTING_TO_SERVER = 'Connecting...'
export const DISCONNECTING_FROM_SERVER = 'Disconnecting...'
export const DISCONNECTED_FROM_SERVER = 'You are now playing offline.'
export const OUT_OF_COW_FEED_NOTIFICATION =
  "You're out of cow feed! Buy some more before your cows get hungry and run away!"
export const INVENTORY_FULL_NOTIFICATION = 'Your inventory is full!'

export const SHOVELED = 'Shoveled'

export const WATERING_CAN_ALT_TEXT = 'A watering can for hydrating plants.'
export const WATERING_CAN_HIDDEN_TEXT =
  'Select the watering can to water your crops'
export const SCYTHE_ALT_TEXT = 'A scythe for crop harvesting.'
export const SCYTHE_HIDDEN_TEXT = 'Select the scythe to harvest ripened crops'
export const HOE_ALT_TEXT =
  'A hoe for removing crops and disposing of them. Also returns replantable items to your inventory.'
export const HOE_HIDDEN_TEXT =
  'Select the hoe to clear crops, or replantable field items'
export const SHOVEL_ALT_TEXT = 'A shovel for digging up rocks.'
export const SHOVEL_HIDDEN_TEXT = 'Select the shovel to dig for ore'

export const TOOL_LEVEL_INFO = {
  SCYTHE: {
    DEFAULT: 'Basic - harvests one crop per plot',
    BRONZE: 'Bronze - harvests two crops per plot',
    IRON: 'Iron - harvests three crops per plot',
    SILVER: 'Silver - harvests four crops per plot',
    GOLD: 'Gold - harvests five crops per plot',
  },
  SHOVEL: {
    DEFAULT: 'Basic - has a 30% chance of digging up resources',
    BRONZE: 'Bronze - has a 40% chance of digging up resources',
    IRON: 'Iron - has a 50% chance of digging up resources',
    SILVER: 'Silver - has a 60% chance of digging up resources',
    GOLD: 'Gold - has a 70% chance of digging up resources',
  },
  WATERING_CAN: {
    DEFAULT: 'Basic - keeps plots watered for one day',
    BRONZE: 'Bronze - keeps plots watered for two days',
    IRON: 'Iron - keeps plots watered for three days',
    SILVER: 'Silver - keeps plots watered for four days',
    GOLD: 'Gold - keeps plots watered for five days',
  },
  HOE: {
    DEFAULT: 'Basic - destroys crops',
    BRONZE: 'Bronze - 20% chance to retrieve seeds when destroying crops',
    IRON: 'Iron - 40% chance to retrieve seeds when destroying crops',
    SILVER: 'Silver - 60% chance to retrieve seeds when destroying crops',
    GOLD: 'Gold - 80% chance to retrieve seeds when destroying crops',
  },
}
