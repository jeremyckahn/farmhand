var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// api-src/get-market-data.ts
import { promisify } from "util";
import "redis";

// src/enums.ts
var cropType = (
  /** @type {const} */
  {
    ASPARAGUS: "ASPARAGUS",
    CARROT: "CARROT",
    CORN: "CORN",
    GARLIC: "GARLIC",
    GRAPE: "GRAPE",
    JALAPENO: "JALAPENO",
    OLIVE: "OLIVE",
    ONION: "ONION",
    PEA: "PEA",
    POTATO: "POTATO",
    PUMPKIN: "PUMPKIN",
    SOYBEAN: "SOYBEAN",
    SPINACH: "SPINACH",
    SUNFLOWER: "SUNFLOWER",
    STRAWBERRY: "STRAWBERRY",
    SWEET_POTATO: "SWEET_POTATO",
    TOMATO: "TOMATO",
    WATERMELON: "WATERMELON",
    WHEAT: "WHEAT",
    WEED: "WEED"
  }
);
var recipeType = (
  /** @type {const} */
  {
    FERMENTATION: "FERMENTATION",
    FORGE: "FORGE",
    KITCHEN: "KITCHEN",
    RECYCLING: "RECYCLING",
    WINE: "WINE"
  }
);
var fieldMode = (
  /** @type {const} */
  {
    CLEANUP: "CLEANUP",
    FERTILIZE: "FERTILIZE",
    HARVEST: "HARVEST",
    MINE: "MINE",
    OBSERVE: "OBSERVE",
    PLANT: "PLANT",
    SET_SPRINKLER: "SET_SPRINKLER",
    SET_SCARECROW: "SET_SCARECROW",
    WATER: "WATER"
  }
);
var stageFocusType = (
  /** @type {const} */
  {
    NONE: "NONE",
    // Used for testing
    HOME: "HOME",
    FIELD: "FIELD",
    FOREST: "FOREST",
    SHOP: "SHOP",
    COW_PEN: "COW_PEN",
    INVENTORY: "INVENTORY",
    WORKSHOP: "WORKSHOP",
    CELLAR: "CELLAR"
  }
);
var itemType = (
  /** @type {const} */
  {
    COW_FEED: "COW_FEED",
    CRAFTED_ITEM: "CRAFTED_ITEM",
    CROP: "CROP",
    FERTILIZER: "FERTILIZER",
    FUEL: "FUEL",
    HUGGING_MACHINE: "HUGGING_MACHINE",
    MILK: "MILK",
    ORE: "ORE",
    SCARECROW: "SCARECROW",
    SPRINKLER: "SPRINKLER",
    STONE: "STONE",
    TOOL_UPGRADE: "TOOL_UPGRADE",
    WEED: "WEED"
  }
);
var cowColors = (
  /** @type {const} */
  {
    BLUE: "BLUE",
    BROWN: "BROWN",
    GREEN: "GREEN",
    ORANGE: "ORANGE",
    PURPLE: "PURPLE",
    RAINBOW: "RAINBOW",
    WHITE: "WHITE",
    YELLOW: "YELLOW"
  }
);
var { RAINBOW, ...standardCowColors } = cowColors;
var toolType = (
  /** @type {const} */
  {
    SCYTHE: "SCYTHE",
    SHOVEL: "SHOVEL",
    HOE: "HOE",
    WATERING_CAN: "WATERING_CAN"
  }
);
var toolLevel = (
  /** @type {const} */
  {
    UNAVAILABLE: "UNAVAILABLE",
    DEFAULT: "DEFAULT",
    BRONZE: "BRONZE",
    IRON: "IRON",
    SILVER: "SILVER",
    GOLD: "GOLD"
  }
);
var cropFamily = {
  GRAPE: "GRAPE"
};
var grapeVariety = {
  CHARDONNAY: "CHARDONNAY",
  SAUVIGNON_BLANC: "SAUVIGNON_BLANC",
  //PINOT_BLANC: 'PINOT_BLANC',
  //MUSCAT: 'MUSCAT',
  //RIESLING: 'RIESLING',
  //MERLOT: 'MERLOT',
  CABERNET_SAUVIGNON: "CABERNET_SAUVIGNON",
  //SYRAH: 'SYRAH',
  TEMPRANILLO: "TEMPRANILLO",
  NEBBIOLO: "NEBBIOLO"
};

// src/data/recipes.ts
var recipes_exports = {};
__export(recipes_exports, {
  bread: () => bread,
  bronzeIngot: () => bronzeIngot,
  burger: () => burger,
  butter: () => butter,
  carrotSoup: () => carrotSoup,
  cheese: () => cheese,
  chicknPotPie: () => chicknPotPie,
  chocolate: () => chocolate,
  chocolateSoyMilk: () => chocolateSoyMilk,
  compost: () => compost,
  fertilizer: () => fertilizer,
  flour: () => flour,
  frenchOnionSoup: () => frenchOnionSoup,
  friedTofu: () => friedTofu,
  garlicBread: () => garlicBread,
  garlicFries: () => garlicFries,
  goldIngot: () => goldIngot,
  hotSauce: () => hotSauce,
  ironIngot: () => ironIngot,
  jackolantern: () => jackolantern,
  oliveOil: () => oliveOil,
  onionRings: () => onionRings,
  popcorn: () => popcorn,
  pumpkinPie: () => pumpkinPie,
  rainbowCheese: () => rainbowCheese,
  salsa: () => salsa,
  salt: () => salt,
  silverIngot: () => silverIngot,
  soyMilk: () => soyMilk,
  spaghetti: () => spaghetti,
  spicyCheese: () => spicyCheese,
  spicyPickledGarlic: () => spicyPickledGarlic,
  strawberryJam: () => strawberryJam,
  summerSalad: () => summerSalad,
  sunButter: () => sunButter,
  sweetPotatoFries: () => sweetPotatoFries,
  sweetPotatoPie: () => sweetPotatoPie,
  tofu: () => tofu,
  vegetableOil: () => vegetableOil,
  wineCabernetSauvignon: () => wineCabernetSauvignon,
  wineChardonnay: () => wineChardonnay,
  wineNebbiolo: () => wineNebbiolo,
  wineSauvignonBlanc: () => wineSauvignonBlanc,
  wineTempranillo: () => wineTempranillo,
  yeast: () => yeast
});

// src/constants.ts
var { freeze } = Object;
var MEMOIZE_CACHE_CLEAR_THRESHOLD = 10;
var PURCHASEABLE_FIELD_SIZES = freeze(
  /* @__PURE__ */ new Map([
    [1, { columns: 8, rows: 12, price: 1e3 }],
    [2, { columns: 10, rows: 16, price: 5e3 }],
    [3, { columns: 12, rows: 18, price: 2e4 }]
  ])
);
var PURCHASABLE_FOREST_SIZES = freeze(
  /* @__PURE__ */ new Map([
    [1, { columns: 4, rows: 2, price: 1e5 }],
    [2, { columns: 4, rows: 3, price: 2e5 }],
    [3, { columns: 4, rows: 4, price: 3e5 }]
  ])
);
var LARGEST_PURCHASABLE_FIELD_SIZE = (
  /** @type {farmhand.purchaseableFieldSize} */
  PURCHASEABLE_FIELD_SIZES.get(
    PURCHASEABLE_FIELD_SIZES.size
  )
);
var PURCHASEABLE_COMBINES = freeze(
  /* @__PURE__ */ new Map([[1, { type: "Basic", price: 25e4 }]])
);
var PURCHASEABLE_COMPOSTERS = freeze(
  /* @__PURE__ */ new Map([[1, { type: "Basic", price: 1e3 }]])
);
var PURCHASEABLE_SMELTERS = freeze(
  /* @__PURE__ */ new Map([[1, { type: "Basic", price: 25e4 }]])
);
var PURCHASEABLE_COW_PENS = freeze(
  /* @__PURE__ */ new Map([
    [1, { cows: 10, price: 1500 }],
    [2, { cows: 20, price: 1e4 }],
    [3, { cows: 30, price: 5e4 }]
  ])
);
var PURCHASEABLE_CELLARS = freeze(
  /* @__PURE__ */ new Map([
    [1, { space: 10, price: 25e4 }],
    [2, { space: 20, price: 75e4 }],
    [3, { space: 30, price: 2e6 }]
  ])
);
var INITIAL_SPRINKLER_RANGE = 1;
var COW_FEED_ITEM_ID = "cow-feed";
var HUGGING_MACHINE_ITEM_ID = "hugging-machine";
var NOTIFICATION_DURATION = import.meta.env?.MODE === "test" ? 1 : 6e3;
var STAGE_TITLE_MAP = {
  [stageFocusType.HOME]: "Home",
  [stageFocusType.FIELD]: "Field",
  [stageFocusType.FOREST]: "Forest",
  [stageFocusType.SHOP]: "Shop",
  [stageFocusType.COW_PEN]: "Cows",
  [stageFocusType.WORKSHOP]: "Workshop",
  [stageFocusType.CELLAR]: "Cellar"
};
var RECIPE_INGREDIENT_VALUE_MULTIPLIER = 1.25;
var TOOLBELT_FIELD_MODES = /* @__PURE__ */ new Set([
  fieldMode.CLEANUP,
  fieldMode.HARVEST,
  fieldMode.WATER,
  fieldMode.MINE
]);
var COAL_SPAWN_CHANCE = 0.15;
var STONE_SPAWN_CHANCE = 0.4;
var SALT_ROCK_SPAWN_CHANCE = 0.3;
var BRONZE_SPAWN_CHANCE = 0.4;
var GOLD_SPAWN_CHANCE = 0.07;
var IRON_SPAWN_CHANCE = 0.33;
var SILVER_SPAWN_CHANCE = 0.2;
var HOE_LEVEL_TO_SEED_RECLAIM_RATE = {
  [toolLevel.DEFAULT]: 0,
  [toolLevel.BRONZE]: 0.25,
  [toolLevel.IRON]: 0.5,
  [toolLevel.SILVER]: 0.75,
  [toolLevel.GOLD]: 1
};
var COW_COLORS_HEX_MAP = {
  [cowColors.BLUE]: "#8ff0f9",
  [cowColors.BROWN]: "#b45f28",
  [cowColors.GREEN]: "#65f295",
  [cowColors.ORANGE]: "#ff7031",
  [cowColors.PURPLE]: "#d884f2",
  [cowColors.WHITE]: "#ffffff",
  [cowColors.YELLOW]: "#fff931"
};
var STANDARD_VIEW_LIST = [stageFocusType.SHOP, stageFocusType.FIELD];
var HEARTBEAT_INTERVAL_PERIOD = 10 * 1e3;
var GRAPES_REQUIRED_FOR_WINE = 50;
var YEAST_REQUIREMENT_FOR_WINE_MULTIPLIER = 5;

