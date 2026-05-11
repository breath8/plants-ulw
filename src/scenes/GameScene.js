// GameScene.js - 核心游戏场景
class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    init(data) {
        this.levelIndex = data.level || 0;
        this.levelData = LEVELS[this.levelIndex];
        this.sunAmount = SUN.initialAmount;
        this.isGameOver = false;
        this.isPaused = false;
        this.selectedPlant = null;
        this.shovelActive = false;
        this.waveIndex = 0;
        this.zombieSpawnTimer = 0;
        this.sunFallTimer = 0;
        this.lawnmowers = [];
        this.plants = [];
        this.zombies = [];
        this.projectiles = [];
        this.suns = [];
        this.plantCards = [];
        this.waveZombies = [];
        this.allWavesSpawned = false;
        this.zombiesRemaining = 0;
    }

    create() {
        // 重置相机状态（防止前一场景fadeOut残留）
        this.cameras.main.resetFX();
        this.cameras.main.setAlpha(1);

        // 重置网格
        gridManager.reset();

        this.createBackground();
        this.createUI();
        this.createLawnmowers();
        this.setupInput();
        this.setupCollisions();

        // 开始第一波
        this.startNextWave();
    }

    createBackground() {
        const g = this.add.graphics();

        // 院子背景
        g.fillStyle(0x8B7355);
        g.fillRect(0, 0, GAME_WIDTH, GRID.startY);

        // 草坪
        for (let row = 0; row < GRID.rows; row++) {
            for (let col = 0; col < GRID.cols; col++) {
                const x = GRID.startX + col * GRID.cellWidth;
                const y = GRID.startY + row * GRID.cellHeight;
                const isDark = (row + col) % 2 === 0;
                g.fillStyle(isDark ? 0x5AA035 : 0x4A8C2A);
                g.fillRect(x, y, GRID.cellWidth, GRID.cellHeight);
            }
        }

        // 左侧房屋区域
        g.fillStyle(0x8B7355);
        g.fillRect(0, GRID.startY, GRID.startX, GRID.rows * GRID.cellHeight);

        // 房屋
        g.fillStyle(0xA0522D);
        g.fillRect(0, 80, 180, 200);
        g.fillStyle(0x8B4513);
        g.fillRect(0, 60, 200, 30);
        // 门
        g.fillStyle(0x654321);
        g.fillRect(70, 180, 40, 100);
        // 窗户
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

        // 右侧道路
        g.fillStyle(0x7B7B7B);
        g.fillRect(GRID.startX + GRID.cols * GRID.cellWidth, GRID.startY,
            GAME_WIDTH - GRID.startX - GRID.cols * GRID.cellWidth, GRID.rows * GRID.cellHeight);

        // 底部
        g.fillStyle(0x8B7355);
        g.fillRect(0, GRID.startY + GRID.rows * GRID.cellHeight, GAME_WIDTH, 100);
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
        const availablePlants = this.levelData.plants;

        for (let i = 0; i < availablePlants.length; i++) {
            const plantType = availablePlants[i];
            const cfg = PLANT_CONFIG[plantType];
            const x = cardStartX + i * (cardWidth + cardSpacing);

            const card = this.createPlantCard(x, cardY, plantType, cfg, cardWidth, cardHeight);
            this.plantCards.push(card);
        }

        // === 铲子按钮 ===
        const shovelX = cardStartX + availablePlants.length * (cardWidth + cardSpacing) + 10;
        this.createShovelButton(shovelX, cardY, cardWidth, cardHeight);

        // === 波次信息 ===
        this.waveText = this.add.text(GAME_WIDTH - 20, 25, `波次: 0/${this.levelData.waves.length}`, {
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

        // 阳光消耗
        const costText = this.add.text(width / 2, height - 15, String(cfg.cost), {
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

        // 交互区域
        const zone = this.add.zone(x + width / 2, y + height / 2, width, height)
            .setInteractive({ useHandCursor: true });
        zone.setDepth(20);

        zone.on('pointerdown', () => {
            this.onCardClick(plantType, container, cfg, cooldownMask);
        });

        zone.on('pointerover', () => {
            if (!cooldownMask.visible && this.sunAmount >= cfg.cost) {
                container.setScale(1.05);
            }
        });

        zone.on('pointerout', () => {
            container.setScale(1);
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
            cfg: cfg
        };
    }

    createPlantPreview(type, cx, cy) {
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
                g.fillStyle(0x8B6914);
                g.fillEllipse(cx, cy + 2, 20, 26);
                g.fillStyle(0xFFFFFF);
                g.fillCircle(cx - 3, cy - 2, 2);
                g.fillCircle(cx + 3, cy - 2, 2);
                g.fillStyle(0x000000);
                g.fillCircle(cx - 3, cy - 2, 1);
                g.fillCircle(cx + 3, cy - 2, 1);
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
                g.fillStyle(0x5A4020);
                g.fillEllipse(cx, cy + 8, 22, 8);
                g.fillStyle(0x8B6914);
                g.fillEllipse(cx, cy + 2, 16, 20);
                g.fillStyle(0xFFFFFF);
                g.fillCircle(cx - 3, cy - 2, 2);
                g.fillCircle(cx + 3, cy - 2, 2);
                g.fillStyle(0x000000);
                g.fillCircle(cx - 3, cy - 2, 1);
                g.fillCircle(cx + 3, cy - 2, 1);
                break;
        }
        return g;
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
        shovel.fillStyle(0x8B8B8B);
        shovel.fillRect(width / 2 - 3, 8, 6, 25);
        shovel.fillStyle(0xAAAAAA);
        shovel.fillEllipse(width / 2, 8, 16, 10);
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
        for (let row = 0; row < GRID.rows; row++) {
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

        // 草坪点击事件 - 用于种植和铲子
        // 注意：这会在没有其他交互对象被点击时触发
        this.input.on('pointerdown', (pointer, currentlyOver) => {
            if (this.isGameOver || this.isPaused) return;

            // 如果点击了阳光或其他交互对象，不处理草坪点击
            if (currentlyOver && currentlyOver.length > 0) return;

            // 只在草坪区域响应（排除UI区域）
            const cell = gridManager.getCellFromPosition(pointer.x, pointer.y);
            if (!cell) return;

            if (this.shovelActive) {
                this.removePlantAt(cell.row, cell.col);
                this.shovelActive = false;
                if (this.shovelButton) {
                    this.shovelButton.bg.clear();
                    this.shovelButton.bg.fillStyle(0x8B4513);
                    this.shovelButton.bg.fillRoundedRect(0, 0, this.shovelButton.width, this.shovelButton.height, 5);
                    this.shovelButton.bg.fillStyle(0xA0522D);
                    this.shovelButton.bg.fillRoundedRect(2, 2, this.shovelButton.width - 4, this.shovelButton.height - 25, 4);
                }
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

    updateCursorPreview(px, py) {
        // 移除旧预览
        if (this.cursorPreview) {
            this.cursorPreview.destroy();
            this.cursorPreview = null;
        }

        if (!this.selectedPlant) return;

        const cell = gridManager.getCellFromPosition(px, py);
        if (!cell) return;
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

        // 如果点击的是已选中的植物，取消选择
        if (this.selectedPlant === plantType) {
            this.clearSelection();
            return;
        }

        // 选中植物（允许选中，种植时再检查阳光）
        this.selectedPlant = plantType;

        // 显示选中高亮
        const card = this.plantCards.find(c => c.type === plantType);
        if (card) {
            card.selectBorder.setVisible(true);
        }
    }

    placePlant(row, col) {
        if (!this.selectedPlant) return;
        if (gridManager.isOccupied(row, col)) return;

        const cfg = PLANT_CONFIG[this.selectedPlant];
        if (this.sunAmount < cfg.cost) return;

        // 扣除阳光
        this.sunAmount -= cfg.cost;
        this.updateSunDisplay();

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
            default: return;
        }

        gridManager.placePlant(row, col, plant);
        this.plants.push(plant);

        // 开始冷却
        this.startCooldown(this.selectedPlant);

        // 清除选中状态
        this.clearSelection();

        // 更新卡片可用状态
        this.updateCardAvailability();
    }

    clearSelection() {
        this.selectedPlant = null;

        // 清除所有卡片选中高亮
        this.plantCards.forEach(card => {
            card.selectBorder.setVisible(false);
            card.container.setScale(1);
        });

        // 清除预览
        if (this.cursorPreview) {
            this.cursorPreview.destroy();
            this.cursorPreview = null;
        }
    }

    updateCardAvailability() {
        this.plantCards.forEach(card => {
            const canAfford = this.sunAmount >= card.cfg.cost;
            const isCooling = card.cooling;
            // 降低不可用卡片的透明度
            card.container.setAlpha((canAfford && !isCooling) ? 1 : 0.5);
        });
    }

    removePlantAt(row, col) {
        const plant = gridManager.getPlant(row, col);
        if (plant) {
            plant.die();
        }
    }

    startCooldown(plantType) {
        const card = this.plantCards.find(c => c.type === plantType);
        if (!card) return;

        card.cooling = true;
        card.cooldownMask.setVisible(true);
        this.updateCardAvailability();

        this.time.delayedCall(card.cfg.cooldown, () => {
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
        if (this.waveIndex >= this.levelData.waves.length) {
            this.allWavesSpawned = true;
            return;
        }

        const wave = this.levelData.waves[this.waveIndex];
        this.waveZombies = [...wave.zombies];
        this.zombieSpawnTimer = wave.delay;
        this.waveIndex++;

        this.waveText.setText(`波次: ${this.waveIndex}/${this.levelData.waves.length}`);
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
            default: zombie = new BasicZombie(this, x, y, row); break;
        }

        this.zombies.push(zombie);
        this.zombiesRemaining++;
    }

    spawnSun() {
        const x = Phaser.Math.Between(GRID.startX, GRID.startX + GRID.cols * GRID.cellWidth);
        const targetY = Phaser.Math.Between(GRID.startY + 50, GRID.startY + GRID.rows * GRID.cellHeight - 50);
        const sun = new Sun(this, x, -20, targetY, true);
        this.suns.push(sun);
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        if (this.isPaused) {
            this.scene.pause();
        } else {
            this.scene.resume();
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
            this.scene.start('MenuScene');
        });
    }

    onLevelComplete() {
        if (this.isGameOver) return;
        this.isGameOver = true;

        // 更新解锁进度
        const current = this.registry.get('unlockedLevel') || 0;
        if (this.levelIndex + 1 > current && this.levelIndex + 1 < LEVELS.length) {
            this.registry.set('unlockedLevel', this.levelIndex + 1);
        }

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

        // 入场动画
        winText.setScale(0);
        this.tweens.add({
            targets: winText,
            scaleX: 1,
            scaleY: 1,
            duration: 500,
            ease: 'Back.easeOut'
        });

        // 下一关按钮（如果不是最后一关）
        if (this.levelIndex + 1 < LEVELS.length) {
            const nextBg = this.add.graphics().setDepth(101);
            nextBg.fillStyle(0x4CAF50);
            nextBg.fillRoundedRect(GAME_WIDTH / 2 - 70, GAME_HEIGHT / 2 + 10, 140, 50, 10);

            const nextText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 35, '下一关', {
                font: 'bold 24px Arial',
                fill: '#FFFFFF'
            }).setOrigin(0.5, 0.5).setDepth(102);

            const nextZone = this.add.zone(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 35, 140, 50)
                .setInteractive({ useHandCursor: true }).setDepth(102);
            nextZone.on('pointerdown', () => {
                this.scene.start('GameScene', { level: this.levelIndex + 1 });
            });
        }

        // 返回菜单
        const menuBg = this.add.graphics().setDepth(101);
        menuBg.fillStyle(0x666666);
        menuBg.fillRoundedRect(GAME_WIDTH / 2 - 60, GAME_HEIGHT / 2 + 75, 120, 45, 10);

        const menuText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 97, '返回菜单', {
            font: 'bold 18px Arial',
            fill: '#FFFFFF'
        }).setOrigin(0.5, 0.5).setDepth(102);

        const menuZone = this.add.zone(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 97, 120, 45)
            .setInteractive({ useHandCursor: true }).setDepth(102);
        menuZone.on('pointerdown', () => {
            this.scene.start('MenuScene');
        });

        this.time.delayedCall(1500, () => {
            this.scene.start('VictoryScene', { level: this.levelIndex });
        });
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
        } else if (this.waveIndex < this.levelData.waves.length) {
            // 当前波次所有僵尸生成完毕，检查是否需要开始下一波
            const aliveZombies = this.zombies.filter(z => z && z.alive);
            if (aliveZombies.length <= 2) {
                this.startNextWave();
            }
        }

        // 天空掉落阳光
        this.sunFallTimer += delta;
        if (this.sunFallTimer >= SUN.fallInterval) {
            this.sunFallTimer = 0;
            this.spawnSun();
        }

        // 更新所有实体
        this.plants.forEach(p => {
            if (p && p.active && p.alive) p.update(time, delta);
        });
        this.zombies.forEach(z => {
            if (z && z.active && z.alive) z.update(time, delta);
        });

        // 碰撞检测
        this.checkProjectileCollisions();
        this.checkLawnmowers();

        // 清理
        this.cleanup();

        // 更新僵尸计数
        this.zombiesRemaining = this.zombies.filter(z => z && z.alive).length;

        // 胜利检查
        if (!this.allWavesSpawned && this.waveIndex >= this.levelData.waves.length && this.waveZombies.length === 0) {
            this.allWavesSpawned = true;
        }
        if (this.allWavesSpawned) {
            this.checkWinCondition();
        }
    }
}
