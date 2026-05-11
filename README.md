# 植物大战僵尸 - 复刻版

一个基于 Phaser 3 的植物大战僵尸经典冒险模式前10关复刻版。使用纯 JavaScript + SVG 图形绘制，无需外部美术资源。

## 项目概述

本项目复刻了经典《植物大战僵尸》(Plants vs. Zombies) 游戏的冒险模式 1-1 到 1-10 关卡，包含完整的植物种植、僵尸波次、阳光经济、卡片冷却等核心玩法系统。

## 技术栈

| 技术 | 用途 |
|------|------|
| **Phaser 3.80** | HTML5 游戏引擎 |
| **原生 JavaScript** | 游戏逻辑 (ES6 Class) |
| **SVG / Canvas Graphics** | 所有视觉资源 (无需外部图片) |
| **HTML5** | 游戏容器 |

## 运行方式

```bash
# 无需安装任何依赖，直接用浏览器打开 index.html 即可
# 推荐使用本地服务器
npx http-server . -p 8080
# 或使用 Python
python -m http.server 8080
# 然后访问 http://localhost:8080
```

## 游戏内容

### 关卡设计 (1-1 到 1-10)

| 关卡 | 解锁植物 | 僵尸类型 | 特殊机制 |
|------|---------|---------|---------|
| 1-1 | 豌豆射手 | 普通僵尸 | 教程关 |
| 1-2 | 向日葵 | 普通 + 旗帜僵尸 | 阳光经济引入 |
| 1-3 | 坚果墙 | + 路障僵尸 | 防御机制 |
| 1-4 | 寒冰射手 | + 撑杆僵尸 | 减速效果 |
| 1-5 | 樱桃炸弹 | + 铁桶僵尸 | 范围爆炸 |
| 1-6 | 大嘴花 | 混合僵尸 | 近战吞噬 |
| 1-7 | 双发射手 | 大波僵尸 | 双倍火力 |
| 1-8 | 土豆地雷 | 混合强化 | 埋地延迟 |
| 1-9 | (全植物) | 大波精英 | 多波次挑战 |
| 1-10 | (全植物) | 全类型僵尸海 | 最终 Boss 波 |

### 植物列表

| 植物 | 阳光消耗 | 冷却时间 | 能力描述 |
|------|---------|---------|---------|
| 豌豆射手 | 100 | 7.5s | 向前方发射豌豆 |
| 向日葵 | 50 | 7.5s | 产出额外阳光 |
| 坚果墙 | 50 | 30s | 高血量防御，外观随血量变化 |
| 寒冰射手 | 175 | 7.5s | 发射冰豌豆，减速僵尸 |
| 樱桃炸弹 | 150 | 50s | 范围爆炸，一次性使用 |
| 大嘴花 | 150 | 7.5s | 吞噬前方单个僵尸，咀嚼后恢复 |
| 双发射手 | 200 | 7.5s | 连续发射两颗豌豆 |
| 土豆地雷 | 25 | 30s | 埋入地下，激活后踩踏即爆炸 |

### 僵尸列表

| 僵尸 | 血量 | 速度 | 特殊能力 |
|------|------|------|---------|
| 普通僵尸 | 200 | 慢 | 无 |
| 旗帜僵尸 | 200 | 稍快 | 标志大波来袭 |
| 路障僵尸 | 560 | 慢 | 路障帽提供额外护甲 |
| 撑杆僵尸 | 340 | 快 | 跳跃越过第一个植物 |
| 铁桶僵尸 | 1300 | 慢 | 铁桶提供高额护甲 |

### 核心系统

- **5×9 网格草坪**: 经典的种植区域布局
- **阳光经济**: 天空自动掉落阳光 + 向日葵产出，初始 50 阳光
- **卡片冷却**: 每种植物种植后独立冷却
- **铲子工具**: 可移除已种植的植物
- **割草机**: 每行一台，僵尸到达时自动触发清理全行
- **波次系统**: 每关多波僵尸，最后一波以旗帜僵尸为首的大波来袭

## 项目结构

```
plants-ulw/
├── index.html                    # 游戏入口 HTML
├── assets/
│   └── svg/
│       ├── plants/               # 植物 SVG 资源 (含CSS动画)
│       │   ├── peashooter.svg
│       │   ├── sunflower.svg
│       │   ├── wallnut.svg
│       │   ├── snowpea.svg
│       │   ├── cherrybomb.svg
│       │   ├── chomper.svg
│       │   ├── repeater.svg
│       │   ├── potatomine.svg
│       │   └── fumeshroom.svg
│       ├── zombies/              # 僵尸 SVG 资源
│       │   ├── zombie.svg
│       │   ├── flagzombie.svg
│       │   ├── coneheadzombie.svg
│       │   ├── bucketheadzombie.svg
│       │   └── polevaultzombie.svg
│       ├── projectiles/          # 投射物 SVG
│       │   ├── pea.svg
│       │   ├── snowpea.svg
│       │   └── sun.svg
│       └── ui/                   # UI 元素 SVG
│           └── lawnmower.svg
└── src/
    ├── main.js                   # Phaser 配置与游戏常量
    ├── data/
    │   └── levels.js             # 10关关卡波次数据
    ├── entities/
    │   ├── Plant.js              # 植物基类 (含所有植物图形绘制)
    │   ├── Zombie.js             # 僵尸基类 (含所有僵尸图形绘制)
    │   ├── Projectile.js         # 豌豆/冰豌豆投射物
    │   └── Sun.js                # 阳光实体
    ├── plants/                   # 植物子类
    │   ├── Peashooter.js
    │   ├── Sunflower.js
    │   ├── Wallnut.js
    │   ├── Snowpea.js
    │   ├── CherryBomb.js
    │   ├── Chomper.js
    │   ├── Repeater.js
    │   └── PotatoMine.js
    ├── zombies/                  # 僵尸子类
    │   ├── BasicZombie.js
    │   ├── FlagZombie.js
    │   ├── ConeheadZombie.js
    │   ├── BucketheadZombie.js
    │   └── PoleVaultZombie.js
    ├── scenes/                   # Phaser 场景
    │   ├── BootScene.js          # 资源加载
    │   ├── MenuScene.js          # 主菜单
    │   ├── LevelSelectScene.js   # 关卡选择
    │   ├── GameScene.js          # 核心游戏场景
    │   └── VictoryScene.js       # 过关动画
    └── utils/
        └── Grid.js               # 5×9 网格管理
```

## 游戏操作

1. **种植植物**: 点击下方卡片栏选择植物，再点击草坪放置
2. **收集阳光**: 点击飘落的阳光或向日葵产出的阳光
3. **使用铲子**: 点击铲子按钮激活，再点击已种植的植物移除
4. **游戏目标**: 抵御所有波次的僵尸入侵，保护左侧房屋不被突破

## 设计原则

- **最大程度还原**: 阳光消耗、冷却时间、僵尸血量、波次设计等数值均参考原版
- **纯图形绘制**: 所有植物和僵尸使用 Canvas Graphics API 程序化绘制，无需外部图片资源
- **零依赖运行**: 仅依赖 CDN 加载的 Phaser 3，无需 npm/node 环境
- **渐进式难度**: 每关逐步引入新植物和新僵尸类型，难度曲线平稳上升

## 浏览器兼容

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 许可

本项目仅用于学习和个人用途。植物大战僵尸(Plants vs. Zombies)是 PopCap Games / Electronic Arts 的注册商标。
