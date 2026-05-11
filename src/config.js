// config.js - 游戏常量配置（最先加载）

// 游戏尺寸
const GAME_WIDTH = 1024;
const GAME_HEIGHT = 600;

// 网格配置 - 5行9列
const GRID = {
    rows: 5,
    cols: 9,
    startX: 220,      // 草坪起始X
    startY: 95,       // 草坪起始Y
    cellWidth: 80,
    cellHeight: 100
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
    peashooter:  { cost: 100, cooldown: 7500,  hp: 300, damage: 20, fireRate: 1500 },
    sunflower:   { cost: 50,  cooldown: 7500,  hp: 300 },
    wallnut:     { cost: 50,  cooldown: 30000, hp: 4000 },
    snowpea:     { cost: 175, cooldown: 7500,  hp: 300, damage: 20, fireRate: 1500 },
    cherrybomb:  { cost: 150, cooldown: 50000, hp: 300, damage: 1800, range: 1 },
    chomper:     { cost: 150, cooldown: 7500,  hp: 300, damage: 1800, chewTime: 42000 },
    repeater:    { cost: 200, cooldown: 7500,  hp: 300, damage: 20, fireRate: 1500 },
    potatomine:  { cost: 25,  cooldown: 30000, hp: 300, damage: 1800, armTime: 15000 }
};

// 僵尸配置
const ZOMBIE_CONFIG = {
    basic:        { hp: 200,  speed: 12,  damage: 100, eatRate: 400 },
    flag:         { hp: 200,  speed: 15,  damage: 100, eatRate: 400 },
    conehead:     { hp: 560,  speed: 12,  damage: 100, eatRate: 400 },
    buckethead:   { hp: 1300, speed: 10,  damage: 100, eatRate: 400 },
    polevault:    { hp: 340,  speed: 18,  damage: 100, eatRate: 400, jumpRange: 1 }
};