// src/utils/memoize.ts
import fastMemoize from "fast-memoize";
var MemoizeCache = class {
  cache = {};
  /**
   * @param {Object} [config] Can also contain the config options used to
   * configure fast-memoize.
   * @param {number} [config.cacheSize]
   * @see https://github.com/caiogondim/fast-memoize.js
   */
  constructor({ cacheSize = MEMOIZE_CACHE_CLEAR_THRESHOLD } = {}) {
    this.cacheSize = cacheSize;
  }
  has(key) {
    return key in this.cache;
  }
  get(key) {
    return this.cache[key];
  }
  set(key, value) {
    if (Object.keys(this.cache).length > this.cacheSize) {
      this.cache = {};
    }
    this.cache[key] = value;
  }
};
var memoize = (fn, config) => fastMemoize(fn, {
  cache: { create: () => new MemoizeCache(config) },
  ...config
});

// src/utils/getCropLifecycleDuration.ts
var getCropLifecycleDuration = memoize(({ cropTimeline }) => {
  return cropTimeline.reduce((acc, value) => {
    return acc + value;
  }, 0);
});

// src/data/crop.ts
var { freeze: freeze2 } = Object;
var crop = ({
  cropTimeline,
  growsInto,
  tier = 1,
  isSeed = Boolean(growsInto),
  cropLifecycleDuration = getCropLifecycleDuration({ cropTimeline }),
  id = "",
  name = "",
  ...rest
}) => freeze2(
  /** @type {farmhand.item} */
  {
    id,
    name,
    cropTimeline,
    doesPriceFluctuate: true,
    tier,
    type: itemType.CROP,
    value: 10 + cropLifecycleDuration * tier * (isSeed ? 1 : 3),
    ...isSeed && {
      enablesFieldMode: fieldMode.PLANT,
      growsInto,
      isPlantableCrop: true
    },
    ...rest
  }
);
var fromSeed = ({ cropTimeline, cropType: cropType2, growsInto, tier = 1 }, { variantIdx = 0, canBeFermented = false } = {}) => {
  const variants = Array.isArray(growsInto) ? growsInto : [growsInto];
  return (
    /** @type {farmhand.item} */
    {
      id: variants[variantIdx] || "",
      cropTimeline,
      cropType: cropType2,
      doesPriceFluctuate: true,
      tier,
      type: itemType.CROP,
      ...canBeFermented && {
        daysToFerment: getCropLifecycleDuration({ cropTimeline }) * tier
      }
    }
  );
};
var cropVariety = ({
  imageId,
  cropFamily: cropFamily2,
  variety,
  ...cropVarietyProperties
}) => {
  return { imageId, cropFamily: cropFamily2, variety, ...crop({ ...cropVarietyProperties }) };
};

// src/data/crops/grape.ts
var isGrape = (item) => {
  return "cropFamily" in item && item.cropFamily === cropFamily.GRAPE;
};
var grape = (grapeProps) => {
  const newGrape = {
    ...cropVariety({
      ...grapeProps,
      cropFamily: (
        /** @type {'GRAPE'} */
        cropFamily.GRAPE
      )
    })
  };
  if (!isGrape(newGrape)) {
    throw new Error(`Invalid cropVariety props`);
  }
  return newGrape;
};
var grapeSeed = crop({
  cropType: cropType.GRAPE,
  cropTimeline: [3, 4],
  growsInto: [
    "grape-chardonnay",
    "grape-sauvignon-blanc",
    // 'grape-pinot-blanc',
    // 'grape-muscat',
    // 'grape-riesling',
    // 'grape-merlot',
    "grape-cabernet-sauvignon",
    // 'grape-syrah',
    "grape-tempranillo",
    "grape-nebbiolo"
  ],
  id: "grape-seed",
  name: "Grape Seed",
  tier: 7
});
var grapeVarietyNameMap = {
  [grapeVariety.CHARDONNAY]: "Chardonnay",
  [grapeVariety.SAUVIGNON_BLANC]: "Sauvignon Blanc",
  //[grapeVariety.PINOT_BLANC]: 'Pinot Blanc',
  //[grapeVariety.MUSCAT]: 'Muscat',
  //[grapeVariety.RIESLING]: 'Riesling',
  //[grapeVariety.MERLOT]: 'Merlot',
  [grapeVariety.CABERNET_SAUVIGNON]: "Cabernet Sauvignon",
  //[grapeVariety.SYRAH]: 'Syrah',
  [grapeVariety.TEMPRANILLO]: "Tempranillo",
  [grapeVariety.NEBBIOLO]: "Nebbiolo"
};
var wineVarietyValueMap = {
  [grapeVariety.CHARDONNAY]: 1,
  [grapeVariety.SAUVIGNON_BLANC]: 8,
  //[grapeVariety.PINOT_BLANC]: 2,
  //[grapeVariety.MUSCAT]: 4,
  //[grapeVariety.RIESLING]: 7,
  //[grapeVariety.MERLOT]: 6,
  [grapeVariety.CABERNET_SAUVIGNON]: 3,
  //[grapeVariety.SYRAH]: 9,
  [grapeVariety.TEMPRANILLO]: 5,
  [grapeVariety.NEBBIOLO]: 10
};
var grapeChardonnay = grape({
  // @ts-expect-error
  ...fromSeed(grapeSeed, {
    variantIdx: grapeSeed.growsInto?.indexOf("grape-chardonnay")
  }),
  name: "Chardonnay Grape",
  imageId: "grape-green",
  variety: (
    /** @type {'CHARDONNAY'} */
    grapeVariety.CHARDONNAY
  ),
  wineId: "wine-chardonnay"
});
var grapeSauvignonBlanc = grape({
  // @ts-expect-error
  ...fromSeed(grapeSeed, {
    variantIdx: grapeSeed.growsInto?.indexOf("grape-sauvignon-blanc")
  }),
  name: "Sauvignon Blanc Grape",
  imageId: "grape-green",
  variety: (
    /** @type {'SAUVIGNON_BLANC'} */
    grapeVariety.SAUVIGNON_BLANC
  ),
  wineId: "wine-sauvignon-blanc"
});
var grapeCabernetSauvignon = grape({
  // @ts-expect-error
  ...fromSeed(grapeSeed, {
    variantIdx: grapeSeed.growsInto?.indexOf("grape-cabernet-sauvignon")
  }),
  name: "Cabernet Sauvignon Grape",
  imageId: "grape-purple",
  variety: (
    /** @type {'CABERNET_SAUVIGNON'} */
    grapeVariety.CABERNET_SAUVIGNON
  ),
  wineId: "wine-cabernet-sauvignon"
});
var grapeTempranillo = grape({
  // @ts-expect-error
  ...fromSeed(grapeSeed, {
    variantIdx: grapeSeed.growsInto?.indexOf("grape-tempranillo")
  }),
  name: "Tempranillo Grape",
  imageId: "grape-purple",
  variety: (
    /** @type {'TEMPRANILLO'} */
    grapeVariety.TEMPRANILLO
  ),
  wineId: "wine-tempranillo"
});
var grapeNebbiolo = grape({
  // @ts-expect-error
  ...fromSeed(grapeSeed, {
    variantIdx: grapeSeed.growsInto?.indexOf("grape-nebbiolo")
  }),
  name: "Nebbiolo Grape",
  imageId: "grape-purple",
  variety: (
    /** @type {'NEBBIOLO'} */
    grapeVariety.NEBBIOLO
  ),
  wineId: "wine-nebbiolo"
});
var grapeVarietyToGrapeItemMap = {
  [grapeVariety.CHARDONNAY]: grapeChardonnay,
  [grapeVariety.SAUVIGNON_BLANC]: grapeSauvignonBlanc,
  //[grapeVariety.PINOT_BLANC]: grapePinotBlanc,
  //[grapeVariety.MUSCAT]: grapeMuscat,
  //[grapeVariety.RIESLING]: grapeRiesling,
  //[grapeVariety.MERLOT]: grapeMerlot,
  [grapeVariety.CABERNET_SAUVIGNON]: grapeCabernetSauvignon,
  //[grapeVariety.SYRAH]: grapeSyrah,
  [grapeVariety.TEMPRANILLO]: grapeTempranillo,
  [grapeVariety.NEBBIOLO]: grapeNebbiolo
};

