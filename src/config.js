// config.js - 游戏常量配置（最先加载）

// 游戏尺寸
const GAME_WIDTH = 1024;
const GAME_HEIGHT = 600;

// 网格配置 - 5行9列（默认），Pool/Fog使用6行
const GRID = {
    rows: 5,
    cols: 9,
    startX: 220,      // 草坪起始X
    startY: 95,       // 草坪起始Y
    cellWidth: 80,
    cellHeight: 100
};

// 世界类型
const WORLD = {
    DAY: 0,
    NIGHT: 1,
    POOL: 2,
    FOG: 3,
    ROOF: 4
};

// 世界配置
const WORLD_CONFIG = {
    0: { name: '白天', isNight: false, hasGraves: false, hasPool: false, hasFog: false, hasSlope: false, lanes: 5, sunFalls: true },
    1: { name: '夜晚', isNight: true, hasGraves: true, hasPool: false, hasFog: false, hasSlope: false, lanes: 5, sunFalls: false },
    2: { name: '泳池', isNight: false, hasGraves: false, hasPool: true, hasFog: false, hasSlope: false, lanes: 6, sunFalls: true },
    3: { name: '迷雾', isNight: true, hasGraves: false, hasPool: true, hasFog: true, hasSlope: false, lanes: 6, sunFalls: false },
    4: { name: '屋顶', isNight: false, hasGraves: false, hasPool: false, hasFog: false, hasSlope: true, lanes: 5, sunFalls: true }
};

// 阳光配置
const SUN = {
    initialAmount: 50,
    fallInterval: 10000,    // 天空掉落间隔ms
    sunflowerInterval: 24000, // 向日葵产出间隔
    sunValue: 25,
    fallDuration: 8000,     // 下落持续时间
    collectRadius: 50,
    lifetime: 8000          // 阳光存活时间
};

// 植物配置
const PLANT_CONFIG = {
    // Day plants (existing)
    peashooter:  { cost: 100, cooldown: 7500,  hp: 300, damage: 20, fireRate: 1500 },
    sunflower:   { cost: 50,  cooldown: 7500,  hp: 300 },
    wallnut:     { cost: 50,  cooldown: 30000, hp: 4000 },
    snowpea:     { cost: 175, cooldown: 7500,  hp: 300, damage: 20, fireRate: 1500, slowFactor: 0.5, slowDuration: 5000 },
    cherrybomb:  { cost: 150, cooldown: 50000, hp: 300, damage: 1800, range: 1 },
    chomper:     { cost: 150, cooldown: 7500,  hp: 300, damage: 1800, chewTime: 42000 },
    repeater:    { cost: 200, cooldown: 7500,  hp: 300, damage: 20, fireRate: 1500 },
    potatomine:  { cost: 25,  cooldown: 30000, hp: 300, damage: 1800, armTime: 15000 },
    // Night plants
    puffshroom:  { cost: 0,   cooldown: 7500,  hp: 300, damage: 20, fireRate: 1500, range: 3 },
    sunshroom:   { cost: 25,  cooldown: 7500,  hp: 300 },
    fumeshroom:  { cost: 75,  cooldown: 7500,  hp: 300, damage: 20, fireRate: 2000, pierce: true },
    gravebuster: { cost: 75,  cooldown: 15000, hp: 300 },
    hypnoshroom: { cost: 75,  cooldown: 30000, hp: 300 },
    scaredyshroom: { cost: 25,  cooldown: 7500,  hp: 300, damage: 20, fireRate: 1000, hideRange: 80 },
    iceshroom:   { cost: 75,  cooldown: 50000, hp: 300, freezeDuration: 6000 },
    doomshroom:  { cost: 125, cooldown: 60000, hp: 300, damage: 1800, range: 2 },
    // Pool plants
    lilypad:     { cost: 25,  cooldown: 15000, hp: 300 },
    squash:      { cost: 50,  cooldown: 30000, hp: 300, damage: 1800 },
    threepeater: { cost: 325, cooldown: 7500,  hp: 300, damage: 20, fireRate: 1500 },
    tanglekelp:  { cost: 25,  cooldown: 30000, hp: 300, damage: 1800 },
    jalapeno:    { cost: 125, cooldown: 50000, hp: 300, damage: 1800 },
    spikeweed:   { cost: 100, cooldown: 7500,  hp: 300, damage: 20, fireRate: 500 },
    torchwood:   { cost: 175, cooldown: 7500,  hp: 300 },
    tallnut:     { cost: 125, cooldown: 30000, hp: 8000 },
    // Fog plants
    seashroom:   { cost: 0,   cooldown: 7500,  hp: 300, damage: 20, fireRate: 1500, range: 3 },
    plantern:    { cost: 25,  cooldown: 15000, hp: 300 },
    cactus:      { cost: 125, cooldown: 7500,  hp: 300, damage: 20, fireRate: 1500 },
    blover:      { cost: 100, cooldown: 5000,  hp: 300 },
    splitpea:    { cost: 125, cooldown: 7500,  hp: 300, damage: 20, fireRate: 1500 },
    starfruit:   { cost: 125, cooldown: 7500,  hp: 300, damage: 20, fireRate: 1500 },
    pumpkin:     { cost: 125, cooldown: 30000, hp: 4000 },
    magnetshroom:{ cost: 100, cooldown: 7500,  hp: 300 },
    // Roof plants
    flowerpot:   { cost: 25,  cooldown: 15000, hp: 300 },
    cabbagepult: { cost: 100, cooldown: 7500,  hp: 300, damage: 40, fireRate: 2500 },
    kernelpult:  { cost: 100, cooldown: 7500,  hp: 300, damage: 20, fireRate: 2500 },
    coffeebean:  { cost: 75,  cooldown: 7500,  hp: 300 },
    garlic:      { cost: 50,  cooldown: 15000, hp: 400 },
    umbrellaleaf:{ cost: 100, cooldown: 15000, hp: 300 },
    marigold:    { cost: 50,  cooldown: 15000, hp: 300 },
    melonpult:   { cost: 300, cooldown: 7500,  hp: 300, damage: 60, fireRate: 2500 }
};

