# Plants vs. Zombies Phaser 复刻版 — Agent 指南

## 项目本质

纯静态 HTML/JS 游戏项目。**无 npm、无构建工具、无包管理器、无 TypeScript。** Phaser 3.80 从 CDN 加载。所有 JS 文件通过 `<script>` 标签按依赖顺序引入。

## 核心架构

```
BootScene → MenuScene → WorldSelectScene → LevelSelectScene → GameScene → VictoryScene
                 ↕                ↕                ↕
            SettingsScene    (50 关 / 5 世界)    (世界特有机制)
```

### 5 大世界 (worldIndex 0-4)
| Index | 世界 | 车道 | 特殊机制 |
|-------|------|------|----------|
| 0 | Day | 5 | 天空掉落阳光 |
| 1 | Night | 5 | 墓碑、无阳光掉落 |
| 2 | Pool | 6 | 中间 2 道水池需睡莲 |
| 3 | Fog | 6 | 迷雾 + 水池 |
| 4 | Roof | 5 | 屋顶斜坡需花盆 |

世界配置在 `config.js` 的 `WORLD_CONFIG` / `WORLD` 常量中定义，通过 `worldIndex` 切换。

### 类继承体系（全局作用域）
```
Phaser.GameObjects.Container
  ├── Plant (src/entities/Plant.js)  ← 40 个子类在 src/plants/
  │   └── 每个子类: drawXXX(g) 方法用 Phaser Graphics API 绘制
  ├── Zombie (src/entities/Zombie.js)  ← 21 个子类在 src/zombies/
  │   └── drawBaseZombie(g) + 子类覆写
  ├── Sun, Projectile, Grave (src/entities/)
  └── Phaser.Scene (src/scenes/ 共 13 个场景)
```

## 关键约束

### 脚本加载顺序（致命）
`index.html` 中 50+ 个 `<script>` 标签必须严格按依赖顺序排列:
```
config.js → utils/*.js → data/*.js → entities/*.js → plants/*.js → zombies/*.js → scenes/*.js → main.js
```
**新文件必须在正确位置插入**，否则游戏直接报错（类未定义）。main.js 必须最后加载。

### 全局作用域
所有类、常量都是全局的（`class Plant`, `const LEVELS`, `const GRID`）。无 `import`/`export`。

### 视觉渲染
- **主渲染方式**: Phaser Graphics API 程序化绘制（`this.scene.add.graphics()`）
- **Fallback**: SVG 纹理（在 `BootScene.preload()` 中加载，以 `plant_peashooter` 等 key 注册）
- 新增植物/僵尸类型必须在 BootScene 加载对应 SVG，并在 `src/plants/` 或 `src/zombies/` 创建子类

### 网格系统
```
GRID: rows=5/6, cols=9, startX=220, startY=95, cellWidth=80, cellHeight=100
位置计算: x = startX + col * cellWidth + cellWidth/2
         y = startY + row * cellHeight + cellHeight/2
```

## 重要开发命令

```bash
# 启动本地服务器
npx http-server . -p 8080
# 或
python -m http.server 8080
# 然后浏览器访问 http://localhost:8080

# 无需安装依赖
```

## 代码约定

- 注释用中文
- 实体继承 `Phaser.GameObjects.Container`（非 Sprite）
- 物理用 Phaser Arcade Physics（`this.scene.physics.add.existing(this)`）
- 植物子类实现 `createVisual(type)`，调用 `this.drawXXX(g)` 绘制
- 配置在全局常量中定义（`PLANT_CONFIG`, `ZOMBIE_CONFIG`, `SUN`），后续通过 `cfg = PLANT_CONFIG[type]` 读取
- `settings` 通过 `saveManager.getSettings()` 读取，`saveManager.updateSettings()` 写入（localStorage 持久化）

## 关卡数据格式 (`src/data/levels.js`)

```js
{
  id: '1-1', name: '1-1', description: '...',
  plants: ['peashooter'],                    // 可用植物列表
  world: 0,                                  // 世界索引，默认 0
  waves: [
    { delay: 8000, zombies: [{ type: 'basic', row: 2 }] },
    // delay: 波次延迟（当前波清到 ≤2 僵尸后开始计时）
    // type: 僵尸类型字符串，row: 出现行号
  ]
}
```

**波次触发条件**: 当 `waveZombies.length === 0` 且 `waveIndex < waves.length` 且 `aliveZombies <= 2` 时立即启动下一波。`delay` 是"前一波清到 ≤2 只后等待的毫秒数"。

**进度条机制**: 基于 `killedZombies / totalZombies` 百分比。`Zombie.die()` 中调用 `scene.onZombieKilled()` 更新。

## 场景初始化陷阱

- 每个场景的 `create()` 必须先调用 `this.cameras.main.resetFX()` 并 `setAlpha(1)` — 否则前一个场景的 fadeOut 残留会导致黑屏。
- `MenuScene` 从其他场景返回时不会重新 `create()`，需要注册 `resume` 事件监听。

## 测试

无传统测试框架。使用 Playwright MCP 进行浏览器运行时测试（`.playwright-mcp/` 目录存有历史日志和截图）。测试方式：
- 启动本地服务器 → Playwright 打开页面 → 验证游戏行为

## 存档系统 (`SaveManager`)

- Key: `plants_ulw_save` (localStorage)
- `unlockedLevel`: 0-based 关卡索引（0 = 1-1 已解锁）
- `settings`: 包含 `initialSun`, `sunFallInterval`, `sunflowerInterval`, `cooldownMultiplier`, `costMultiplier`, `autoCollectSun`
- 默认值: `initialSun=50`, `sunFallInterval=10000`, `autoCollectSun=false`

## 已知陷阱

1. **首波延迟历史 bug**: 原 delay 值 20-25 秒过长，已缩减为 6-10 秒。修改关卡 delay 时需同时调整后续波次保证节奏。
2. **Container + Circle 点击区域**: Phaser 3.80 中 Container 嵌套 Circle 有交互偏移问题。Sun 的阳光收集按钮修复方式是避免在 Container 中使用 Circle 作为输入区域。
3. **设置项键值**: SettingsScene 中的设置项值用原始数值（阳光 9999 → 不显示为 "10k"），时间间隔显示为 "X秒"。新增设置项需要在 `DEFAULT_SETTINGS` 和 `getSettings()` 中都加上。

## 当前完成状态

- Day 世界 (1-1 ~ 1-10): ✅ 100%
- Night 世界 (2-1 ~ 2-10): ✅ 100%
- Pool 世界 (3-1 ~ 3-10): 🔄 ~50%
- Fog 世界 (4-1 ~ 4-10): 🔄 ~50%
- Roof 世界 (5-1 ~ 5-10): 🔄 ~50%
- 额外模式（小游戏/解谜/生存/禅境花园）: ❌ 未开始

## Git 提交规范

查看历史提交使用 `git log --oneline`。提交前缀惯例：`fix:`, `feat:`, `docs:`, `assets:`, `chore:`。正文和摘要均用中文。