// src/utils/getYeastRequiredForWine.ts
var getYeastRequiredForWine = (grapeVariety2) => {
  return wineVarietyValueMap[grapeVariety2] * YEAST_REQUIREMENT_FOR_WINE_MULTIPLIER;
};

// src/data/items.ts
var items_exports = {};
__export(items_exports, {
  asparagus: () => asparagus,
  asparagusSeed: () => asparagusSeed,
  bronzeOre: () => bronzeOre,
  carrot: () => carrot,
  carrotSeed: () => carrotSeed,
  chocolateMilk: () => chocolateMilk,
  coal: () => coal,
  corn: () => corn,
  cornSeed: () => cornSeed,
  cowFeed: () => cowFeed,
  garlic: () => garlic,
  garlicSeed: () => garlicSeed,
  goldOre: () => goldOre,
  grapeCabernetSauvignon: () => grapeCabernetSauvignon,
  grapeChardonnay: () => grapeChardonnay,
  grapeNebbiolo: () => grapeNebbiolo,
  grapeSauvignonBlanc: () => grapeSauvignonBlanc,
  grapeSeed: () => grapeSeed,
  grapeTempranillo: () => grapeTempranillo,
  huggingMachine: () => huggingMachine,
  ironOre: () => ironOre,
  jalapeno: () => jalapeno,
  jalapenoSeed: () => jalapenoSeed,
  milk1: () => milk1,
  milk2: () => milk2,
  milk3: () => milk3,
  olive: () => olive,
  oliveSeed: () => oliveSeed,
  onion: () => onion,
  onionSeed: () => onionSeed,
  pea: () => pea,
  peaSeed: () => peaSeed,
  potato: () => potato,
  potatoSeed: () => potatoSeed,
  pumpkin: () => pumpkin,
  pumpkinSeed: () => pumpkinSeed,
  rainbowFertilizer: () => rainbowFertilizer,
  rainbowMilk1: () => rainbowMilk1,
  rainbowMilk2: () => rainbowMilk2,
  rainbowMilk3: () => rainbowMilk3,
  saltRock: () => saltRock,
  scarecrow: () => scarecrow,
  silverOre: () => silverOre,
  soybean: () => soybean,
  soybeanSeed: () => soybeanSeed,
  spinach: () => spinach,
  spinachSeed: () => spinachSeed,
  sprinkler: () => sprinkler,
  stone: () => stone,
  strawberry: () => strawberry,
  strawberrySeed: () => strawberrySeed,
  sunflower: () => sunflower,
  sunflowerSeed: () => sunflowerSeed,
  sweetPotato: () => sweetPotato,
  sweetPotatoSeed: () => sweetPotatoSeed,
  tomato: () => tomato,
  tomatoSeed: () => tomatoSeed,
  watermelon: () => watermelon,
  watermelonSeed: () => watermelonSeed,
  weed: () => weed,
  wheat: () => wheat,
  wheatSeed: () => wheatSeed
});

// src/data/crops/asparagus.ts
var asparagusSeed = crop({
  cropType: cropType.ASPARAGUS,
  cropTimeline: [4, 2, 2, 1],
  growsInto: "asparagus",
  id: "asparagus-seed",
  name: "Asparagus Seed",
  tier: 4
});
var asparagus = crop({
  // @ts-expect-error
  ...fromSeed(asparagusSeed, {
    canBeFermented: true
  }),
  name: "Asparagus"
});

// src/data/crops/carrot.ts
var carrotSeed = crop({
  cropType: cropType.CARROT,
  cropTimeline: [2, 1, 1, 1],
  growsInto: "carrot",
  id: "carrot-seed",
  name: "Carrot Seed",
  tier: 1
});
var carrot = crop({
  // @ts-expect-error
  ...fromSeed(carrotSeed, {
    canBeFermented: true
  }),
  name: "Carrot"
});

// src/data/crops/corn.ts
var cornSeed = crop({
  cropType: cropType.CORN,
  cropTimeline: [3, 1, 1, 1, 2, 2],
  growsInto: "corn",
  id: "corn-seed",
  name: "Corn Kernels",
  tier: 2
});
var corn = crop({
  // @ts-expect-error
  ...fromSeed(cornSeed, {
    canBeFermented: true
  }),
  name: "Corn"
});

// src/data/crops/garlic.ts
var garlicSeed = crop({
  cropType: cropType.GARLIC,
  cropTimeline: [2, 1, 1, 1],
  growsInto: "garlic",
  id: "garlic-seed",
  name: "Garlic Bulb",
  tier: 5
});
var garlic = crop({
  // @ts-expect-error
  ...fromSeed(garlicSeed, {
    canBeFermented: true
  }),
  name: "Garlic"
});

// src/data/crops/jalapeno.ts
var jalapenoSeed = crop({
  cropType: cropType.JALAPENO,
  cropTimeline: [2, 1, 1, 1],
  growsInto: "jalapeno",
  id: "jalapeno-seed",
  name: "Jalape\xF1o Seed",
  tier: 4
});
var jalapeno = crop({
  // @ts-expect-error
  ...fromSeed(jalapenoSeed, {
    canBeFermented: true
  }),
  name: "Jalape\xF1o"
});

// src/data/crops/olive.ts
var oliveSeed = crop({
  cropType: cropType.OLIVE,
  cropTimeline: [3, 6],
  growsInto: "olive",
  id: "olive-seed",
  name: "Olive Seed",
  tier: 6
});
var olive = crop({
  // @ts-expect-error
  ...fromSeed(oliveSeed, {
    canBeFermented: true
  }),
  name: "Olive"
});

// src/data/crops/onion.ts
var onionSeed = crop({
  cropType: cropType.ONION,
  cropTimeline: [3, 1, 2, 1],
  growsInto: "onion",
  id: "onion-seed",
  name: "Onion Seeds",
  tier: 2
});
var onion = crop({
  // @ts-expect-error
  ...fromSeed(onionSeed, {
    canBeFermented: true
  }),
  name: "Onion"
});

// src/data/crops/pea.ts
var peaSeed = crop({
  cropType: cropType.PEA,
  cropTimeline: [2, 3],
  growsInto: "pea",
  id: "pea-seed",
  name: "Pea Seed",
  tier: 5
});
var pea = crop({
  // @ts-expect-error
  ...fromSeed(peaSeed, {
    canBeFermented: true
  }),
  name: "Pea"
});

// src/data/crops/potato.ts
var potatoSeed = crop({
  cropType: cropType.POTATO,
  cropTimeline: [2, 1, 1, 1],
  growsInto: "potato",
  id: "potato-seed",
  name: "Potato Seeds",
  tier: 2
});
var potato = crop({
  // @ts-expect-error
  ...fromSeed(potatoSeed, {
    canBeFermented: true
  }),
  name: "Potato"
});

// src/data/crops/pumpkin.ts
var pumpkinSeed = crop({
  cropType: cropType.PUMPKIN,
  cropTimeline: [3, 1, 1, 1, 1, 1],
  growsInto: "pumpkin",
  id: "pumpkin-seed",
  name: "Pumpkin Seed",
  tier: 1
});
var pumpkin = crop({
  // @ts-expect-error
  ...fromSeed(pumpkinSeed, {
    canBeFermented: true
  }),
  name: "Pumpkin"
});