// 僵尸配置
const ZOMBIE_CONFIG = {
    // Day zombies
    basic:        { hp: 200,  speed: 12,  damage: 100, eatRate: 400 },
    flag:         { hp: 200,  speed: 15,  damage: 100, eatRate: 400 },
    conehead:     { hp: 560,  speed: 12,  damage: 100, eatRate: 400 },
    buckethead:   { hp: 1300, speed: 10,  damage: 100, eatRate: 400 },
    polevault:    { hp: 340,  speed: 18,  damage: 100, eatRate: 400, jumpRange: 1 },
    // Night zombies
    newspaper:    { hp: 340,  speed: 12,  damage: 100, eatRate: 400, rageHp: 170, rageSpeed: 30 },
    screendoor:   { hp: 1100, speed: 10,  damage: 100, eatRate: 400 },
    football:     { hp: 1400, speed: 25,  damage: 100, eatRate: 200 },
    dancing:      { hp: 340,  speed: 12,  damage: 100, eatRate: 400 },
    backupdancer: { hp: 200,  speed: 12,  damage: 100, eatRate: 400 },
    // Pool zombies
    duckytube:    { hp: 200,  speed: 12,  damage: 100, eatRate: 400 },
    snorkel:      { hp: 340,  speed: 14,  damage: 100, eatRate: 400 },
    zomboni:      { hp: 1400, speed: 8,   damage: 100, eatRate: 400 },
    dolphinrider: { hp: 340,  speed: 22,  damage: 100, eatRate: 400, jumpRange: 2 },
    // Fog zombies
    jackbox:      { hp: 560,  speed: 12,  damage: 1800, eatRate: 400 },
    balloon:      { hp: 200,  speed: 12,  damage: 100, eatRate: 400 },
    // Roof zombies
    bungee:       { hp: 200,  speed: 0,   damage: 0,   eatRate: 0 },
    ladder:       { hp: 340,  speed: 10,  damage: 100, eatRate: 400 },
    catapult:     { hp: 780,  speed: 8,   damage: 100, eatRate: 400 },
    gargantuar:   { hp: 3000, speed: 6,   damage: 100, eatRate: 400 },
    imp:          { hp: 200,  speed: 22,  damage: 100, eatRate: 300 },
    zomboss:      { hp: 55000, speed: 0,  damage: 100, eatRate: 0 }
};
