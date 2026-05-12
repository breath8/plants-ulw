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
    melonpult:   { cost: 300, cooldown: 7500,  hp: 300, damage: 80, fireRate: 2500 }
};

// 僵尸配置
const ZOMBIE_CONFIG = {
    // Day zombies
    basic:        { hp: 200,  speed: 12,  damage: 100, eatRate: 400 },
    flag:         { hp: 200,  speed: 15,  damage: 100, eatRate: 400 },
    conehead:     { hp: 570,  speed: 12,  damage: 100, eatRate: 400 },
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

// 植物中文名与描述（用于卡片提示）
const PLANT_INFO = {
    peashooter:    { name: '豌豆射手', desc: '向前方发射豌豆' },
    sunflower:     { name: '向日葵', desc: '周期性产出阳光' },
    wallnut:       { name: '坚果墙', desc: '高血量防御' },
    snowpea:       { name: '寒冰射手', desc: '发射冰豌豆减速僵尸' },
    cherrybomb:    { name: '樱桃炸弹', desc: '范围爆炸，一次性' },
    chomper:       { name: '大嘴花', desc: '吞噬前方单个僵尸' },
    repeater:      { name: '双发射手', desc: '连续发射两颗豌豆' },
    potatomine:    { name: '土豆地雷', desc: '埋地延迟，踩踏爆炸' },
    puffshroom:    { name: '小喷菇', desc: '免费短射程攻击' },
    sunshroom:     { name: '阳光菇', desc: '成长型产阳光' },
    fumeshroom:    { name: '大喷菇', desc: '穿透毒雾攻击' },
    gravebuster:   { name: '墓碑吞噬者', desc: '清除墓碑' },
    hypnoshroom:   { name: '魅惑菇', desc: '魅惑僵尸反戈' },
    scaredyshroom: { name: '胆小菇', desc: '僵尸靠近时缩回' },
    iceshroom:     { name: '冰冻菇', desc: '全屏冻结僵尸' },
    doomshroom:    { name: '毁灭菇', desc: '大范围毁灭爆炸' },
    lilypad:       { name: '睡莲', desc: '水上种植平台' },
    squash:        { name: '窝瓜', desc: '压扁前方僵尸' },
    threepeater:   { name: '三发射手', desc: '三行同时发射' },
    tanglekelp:    { name: '缠绕海草', desc: '拖下水消灭僵尸' },
    jalapeno:      { name: '辣椒', desc: '烧毁整行僵尸' },
    spikeweed:     { name: '地刺', desc: '对踩踏僵尸造成伤害' },
    torchwood:     { name: '火炬树桩', desc: '增强经过的豌豆' },
    tallnut:       { name: '高坚果', desc: '超高血量防御' },
    seashroom:     { name: '海蘑菇', desc: '免费水上短射程' },
    plantern:      { name: '灯笼草', desc: '照亮迷雾区域' },
    cactus:        { name: '仙人掌', desc: '对空攻击' },
    blover:        { name: '三叶草', desc: '吹散迷雾与飞行僵尸' },
    splitpea:      { name: '双向射手', desc: '前后双向射击' },
    starfruit:     { name: '杨桃', desc: '五星散射' },
    pumpkin:       { name: '南瓜头', desc: '保护罩掩护植物' },
    magnetshroom:  { name: '磁力菇', desc: '吸走僵尸铁制物品' },
    flowerpot:     { name: '花盆', desc: '屋顶种植平台' },
    cabbagepult:   { name: '卷心菜投手', desc: '抛物线投掷攻击' },
    kernelpult:    { name: '玉米投手', desc: '抛物线攻击，黄油定身' },
    coffeebean:    { name: '咖啡豆', desc: '唤醒白天睡觉的蘑菇' },
    garlic:        { name: '大蒜', desc: '强制僵尸换行' },
    umbrellaleaf:  { name: '荷叶伞', desc: '防御投掷与蹦极' },
    marigold:      { name: '金盏花', desc: '产出银币' },
    melonpult:     { name: '西瓜投手', desc: '范围减速抛物线攻击' }
};
