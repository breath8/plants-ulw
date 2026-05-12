// GameScene.js - 核心游戏场景
class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    init(data) {
        this.levelIndex = data.level || 0;
        this.gameMode = data.mode || 'adventure'; // 'adventure', 'mini', 'survival'

        // 根据模式选择关卡数据源
        if (this.gameMode === 'mini') {
            this.levelData = MINI_GAMES[this.levelIndex];
        } else if (this.gameMode === 'survival') {
            this.levelData = { waves: [], plants: SURVIVAL_CONFIG.initialPlants };
            this.survivalWaveNumber = 0;
            this.isSurvivalMode = true;
        } else {
            this.levelData = LEVELS[this.levelIndex];
        }

        // 世界系统
        this.worldIndex = this.levelData.world !== undefined ? this.levelData.world : 0;
        this.worldConfig = WORLD_CONFIG[this.worldIndex] || WORLD_CONFIG[0];
        this.isNight = this.worldConfig.isNight;
        this.hasGraves = this.worldConfig.hasGraves;
        this.hasPool = this.worldConfig.hasPool;
        this.hasFog = this.worldConfig.hasFog;
        this.hasSlope = this.worldConfig.hasSlope;
        this.sunFalls = this.worldConfig.sunFalls;
        this.gridRows = this.worldConfig.lanes;

        // 应用设置（生存模式使用独立设置）
        const settings = saveManager.getSettings();
        if (this.isSurvivalMode) {
            this.sunAmount = SURVIVAL_CONFIG.initialSun;
            this.sunFallInterval = SURVIVAL_CONFIG.sunFallInterval;
        } else {
            this.sunAmount = settings.initialSun;
            this.sunFallInterval = settings.sunFallInterval;
        }
        this.sunflowerInterval = settings.sunflowerInterval;
        this.cooldownMultiplier = settings.cooldownMultiplier;
        this.costMultiplier = settings.costMultiplier;
        this.autoCollectSun = settings.autoCollectSun || false;

        this.isGameOver = false;
        this.isPaused = false;
        this.pauseMenuContainer = null;
        this.selectedPlant = null;
        this.shovelActive = false;
        this.waveIndex = 0;
        this.zombieSpawnTimer = 0;
        this.sunFallTimer = 0;
        this.graves = [];
        this.lawnmowers = [];
        this.plants = [];
        this.zombies = [];
        this.projectiles = [];
        this.suns = [];
        this.plantCards = [];
        this.waveZombies = [];
        this.allWavesSpawned = false;
        this.zombiesRemaining = 0;
        this.killedZombies = 0;
        this.totalZombies = this.isSurvivalMode ? 9999 : this.levelData.waves.reduce((sum, wave) => sum + wave.zombies.length, 0);
        this.waveEndTimer = 0;              // 波次结束后等待计时器
        this.minWaveGap = 5000;             // 波次最小间隔时间(ms)
        this.waveEndWaiting = false;        // 是否在等待波次间隔