// src/data/crops/soybean.ts
var soybeanSeed = crop({
  cropType: cropType.SOYBEAN,
  cropTimeline: [2, 2],
  growsInto: "soybean",
  id: "soybean-seed",
  name: "Soybean Seeds",
  tier: 3
});
var soybean = crop({
  // @ts-expect-error
  ...fromSeed(soybeanSeed, {
    canBeFermented: true
  }),
  name: "Soybean"
});

// src/data/crops/spinach.ts
var spinachSeed = crop({
  cropType: cropType.SPINACH,
  cropTimeline: [2, 4],
  growsInto: "spinach",
  id: "spinach-seed",
  name: "Spinach Seed",
  tier: 1
});
var spinach = crop({
  // @ts-expect-error
  ...fromSeed(spinachSeed, {
    canBeFermented: true
  }),
  name: "Spinach"
});

// src/data/crops/sunflower.ts
var sunflowerSeed = crop({
  cropType: cropType.SUNFLOWER,
  cropTimeline: [1, 1, 1, 1, 1, 1],
  growsInto: "sunflower",
  id: "sunflower-seed",
  name: "Sunflower Seed",
  tier: 6
});
var sunflower = crop({
  // @ts-expect-error
  ...fromSeed(sunflowerSeed, {
    canBeFermented: true
  }),
  name: "Sunflower"
});

// src/data/crops/strawberry.ts
var strawberrySeed = crop({
  cropType: cropType.STRAWBERRY,
  cropTimeline: [6, 2],
  growsInto: "strawberry",
  id: "strawberry-seed",
  name: "Strawberry Seed",
  tier: 5
});
var strawberry = crop({
  // @ts-expect-error
  ...fromSeed(strawberrySeed),
  name: "Strawberry"
});

// src/data/crops/sweet-potato.ts
var sweetPotatoSeed = crop({
  cropType: cropType.SWEET_POTATO,
  cropTimeline: [2, 1, 1, 2, 2],
  growsInto: "sweet-potato",
  id: "sweet-potato-seed",
  name: "Sweet Potato Slip",
  tier: 6
});
var sweetPotato = crop({
  // @ts-expect-error
  ...fromSeed(sweetPotatoSeed, {
    canBeFermented: true
  }),
  name: "Sweet Potato"
});

// src/data/crops/tomato.ts
var tomatoSeed = crop({
  cropType: cropType.TOMATO,
  cropTimeline: [2, 1, 1, 1, 2, 2, 2],
  growsInto: "tomato",
  id: "tomato-seed",
  name: "Tomato Seeds",
  tier: 3
});
var tomato = crop({
  // @ts-expect-error
  ...fromSeed(tomatoSeed, {
    canBeFermented: true
  }),
  name: "Tomato"
});

// src/data/crops/watermelon.ts
var watermelonSeed = crop({
  cropType: cropType.WATERMELON,
  cropTimeline: [2, 10],
  growsInto: "watermelon",
  id: "watermelon-seed",
  name: "Watermelon Seed",
  tier: 4
});
var watermelon = crop({
  // @ts-expect-error
  ...fromSeed(watermelonSeed),
  name: "Watermelon"
});

// src/data/crops/wheat.ts
var wheatSeed = crop({
  cropType: cropType.WHEAT,
  cropTimeline: [1, 1],
  growsInto: "wheat",
  id: "wheat-seed",
  name: "Wheat Seeds",
  tier: 3
});
var wheat = crop({
  // @ts-expect-error
  ...fromSeed(wheatSeed),
  name: "Wheat"
});

// src/data/ores/bronzeOre.ts
var { freeze: freeze3 } = Object;
var bronzeOre = freeze3({
  description: "A piece of bronze ore.",
  doesPriceFluctuate: true,
  id: "bronze-ore",
  name: "Bronze Ore",
  type: (
    /** @type {farmhand.itemType} */
    itemType.ORE
  ),
  value: 25,
  spawnChance: BRONZE_SPAWN_CHANCE
});

// src/data/ores/coal.ts
var { freeze: freeze4 } = Object;
var coal = freeze4({
  description: "A piece of coal.",
  doesPriceFluctuate: false,
  id: "coal",
  name: "Coal",
  type: (
    /** @type {farmhand.itemType} */
    itemType.FUEL
  ),
  spawnChance: COAL_SPAWN_CHANCE,
  value: 2
});

// src/data/ores/goldOre.ts
var { freeze: freeze5 } = Object;
var goldOre = freeze5({
  description: "A piece of gold ore.",
  doesPriceFluctuate: true,
  id: "gold-ore",
  name: "Gold Ore",
  type: (
    /** @type {farmhand.itemType} */
    itemType.ORE
  ),
  value: 500,
  spawnChance: GOLD_SPAWN_CHANCE
});

// src/data/ores/ironOre.ts
var { freeze: freeze6 } = Object;
var ironOre = freeze6({
  description: "A piece of iron ore.",
  doesPriceFluctuate: true,
  id: "iron-ore",
  name: "Iron Ore",
  type: (
    /** @type {farmhand.itemType} */
    itemType.ORE
  ),
  value: 40,
  spawnChance: IRON_SPAWN_CHANCE
});

// src/data/ores/silverOre.ts
var { freeze: freeze7 } = Object;
var silverOre = freeze7({
  description: "A piece of silver ore.",
  doesPriceFluctuate: true,
  id: "silver-ore",
  name: "Silver Ore",
  type: (
    /** @type {farmhand.itemType} */
    itemType.ORE
  ),
  value: 100,
  spawnChance: SILVER_SPAWN_CHANCE
});

// src/data/ores/stone.ts
var { freeze: freeze8 } = Object;
var stone = freeze8({
  description: "A piece of rock.",
  doesPriceFluctuate: false,
  id: "stone",
  name: "Stone",
  spawnChance: STONE_SPAWN_CHANCE,
  type: (
    /** @type {farmhand.itemType} */
    itemType.STONE
  ),
  value: 10
});

// src/data/ores/saltRock.ts
var { freeze: freeze9 } = Object;
var saltRock = freeze9({
  description: "A large chunk of salt.",
  doesPriceFluctuate: true,
  id: "salt-rock",
  name: "Salt Rock",
  spawnChance: SALT_ROCK_SPAWN_CHANCE,
  type: (
    /** @type {farmhand.itemType} */
    itemType.STONE
  ),
  value: 10
});

// src/data/items.ts
var { freeze: freeze10 } = Object;
var {
  COW_FEED,
  FERTILIZER,
  HUGGING_MACHINE,
  MILK,
  SCARECROW,
  SPRINKLER,
  WEED
} = itemType;
var weed = freeze10({
  id: "weed",
  name: "Weed",
  value: 0.1,
  doesPriceFluctuate: false,
  type: WEED
});
var rainbowFertilizer = freeze10({
  description: "Helps crops grow a little faster and automatically replants them upon harvesting. Consumes seeds upon replanting and disappears if none are available. Also works for Scarecrows.",
  enablesFieldMode: fieldMode.FERTILIZE,
  id: "rainbow-fertilizer",
  name: "Rainbow Fertilizer",
  type: (
    /** @type {farmhand.itemType} */
    FERTILIZER
  ),
  // Rainbow Fertilizer is worth less than regular Fertilizer because it is not
  // sold in the shop. Items that are sold in the shop have automatically
  // reduced resale value, but since that would not apply to Rainbow
  // Fertilizer, it is pre-reduced via this hardcoded value.
  value: 15
});
var sprinkler = freeze10({
  description: "Automatically waters adjacent plants every day.",
  enablesFieldMode: fieldMode.SET_SPRINKLER,
  // Note: The actual hoveredPlotRangeSize of sprinklers grows with the
  // player's level.
  hoveredPlotRangeSize: INITIAL_SPRINKLER_RANGE,
  id: "sprinkler",
  isReplantable: true,
  name: "Sprinkler",
  type: (
    /** @type {farmhand.itemType} */
    SPRINKLER
  ),
  value: 120
});
var scarecrow = freeze10({
  description: "Prevents crows from eating your crops. One scarecrow covers an entire field, but they are afraid of storms.",
  enablesFieldMode: fieldMode.SET_SCARECROW,
  // Note: This needs to be a safe number (rather than Infinity) because it
  // potentially gets JSON.stringify-ed during data export. Non-safe numbers
  // get stringify-ed to "null", which breaks reimporting.
  hoveredPlotRangeSize: Number.MAX_SAFE_INTEGER,
  id: "scarecrow",
  isReplantable: true,
  name: "Scarecrow",
  type: (
    /** @type {farmhand.itemType} */
    SCARECROW
  ),
  value: 160
});
var cowFeed = freeze10({
  id: COW_FEED_ITEM_ID,
  description: "Each cow automatically consumes one unit of Cow Feed per day. Fed cows gain and maintain weight.",
  name: "Cow Feed",
  type: (
    /** @type {farmhand.itemType} */
    COW_FEED
  ),
  value: 5
});
var huggingMachine = freeze10({
  id: HUGGING_MACHINE_ITEM_ID,
  description: "Automatically hugs one cow three times every day.",
  name: "Hugging Machine",
  type: (
    /** @type {farmhand.itemType} */
    HUGGING_MACHINE
  ),
  value: 500
});
var milk1 = freeze10({
  id: "milk-1",
  name: "Grade C Milk",
  type: (
    /** @type {farmhand.itemType} */
    MILK
  ),
  value: 40
});
var milk2 = freeze10({
  id: "milk-2",
  name: "Grade B Milk",
  type: (
    /** @type {farmhand.itemType} */
    MILK
  ),
  value: 80
});
var milk3 = freeze10({
  id: "milk-3",
  name: "Grade A Milk",
  type: (
    /** @type {farmhand.itemType} */
    MILK
  ),
  value: 120
});
var rainbowMilk1 = freeze10({
  id: "rainbow-milk-1",
  name: "Grade C Rainbow Milk",
  type: (
    /** @type {farmhand.itemType} */
    MILK
  ),
  value: 60
});
var rainbowMilk2 = freeze10({
  id: "rainbow-milk-2",
  name: "Grade B Rainbow Milk",
  type: (
    /** @type {farmhand.itemType} */
    MILK
  ),
  value: 120
});
var rainbowMilk3 = freeze10({
  id: "rainbow-milk-3",
  name: "Grade A Rainbow Milk",
  type: (
    /** @type {farmhand.itemType} */
    MILK
  ),
  value: 180
});
var chocolateMilk = freeze10({
  id: "chocolate-milk",
  name: "Chocolate Milk",
  type: (
    /** @type {farmhand.itemType} */
    MILK
  ),
  value: 80
});

