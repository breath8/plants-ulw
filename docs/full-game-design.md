# Plants vs. Zombies 完整复刻版 — 设计文档

## 概述
本项目目标是完整复刻原版 Plants vs. Zombies (2009, PopCap) 的全部内容：
- 50关冒险模式（5大世界）
- 全部26种植物、26种僵尸
- 全部世界机制（墓碑、水池、迷雾、屋顶斜坡、传送带）
- 额外模式：小游戏、解谜模式、生存模式、禅境花园

## 架构

### 游戏流程
```
Boot → Menu → WorldSelect → LevelSelect → GameScene → VictoryScene
                  ↕              ↕              ↕
              SettingsScene   (50 levels)   (World-specific)
```

### 世界系统
GameScene 通过 `worldIndex` (0-4) 加载不同的世界配置：

| Index | World  | 阳光 | 车道 | 特殊机制 | 额外 |
|-------|--------|------|------|----------|------|
| 0 | Day    | 天空掉落 | 5 | 无 | - |
| 1 | Night  | 无掉落 | 5 | 墓碑 | 蘑菇白天睡觉(需咖啡豆) |
| 2 | Pool   | 天空掉落 | 6 | 水池(中间2道) | 水生植物 |
| 3 | Fog    | 无掉落 | 6 | 水池+迷雾 | Plantern+Blover清雾 |
| 4 | Roof   | 天空掉落 | 5 | 屋顶斜坡 | 需花盆；抛物线弹道 |

### 世界修饰器模式
```js
worldConfig = {
  isNight: false,          // 无阳光掉落
  hasGraves: false,        // 墓碑
  hasPool: false,          // 水池车道
  hasFog: false,           // 迷雾覆盖
  hasSlope: false,         // 屋顶斜坡
  isConveyor: false,       // 传送带模式
  lanes: 5,                // 车道数
  gridCols: 9              // 网格列数
}
```

### 存档系统
```
SaveManager:
  unlockedLevel: 0-49     // 线性50关解锁
  currentWorld: 0-4       // 当前世界
  completedWorlds: []     // 已完成世界列表（解锁额外模式）
  
解锁规则:
  - 每过一关，unlockedLevel++
  - 世界内关卡按顺序解锁
  - 完成世界全部10关 → 解锁下一个世界
  - 冒险模式通关 → 解锁小游戏/解谜/生存/禅境花园
```

## 50关冒险模式

### World 1: Day (1-1 ~ 1-10) ✅ 已完成
植物解锁顺序：Peashooter → Sunflower → CherryBomb → Wall-nut → PotatoMine → SnowPea → Chomper → Repeater
僵尸：Basic, Flag, Conehead, PoleVault, Buckethead

### World 2: Night (2-1 ~ 2-10)
植物解锁：Puff-shroom(1-10过关) → Sun-shroom(2-1) → Fume-shroom(2-2) → Grave Buster(2-3) → Hypno-shroom(2-5) → Scaredy-shroom(2-6) → Ice-shroom(2-7) → Doom-shroom(2-8)
僵尸：Newspaper(2-1), ScreenDoor(2-3), Football(2-6), Dancing+Backup(2-8)
特殊：墓碑阻塞格子，最终一波墓碑生成僵尸；无阳光掉落

### World 3: Pool (3-1 ~ 3-10)
植物解锁：Squash(3-1) → Threepeater(3-2) → TangleKelp(3-3) → Jalapeno(3-5) → Spikeweed(3-6) → Torchwood(3-7) → Tall-nut(3-8)
僵尸：Snorkel(3-3), Zomboni(3-6), DolphinRider(3-8), Jackbox(4-1跨世界), Balloon(4-2跨世界)
特殊：6车道，中间2道水池需睡莲，池水最终波出僵尸
(注意：LilyPad、Cattail、Sea-shroom 在2-10、3-10、3-10过关解锁)

### World 4: Fog (4-1 ~ 4-10)
植物解锁：Plantern(4-1) → Cactus(4-2) → Blover(4-3) → SplitPea(4-5) → Starfruit(4-6) → Pumpkin(4-7) → Magnet-shroom(4-8)
僵尸：Digger(4-6), Pogo(4-7), Yeti(4-10随机)
特殊：迷雾覆盖右半场，夜间+水池组合
(注意：Cabbage-pult 在4-10过关解锁)