        // 传送带系统
        this.isConveyor = this.levelData.isConveyor || false;
        this.conveyorItems = [];       // 传送带上的植物列表
        this.conveyorTimer = 0;
        this.conveyorInterval = 8000;  // 每8秒生成一个植物
        this.maxConveyorCards = 8;     // 传送带最大卡片数
    }

    create() {
        // 重置相机状态（防止前一场景fadeOut残留）
        this.cameras.main.resetFX();
        this.cameras.main.setAlpha(1);

        // 重置网格（支持动态行数）
        gridManager.reset(this.gridRows);

        this.createBackground();
        this.createGraves();
        this.createUI();
        this.createLawnmowers();
        this.setupInput();
        this.setupCollisions();

        // 开始第一波
        this.startNextWave();
    }

    createBackground() {
        const g = this.add.graphics();
        const rows = this.gridRows || GRID.rows;
        const gridHeight = rows * GRID.cellHeight;
        const gridEndY = GRID.startY + gridHeight;
        const lawnEndX = GRID.startX + GRID.cols * GRID.cellWidth;

        // 夜间/白天顶部颜色
        if (this.isNight) {
            g.fillStyle(0x0a0a2e);
            g.fillRect(0, 0, GAME_WIDTH, GRID.startY);
            g.fillStyle(0x1a1a3e, 0.5);
            g.fillRect(0, 0, GAME_WIDTH, GRID.startY);
            // 月亮
            g.fillStyle(0xCCCCAA, 0.3);
            g.fillCircle(850, 30, 20);
            g.fillStyle(0xEEEDD0, 0.5);
            g.fillCircle(850, 30, 15);
        } else {
            g.fillStyle(0x87CEEB);
            g.fillRect(0, 0, GAME_WIDTH, GRID.startY);
            g.fillStyle(0x4A90D9, 0.3);
            g.fillRect(0, 0, GAME_WIDTH, GRID.startY);
        }

        // 草坪网格
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < GRID.cols; col++) {
                const x = GRID.startX + col * GRID.cellWidth;
                const y = GRID.startY + row * GRID.cellHeight;

                // Pool世界的中间2行是水池
                if (this.hasPool && row >= 2 && row <= 3) {
                    g.fillStyle(0x1a5276);
                    g.fillRect(x, y, GRID.cellWidth, GRID.cellHeight);
                    g.fillStyle(0x2471A3, 0.3);
                    g.fillRect(x + 2, y + 2, GRID.cellWidth - 4, GRID.cellHeight - 4);
                } else {
                    const isDark = (row + col) % 2 === 0;
                    if (this.isNight) {
                        g.fillStyle(isDark ? 0x2d5a1b : 0x1e4d12);
                    } else {
                        g.fillStyle(isDark ? 0x5AA035 : 0x4A8C2A);
                    }
                    g.fillRect(x, y, GRID.cellWidth, GRID.cellHeight);
                }
            }
        }

        // 左侧房子区域
        if (this.hasSlope) {
            // 屋顶 - 没有房子
            g.fillStyle(0x8B4513);
            g.fillRect(0, GRID.startY, GRID.startX, gridHeight);
        } else if (this.isNight) {
            // 夜间房子 - 暗色
            g.fillStyle(0x1a1a2e);
            g.fillRect(0, GRID.startY, GRID.startX, gridHeight);
            g.fillStyle(0x2a1a0e);
            g.fillRect(10, 90, 170, 180);
            // 门
            g.fillStyle(0x0a0a0a);
            g.fillRect(70, 180, 40, 90);
            // 窗户（亮灯）
            g.fillStyle(0x4a4a1a);
            g.fillRect(25, 115, 25, 25);
            g.fillRect(135, 115, 25, 25);
        } else {
            // 白天房子
            g.fillStyle(0x8B7355);
            g.fillRect(0, GRID.startY, GRID.startX, gridHeight);
            g.fillStyle(0xA0522D);
            g.fillRect(0, 80, 180, 200);
            g.fillStyle(0x8B4513);
            g.fillRect(0, 60, 200, 30);
            g.fillStyle(0x654321);
            g.fillRect(70, 180, 40, 100);
            g.fillStyle(0xADD8E6);
            g.fillRect(20, 120, 30, 30);
            g.fillRect(130, 120, 30, 30);
            g.lineStyle(2, 0x654321);
            g.strokeRect(20, 120, 30, 30);
            g.strokeRect(130, 120, 30, 30);
            g.beginPath();
            g.moveTo(35, 120);
            g.lineTo(35, 150);
            g.strokePath();
            g.beginPath();
            g.moveTo(20, 135);
            g.lineTo(50, 135);
            g.strokePath();
            g.beginPath();
            g.moveTo(145, 120);
            g.lineTo(145, 150);
            g.strokePath();
            g.beginPath();
            g.moveTo(130, 135);
            g.lineTo(160, 135);
            g.strokePath();
        }

        // 右侧道路/区域
        if (this.hasPool) {
            g.fillStyle(0x1a3a5a);
        } else if (this.hasSlope) {
            g.fillStyle(0x6B3410);
        } else if (this.isNight) {
            g.fillStyle(0x1a1a2e);
        } else {
            g.fillStyle(0x7B7B7B);
        }
        g.fillRect(lawnEndX, GRID.startY, GAME_WIDTH - lawnEndX, gridHeight);

        // 底部
        if (this.hasSlope) {
            g.fillStyle(0x5B2A0E);
        } else if (this.isNight) {
            g.fillStyle(0x0a0a1e);
        } else {
            g.fillStyle(0x8B7355);
        }
        g.fillRect(0, gridEndY, GAME_WIDTH, 100);

        // 夜间的星星
        if (this.isNight) {
            for (let i = 0; i < 30; i++) {
                const sx = Math.random() * GAME_WIDTH;
                const sy = Math.random() * GRID.startY;
                g.fillStyle(0xFFFFFF, Math.random() * 0.5 + 0.2);
                g.fillCircle(sx, sy, Math.random() * 1.5 + 0.5);
            }
        }

        // 迷雾覆盖（Fog世界）
        if (this.hasFog) {
            this.fogOverlay = this.add.graphics();
            this.fogOverlay.setDepth(5);
            this.updateFogOverlay();
        }

        // 屋顶斜坡：左侧房子区域风格
        if (this.hasSlope) {
            // 屋顶边缘装饰线
            g.lineStyle(2, 0x6B3410);
            g.beginPath();
            g.moveTo(0, GRID.startY);
            g.lineTo(GRID.startX, GRID.startY);
            g.strokePath();
            // 屋顶砖纹
            const slopeG = this.add.graphics();
            slopeG.setDepth(0);
            for (let row = 0; row < rows; row++) {
                const yOffset = GRID.startY + row * GRID.cellHeight + GRID.cellHeight / 2;
                for (let col = 0; col < GRID.cols; col++) {
                    const x = GRID.startX + col * GRID.cellWidth + GRID.cellWidth / 2;
                    slopeG.lineStyle(1, 0x5B2A0E, 0.2);
                    slopeG.strokeRect(x - 38, yOffset - 46, 76, 92);
                }
            }
        }
    }

    updateFogOverlay() {
        if (!this.fogOverlay || !this.hasFog) return;

        this.fogOverlay.clear();
        const rows = this.gridRows || GRID.rows;
        const cols = GRID.cols;

        // 迷雾渐变 - 右侧更浓
        for (let col = 0; col < cols; col++) {
            const alpha = (col / cols) * 0.6; // 越靠右雾越浓
            const x = GRID.startX + col * GRID.cellWidth;
            for (let row = 0; row < rows; row++) {
                const y = GRID.startY + row * GRID.cellHeight;

                // 检查该格是否有Plantern驱散
                let revealed = false;
                if (this.plants) {
                    for (const p of this.plants) {
                        if (p && p.alive && p.type === 'plantern') {
                            const dr = Math.abs(p.row - row);
                            const dc = Math.abs(p.col - col);
                            if (dr <= 2 && dc <= 2) {
                                revealed = true;
                                break;
                            }
                        }
                    }
                }

                if (!revealed && alpha > 0.05) {
                    this.fogOverlay.fillStyle(0x1a1a2e, alpha);
                    this.fogOverlay.fillRect(x, y, GRID.cellWidth, GRID.cellHeight);
                }
            }
        }
    }

    createGraves() {
        if (!this.hasGraves) return;

        // 在草坪上随机放置墓碑
        const graveCount = Phaser.Math.Between(3, 6);
        const cols = GRID.cols;
        const rows = this.gridRows || GRID.rows;

        // 收集可用格子（排除第1列和第9列，以及已占用的格子）
        const availableCells = [];
        for (let r = 0; r < rows; r++) {
            for (let c = 1; c < cols - 1; c++) {
                if (!gridManager.isOccupied(r, c)) {
                    availableCells.push({ row: r, col: c });
                }
            }
        }

        // 随机选择位置
        Phaser.Utils.Array.Shuffle(availableCells);
        for (let i = 0; i < Math.min(graveCount, availableCells.length); i++) {
            const cell = availableCells[i];
            const pos = gridManager.getCellPosition(cell.row, cell.col);
            const grave = new Grave(this, pos.x, pos.y, cell.row, cell.col);
            this.graves.push(grave);
            // 标记格子被墓碑占用
            gridManager.grid[cell.row][cell.col] = 'grave';
        }
    }

    createUI() {
        // === 顶部阳光栏 ===
        const topBar = this.add.graphics();
        topBar.fillStyle(0x5C3A1E, 0.9);
        topBar.fillRoundedRect(10, 5, 150, 40, 8);
        topBar.fillStyle(0x7B4F2A);
        topBar.fillRoundedRect(12, 7, 146, 15, 5);

        // 阳光图标
        const sunIcon = this.add.graphics();
        sunIcon.fillStyle(0xFFD700);
        sunIcon.fillCircle(30, 25, 12);
        sunIcon.fillStyle(0xFFEC8B);
        sunIcon.fillCircle(30, 25, 8);

        // 阳光数量
        this.sunText = this.add.text(55, 25, String(this.sunAmount), {
            font: 'bold 20px Arial',
            fill: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0, 0.5);

        // === 植物卡片栏 ===
        const cardStartX = 175;
        const cardY = 15;
        const cardWidth = 55;
        const cardHeight = 70;
        const cardSpacing = 5;

        this.plantCards = [];

        if (this.isConveyor) {
            // 传送带模式：绘制传送带背景并初始化
            this.createConveyorBackground(cardStartX, cardY, cardWidth, cardHeight, cardSpacing);
            // 初始生成4个植物
            for (let i = 0; i < 4; i++) {
                this.generateConveyorPlant();
            }
        } else {
            const availablePlants = this.levelData.plants;
            for (let i = 0; i < availablePlants.length; i++) {
                const plantType = availablePlants[i];
                const cfg = PLANT_CONFIG[plantType];
                const x = cardStartX + i * (cardWidth + cardSpacing);

                const card = this.createPlantCard(x, cardY, plantType, cfg, cardWidth, cardHeight);
                this.plantCards.push(card);
            }
        }

        // === 铲子按钮（传送带模式也保留铲子） ===
        const plantCount = this.isConveyor ? 1 : this.levelData.plants.length;
        const shovelX = cardStartX + Math.max(plantCount, 4) * (cardWidth + cardSpacing) + 10;
        this.createShovelButton(shovelX, cardY, cardWidth, cardHeight);

        // === 波次信息 ===
        const totalWaves = this.isSurvivalMode ? '∞' : this.levelData.waves.length;
        this.waveText = this.add.text(GAME_WIDTH - 20, 25, `波次: 0/${totalWaves}`, {
            font: 'bold 16px Arial',
            fill: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(1, 0.5);

        // === 关卡信息 ===
        this.add.text(GAME_WIDTH - 20, 50, `关卡 ${this.levelData.name}`, {
            font: '14px Arial',
            fill: '#CCCCCC',
            stroke: '#000000',
            strokeThickness: 1
        }).setOrigin(1, 0.5);

        // === 暂停按钮 ===
        this.createPauseButton();
    }

    createPlantCard(x, y, plantType, cfg, width, height) {
        const container = this.add.container(x, y);
        container.setDepth(10);

        // 卡片背景
        const bg = this.add.graphics();
        bg.fillStyle(0x5C3A1E);
        bg.fillRoundedRect(0, 0, width, height, 5);
        bg.fillStyle(0x7B4F2A);
        bg.fillRoundedRect(2, 2, width - 4, height - 25, 4);
        container.add(bg);

        // 选中高亮边框（默认隐藏）
        const selectBorder = this.add.graphics();
        selectBorder.fillStyle(0xFFD700, 0.4);
        selectBorder.fillRoundedRect(-2, -2, width + 4, height + 4, 6);
        selectBorder.setVisible(false);
        container.add(selectBorder);

        // 植物预览
        const preview = this.createPlantPreview(plantType, width / 2, 25);
        container.add(preview);

        // 阳光消耗（考虑倍率）
        const effectiveCost = Math.round(cfg.cost * this.costMultiplier);
        const costText = this.add.text(width / 2, height - 15, String(effectiveCost), {
            font: 'bold 12px Arial',
            fill: '#FFD700'
        }).setOrigin(0.5, 0.5);
        container.add(costText);

        // 冷却遮罩
        const cooldownMask = this.add.graphics();
        cooldownMask.fillStyle(0x000000, 0.6);
        cooldownMask.fillRoundedRect(0, 0, width, height, 5);
        cooldownMask.setVisible(false);
        container.add(cooldownMask);

        // === 提示信息（鼠标悬停显示） ===
        const infoTipInner = this.add.graphics();
        infoTipInner.fillStyle(0x1a1a2e, 0.92);
        infoTipInner.fillRoundedRect(0, 0, 180, 56, 6);
        infoTipInner.lineStyle(1, 0xFFD700, 0.5);
        infoTipInner.strokeRoundedRect(0, 0, 180, 56, 6);

        const infoName = this.add.text(10, 6, '', {
            font: 'bold 13px Arial', fill: '#FFD700'
        });
        const infoDesc = this.add.text(10, 26, '', {
            font: '11px Arial', fill: '#CCCCCC', wordWrap: { width: 160 }
        });
        const infoCost = this.add.text(10, 42, '', {
            font: '11px Arial', fill: '#FFEC8B'
        });

        const infoTip = this.add.container(0, 0, [infoTipInner, infoName, infoDesc, infoCost]);
        infoTip.setDepth(100);
        infoTip.setVisible(false);

        // 交互区域
        const zone = this.add.zone(x + width / 2, y + height / 2, width, height)
            .setInteractive({ useHandCursor: true });
        zone.setDepth(20);

        zone.on('pointerdown', () => {
            this.onCardClick(plantType, container, cfg, cooldownMask);
        });

        const showTooltip = () => {
            const info = PLANT_INFO[plantType];
            if (!info) return;
            infoName.setText(info.name);
            infoDesc.setText(info.desc);
            const effCost = Math.round(cfg.cost * this.costMultiplier);
            let extra = '';
            if (cfg.damage) extra += ` 伤害:${cfg.damage}`;
            if (cfg.fireRate) extra += ` 射速:${(cfg.fireRate / 1000).toFixed(1)}s`;
            infoCost.setText(`☀${effCost}${extra}`);
            // 定位在卡片下方居中
            const tipX = x + width / 2 - 90;
            const tipY = y + height + 4;
            infoTip.setPosition(tipX, tipY);
            infoTip.setVisible(true);
            // 移到顶层
            infoTip.setDepth(100);
        };

        zone.on('pointerover', () => {
            showTooltip();
            const effCost = Math.round(cfg.cost * this.costMultiplier);
            if (!cooldownMask.visible && this.sunAmount >= effCost) {
                container.setScale(1.05);
            }
        });

        zone.on('pointerout', () => {
            container.setScale(1);
            infoTip.setVisible(false);
        });

        return {
            type: plantType,
            container: container,
            bg: bg,
            selectBorder: selectBorder,
            cooldownMask: cooldownMask,
            zone: zone,
            width: width,
            height: height,
            cooling: false,
            cfg: cfg,
            infoTip: infoTip
        };
    }

    createPlantPreview(type, cx, cy) {
        // 优先使用SVG纹理
        const textureKey = 'plant_' + type;
        if (this.textures && this.textures.exists(textureKey)) {
            return this.add.image(cx, cy, textureKey).setScale(0.35);
        }

        const g = this.add.graphics();
        const scale = 0.5;

        switch(type) {
            case 'peashooter':
                g.fillStyle(0x4A8C2A);
                g.fillRect(cx - 2, cy + 5, 4, 10);
                g.fillStyle(0x6ABF3A);
                g.fillCircle(cx, cy, 10);
                g.fillStyle(0xFFFFFF);
                g.fillCircle(cx - 2, cy - 2, 3);
                g.fillStyle(0x000000);
                g.fillCircle(cx - 1, cy - 2, 1.5);
                break;
            case 'sunflower':
                g.fillStyle(0x4A8C2A);
                g.fillRect(cx - 1, cy + 5, 3, 10);
                for (let i = 0; i < 6; i++) {
                    const angle = (i * 60) * Math.PI / 180;
                    g.fillStyle(i % 2 === 0 ? 0xF5C842 : 0xE6B520);
                    g.fillEllipse(cx + Math.cos(angle) * 7, cy + Math.sin(angle) * 7 - 2, 5, 9);
                }
                g.fillStyle(0x5A3810);
                g.fillCircle(cx, cy - 2, 6);
                break;
            case 'wallnut':
                g.fillStyle(0xCD853F);
                g.fillEllipse(cx, cy + 2, 20, 26);
                g.lineStyle(1.5, 0x8B6914, 0.4);
                g.strokeEllipse(cx, cy + 2, 20, 26);
                // 眼睛
                g.fillStyle(0xFFFFFF);
                g.fillCircle(cx - 4, cy - 3, 2.5);
                g.fillCircle(cx + 4, cy - 3, 2.5);
                g.fillStyle(0x222222);
                g.fillCircle(cx - 4, cy - 3, 1.2);
                g.fillCircle(cx + 4, cy - 3, 1.2);
                // 经典锯齿嘴
                g.lineStyle(1.2, 0x5A3810);
                g.beginPath();
                g.moveTo(cx - 6, cy + 4);
                g.lineTo(cx - 4, cy + 7);
                g.lineTo(cx - 2, cy + 4);
                g.lineTo(cx, cy + 7);
                g.lineTo(cx + 2, cy + 4);
                g.lineTo(cx + 4, cy + 7);
                g.lineTo(cx + 6, cy + 4);
                g.strokePath();
                break;
            case 'snowpea':
                g.fillStyle(0x2A6A8C);
                g.fillRect(cx - 2, cy + 5, 4, 10);
                g.fillStyle(0x4AA8D8);
                g.fillCircle(cx, cy, 10);
                g.fillStyle(0xFFFFFF);
                g.fillCircle(cx - 2, cy - 2, 3);
                g.fillStyle(0x000000);
                g.fillCircle(cx - 1, cy - 2, 1.5);
                g.fillStyle(0xB8E8FF, 0.6);
                g.fillCircle(cx + 4, cy - 4, 2);
                break;
            case 'cherrybomb':
                g.fillStyle(0xCC2200);
                g.fillCircle(cx - 5, cy + 3, 8);
                g.fillCircle(cx + 5, cy + 3, 8);
                g.fillStyle(0xFF6644, 0.4);
                g.fillCircle(cx - 7, cy, 3);
                g.lineStyle(2, 0x4A8C2A);
                g.beginPath();
                g.moveTo(cx - 5, cy - 5);
                g.lineTo(cx, cy - 12);
                g.lineTo(cx + 5, cy - 5);
                g.strokePath();
                break;
            case 'chomper':
                g.fillStyle(0x4A5A2A);
                g.fillRect(cx - 2, cy + 5, 4, 10);
                g.fillStyle(0x6A4A8A);
                g.fillEllipse(cx, cy - 2, 20, 14);
                g.fillStyle(0xFFFFFF);
                g.fillTriangle(cx - 7, cy + 4, cx - 5, cy + 10, cx - 3, cy + 4);
                g.fillTriangle(cx + 3, cy + 4, cx + 5, cy + 10, cx + 7, cy + 4);
                break;
            case 'repeater':
                g.fillStyle(0x4A8C2A);
                g.fillRect(cx - 2, cy + 5, 4, 10);
                g.fillStyle(0x6ABF3A);
                g.fillCircle(cx - 3, cy + 1, 8);
                g.fillCircle(cx + 3, cy, 9);
                g.fillStyle(0xFFFFFF);
                g.fillCircle(cx + 1, cy - 2, 3);
                g.fillStyle(0x000000);
                g.fillCircle(cx + 2, cy - 2, 1.5);
                break;
            case 'potatomine':
                // 底部泥土
                g.fillStyle(0x5A4020);
                g.fillEllipse(cx, cy + 8, 22, 8);
                // 土豆身体（土黄色，区别于坚果的棕色）
                g.fillStyle(0xC8A85C);
                g.fillEllipse(cx, cy + 2, 16, 20);
                // 引信（从顶部伸出）
                g.lineStyle(1.5, 0x5A3A1A);
                g.beginPath();
                g.moveTo(cx, cy - 12);
                g.lineTo(cx + 2, cy - 18);
                g.lineTo(cx + 6, cy - 20);
                g.strokePath();
                // 引信火花
                g.fillStyle(0xFF6600);
                g.fillCircle(cx + 6, cy - 20, 3);
                g.fillStyle(0xFFCC00, 0.6);
                g.fillCircle(cx + 6, cy - 20, 1.5);
                // 眼睛（圆形惊讶表情）
                g.fillStyle(0xFFFFFF);
                g.fillCircle(cx - 4, cy - 2, 2.5);
                g.fillCircle(cx + 4, cy - 2, 2.5);
                g.fillStyle(0x333333);
                g.fillCircle(cx - 4, cy - 2, 1.2);
                g.fillCircle(cx + 4, cy - 2, 1.2);
                // 惊讶O形嘴
                g.fillStyle(0x5A3A1A);
                g.fillEllipse(cx, cy + 5, 4, 3);
                break;
            case 'puffshroom':
                g.fillStyle(0x8B6AAF);
                g.fillRect(cx - 2, cy + 5, 4, 8);
                g.fillStyle(0x9B59B6);
                g.fillEllipse(cx, cy, 20, 16);
                g.fillStyle(0xFFFFFF);
                g.fillCircle(cx - 4, cy - 3, 1.5);
                g.fillCircle(cx + 3, cy - 5, 1.5);
                break;
            case 'sunshroom':
                g.fillStyle(0xD4A847);
                g.fillRect(cx - 2, cy + 5, 4, 8);
                g.fillStyle(0xF5C842);
                g.fillEllipse(cx, cy, 20, 16);
                g.fillStyle(0xFFFFFF);
                g.fillCircle(cx - 3, cy - 2, 2);
                g.fillCircle(cx + 3, cy - 2, 2);
                g.fillStyle(0x000000);
                g.fillCircle(cx - 3, cy - 2, 1);
                g.fillCircle(cx + 3, cy - 2, 1);
                break;
            case 'fumeshroom':
                g.fillStyle(0x5A7A3A);
                g.fillRect(cx - 2, cy + 5, 4, 8);
                g.fillStyle(0x7B9B4A);
                g.fillEllipse(cx, cy, 24, 18);
                g.fillStyle(0x8BAB5A, 0.5);
                g.fillCircle(cx + 10, cy - 2, 4);
                break;
            case 'gravebuster':
                g.fillStyle(0xE8E8E8);
                g.fillEllipse(cx, cy, 18, 20);
                g.fillStyle(0x1A1A2E);
                g.fillEllipse(cx - 3, cy - 3, 4, 5);
                g.fillEllipse(cx + 3, cy - 3, 4, 5);
                g.fillStyle(0xCC2222);
                g.fillCircle(cx - 3, cy - 3, 1);
                g.fillCircle(cx + 3, cy - 3, 1);
                break;
            case 'hypnoshroom':
                g.fillStyle(0x8A5AA0);
                g.fillRect(cx - 2, cy + 5, 4, 8);
                g.fillStyle(0xB060D0);
                g.fillEllipse(cx, cy, 22, 16);
                g.lineStyle(1.5, 0xFFFFFF, 0.8);
                g.beginPath();
                g.arc(cx, cy, 4, 0, Math.PI * 1.5);
                g.strokePath();
                break;
            case 'scaredyshroom':
                g.fillStyle(0x5A8AAA);
                g.fillRect(cx - 2, cy + 5, 4, 8);
                g.fillStyle(0x6A9ABA);
                g.fillEllipse(cx, cy, 20, 16);
                g.fillStyle(0xFFFFFF);
                g.fillEllipse(cx - 3, cy - 2, 4, 5);
                g.fillEllipse(cx + 3, cy - 2, 4, 5);
                g.fillStyle(0x000000);
                g.fillCircle(cx - 3, cy - 1, 1);
                g.fillCircle(cx + 3, cy - 1, 1);
                break;
            case 'iceshroom':
                g.fillStyle(0xAAE0FF, 0.3);
                g.fillCircle(cx, cy, 14);
                g.fillStyle(0x4A8ABB);
                g.fillRect(cx - 2, cy + 5, 4, 8);
                g.fillStyle(0x5AAADF);
                g.fillEllipse(cx, cy, 22, 16);
                g.fillStyle(0xFFFFFF, 0.6);
                g.fillTriangle(cx, cy - 8, cx - 2, cy - 4, cx + 2, cy - 4);
                break;
            case 'doomshroom':
                g.fillStyle(0xFF2200, 0.15);
                g.fillCircle(cx, cy, 14);
                g.fillStyle(0x5A2A3A);
                g.fillEllipse(cx, cy, 22, 16);
                g.fillStyle(0x1A0A0A);
                g.fillEllipse(cx - 3, cy - 2, 3, 4);
                g.fillEllipse(cx + 3, cy - 2, 3, 4);
                g.fillStyle(0xFF4400, 0.5);
                g.fillTriangle(cx, cy - 10, cx - 2, cy - 6, cx + 2, cy - 6);
                break;
        }
        return g;
    }

    // ===== 传送带系统 =====

    createConveyorBackground(startX, cardY, cardWidth, cardHeight, cardSpacing) {
        // 传送带底栏背景
        const beltWidth = GAME_WIDTH - startX - 10;
        const beltBg = this.add.graphics();
        beltBg.fillStyle(0x3A2A1A, 0.9);
        beltBg.fillRoundedRect(startX - 5, cardY - 5, beltWidth, cardHeight + 10, 8);
        beltBg.lineStyle(2, 0x8B6914, 0.8);
        beltBg.strokeRoundedRect(startX - 5, cardY - 5, beltWidth, cardHeight + 10, 8);

        // 传送带纹理条纹
        for (let i = 0; i < 20; i++) {
            const sx = startX + i * 35;
            const stripe = this.add.graphics();
            stripe.fillStyle(0x5A4A2A, 0.3);
            stripe.fillRect(sx, cardY + cardHeight - 12, 20, 8);
        }
    }

    generateConveyorPlant() {
        if (!this.isConveyor || !this.levelData.conveyorPlants) return;
        if (this.conveyorItems.length >= this.maxConveyorCards) return;

        // 随机选择一种植物
        const plants = this.levelData.conveyorPlants;
        const plantType = plants[Math.floor(Math.random() * plants.length)];
        const cfg = PLANT_CONFIG[plantType];
        if (!cfg) return;

        // 创建传送带卡片
        const card = this.createConveyorCard(plantType, cfg);
        this.conveyorItems.push({ type: plantType, container: card.container, cfg: cfg, selectBorder: card.selectBorder });

        // 重新排列所有卡片位置（新卡片从右滑入）
        this.updateConveyorPositions(true);
    }

    createConveyorCard(plantType, cfg) {
        const container = this.add.container(0, 0);
        container.setDepth(10);

        const cardWidth = 55;
        const cardHeight = 70;

        // 卡片背景
        const bg = this.add.graphics();
        bg.fillStyle(0x4A3A1A);
        bg.fillRoundedRect(0, 0, cardWidth, cardHeight, 5);
        bg.fillStyle(0x6B4F2A);
        bg.fillRoundedRect(2, 2, cardWidth - 4, cardHeight - 25, 4);
        container.add(bg);

        // 植物图标
        const iconGfx = this.createPlantPreview(plantType, cardWidth / 2, 22 + 8);
        if (iconGfx) container.add(iconGfx);

        // 植物名字
        const info = PLANT_INFO[plantType];
        const label = info ? info.name : plantType;
        const text = this.add.text(cardWidth / 2, cardHeight - 10, label, {
            font: '10px Arial',
            fill: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 1
        }).setOrigin(0.5, 0.5);
        container.add(text);

        // 选中高亮边框（默认隐藏）
        const selectBorder = this.add.graphics();
        selectBorder.lineStyle(2, 0xFFD700);
        selectBorder.strokeRoundedRect(-2, -2, cardWidth + 4, cardHeight + 4, 6);
        selectBorder.setVisible(false);
        container.add(selectBorder);

        // 交互区 - 作为Container的子元素，坐标相对于Container
        const zone = this.add.zone(0, 0, cardWidth, cardHeight)
            .setInteractive({ useHandCursor: true });
        container.add(zone);

        zone.on('pointerdown', () => {
            // 取消铲子模式
            this.shovelActive = false;
            if (this.shovelButton) {
                this.shovelButton.bg.clear();
                this.shovelButton.bg.fillStyle(0x8B4513);
                this.shovelButton.bg.fillRoundedRect(0, 0, this.shovelButton.width, this.shovelButton.height, 5);
                this.shovelButton.bg.fillStyle(0xA0522D);
                this.shovelButton.bg.fillRoundedRect(2, 2, this.shovelButton.width - 4, this.shovelButton.height - 25, 4);
            }

            // 清除所有普通卡片的高亮
            this.plantCards.forEach(card => {
                card.selectBorder.setVisible(false);
                card.container.setScale(1);
            });
            // 清除传送带卡片的高亮
            this.conveyorItems.forEach(item => {
                if (item.selectBorder) item.selectBorder.setVisible(false);
            });

            // 如果点击的是已选中的，取消选择
            if (this.selectedPlant === plantType) {
                this.clearSelection();
                return;
            }

            this.selectedPlant = plantType;
            selectBorder.setVisible(true);

            // 光标预览
            this.clearCursorPreview();
            this.createCursorPreview(plantType);
        });

        return { container, bg, selectBorder, zone };
    }

    updateConveyorPositions(animate) {
        const cardStartX = 175;
        const cardY = 15;
        const cardWidth = 55;
        const cardSpacing = 5;

        this.conveyorItems.forEach((item, index) => {
            const targetX = cardStartX + index * (cardWidth + cardSpacing);
            const targetY = cardY;

            if (animate && item.container.x !== targetX) {
                this.tweens.add({
                    targets: item.container,
                    x: targetX,
                    y: targetY,
                    duration: 200,
                    ease: 'Quad.easeOut'
                });
            } else {
                item.container.x = targetX;
                item.container.y = targetY;
            }
        });
    }

    removeConveyorPlant(plantType) {
        // 找到第一个匹配的传送带卡片并移除
        const idx = this.conveyorItems.findIndex(item => item.type === plantType);
        if (idx === -1) return false;

        const item = this.conveyorItems[idx];
        // 销毁容器
        if (item.container) {
            item.container.destroy();
        }
        this.conveyorItems.splice(idx, 1);

        // 重新排列剩余卡片
        this.updateConveyorPositions(true);
        return true;
    }

    createShovelButton(x, y, width, height) {
        const container = this.add.container(x, y);

        const bg = this.add.graphics();
        bg.fillStyle(0x8B4513);
        bg.fillRoundedRect(0, 0, width, height, 5);
        bg.fillStyle(0xA0522D);
        bg.fillRoundedRect(2, 2, width - 4, height - 25, 4);
        container.add(bg);

        // 铲子图形
        const shovel = this.add.graphics();
        // 铲柄（木质）
        shovel.fillStyle(0x8B5A2B);
        shovel.fillRect(width / 2 - 2, 5, 4, 22);
        // 铲头（金属灰）
        shovel.fillStyle(0x999999);
        shovel.fillRect(width / 2 - 7, 23, 14, 9);
        shovel.fillStyle(0xBBBBBB);
        shovel.fillRect(width / 2 - 7, 23, 14, 3);
        // 铲头底部圆弧
        shovel.fillStyle(0x888888);
        shovel.fillEllipse(width / 2, 32, 16, 5);
        container.add(shovel);

        const text = this.add.text(width / 2, height - 15, '铲子', {
            font: '12px Arial',
            fill: '#FFFFFF'
        }).setOrigin(0.5, 0.5);
        container.add(text);

        const zone = this.add.zone(x + width / 2, y + height / 2, width, height)
            .setInteractive({ useHandCursor: true });

        zone.on('pointerdown', () => {
            this.shovelActive = !this.shovelActive;
            this.selectedPlant = null;
            this.clearCursorPreview();
            if (this.shovelActive) {
                bg.clear();
                bg.fillStyle(0xAA6633);
                bg.fillRoundedRect(0, 0, width, height, 5);
            } else {
                bg.clear();
                bg.fillStyle(0x8B4513);
                bg.fillRoundedRect(0, 0, width, height, 5);
                bg.fillStyle(0xA0522D);
                bg.fillRoundedRect(2, 2, width - 4, height - 25, 4);
            }
        });

        this.shovelButton = { container, bg, zone, width, height };
    }

    onZombieKilled() {
        this.killedZombies++;
    }

    createPauseButton() {
        const x = GAME_WIDTH - 60;
        const y = GAME_HEIGHT - 30;

        const bg = this.add.graphics();
        bg.fillStyle(0x666666, 0.8);
        bg.fillRoundedRect(x - 30, y - 15, 60, 30, 5);

        const text = this.add.text(x, y, '暂停', {
            font: '14px Arial',
            fill: '#FFFFFF'
        }).setOrigin(0.5, 0.5);

        const zone = this.add.zone(x, y, 60, 30).setInteractive({ useHandCursor: true });
        zone.on('pointerdown', () => {
            this.togglePause();
        });
    }

    createLawnmowers() {
        const rows = this.gridRows || GRID.rows;
        for (let row = 0; row < rows; row++) {
            const pos = gridManager.getCellPosition(row, -1);
            const mower = this.add.container(pos.x + 30, pos.y);

            const g = this.add.graphics();
            g.fillStyle(0x888888);
            g.fillRoundedRect(-15, -10, 30, 20, 3);
            g.fillStyle(0x999999);
            g.fillRoundedRect(-12, -8, 24, 16, 2);
            g.fillStyle(0xCC3333);
            g.fillRoundedRect(12, -6, 8, 12, 2);
            g.fillStyle(0x555555);
            g.fillCircle(-8, 12, 6);
            g.fillCircle(8, 12, 6);
            g.fillStyle(0x777777);
            g.fillCircle(-8, 12, 3);
            g.fillCircle(8, 12, 3);
            mower.add(g);

            this.lawnmowers.push({
                container: mower,
                row: row,
                active: false,
                x: pos.x + 30
            });
        }
    }

    setupInput() {
        // 启用topOnly模式 - 只有最顶层的交互对象响应点击
        this.input.topOnly = true;

        // 草坪点击事件 - 用于种植、铲子和阳光收集
        this.input.on('pointerdown', (pointer, currentlyOver) => {
            if (this.isGameOver || this.isPaused) return;

            // 尝试收集阳光（手动碰撞检测作为备用方案）
            if (this.tryCollectSun(pointer.x, pointer.y)) {
                return; // 已处理阳光收集
            }

            // 如果点击了其他交互对象（如卡片），不处理草坪点击
            if (currentlyOver && currentlyOver.length > 0) return;

            // 只在草坪区域响应（排除UI区域）
            const cell = gridManager.getCellFromPosition(pointer.x, pointer.y);
            if (!cell) return;

            if (this.shovelActive) {
                this.removePlantAt(cell.row, cell.col);
                return;
            }

            if (this.selectedPlant) {
                this.placePlant(cell.row, cell.col);
            }
        });

        // 鼠标移动时显示种植预览
        this.input.on('pointermove', (pointer) => {
            this.updateCursorPreview(pointer.x, pointer.y);
        });
    }

    // 手动检测并收集阳光（备用方案，解决Phaser Container hitArea问题）
    tryCollectSun(px, py) {
        for (let i = this.suns.length - 1; i >= 0; i--) {
            const sun = this.suns[i];
            if (!sun || sun.collected || !sun.active) continue;

            // 计算点击位置到阳光中心的距离
            const dist = Phaser.Math.Distance.Between(px, py, sun.x, sun.y);
            if (dist < 30) { // 30像素的收集半径
                sun.collect();
                return true;
            }
        }
        return false;
    }

    updateCursorPreview(px, py) {
        this.clearCursorPreview();

        const cell = gridManager.getCellFromPosition(px, py);
        if (!cell) return;

        if (this.shovelActive) {
            // 铲子模式：格子白色高亮 + 铲子图标跟随鼠标
            const pos = gridManager.getCellPosition(cell.row, cell.col);
            const g = this.add.graphics();
            g.fillStyle(0xFFFFFF, 0.25);
            g.fillRoundedRect(
                pos.x - GRID.cellWidth / 2 + 2,
                pos.y - GRID.cellHeight / 2 + 2,
                GRID.cellWidth - 4,
                GRID.cellHeight - 4,
                4
            );
            g.setDepth(5);
            this.cursorPreview = g;

            // 跟随鼠标的小铲子图标
            const icon = this.add.graphics();
            // 铲柄
            icon.fillStyle(0x8B5A2B);
            icon.fillRect(px + 12, py - 8, 3, 18);
            // 铲头
            icon.fillStyle(0x999999);
            icon.fillRect(px + 8, py + 8, 11, 7);
            icon.fillStyle(0xBBBBBB);
            icon.fillRect(px + 8, py + 8, 11, 3);
            // 铲头弧度
            icon.fillStyle(0x888888);
            icon.fillEllipse(px + 14, py + 15, 14, 4);
            icon.setDepth(100);
            this.cursorIcon = icon;
            return;
        }

        if (!this.selectedPlant) return;
        if (gridManager.isOccupied(cell.row, cell.col)) return;

        const pos = gridManager.getCellPosition(cell.row, cell.col);
        this.cursorPreview = this.add.graphics();
        this.cursorPreview.fillStyle(0xFFFFFF, 0.3);
        this.cursorPreview.fillRoundedRect(
            pos.x - GRID.cellWidth / 2 + 2,
            pos.y - GRID.cellHeight / 2 + 2,
            GRID.cellWidth - 4,
            GRID.cellHeight - 4,
            4
        );
        this.cursorPreview.setDepth(5);

        // 跟随鼠标的小植物图标
        const icon = this.createPlantPreview(this.selectedPlant, px + 15, py - 10);
        icon.setDepth(100);
        this.cursorIcon = icon;
    }

    setupCollisions() {
        // 碰撞在update中手动检测
    }

    onCardClick(plantType, container, cfg, cooldownMask) {
        if (cooldownMask.visible) return;

        // 清除所有卡片的选中状态
        this.plantCards.forEach(card => {
            card.selectBorder.setVisible(false);
            card.container.setScale(1);
        });

        // 取消铲子
        this.shovelActive = false;
        if (this.shovelButton) {
            this.shovelButton.bg.clear();
            this.shovelButton.bg.fillStyle(0x8B4513);
            this.shovelButton.bg.fillRoundedRect(0, 0, this.shovelButton.width, this.shovelButton.height, 5);
            this.shovelButton.bg.fillStyle(0xA0522D);
            this.shovelButton.bg.fillRoundedRect(2, 2, this.shovelButton.width - 4, this.shovelButton.height - 25, 4);
        }

        // 取消铲子模式
        this.shovelActive = false;
        if (this.shovelButton) {
            this.shovelButton.bg.clear();
            this.shovelButton.bg.fillStyle(0x8B4513);
            this.shovelButton.bg.fillRoundedRect(0, 0, this.shovelButton.width, this.shovelButton.height, 5);
            this.shovelButton.bg.fillStyle(0xA0522D);
            this.shovelButton.bg.fillRoundedRect(2, 2, this.shovelButton.width - 4, this.shovelButton.height - 25, 4);
        }

        // 如果点击的是已选中的植物，取消选择
        if (this.selectedPlant === plantType) {
            this.clearSelection();
            return;
        }

        // 选中植物（允许选中，种植时再检查阳光）
        this.selectedPlant = plantType;
        this.clearCursorPreview();

        // 显示选中高亮
        const card = this.plantCards.find(c => c.type === plantType);
        if (card) {
            card.selectBorder.setVisible(true);
        }
    }

    placePlant(row, col) {
        if (!this.selectedPlant) return;

        const plantType = this.selectedPlant;
        const cfg = PLANT_CONFIG[plantType];

        if (this.isConveyor) {
            // 传送带模式：不消耗阳光，没有冷却
            const hasItem = this.conveyorItems.some(item => item.type === plantType);
            if (!hasItem) return;
        } else {
            const effectiveCost = Math.round(cfg.cost * this.costMultiplier);
            if (this.sunAmount < effectiveCost) return;

            // 冷却检查
            const card = this.plantCards.find(c => c.type === plantType);
            if (!card || card.cooling) return;
        }

        // 检查放置限制
        const existing = gridManager.getPlant(row, col);

        if (this.hasPool) {
            const isWaterRow = row >= 2 && row <= 3;
            if (isWaterRow) {
                if (plantType === 'lilypad') {
                    // 睡莲只能放空水格
                    if (existing) return;
                } else {
                    // 其他植物需要睡莲垫底
                    if (!existing || existing.type !== 'lilypad') return;
                }
            } else {
                // 非水行：正常占用检查
                if (existing) return;
            }
        } else if (this.hasSlope) {
            if (plantType === 'flowerpot') {
                // 花盆只能放空格
                if (existing) return;
            } else {
                // 其他植物需要花盆垫底
                if (!existing || existing.type !== 'flowerpot') return;
            }
        } else {
            // 普通关卡：正常占用检查
            if (existing) return;
        }

        // 扣除阳光（传送带模式不消耗阳光）
        if (!this.isConveyor) {
            const effectiveCost = Math.round(cfg.cost * this.costMultiplier);
            this.sunAmount -= effectiveCost;
            this.updateSunDisplay();
        }

        // 创建植物
        const pos = gridManager.getCellPosition(row, col);
        let plant;

        switch(this.selectedPlant) {
            case 'peashooter': plant = new Peashooter(this, pos.x, pos.y, row, col); break;
            case 'sunflower': plant = new Sunflower(this, pos.x, pos.y, row, col); break;
            case 'wallnut': plant = new Wallnut(this, pos.x, pos.y, row, col); break;
            case 'snowpea': plant = new Snowpea(this, pos.x, pos.y, row, col); break;
            case 'cherrybomb': plant = new CherryBomb(this, pos.x, pos.y, row, col); break;
            case 'chomper': plant = new Chomper(this, pos.x, pos.y, row, col); break;
            case 'repeater': plant = new Repeater(this, pos.x, pos.y, row, col); break;
            case 'potatomine': plant = new PotatoMine(this, pos.x, pos.y, row, col); break;
            case 'puffshroom': plant = new Puffshroom(this, pos.x, pos.y, row, col); break;
            case 'sunshroom': plant = new Sunshroom(this, pos.x, pos.y, row, col); break;
            case 'fumeshroom': plant = new Fumeshroom(this, pos.x, pos.y, row, col); break;
            case 'gravebuster': plant = new GraveBuster(this, pos.x, pos.y, row, col); break;
            case 'hypnoshroom': plant = new Hypnoshroom(this, pos.x, pos.y, row, col); break;
            case 'scaredyshroom': plant = new Scaredyshroom(this, pos.x, pos.y, row, col); break;
            case 'iceshroom': plant = new Iceshroom(this, pos.x, pos.y, row, col); break;
            case 'doomshroom': plant = new Doomshroom(this, pos.x, pos.y, row, col); break;
            // Pool plants
            case 'lilypad': plant = new Lilypad(this, pos.x, pos.y, row, col); break;
            case 'squash': plant = new Squash(this, pos.x, pos.y, row, col); break;
            case 'threepeater': plant = new Threepeater(this, pos.x, pos.y, row, col); break;
            case 'tanglekelp': plant = new TangleKelp(this, pos.x, pos.y, row, col); break;
            case 'jalapeno': plant = new Jalapeno(this, pos.x, pos.y, row, col); break;
            case 'spikeweed': plant = new Spikeweed(this, pos.x, pos.y, row, col); break;
            case 'torchwood': plant = new Torchwood(this, pos.x, pos.y, row, col); break;
            case 'tallnut': plant = new Tallnut(this, pos.x, pos.y, row, col); break;
            // Fog plants
            case 'seashroom': plant = new Seashroom(this, pos.x, pos.y, row, col); break;
            case 'plantern': plant = new Plantern(this, pos.x, pos.y, row, col); break;
            case 'cactus': plant = new Cactus(this, pos.x, pos.y, row, col); break;
            case 'blover': plant = new Blover(this, pos.x, pos.y, row, col); break;
            case 'splitpea': plant = new Splitpea(this, pos.x, pos.y, row, col); break;
            case 'starfruit': plant = new Starfruit(this, pos.x, pos.y, row, col); break;
            case 'pumpkin': plant = new Pumpkin(this, pos.x, pos.y, row, col); break;
            case 'magnetshroom': plant = new Magnetshroom(this, pos.x, pos.y, row, col); break;
            // Roof plants
            case 'cabbagepult': plant = new Cabbagepult(this, pos.x, pos.y, row, col); break;
            case 'kernelpult': plant = new Kernelpult(this, pos.x, pos.y, row, col); break;
            case 'melonpult': plant = new Melonpult(this, pos.x, pos.y, row, col); break;
            case 'coffeebean': plant = new Coffeebean(this, pos.x, pos.y, row, col); break;
            case 'garlic': plant = new Garlic(this, pos.x, pos.y, row, col); break;
            case 'flowerpot': plant = new Flowerpot(this, pos.x, pos.y, row, col); break;
            case 'umbrellaleaf': plant = new Umbrellaleaf(this, pos.x, pos.y, row, col); break;
            case 'marigold': plant = new Marigold(this, pos.x, pos.y, row, col); break;
            default: return;
        }

        gridManager.placePlant(row, col, plant);
        this.plants.push(plant);

        if (this.isConveyor) {
            // 传送带模式：移除已放置的卡片，不触发冷却
            this.removeConveyorPlant(this.selectedPlant);
            this.clearSelection();
        } else {
            // 普通模式：开始冷却
            this.startCooldown(this.selectedPlant);
            // 更新卡片可用状态
            this.updateCardAvailability();
        }
    }

    clearSelection() {
        this.selectedPlant = null;

        // 清除所有卡片选中高亮
        this.plantCards.forEach(card => {
            card.selectBorder.setVisible(false);
            card.container.setScale(1);
        });

        // 清除传送带卡片选中高亮
        this.conveyorItems.forEach(item => {
            if (item.selectBorder) item.selectBorder.setVisible(false);
        });

        // 清除预览
        this.clearCursorPreview();
    }

    clearCursorPreview() {
        if (this.cursorPreview) {
            this.cursorPreview.destroy();
            this.cursorPreview = null;
        }
        if (this.cursorIcon) {
            this.cursorIcon.destroy();
            this.cursorIcon = null;
        }
    }

    updateCardAvailability() {
        this.plantCards.forEach(card => {
            const effectiveCost = Math.round(card.cfg.cost * this.costMultiplier);
            const canAfford = this.sunAmount >= effectiveCost;
            const isCooling = card.cooling;
            // 降低不可用卡片的透明度
            card.container.setAlpha((canAfford && !isCooling) ? 1 : 0.5);
        });
    }

    removePlantAt(row, col) {
        const plant = gridManager.getPlant(row, col);
        if (plant && typeof plant.die === 'function') {
            plant.die();
        }
    }

    startCooldown(plantType) {
        const card = this.plantCards.find(c => c.type === plantType);
        if (!card) return;

        card.cooling = true;
        card.cooldownMask.setVisible(true);
        this.updateCardAvailability();

        const effectiveCooldown = Math.round(card.cfg.cooldown * this.cooldownMultiplier);
        this.time.delayedCall(effectiveCooldown, () => {
            card.cooling = false;
            card.cooldownMask.setVisible(false);
            this.updateCardAvailability();
        });
    }

    updateSunDisplay() {
        this.sunText.setText(String(this.sunAmount));
        this.updateCardAvailability();
    }

    startNextWave() {
        if (this.isSurvivalMode) {
            // 生存模式：动态生成波次
            const wave = SURVIVAL_CONFIG.getWave(this.survivalWaveNumber);
            this.survivalWaveNumber++;
            this.waveZombies = [...wave.zombies];
            this.zombieSpawnTimer = wave.delay;
            this.waveIndex++;
            this.waveText.setText(`波次: ${this.survivalWaveNumber}`);
            this.waveEndWaiting = false;
            this.waveEndTimer = 0;
            return;
        }

        if (this.waveIndex >= this.levelData.waves.length) {
            this.allWavesSpawned = true;
            return;
        }

        const wave = this.levelData.waves[this.waveIndex];
        this.waveZombies = [...wave.zombies];
        this.zombieSpawnTimer = wave.delay;
        this.waveIndex++;

        this.waveText.setText(`波次: ${this.waveIndex}/${this.levelData.waves.length}`);

        // 重置波次结束等待
        this.waveEndWaiting = false;
        this.waveEndTimer = 0;
    }

    spawnZombie(type, row) {
        const x = GAME_WIDTH + 20;
        const pos = gridManager.getCellPosition(row, 0);
        const y = pos.y;

        let zombie;
        switch(type) {
            case 'basic': zombie = new BasicZombie(this, x, y, row); break;
            case 'flag': zombie = new FlagZombie(this, x, y, row); break;
            case 'conehead': zombie = new ConeheadZombie(this, x, y, row); break;
            case 'buckethead': zombie = new BucketheadZombie(this, x, y, row); break;
            case 'polevault': zombie = new PoleVaultZombie(this, x, y, row); break;
            // Night zombies
            case 'newspaper': zombie = new NewspaperZombie(this, x, y, row); break;
            case 'screendoor': zombie = new ScreenDoorZombie(this, x, y, row); break;
            case 'football': zombie = new FootballZombie(this, x, y, row); break;
            case 'dancing': zombie = new DancingZombie(this, x, y, row); break;
            case 'backupdancer': zombie = new BackupDancer(this, x, y, row); break;
            // Pool zombies
            case 'duckytube': zombie = new DuckyTubeZombie(this, x, y, row); break;
            case 'snorkel': zombie = new SnorkelZombie(this, x, y, row); break;
            case 'zomboni': zombie = new ZomboniZombie(this, x, y, row); break;
            case 'dolphinrider': zombie = new DolphinRiderZombie(this, x, y, row); break;
            // Fog zombies
            case 'jackbox': zombie = new JackboxZombie(this, x, y, row); break;
            case 'balloon': zombie = new BalloonZombie(this, x, y, row); break;
            // Roof zombies
            case 'bungee': zombie = new BungeeZombie(this, x, y, row); break;
            case 'catapult': zombie = new CatapultZombie(this, x, y, row); break;
            case 'ladder': zombie = new LadderZombie(this, x, y, row); break;
            case 'gargantuar': zombie = new GargantuarZombie(this, x, y, row); break;
            case 'imp': zombie = new ImpZombie(this, x, y, row); break;
            default: zombie = new BasicZombie(this, x, y, row); break;
        }

        this.zombies.push(zombie);
        this.zombiesRemaining++;
    }

    spawnSun() {
        const x = Phaser.Math.Between(GRID.startX, GRID.startX + GRID.cols * GRID.cellWidth);
        const rows = this.gridRows || GRID.rows;
        const targetY = Phaser.Math.Between(GRID.startY + 50, GRID.startY + rows * GRID.cellHeight - 50);
        const sun = new Sun(this, x, -20, targetY, true);
        this.suns.push(sun);
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        if (this.isPaused) {
            this.physics.pause();
            this.showPauseMenu();
        } else {
            this.physics.resume();
            this.hidePauseMenu();
        }
    }

    showPauseMenu() {
        if (this.pauseMenuContainer) return;

        const container = this.add.container(0, 0).setDepth(200);

        // 半透明遮罩
        const overlay = this.add.graphics();
        overlay.fillStyle(0x000000, 0.6);
        overlay.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
        container.add(overlay);

        // 暂停标题面板
        const panelBg = this.add.graphics();
        panelBg.fillStyle(0x2d2d44, 0.95);
        panelBg.fillRoundedRect(GAME_WIDTH / 2 - 130, GAME_HEIGHT / 2 - 120, 260, 260, 16);
        panelBg.lineStyle(2, 0x4CAF50);
        panelBg.strokeRoundedRect(GAME_WIDTH / 2 - 130, GAME_HEIGHT / 2 - 120, 260, 260, 16);
        container.add(panelBg);

        // 标题
        const title = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 85, '游戏暂停', {
            font: 'bold 30px Arial',
            fill: '#FFD700',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5, 0.5);
        container.add(title);

        // 继续游戏按钮
        this.createPauseMenuButton(container, GAME_WIDTH / 2, GAME_HEIGHT / 2 - 25, '继续游戏', 0x4CAF50, () => {
            this.togglePause();
        });

        // 重新开始按钮
        this.createPauseMenuButton(container, GAME_WIDTH / 2, GAME_HEIGHT / 2 + 35, '重新开始', 0xFF8C00, () => {
            this.isPaused = false;
            this.physics.resume();
            this.scene.restart({ level: this.levelIndex });
        });

        // 返回菜单按钮
        this.createPauseMenuButton(container, GAME_WIDTH / 2, GAME_HEIGHT / 2 + 95, '返回菜单', 0xCC3333, () => {
            this.isPaused = false;
            this.physics.resume();
            this.scene.start('MenuScene');
        });

        this.pauseMenuContainer = container;

        // 入场动画
        container.setAlpha(0);
        this.tweens.add({
            targets: container,
            alpha: 1,
            duration: 200
        });
    }

    getBrighterColor(color, amount) {
        let r = (color >> 16) & 0xFF;
        let g = (color >> 8) & 0xFF;
        let b = color & 0xFF;
        r = Math.min(255, r + amount);
        g = Math.min(255, g + amount);
        b = Math.min(255, b + amount);
        return (r << 16) | (g << 8) | b;
    }

    createPauseMenuButton(container, x, y, text, color, callback) {
        const brighter = this.getBrighterColor(color, 40);
        const brightest = this.getBrighterColor(color, 70);

        const bg = this.add.graphics();
        bg.fillStyle(color);
        bg.fillRoundedRect(x - 85, y - 22, 170, 44, 10);
        bg.fillStyle(brighter, 0.5);
        bg.fillRoundedRect(x - 82, y - 19, 164, 22, 8);
        container.add(bg);

        const label = this.add.text(x, y, text, {
            font: 'bold 20px Arial',
            fill: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5, 0.5);
        container.add(label);

        const zone = this.add.zone(x, y, 170, 44).setInteractive({ useHandCursor: true });
        container.add(zone);

        zone.on('pointerdown', callback);
        zone.on('pointerover', () => {
            bg.clear();
            bg.fillStyle(brightest);
            bg.fillRoundedRect(x - 85, y - 22, 170, 44, 10);
            bg.fillStyle(this.getBrighterColor(brightest, 30), 0.5);
            bg.fillRoundedRect(x - 82, y - 19, 164, 22, 8);
        });
        zone.on('pointerout', () => {
            bg.clear();
            bg.fillStyle(color);
            bg.fillRoundedRect(x - 85, y - 22, 170, 44, 10);
            bg.fillStyle(brighter, 0.5);
            bg.fillRoundedRect(x - 82, y - 19, 164, 22, 8);
        });
    }

    hidePauseMenu() {
        if (this.pauseMenuContainer) {
            this.pauseMenuContainer.destroy();
            this.pauseMenuContainer = null;
        }
    }

    checkProjectileCollisions() {
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const proj = this.projectiles[i];
            if (!proj || !proj.active || !proj.alive) {
                this.projectiles.splice(i, 1);
                continue;
            }

            for (let j = this.zombies.length - 1; j >= 0; j--) {
                const zombie = this.zombies[j];
                if (!zombie || !zombie.active || !zombie.alive) continue;
                if (zombie.row !== proj.row) continue;

                const dist = Math.abs(proj.x - zombie.x);
                const yDist = Math.abs(proj.y - zombie.y);
                if (dist < 25 && yDist < 40) {
                    zombie.takeDamage(proj.damage, proj.type === 'snowpea');
                    proj.hit();
                    this.projectiles.splice(i, 1);
                    break;
                }
            }
        }
    }

    checkLawnmowers() {
        for (let i = 0; i < this.lawnmowers.length; i++) {
            const mower = this.lawnmowers[i];
            if (mower.active) {
                mower.container.x += 5;
                // 检测碰撞
                for (let j = this.zombies.length - 1; j >= 0; j--) {
                    const zombie = this.zombies[j];
                    if (zombie && zombie.alive && zombie.row === mower.row) {
                        const dist = Math.abs(mower.container.x - zombie.x);
                        if (dist < 30) {
                            zombie.takeDamage(9999);
                        }
                    }
                }
                if (mower.container.x > GAME_WIDTH + 50) {
                    mower.container.destroy();
                    this.lawnmowers.splice(i, 1);
                    i--;
                }
            } else {
                // 检测是否有僵尸到达
                for (let j = 0; j < this.zombies.length; j++) {
                    const zombie = this.zombies[j];
                    if (zombie && zombie.alive && zombie.row === mower.row) {
                        if (zombie.x < GRID.startX + 20) {
                            mower.active = true;
                            break;
                        }
                    }
                }
            }
        }
    }

    cleanup() {
        // 清理已死亡的实体
        this.plants = this.plants.filter(p => p && p.active && p.alive);
        this.zombies = this.zombies.filter(z => z && z.active && z.alive);
        this.projectiles = this.projectiles.filter(p => p && p.active && p.alive);
        this.suns = this.suns.filter(s => s && s.active && !s.collected);
    }

    checkWinCondition() {
        if (this.allWavesSpawned && this.zombiesRemaining <= 0 && this.zombies.filter(z => z.alive).length === 0) {
            this.onLevelComplete();
        }
    }

    onZombieReachHouse(row) {
        // 检查该行是否有割草机
        const mower = this.lawnmowers.find(m => m.row === row && !m.active);
        if (mower) {
            mower.active = true;
            return;
        }

        // 游戏失败
        if (!this.isGameOver) {
            this.isGameOver = true;
            this.showGameOver();
        }
    }

    showGameOver() {
        // 半透明遮罩
        const overlay = this.add.graphics();
        overlay.fillStyle(0x000000, 0.6);
        overlay.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
        overlay.setDepth(100);

        const gameOverText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 40, '僵尸吃掉了你的脑子！', {
            font: 'bold 36px Arial',
            fill: '#FF0000',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5, 0.5).setDepth(101);

        // 重试按钮
        const retryBg = this.add.graphics().setDepth(101);
        retryBg.fillStyle(0x4CAF50);
        retryBg.fillRoundedRect(GAME_WIDTH / 2 - 60, GAME_HEIGHT / 2 + 20, 120, 45, 10);

        const retryText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 42, '重试', {
            font: 'bold 22px Arial',
            fill: '#FFFFFF'
        }).setOrigin(0.5, 0.5).setDepth(102);

        const retryZone = this.add.zone(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 42, 120, 45)
            .setInteractive({ useHandCursor: true }).setDepth(102);
        retryZone.on('pointerdown', () => {
            this.scene.restart({ level: this.levelIndex });
        });

        // 返回菜单按钮
        const menuBg = this.add.graphics().setDepth(101);
        menuBg.fillStyle(0x666666);
        menuBg.fillRoundedRect(GAME_WIDTH / 2 - 60, GAME_HEIGHT / 2 + 80, 120, 45, 10);

        const menuText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 102, '返回菜单', {
            font: 'bold 18px Arial',
            fill: '#FFFFFF'
        }).setOrigin(0.5, 0.5).setDepth(102);

        const menuZone = this.add.zone(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 102, 120, 45)
            .setInteractive({ useHandCursor: true }).setDepth(102);
        menuZone.on('pointerdown', () => {
            if (this.gameMode === 'adventure') {
                this.scene.start('MenuScene');
            } else {
                this.scene.start('ExtraModeSelectScene');
            }
        });
    }

    onLevelComplete() {
        if (this.isGameOver) return;
        this.isGameOver = true;

        // 胜利界面
        const overlay = this.add.graphics();
        overlay.fillStyle(0x000000, 0.5);
        overlay.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
        overlay.setDepth(100);

        const winText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 60, '关卡完成！', {
            font: 'bold 42px Arial',
            fill: '#FFD700',
            stroke: '#000000',
            strokeThickness: 5
        }).setOrigin(0.5, 0.5).setDepth(101);

        // 关卡名
        const levelName = this.levelData.name || this.levelData.id || `关卡 ${this.levelIndex + 1}`;
        this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 20, `关卡 ${levelName}`, {
            font: '22px Arial',
            fill: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5, 0.5).setDepth(101);

        // 入场动画
        winText.setScale(0);
        this.tweens.add({
            targets: winText,
            scaleX: 1,
            scaleY: 1,
            duration: 500,
            ease: 'Back.easeOut'
        });

        if (this.gameMode === 'adventure') {
            // 冒险模式：更新解锁进度
            const nextLevel = this.levelIndex + 1;
            if (nextLevel < LEVELS.length) {
                saveManager.setUnlockedLevel(nextLevel);
            }

            // 下一关按钮
            if (nextLevel < LEVELS.length) {
                const nextBg = this.add.graphics().setDepth(101);
                nextBg.fillStyle(0x4CAF50);
                nextBg.fillRoundedRect(GAME_WIDTH / 2 - 70, GAME_HEIGHT / 2 + 15, 140, 50, 10);

                const nextText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 40, '下一关 →', {
                    font: 'bold 22px Arial',
                    fill: '#FFFFFF'
                }).setOrigin(0.5, 0.5).setDepth(102);

                const nextZone = this.add.zone(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 40, 140, 50)
                    .setInteractive({ useHandCursor: true }).setDepth(102);
                nextZone.on('pointerdown', () => {
                    this.scene.start('GameScene', { level: nextLevel, mode: 'adventure' });
                });
            }

            // 返回关卡选择
            const selBg = this.add.graphics().setDepth(101);
            selBg.fillStyle(0x666666);
            selBg.fillRoundedRect(GAME_WIDTH / 2 - 60, GAME_HEIGHT / 2 + 80, 120, 45, 10);

            const selText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 102, '返回选关', {
                font: 'bold 18px Arial',
                fill: '#FFFFFF'
            }).setOrigin(0.5, 0.5).setDepth(102);

            const selZone = this.add.zone(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 102, 120, 45)
                .setInteractive({ useHandCursor: true }).setDepth(102);
            selZone.on('pointerdown', () => {
                this.scene.start('LevelSelectScene', { worldIndex: this.worldIndex });
            });
        } else {
            // 额外模式：返回额外模式选择
            const retryBg = this.add.graphics().setDepth(101);
            retryBg.fillStyle(0x4CAF50);
            retryBg.fillRoundedRect(GAME_WIDTH / 2 - 70, GAME_HEIGHT / 2 + 15, 140, 50, 10);

            const retryText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 40, '再来一次', {
                font: 'bold 22px Arial',
                fill: '#FFFFFF'
            }).setOrigin(0.5, 0.5).setDepth(102);

            const retryZone = this.add.zone(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 40, 140, 50)
                .setInteractive({ useHandCursor: true }).setDepth(102);
            retryZone.on('pointerdown', () => {
                this.scene.start('GameScene', { level: this.levelIndex, mode: this.gameMode });
            });

            const selBg = this.add.graphics().setDepth(101);
            selBg.fillStyle(0x666666);
            selBg.fillRoundedRect(GAME_WIDTH / 2 - 60, GAME_HEIGHT / 2 + 80, 120, 45, 10);

            const selText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 102, '返回', {
                font: 'bold 18px Arial',
                fill: '#FFFFFF'
            }).setOrigin(0.5, 0.5).setDepth(102);

            const selZone = this.add.zone(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 102, 120, 45)
                .setInteractive({ useHandCursor: true }).setDepth(102);
            selZone.on('pointerdown', () => {
                this.scene.start('ExtraModeSelectScene');
            });
        }
    }

    update(time, delta) {
        if (this.isGameOver || this.isPaused) return;

        // 僵尸生成
        if (this.waveZombies.length > 0) {
            this.zombieSpawnTimer -= delta;
            if (this.zombieSpawnTimer <= 0) {
                const zombieData = this.waveZombies.shift();
                this.spawnZombie(zombieData.type, zombieData.row);
                this.zombieSpawnTimer = 800 + Math.random() * 400;
            }
        } else if (this.isSurvivalMode || this.waveIndex < this.levelData.waves.length) {
            // 当前波次所有僵尸生成完毕，等待最小间隔后开始下一波
            if (!this.waveEndWaiting) {
                this.waveEndWaiting = true;
                this.waveEndTimer = 0;
            }
            this.waveEndTimer += delta;
            const aliveZombies = this.zombies.filter(z => z && z.alive);
            if (aliveZombies.length <= 2 && this.waveEndTimer >= this.minWaveGap) {
                this.waveEndWaiting = false;
                this.waveEndTimer = 0;
                this.startNextWave();
            }
        }

        // 天空掉落阳光（夜间不掉落）
        if (this.sunFalls) {
            this.sunFallTimer += delta;
            if (this.sunFallTimer >= this.sunFallInterval) {
                this.sunFallTimer = 0;
                this.spawnSun();
            }
        }

        // 自动收集阳光
        if (this.autoCollectSun) {
            this.suns.forEach(sun => {
                if (sun && !sun.collected && sun.active) {
                    // 收集所有在草坪区域内的阳光
                    const rows = this.gridRows || GRID.rows;
                    const inPlayArea = sun.y > GRID.startY && sun.y < GRID.startY + rows * GRID.cellHeight
                        && sun.x > GRID.startX - 40 && sun.x < GRID.startX + GRID.cols * GRID.cellWidth + 40;
                    if (inPlayArea) {
                        sun.collect();
                    }
                }
            });
        }

        // 传送带植物生成
        if (this.isConveyor) {
            this.conveyorTimer += delta;
            if (this.conveyorTimer >= this.conveyorInterval) {
                this.conveyorTimer = 0;
                this.generateConveyorPlant();
            }
        }

        // 更新所有实体
        this.plants.forEach(p => {
            if (p && p.active && p.alive) p.update(time, delta);
        });
        this.zombies.forEach(z => {
            if (z && z.active && z.alive) z.update(time, delta);
        });

        // 更新迷雾（有Plantern时更新驱散区域）
        if (this.hasFog && this.fogOverlay) {
            this.updateFogOverlay();
        }

        // 碰撞检测
        this.checkProjectileCollisions();
        this.checkLawnmowers();

        // 清理
        this.cleanup();

        // 更新僵尸计数
        this.zombiesRemaining = this.zombies.filter(z => z && z.alive).length;

        // 胜利检查（生存模式没有胜利，只有失败）
        if (!this.isSurvivalMode) {
            if (!this.allWavesSpawned && this.waveIndex >= this.levelData.waves.length && this.waveZombies.length === 0) {
                this.allWavesSpawned = true;
            }
            if (this.allWavesSpawned) {
                this.checkWinCondition();
            }
        }
    }
}