// src/data/items-map.ts
var itemsMap = {
  ...Object.keys(items_exports).reduce((acc, itemName) => {
    const item = items_exports[itemName];
    acc[item.id] = item;
    return acc;
  }, {})
};
var items_map_default = itemsMap;

// src/data/recipes.ts
var itemsMap2 = { ...items_map_default };
var convertToRecipe = (partialRecipe) => {
  const recipe = Object.freeze({
    type: itemType.CRAFTED_ITEM,
    value: Object.keys(partialRecipe.ingredients).reduce(
      (sum, itemId) => sum + RECIPE_INGREDIENT_VALUE_MULTIPLIER * itemsMap2[itemId].value * partialRecipe.ingredients[itemId],
      0
    ),
    ...partialRecipe
  });
  itemsMap2[partialRecipe.id] = /** @type {farmhand.item} */
  recipe;
  return (
    /** @type {farmhand.recipe} */
    recipe
  );
};
var salt = convertToRecipe({
  id: "salt",
  name: "Salt",
  ingredients: {
    [saltRock.id]: 1
  },
  condition: (state) => (state.itemsSold[saltRock.id] || 0) >= 30,
  description: "Useful for seasoning food and fermentation.",
  recipeType: (
    /** @type {farmhand.recipeType} */
    recipeType.KITCHEN
  )
});
var flour = convertToRecipe({
  id: "flour",
  name: "Flour",
  ingredients: {
    [wheat.id]: 10
  },
  condition: (state) => (state.itemsSold[wheat.id] || 0) >= 20,
  recipeType: (
    /** @type {farmhand.recipeType} */
    recipeType.KITCHEN
  )
});
var yeast = convertToRecipe({
  id: "yeast",
  name: "Yeast",
  ingredients: {
    [flour.id]: 5
  },
  condition: (state) => (state.itemsSold[flour.id] || 0) >= 25,
  recipeType: (
    /** @type {farmhand.recipeType} */
    recipeType.KITCHEN
  )
});
var getWineRecipeFromGrape = (grape2) => {
  return {
    ...convertToRecipe({
      id: grape2.wineId,
      name: `${grapeVarietyNameMap[grape2.variety]} Wine`,
      type: itemType.CRAFTED_ITEM,
      ingredients: {
        [grape2.id]: GRAPES_REQUIRED_FOR_WINE,
        [yeast.id]: getYeastRequiredForWine(grape2.variety)
      },
      recipeType: (
        /** @type {farmhand.recipeType} */
        recipeType.WINE
      ),
      // NOTE: This prevents wines from appearing in the Learned Recipes list in the Workshop
      condition: () => false
    }),
    variety: grape2.variety
  };
};
var bread = convertToRecipe({
  id: "bread",
  name: "Bread",
  ingredients: {
    [flour.id]: 10,
    [yeast.id]: 5
  },
  condition: (state) => (state.itemsSold[flour.id] || 0) >= 30 && (state.itemsSold[yeast.id] || 0) >= 15,
  recipeType: (
    /** @type {farmhand.recipeType} */
    recipeType.KITCHEN
  )
});
var butter = convertToRecipe({
  id: "butter",
  name: "Butter",
  ingredients: {
    [milk3.id]: 5
  },
  condition: (state) => (state.itemsSold[milk3.id] || 0) >= 30,
  recipeType: (
    /** @type {farmhand.recipeType} */
    recipeType.KITCHEN
  )
});
var sunButter = convertToRecipe({
  id: "sun-butter",
  name: "Sun Butter",
  ingredients: {
    [sunflower.id]: 25
  },
  condition: (state) => (state.itemsSold[sunflower.id] || 0) >= 200,
  recipeType: (
    /** @type {farmhand.recipeType} */
    recipeType.KITCHEN
  )
});
var oliveOil = convertToRecipe({
  id: "olive-oil",
  name: "Olive Oil",
  ingredients: {
    [olive.id]: 250
  },
  condition: (state) => (state.itemsSold[olive.id] || 0) >= 500,
  recipeType: (
    /** @type {farmhand.recipeType} */
    recipeType.KITCHEN
  )
});
var cheese = convertToRecipe({
  id: "cheese",
  name: "Cheese",
  ingredients: {
    [milk3.id]: 8
  },
  condition: (state) => (state.itemsSold[milk3.id] || 0) >= 20,
  recipeType: (
    /** @type {farmhand.recipeType} */
    recipeType.KITCHEN
  )
});
var rainbowCheese = convertToRecipe({
  id: "rainbowCheese",
  name: "Rainbow Cheese",
  ingredients: {
    [rainbowMilk3.id]: 10
  },
  condition: (state) => (state.itemsSold[rainbowMilk3.id] || 0) >= 30,
  recipeType: (
    /** @type {farmhand.recipeType} */
    recipeType.KITCHEN
  )
});
var chocolate = convertToRecipe({
  id: "chocolate",
  name: "Chocolate",
  ingredients: {
    [chocolateMilk.id]: 10
  },
  condition: (state) => (state.itemsSold[chocolateMilk.id] || 0) >= 25,
  recipeType: (
    /** @type {farmhand.recipeType} */
    recipeType.KITCHEN
  )
});
var carrotSoup = convertToRecipe({
  id: "carrot-soup",
  name: "Carrot Soup",
  ingredients: {
    [carrot.id]: 4
  },
  condition: (state) => (state.itemsSold[carrot.id] || 0) >= 10,
  recipeType: (
    /** @type {farmhand.recipeType} */
    recipeType.KITCHEN
  )
});
var jackolantern = convertToRecipe({
  id: "jackolantern",
  name: "Jack-o'-lantern",
  ingredients: {
    [pumpkin.id]: 1
  },
  condition: (state) => (state.itemsSold[pumpkin.id] || 0) >= 50,
  recipeType: (
    /** @type {farmhand.recipeType} */
    recipeType.KITCHEN
  )
});
var spaghetti = convertToRecipe({
  id: "spaghetti",
  name: "Spaghetti",
  ingredients: {
    [wheat.id]: 10,
    [tomato.id]: 2
  },
  condition: (state) => (state.itemsSold[wheat.id] || 0) >= 20 && (state.itemsSold[tomato.id] || 0) >= 5,
  recipeType: (
    /** @type {farmhand.recipeType} */
    recipeType.KITCHEN
  )
});
var frenchOnionSoup = convertToRecipe({
  id: "french-onion-soup",
  name: "French Onion Soup",
  ingredients: {
    [onion.id]: 5,
    [cheese.id]: 2,
    [salt.id]: 2
  },
  condition: (state) => (state.itemsSold[onion.id] || 0) >= 15 && (state.itemsSold[cheese.id] || 0) >= 10,
  recipeType: (
    /** @type {farmhand.recipeType} */
    recipeType.KITCHEN
  )
});
var burger = convertToRecipe({
  id: "burger",
  name: "Burger",
  ingredients: {
    [bread.id]: 1,
    [cheese.id]: 1,
    [onion.id]: 1,
    [soybean.id]: 12,
    [spinach.id]: 1,
    [tomato.id]: 1
  },
  condition: (state) => (state.itemsSold[bread.id] || 0) >= 5 && (state.itemsSold[cheese.id] || 0) >= 5 && (state.itemsSold[onion.id] || 0) >= 5 && (state.itemsSold[soybean.id] || 0) >= 25 && (state.itemsSold[spinach.id] || 0) >= 5 && (state.itemsSold[tomato.id] || 0) >= 5,
  recipeType: (
    /** @type {farmhand.recipeType} */
    recipeType.KITCHEN
  )
});
var summerSalad = convertToRecipe({
  id: "summer-salad",
  name: "Summer Salad",
  ingredients: {
    [spinach.id]: 6,
    [corn.id]: 1,
    [carrot.id]: 1
  },
  condition: (state) => (state.itemsSold[spinach.id] || 0) >= 30 && (state.itemsSold[corn.id] || 0) > 5 && (state.itemsSold[carrot.id] || 0) > 5,
  recipeType: (
    /** @type {farmhand.recipeType} */
    recipeType.KITCHEN
  )
});
var soyMilk = convertToRecipe({
  id: "soy-milk",
  name: "Soy Milk",
  ingredients: {
    [soybean.id]: 20
  },
  condition: (state) => (state.itemsSold[soybean.id] || 0) >= 100,
  recipeType: (
    /** @type {farmhand.recipeType} */
    recipeType.KITCHEN
  )
});
var chocolateSoyMilk = convertToRecipe({
  id: "chocolate-soy-milk",
  name: "Chocolate Soy Milk",
  ingredients: {
    [soyMilk.id]: 1,
    [chocolate.id]: 1
  },
  condition: (state) => (state.itemsSold[soyMilk.id] || 0) >= 5 && (state.itemsSold[chocolate.id] || 0) >= 5,
  recipeType: (
    /** @type {farmhand.recipeType} */
    recipeType.KITCHEN
  )
});
var tofu = convertToRecipe({
  id: "tofu",
  name: "Tofu",
  ingredients: {
    [soyMilk.id]: 4
  },
  condition: (state) => (state.itemsSold[soyMilk.id] || 0) >= 20,
  recipeType: (
    /** @type {farmhand.recipeType} */
    recipeType.KITCHEN
  )
});
var chicknPotPie = convertToRecipe({
  id: "chickn-pot-pie",
  name: "Chick'n Pot Pie",
  ingredients: {
    [tofu.id]: 6,
    [pea.id]: 10,
    [carrot.id]: 8,
    [wheat.id]: 12,
    [soyMilk.id]: 3
  },
  condition: (state) => (state.itemsSold[tofu.id] || 0) >= 30 && (state.itemsSold[pea.id] || 0) >= 225 && (state.itemsSold[carrot.id] || 0) >= 300 && (state.itemsSold[wheat.id] || 0) >= 425 && (state.itemsSold[soyMilk.id] || 0) >= 15,
  recipeType: (
    /** @type {farmhand.recipeType} */
    recipeType.KITCHEN
  )
});
var hotSauce = convertToRecipe({
  id: "hot-sauce",
  name: "Hot Sauce",
  ingredients: {
    [jalapeno.id]: 10,
    [salt.id]: 1
  },
  condition: (state) => (state.itemsSold[jalapeno.id] || 0) >= 50,
  recipeType: (
    /** @type {farmhand.recipeType} */
    recipeType.KITCHEN
  )
});
var salsa = convertToRecipe({
  id: "salsa",
  name: "Salsa",
  ingredients: {
    [jalapeno.id]: 1,
    [onion.id]: 1,
    [tomato.id]: 1,
    [corn.id]: 1
  },
  condition: (state) => (state.itemsSold[jalapeno.id] || 0) >= 5 && (state.itemsSold[onion.id] || 0) >= 5 && (state.itemsSold[tomato.id] || 0) >= 5 && (state.itemsSold[corn.id] || 0) >= 5,
  recipeType: (
    /** @type {farmhand.recipeType} */
    recipeType.KITCHEN
  )
});
var spicyCheese = convertToRecipe({
  id: "spicy-cheese",
  name: "Spicy Cheese",
  ingredients: {
    [jalapeno.id]: 4,
    [milk3.id]: 10
  },
  condition: (state) => (state.itemsSold[jalapeno.id] || 0) >= 20 && (state.itemsSold[milk3.id] || 0) >= 50,
  recipeType: (
    /** @type {farmhand.recipeType} */
    recipeType.KITCHEN
  )
});
var vegetableOil = convertToRecipe({
  id: "vegetable-oil",
  name: "Vegetable Oil",
  ingredients: {
    [soybean.id]: 350
  },
  condition: (state) => (state.itemsSold[soybean.id] || 0) >= 900,
  recipeType: (
    /** @type {farmhand.recipeType} */
    recipeType.KITCHEN
  )
});
var friedTofu = convertToRecipe({
  id: "fried-tofu",
  name: "Deep Fried Tofu",
  ingredients: {
    [tofu.id]: 1,
    [vegetableOil.id]: 2
  },
  condition: (state) => (state.itemsSold[tofu.id] || 0) >= 50 && (state.itemsSold[vegetableOil.id] || 0) >= 50,
  recipeType: (
    /** @type {farmhand.recipeType} */
    recipeType.KITCHEN
  )
});
var spicyPickledGarlic = convertToRecipe({
  id: "spicy-pickled-garlic",
  name: "Spicy Pickled Garlic",
  ingredients: {
    [jalapeno.id]: 2,
    [garlic.id]: 5
  },
  condition: (state) => (state.itemsSold[jalapeno.id] || 0) >= 12 && (state.itemsSold[garlic.id] || 0) >= 25,
  recipeType: (
    /** @type {farmhand.recipeType} */
    recipeType.KITCHEN
  )
});
var garlicFries = convertToRecipe({
  id: "garlic-fries",
  name: "Garlic Fries",
  ingredients: {
    [potato.id]: 5,
    [garlic.id]: 3,
    [vegetableOil.id]: 1,
    [salt.id]: 2
  },
  condition: (state) => (state.itemsSold[potato.id] || 0) >= 50 && (state.itemsSold[garlic.id] || 0) >= 30,
  recipeType: (
    /** @type {farmhand.recipeType} */
    recipeType.KITCHEN
  )
});
var garlicBread = convertToRecipe({
  id: "garlic-bread",
  name: "Garlic Bread",
  ingredients: {
    [bread.id]: 1,
    [garlic.id]: 5,
    [oliveOil.id]: 1
  },
  condition: (state) => (state.itemsSold[bread.id] || 0) >= 30 && (state.itemsSold[oliveOil.id] || 0) >= 20 && (state.itemsSold[garlic.id] || 0) >= 50,
  recipeType: (
    /** @type {farmhand.recipeType} */
    recipeType.KITCHEN
  )
});
var strawberryJam = convertToRecipe({
  id: "strawberry-jam",
  name: "Strawberry Jam",
  ingredients: {
    [strawberry.id]: 10
  },
  condition: (state) => (state.itemsSold[strawberry.id] || 0) >= 60,
  recipeType: (
    /** @type {farmhand.recipeType} */
    recipeType.KITCHEN
  )
});
var popcorn = convertToRecipe({
  id: "popcorn",
  name: "Popcorn",
  ingredients: {
    [corn.id]: 2,
    [butter.id]: 1
  },
  condition: (state) => (state.itemsSold[corn.id] || 0) >= 12 && (state.itemsSold[butter.id] || 0) >= 6,
  recipeType: (
    /** @type {farmhand.recipeType} */
    recipeType.KITCHEN
  )
});
var pumpkinPie = convertToRecipe({
  id: "pumpkin-pie",
  name: "Pumpkin Pie",
  ingredients: {
    [pumpkin.id]: 4,
    [wheat.id]: 10,
    [butter.id]: 2
  },
  condition: (state) => (state.itemsSold[pumpkin.id] || 0) >= 200 && (state.itemsSold[wheat.id] || 0) >= 250 && (state.itemsSold[butter.id] || 0) >= 75,
  recipeType: (
    /** @type {farmhand.recipeType} */
    recipeType.KITCHEN
  )
});
var sweetPotatoPie = convertToRecipe({
  id: "sweet-potato-pie",
  name: "Sweet Potato Pie",
  ingredients: {
    [sweetPotato.id]: 6,
    [wheat.id]: 10,
    [butter.id]: 2
  },
  condition: (state) => (state.itemsSold[sweetPotato.id] || 0) >= 200 && (state.itemsSold[wheat.id] || 0) >= 250 && (state.itemsSold[butter.id] || 0) >= 75,
  recipeType: (
    /** @type {farmhand.recipeType} */
    recipeType.KITCHEN
  )
});
var sweetPotatoFries = convertToRecipe({
  id: "sweet-potato-fries",
  name: "Sweet Potato Fries",
  ingredients: {
    [sweetPotato.id]: 10,
    [vegetableOil.id]: 1,
    [salt.id]: 1
  },
  condition: (state) => (state.itemsSold[sweetPotato.id] || 0) >= 100,
  recipeType: (
    /** @type {farmhand.recipeType} */
    recipeType.KITCHEN
  )
});
var onionRings = convertToRecipe({
  id: "onion-rings",
  name: "Onion Rings",
  ingredients: {
    [onion.id]: 1,
    [vegetableOil.id]: 1,
    [wheat.id]: 5,
    [soyMilk.id]: 1,
    [salt.id]: 3
  },
  condition: (state) => (state.itemsSold[onion.id] || 0) >= 50 && (state.itemsSold[vegetableOil.id] || 0) > 20 && (state.itemsSold[soyMilk.id] || 0) > 20 && (state.itemsSold[wheat.id] || 0) > 30,
  recipeType: (
    /** @type {farmhand.recipeType} */
    recipeType.KITCHEN
  )
});
var bronzeIngot = convertToRecipe({
  id: "bronze-ingot",
  name: "Bronze Ingot",
  ingredients: {
    [bronzeOre.id]: 5,
    [coal.id]: 5
  },
  condition: (state) => state.purchasedSmelter > 0 && (state.itemsSold[bronzeOre.id] || 0) >= 50,
  recipeType: (
    /** @type {farmhand.recipeType} */
    recipeType.FORGE
  )
});
var ironIngot = convertToRecipe({
  id: "iron-ingot",
  name: "Iron Ingot",
  ingredients: {
    [ironOre.id]: 5,
    [coal.id]: 12
  },
  condition: (state) => state.purchasedSmelter > 0 && (state.itemsSold[ironOre.id] || 0) >= 50,
  recipeType: (
    /** @type {farmhand.recipeType} */
    recipeType.FORGE
  )
});
var silverIngot = convertToRecipe({
  id: "silver-ingot",
  name: "Silver Ingot",
  ingredients: {
    [silverOre.id]: 5,
    [coal.id]: 8
  },
  condition: (state) => state.purchasedSmelter > 0 && (state.itemsSold[silverOre.id] || 0) >= 50,
  recipeType: (
    /** @type {farmhand.recipeType} */
    recipeType.FORGE
  )
});
var goldIngot = convertToRecipe({
  id: "gold-ingot",
  name: "Gold Ingot",
  ingredients: {
    [goldOre.id]: 5,
    [coal.id]: 10
  },
  condition: (state) => state.purchasedSmelter > 0 && (state.itemsSold[goldOre.id] || 0) >= 50,
  recipeType: (
    /** @type {farmhand.recipeType} */
    recipeType.FORGE
  )
});
var compost = convertToRecipe({
  id: "compost",
  name: "Compost",
  ingredients: {
    [weed.id]: 25
  },
  condition: (state) => state.purchasedComposter > 0 && (state.itemsSold[weed.id] || 0) >= 100,
  description: "Can be used to make fertilizer.",
  recipeType: (
    /** @type {farmhand.recipeType} */
    recipeType.RECYCLING
  ),
  type: itemType.CRAFTED_ITEM
});
var fertilizer = convertToRecipe({
  id: "fertilizer",
  name: "Fertilizer",
  ingredients: {
    [compost.id]: 10
  },
  condition: (state) => state.purchasedComposter > 0 && (state.itemsSold[compost.id] || 0) >= 10,
  description: "Helps crops grow and mature a little faster.",
  enablesFieldMode: fieldMode.FERTILIZE,
  recipeType: (
    /** @type {farmhand.recipeType} */
    recipeType.RECYCLING
  ),
  type: itemType.FERTILIZER,
  value: 25
});
var wineChardonnay = getWineRecipeFromGrape({
  ...grapeChardonnay
});
var wineSauvignonBlanc = getWineRecipeFromGrape({
  ...grapeSauvignonBlanc
});
var wineCabernetSauvignon = getWineRecipeFromGrape({
  ...grapeCabernetSauvignon
});
var wineTempranillo = getWineRecipeFromGrape({
  ...grapeTempranillo
});
var wineNebbiolo = getWineRecipeFromGrape({
  ...grapeNebbiolo
});