### World 5: Roof (5-1 ~ 5-10)
植物解锁：FlowerPot(5-1提供+5-2获得) → Kernel-pult(5-2) → CoffeeBean(5-3) → Garlic(5-4) → UmbrellaLeaf(5-6) → Marigold(5-7) → Melon-pult(5-8)
僵尸：Bungee(5-2), Ladder(5-3), Catapult(5-6), Gargantuar+Imp(5-8)
Boss: Dr. Zomboss(5-10, Zombot)
特殊：屋顶斜坡(左4列需抛物线)，需花盆，蹦极偷植物

## 完整植物清单 (26种)

| # | 植物 | 阳光 | 冷却 | 特性 | 解锁 |
|---|------|------|------|------|------|
| 1 | Peashooter | 100 | 7.5s | 直线射击 | 初始 |
| 2 | Sunflower | 50 | 7.5s | 产阳光 | 1-1 |
| 3 | CherryBomb | 150 | 50s | 3x3爆炸 | 1-2 |
| 4 | Wall-nut | 50 | 30s | 4000HP防御 | 1-3 |
| 5 | PotatoMine | 25 | 30s | 埋地1800伤害 | 1-5 |
| 6 | SnowPea | 175 | 7.5s | 减速 | 1-6 |
| 7 | Chomper | 150 | 7.5s | 吞噬1800伤害 | 1-7 |
| 8 | Repeater | 200 | 7.5s | 双发 | 1-8 |
| 9 | Puff-shroom | 0 | 7.5s | 短射程 | 1-10 |
| 10 | Sun-shroom | 25 | 7.5s | 成长产阳光 | 2-1 |
| 11 | Fume-shroom | 75 | 7.5s | 穿透 | 2-2 |
| 12 | GraveBuster | 75 | 15s | 清除墓碑 | 2-3 |
| 13 | Hypno-shroom | 75 | 30s | 魅惑 | 2-5 |
| 14 | Scaredy-shroom | 25 | 7.5s | 远程/躲藏 | 2-6 |
| 15 | Ice-shroom | 75 | 50s | 全屏冻结 | 2-7 |
| 16 | Doom-shroom | 125 | 60s | 大爆炸+弹坑 | 2-8 |
| 17 | LilyPad | 25 | 15s | 水上种植 | 2-10 |
| 18 | Squash | 50 | 30s | 压杀单体 | 3-1 |
| 19 | Threepeater | 325 | 7.5s | 三行射击 | 3-2 |
| 20 | TangleKelp | 25 | 30s | 水下拖拽 | 3-3 |
| 21 | Jalapeno | 125 | 50s | 整行消灭 | 3-5 |
| 22 | Spikeweed | 100 | 7.5s | 地面伤害 | 3-6 |
| 23 | Torchwood | 175 | 7.5s | 强化豌豆x2 | 3-7 |
| 24 | Tall-nut | 125 | 30s | 8000HP | 3-8 |
| 25 | Sea-shroom | 0 | 7.5s | 水生短射 | 3-10 |
| 26 | Cattail | 225 | 7.5s | 追踪攻击 | 3-10(商店) |

[以下植物在World4-5中解锁]
| 27 | Plantern | 25 | 15s | 照亮迷雾 | 4-1 |
| 28 | Cactus | 125 | 7.5s | 打气球 | 4-2 |
| 29 | Blover | 100 | 5s | 吹雾+气球 | 4-3 |
| 30 | SplitPea | 125 | 7.5s | 前后射击 | 4-5 |
| 31 | Starfruit | 125 | 7.5s | 5方向射击 | 4-6 |
| 32 | Pumpkin | 125 | 30s | 保护罩 | 4-7 |
| 33 | Magnet-shroom | 100 | 7.5s | 吸铁器 | 4-8 |

[以下植物在World5中解锁]
| 34 | FlowerPot | 25 | 15s | 屋顶种植 | 5-1 |
| 35 | Cabbage-pult | 100 | 7.5s | 抛物线 | 4-10 |
| 36 | Kernel-pult | 100 | 7.5s | 玉米+黄油 | 5-2 |
| 37 | CoffeeBean | 75 | 7.5s | 唤醒蘑菇 | 5-3 |
| 38 | Garlic | 50 | 15s | 改道 | 5-4 |
| 39 | UmbrellaLeaf | 100 | 15s | 防蹦极 | 5-6 |
| 40 | Marigold | 50 | 15s | 产金币 | 5-7 |
| 41 | Melon-pult | 300 | 7.5s | 范围伤害 | 5-8 |

(计入升级植物的总计26+种)

## 完整僵尸清单 (26种)

(按首次出现顺序)