// src/data/upgrades.ts
var coalNeededForIngots = (ingotId, amount = 1) => {
  switch (ingotId) {
    case bronzeIngot.id:
      return amount * 2;
    case ironIngot.id:
      return Math.round(amount * 3.5);
    case silverIngot.id:
      return Math.round(amount * 2.5);
    case goldIngot.id:
      return amount * 3;
    default:
      return amount;
  }
};
var { bronzeIngot: bronzeIngot2, ironIngot: ironIngot2, silverIngot: silverIngot2, goldIngot: goldIngot2 } = recipes_exports;
var { coal: coal2 } = items_exports;
var upgrades = {
  [toolType.HOE]: {
    [toolLevel.DEFAULT]: {
      id: "hoe-default",
      name: "Basic Hoe",
      nextLevel: toolLevel.BRONZE
    },
    [toolLevel.BRONZE]: {
      id: "hoe-bronze",
      description: "Gives 25% chance to retrieve seeds when digging up crops",
      name: "Bronze Hoe",
      ingredients: {
        [bronzeIngot2.id]: 8,
        [coal2.id]: coalNeededForIngots(bronzeIngot2.id, 8)
      },
      nextLevel: toolLevel.IRON
    },
    [toolLevel.IRON]: {
      id: "hoe-iron",
      description: "Gives 50% chance to retrieve seeds when digging up crops",
      name: "Iron Hoe",
      ingredients: {
        [ironIngot2.id]: 8,
        [coal2.id]: coalNeededForIngots(ironIngot2.id, 8)
      },
      nextLevel: toolLevel.SILVER
    },
    [toolLevel.SILVER]: {
      id: "hoe-silver",
      description: "Gives 75% chance to retrieve seeds when digging up crops",
      name: "Silver Hoe",
      ingredients: {
        [silverIngot2.id]: 8,
        [coal2.id]: coalNeededForIngots(silverIngot2.id, 8)
      },
      nextLevel: toolLevel.GOLD
    },
    [toolLevel.GOLD]: {
      id: "hoe-gold",
      description: "Gives 100% chance to retrieve seeds when digging up crops",
      name: "Gold Hoe",
      ingredients: {
        [goldIngot2.id]: 8,
        [coal2.id]: coalNeededForIngots(goldIngot2.id, 8)
      },
      isMaxLevel: true
    }
  },
  [toolType.SCYTHE]: {
    [toolLevel.DEFAULT]: {
      id: "scythe-default",
      name: "Basic Scythe",
      nextLevel: toolLevel.BRONZE
    },
    [toolLevel.BRONZE]: {
      id: "scythe-bronze",
      description: "Increases crop yield by 1 when harvesting",
      name: "Bronze Scythe",
      ingredients: {
        [bronzeIngot2.id]: 10,
        [coal2.id]: coalNeededForIngots(bronzeIngot2.id, 10)
      },
      nextLevel: toolLevel.IRON
    },
    [toolLevel.IRON]: {
      id: "scythe-iron",
      description: "Increases crop yield by 2 when harvesting",
      name: "Iron Scythe",
      ingredients: {
        [ironIngot2.id]: 10,
        [coal2.id]: coalNeededForIngots(ironIngot2.id, 10)
      },
      nextLevel: toolLevel.SILVER
    },
    [toolLevel.SILVER]: {
      id: "scythe-silver",
      description: "Increases crop yield by 3 when harvesting",
      name: "Silver Scythe",
      ingredients: {
        [silverIngot2.id]: 10,
        [coal2.id]: coalNeededForIngots(silverIngot2.id, 10)
      },
      nextLevel: toolLevel.GOLD
    },
    [toolLevel.GOLD]: {
      id: "scythe-gold",
      description: "Increases crop yield by 4 when harvesting",
      name: "Gold Scythe",
      ingredients: {
        [goldIngot2.id]: 10,
        [coal2.id]: coalNeededForIngots(goldIngot2.id, 10)
      },
      isMaxLevel: true
    }
  },
  [toolType.SHOVEL]: {
    [toolLevel.DEFAULT]: {
      id: "shovel-default",
      name: "Basic Shovel",
      nextLevel: toolLevel.BRONZE
    },
    [toolLevel.BRONZE]: {
      id: "shovel-bronze",
      description: "Increases chance of finding ore",
      name: "Bronze Shovel",
      ingredients: {
        [bronzeIngot2.id]: 15,
        [coal2.id]: coalNeededForIngots(bronzeIngot2.id, 15)
      },
      nextLevel: toolLevel.IRON
    },
    [toolLevel.IRON]: {
      id: "shovel-iron",
      description: "Increases chance of finding ore",
      name: "Iron Shovel",
      ingredients: {
        [ironIngot2.id]: 15,
        [coal2.id]: coalNeededForIngots(ironIngot2.id, 15)
      },
      nextLevel: toolLevel.SILVER
    },
    [toolLevel.SILVER]: {
      id: "shovel-silver",
      description: "Increases chance of finding ore",
      name: "Silver Shovel",
      ingredients: {
        [silverIngot2.id]: 15,
        [coal2.id]: coalNeededForIngots(silverIngot2.id, 15)
      },
      nextLevel: toolLevel.GOLD
    },
    [toolLevel.GOLD]: {
      id: "shovel-gold",
      description: "Increases chance of finding ore",
      name: "Gold Shovel",
      ingredients: {
        [goldIngot2.id]: 15,
        [coal2.id]: coalNeededForIngots(goldIngot2.id, 15)
      },
      isMaxLevel: true
    }
  }
};
for (let currentToolType in upgrades) {
  for (let i in upgrades[currentToolType]) {
    Object.assign(upgrades[currentToolType][i], {
      toolType: currentToolType,
      value: 0,
      doesPriceFluctuate: false,
      type: itemType.TOOL_UPGRADE,
      level: i
    });
  }
}
var upgrades_default = upgrades;

// src/data/maps.ts
var {
  ASPARAGUS,
  CARROT,
  CORN,
  GARLIC,
  GRAPE,
  JALAPENO,
  OLIVE,
  ONION,
  PEA,
  POTATO,
  PUMPKIN,
  SOYBEAN,
  SPINACH,
  SUNFLOWER,
  STRAWBERRY,
  SWEET_POTATO,
  TOMATO,
  WATERMELON,
  WHEAT,
  WEED: WEED2
} = cropType;
var recipeCategories = {
  [recipeType.KITCHEN]: {},
  [recipeType.FORGE]: {},
  [recipeType.FERMENTATION]: {},
  [recipeType.RECYCLING]: {},
  [recipeType.WINE]: {}
};
var recipesMap = {};
for (const recipeId of Object.keys(recipes_exports)) {
  const recipe = recipes_exports[recipeId];
  recipeCategories[recipe.recipeType][recipe.id] = recipe;
  recipesMap[recipe.id] = recipe;
}
var upgradesMap = {};
for (let toolType2 of Object.keys(upgrades_default)) {
  for (let upgrade of Object.values(upgrades_default[toolType2])) {
    upgradesMap[upgrade.id] = upgrade;
  }
}
var itemsMap3 = {
  ...items_map_default,
  ...recipesMap,
  ...upgradesMap
};
var fermentableItemsMap = Object.fromEntries(
  Object.entries(itemsMap3).filter(([itemId]) => {
    const item = itemsMap3[itemId];
    return "daysToFerment" in item;
  })
);
var cropItemIdToSeedItemMap = Object.entries(items_map_default).reduce(
  (acc, [itemId, item]) => {
    const { growsInto } = item;
    if (growsInto) {
      const variants = Array.isArray(growsInto) ? growsInto : [growsInto];
      for (const variantId of variants) {
        acc[variantId] = items_map_default[itemId];
      }
    }
    return acc;
  },
  {}
);
var cropTypeToIdMap = {
  [ASPARAGUS]: "asparagus",
  [CARROT]: "carrot",
  [CORN]: "corn",
  [GARLIC]: "garlic",
  [
    GRAPE
    /** @type {string | string[]} */
  ]: grapeSeed.growsInto,
  [JALAPENO]: "jalapeno",
  [OLIVE]: "olive",
  [ONION]: "onion",
  [PEA]: "pea",
  [POTATO]: "potato",
  [PUMPKIN]: "pumpkin",
  [SOYBEAN]: "soybean",
  [SPINACH]: "spinach",
  [STRAWBERRY]: "strawberry",
  [SUNFLOWER]: "sunflower",
  [SWEET_POTATO]: "sweet-potato",
  [TOMATO]: "tomato",
  [WATERMELON]: "watermelon",
  [WHEAT]: "wheat",
  [WEED2]: "weed"
};