| # | 僵尸 | HP | 速度 | 特性 | 首次出现 |
|---|------|----|------|------|---------|
| 1 | Basic | 200 | 0.3 | 无 | 1-1 |
| 2 | Flag | 200 | 0.4 | 大波信号 | 1-2 |
| 3 | Conehead | 560 | 0.3 | 锥形帽 | 1-3 |
| 4 | PoleVault | 340 | 0.5 | 跳越首株 | 1-4 |
| 5 | Buckethead | 1300 | 0.25 | 铁桶 | 1-5 |
| 6 | Newspaper | 340(纸), 170(狂暴) | 0.25→0.8 | 破纸加速 | 2-1 |
| 7 | ScreenDoor | 1100(含门) | 0.3 | 铁门挡豌豆 | 2-3 |
| 8 | Football | 1400 | 0.6 | 高速高HP | 2-6 |
| 9 | Dancing | 340 | 0.3 | 召唤伴舞 | 2-8 |
| 10 | BackupDancer | 200 | 0.3 | 伴舞 | 2-8 |
| 11 | DuckyTube | 200/560/1300 | 0.3 | 游泳 | 3-1 |
| 12 | Snorkel | 340 | 0.3 | 潜水 | 3-3 |
| 13 | Zomboni | 1400 | 0.2 | 压植物+冰道 | 3-6 |
| 14 | DolphinRider | 340 | 0.5(跳前) | 跳越2格 | 3-8 |
| 15 | Jackbox | 560 | 0.3 | 自爆 | 4-1 |
| 16 | Balloon | 200(气球), 170(坠地) | 0.3(空) | 飞行 | 4-2 |
| 17 | Digger | 260 | 0.4(地), 0.1(出) | 挖地后防 | 4-6 |
| 18 | Pogo | 340 | 0.4→跳 | 跳越植物 | 4-7 |
| 19 | Yeti | 1085 | 0.5 | 稀有，逃跑 | 4-10 |
| 20 | Bungee | 200(机器) | N/A | 偷植物 | 5-2 |
| 21 | Ladder | 340 | 0.25 | 放梯子越过 | 5-3 |
| 22 | Catapult | 780 | 0.2 | 投篮球 | 5-6 |
| 23 | Gargantuar | 3000 | 0.15 | 巨棒+扔Imp | 5-8 |
| 24 | Imp | 200 | 0.5 | 小快速 | 5-8 |
| 25 | Dr.Zomboss | 55000(Zombot) | N/A | Boss战 | 5-10 |
| 26 | (Bobsled) | N/A | N/A | 冰道雪橇队 | (特殊) |

## 商店系统 (Crazy Dave's Twiddydinkies)
- 3-4过关后解锁
- 出售升级植物：GatlingPea($5000), TwinSunflower($5000), Gloom-shroom($7500), Cattail($10000), Spikerock($7500), WinterMelon($10000), CobCannon($20000), Imitater($30000), GoldMagnet($3000)
- 出售禅境花园物品：花盆、肥料、水壶等

## 额外模式

### 小游戏 (20个)
Wall-nut Bowling 1/2, Bobsled Bonanza, ZomBotany 1/2, Slots, Zombiquarium 1/2, Beghouled, Whack a Zombie, Beghouled Twist, Portal Combat, Column, Zombie Nimble, Zombie Quick, Pogo Party, Dr. Zomboss's Revenge, I, Zombie, I, Zombie 2, Vasebreaker, Vasebreaker 2

### 解谜模式 (I, Zombie + Vasebreaker)
- I, Zombie: 控制僵尸吃植物 (10关)
- Vasebreaker: 砸花瓶打僵尸 (10关)

### 生存模式
- Survival: Day/Night/Pool/Fog/Roof (各10波)
- Survival: Endless (无尽模式)

### 禅境花园
- 种植和培育植物
- 植物产金币
- 商店购买装饰品

## 实施计划

### 阶段1: 基础设施 + Night世界
- 重构 GameScene 支持世界修饰器模式
- 8种新植物、4种新僵尸
- 墓碑机制、夜间无阳光
- WorldSelect场景、50关LevelSelect
- HTML/CSS 引用更新

### 阶段2: Pool世界
- 6车道支持、水池、睡莲
- 5种新植物、5种新僵尸
- 池水僵尸生成

### 阶段3: Fog世界
- 迷雾系统
- 4种新植物、3种新僵尸

### 阶段4: Roof世界 + Boss
- 屋顶斜坡、抛物线弹道
- 花盆系统
- 6种新植物、5种新僵尸
- Dr. Zomboss Boss战

### 阶段5: 额外模式
- 小游戏20个
- 解谜模式
- 生存模式
- 禅境花园
- 商店系统