// src/common/services/randomNumber.ts
import seedrandom from "seedrandom";
import globalWindow from "global/window.js";
var RandomNumberService = class {
  /**
   * @type {Function?}
   */
  seededRandom = null;
  constructor() {
    const initialSeed = new URLSearchParams(globalWindow.location?.search).get(
      "seed"
    );
    if (initialSeed) {
      this.seedRandomNumber(initialSeed);
    }
  }
  /**
   * @param {string} seed
   */
  seedRandomNumber(seed) {
    this.seededRandom = seedrandom(seed);
  }
  /**
   * @returns {number}
   */
  generateRandomNumber() {
    return this.seededRandom ? this.seededRandom() : Math.random();
  }
  unseedRandomNumber() {
    this.seededRandom = null;
  }
  /**
   * Compares given number against a randomly generated number.
   * @param {number} chance Float between 0-1 to compare dice roll against.
   * @returns {boolean} True if the dice roll was equal to or lower than the
   * given chance, false otherwise.
   */
  isRandomNumberLessThan(chance) {
    return this.generateRandomNumber() <= chance;
  }
};
var randomNumberService = new RandomNumberService();

// src/common/utils.ts
var random = () => {
  return randomNumberService.generateRandomNumber();
};
var generateValueAdjustments = (priceCrashes = {}, priceSurges = {}) => Object.keys(itemsMap3).reduce((acc, key) => {
  if (itemsMap3[key].doesPriceFluctuate) {
    if (priceCrashes[key]) {
      acc[key] = 0.5;
    } else if (priceSurges[key]) {
      acc[key] = 1.5;
    } else {
      acc[key] = random() + 0.5;
    }
  }
  return acc;
}, {});

// api-etc/utils.ts
import redis from "redis";

// src/common/constants.ts
var MAX_ROOM_NAME_LENGTH = 25;

// api-etc/constants.ts
var GLOBAL_ROOM_KEY = "global";
var ACCEPTED_ORIGINS = /* @__PURE__ */ new Set([
  "http://localhost:3000",
  "http://farmhand:3000",
  // E2E environment
  "https://farmhand.vercel.app",
  "https://jeremyckahn.github.io",
  "https://www.farmhand.life",
  "https://v6p9d9t4.ssl.hwcdn.net"
  // itch.io's CDN that the game is served from
]);

// api-etc/utils.ts
var getRedisClient = () => {
  const client2 = redis.createClient({
    host: process.env.REDIS_ENDPOINT,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD
  });
  ["connect", "ready", "reconnecting"].forEach(
    (event) => client2.on(event, () => {
      console.log(`[REDIS] ${event}`);
    })
  );
  client2.on("error", function(error) {
    console.log("[REDIS] error");
    console.error(error);
  });
  return client2;
};
var getRoomData = async (roomKey, get2, set2) => {
  let roomData = JSON.parse(await get2(roomKey)) || {};
  let { valueAdjustments } = roomData;
  if (!valueAdjustments) {
    valueAdjustments = generateValueAdjustments();
    roomData = { valueAdjustments };
    set2(roomKey, JSON.stringify(roomData));
  }
  return roomData;
};
var getRoomName = (req) => `room-${(req.query?.room || req.body?.room || GLOBAL_ROOM_KEY).slice(
  0,
  MAX_ROOM_NAME_LENGTH
)}`;
var allowCors = (fn) => async (req, res) => {
  res.setHeader("Access-Control-Allow-Credentials", true);
  const { origin = "" } = req.headers;
  if (ACCEPTED_ORIGINS.has(origin) || origin.match(/https:\/\/farmhand-.*-jeremy-kahns-projects.*.vercel.app/)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  return await fn(req, res);
};

// api-src/get-market-data.ts
var client = getRedisClient();
var get = promisify(client.get).bind(client);
var set = promisify(client.set).bind(client);
var get_market_data_default = allowCors(async (req, res) => {
  const roomKey = getRoomName(req);
  const roomData = await getRoomData(roomKey, get, set);
  const { valueAdjustments } = roomData;
  set(roomKey, JSON.stringify(roomData));
  res.status(200).json({ valueAdjustments });
});
export {
  get_market_data_default as default
};
