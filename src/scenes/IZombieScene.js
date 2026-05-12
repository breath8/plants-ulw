// IZombieScene.js - 我是僵尸解谜模式
class IZombieScene extends Phaser.Scene {
    constructor() {
        super('IZombieScene');
    }

    init(data) {
        this.levelIndex = data.level || 0;
        this.levelData = IZOMBIE_LEVELS[this.levelIndex];
        this.rows = this.levelData.rows || 5;
        this.brains = this.levelData.startingBrains;
        this.brainsEaten = 0;
        this.totalBrains = this.levelData.brains.length;
        this.brainStates = this.levelData.brains.map(() => false);
        this.selectedZombie = null;
        this.isGameOver = false;
        this.plants = [];
        this.zombies = [];
        this.projectiles = [];
        this.suns = [];
        this.zombieCards = [];
        this.gridStartY = 95;
    }

    create() {
        this.cameras.main.resetFX();
        gridManager.reset(this.rows);

        this.createBackground();
        this.createUI();
        this.placePlants();
        this.showBrainMarkers();
        this.setupInput();
    }

    createBackground() {
        const g = this.add.graphics();
        const gridHeight = this.rows * GRID.cellHeight;
        const gridEndY = this.gridStartY + gridHeight;
        const lawnEndX = GRID.startX + GRID.cols * GRID.cellWidth;

        g.fillStyle(0x0a0a2e);
        g.fillRect(0, 0, GAME_WIDTH, this.gridStartY);
        g.fillStyle(0x1a1a3e, 0.5);
        g.fillRect(0, 0, GAME_WIDTH, this.gridStartY);

        g.fillStyle(0xCCCCAA, 0.3);
        g.fillCircle(850, 30, 20);
        g.fillStyle(0xEEEDD0, 0.5);
        g.fillCircle(850, 30, 15);

        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < GRID.cols; col++) {
                const x = GRID.startX + col * GRID.cellWidth;
                const y = this.gridStartY + row * GRID.cellHeight;
                const isDark = (row + col) % 2 === 0;
                g.fillStyle(isDark ? 0x2d5a1b : 0x1e4d12);
                g.fillRect(x, y, GRID.cellWidth, GRID.cellHeight);
            }
        }

        g.fillStyle(0x1a1a2e);
        g.fillRect(0, this.gridStartY, GRID.startX, gridHeight);
        g.fillStyle(0x2a1a0e);
        g.fillRect(10, this.gridStartY - 5, 170, 180);

        g.fillStyle(0x0a0a0a);
        g.fillRect(70, 80, 40, 90);

        g.fillStyle(0x4a4a1a);
        g.fillRect(25, 20, 25, 25);
        g.fillRect(135, 20, 25, 25);

        g.fillStyle(0x1a1a2e);
        g.fillRect(lawnEndX, this.gridStartY, GAME_WIDTH - lawnEndX, gridHeight);

        g.fillStyle(0x0a0a1e);
        g.fillRect(0, gridEndY, GAME_WIDTH, 100);

        for (let i = 0; i < 30; i++) {
            const sx = Math.random() * GAME_WIDTH;
            const sy = Math.random() * this.gridStartY;
            g.fillStyle(0xFFFFFF, Math.random() * 0.3 + 0.1);
            g.fillCircle(sx, sy, Math.random() * 1.5 + 0.5);
        }
    }

    createUI() {
        const cardStartX = 175;
        const cardY = 15;
        const cardWidth = 55;
        const cardHeight = 70;
        const cardSpacing = 5;

        this.brainsText = this.add.text(20, 15, `🧠 ${this.brains}`, {
            font: 'bold 22px Arial',
            fill: '#FF69B4',
            stroke: '#000000',
            strokeThickness: 3
        }).setDepth(10);

        this.brainsEatenText = this.add.text(20, 45, `已吃: ${this.brainsEaten}/${this.totalBrains}`, {
            font: '16px Arial',
            fill: '#CCCCCC',
            stroke: '#000000',
            strokeThickness: 2
        }).setDepth(10);

        this.add.text(GAME_WIDTH - 20, 15, this.levelData.name, {
            font: 'bold 16px Arial',
            fill: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(1, 0.5).setDepth(10);

        this.add.text(GAME_WIDTH - 20, 40, this.levelData.description, {
            font: '13px Arial',
            fill: '#AAAAAA',
            stroke: '#000000',
            strokeThickness: 1
        }).setOrigin(1, 0.5).setDepth(10);

        const zombieTypes = this.levelData.availableZombies;
        const costs = this.levelData.costs;
        const zombieNames = {
            basic: '普通', conehead: '路障', buckethead: '铁桶', polevault: '撑杆'
        };

        for (let i = 0; i < zombieTypes.length; i++) {
            const type = zombieTypes[i];
            const cost = costs[type] || 1;
            const x = cardStartX + i * (cardWidth + cardSpacing);
            const card = this.createZombieCard(x, cardY, type, cost, zombieNames[type] || type, cardWidth, cardHeight);
            this.zombieCards.push(card);
        }
    }

    createZombieCard(x, y, type, cost, label, width, height) {
        const container = this.add.container(x, y).setDepth(10);

        const bg = this.add.graphics();
        bg.fillStyle(0x3a1a1a);
        bg.fillRoundedRect(0, 0, width, height, 5);
        bg.fillStyle(0x5a2a1a);
        bg.fillRoundedRect(2, 2, width - 4, height - 25, 4);
        container.add(bg);

        const selectBorder = this.add.graphics();
        selectBorder.fillStyle(0xFFD700, 0.4);
        selectBorder.fillRoundedRect(-2, -2, width + 4, height + 4, 6);
        selectBorder.setVisible(false);
        container.add(selectBorder);

        const preview = this.add.graphics();
        preview.fillStyle(0x7B8B6F);
        preview.fillCircle(width / 2, 18, 10);
        preview.fillStyle(0x8B6914);
        preview.fillRoundedRect(width / 2 - 8, 26, 16, 18, 3);
        preview.fillStyle(0x4A4A2A);
        preview.fillRoundedRect(width / 2 - 6, 42, 12, 16, 2);

        if (type === 'conehead') {
            preview.fillStyle(0xE8751A);
            preview.fillTriangle(width / 2, 0, width / 2 - 9, 18, width / 2 + 9, 18);
        } else if (type === 'buckethead') {
            preview.fillStyle(0x8A8A8A);
            preview.fillRoundedRect(width / 2 - 10, 0, 20, 20, 2);
        } else if (type === 'polevault') {
            preview.fillStyle(0xCC0000);
            preview.fillRoundedRect(width / 2 - 10, 10, 20, 3, 1);
            preview.fillStyle(0x8B6914);
            preview.fillRect(width / 2 + 12, 4, 3, 30);
        }
        container.add(preview);

        const costText = this.add.text(width / 2, height - 10, `🧠${cost}`, {
            font: 'bold 14px Arial',
            fill: '#FF69B4',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5, 0.5);
        container.add(costText);

        const cooldownMask = this.add.graphics();
        cooldownMask.fillStyle(0x000000, 0.5);
        cooldownMask.fillRoundedRect(0, 0, width, height, 5);
        cooldownMask.setVisible(false);
        container.add(cooldownMask);

        const zone = this.add.zone(x + width / 2, y + height / 2, width, height)
            .setInteractive({ useHandCursor: true }).setDepth(20);
        zone.on('pointerdown', () => {
            this.onZombieCardClick(type, container, selectBorder, cost);
        });
        zone.on('pointerover', () => {
            if (this.brains >= cost) {
                container.setScale(1.05);
            }
        });
        zone.on('pointerout', () => {
            container.setScale(1);
        });

        return { type, container, selectBorder, cost, zone, width, height };
    }

    onZombieCardClick(type, container, selectBorder, cost) {
        if (this.isGameOver) return;
        if (this.brains < cost) return;

        this.zombieCards.forEach(c => {
            c.selectBorder.setVisible(false);
            c.container.setScale(1);
        });

        if (this.selectedZombie === type) {
            this.selectedZombie = null;
            return;
        }

        this.selectedZombie = type;
        selectBorder.setVisible(true);
    }

    showBrainMarkers() {
        this.brainMarkers = [];
        this.levelData.brains.forEach((brain, index) => {
            const px = GRID.startX + brain.col * GRID.cellWidth + GRID.cellWidth / 2;
            const py = this.gridStartY + brain.row * GRID.cellHeight + GRID.cellHeight / 2;

            const g = this.add.graphics().setDepth(5);
            g.fillStyle(0xFF69B4);
            g.fillEllipse(0, 0, 30, 24);
            g.fillStyle(0xFF8EC8, 0.6);
            g.fillEllipse(-3, -3, 20, 16);
            g.fillStyle(0xFFB6E6, 0.4);
            g.fillEllipse(-2, -4, 12, 10);
            g.lineStyle(2, 0xCC4488, 0.8);
            g.strokeEllipse(0, 0, 30, 24);
            g.setPosition(px, py);

            this.brainMarkers.push({ g, row: brain.row, col: brain.col, px, py, eaten: false });
        });
    }

    placePlants() {
        this.levelData.plants.forEach(pd => {
            const pos = gridManager.getCellPosition(pd.row, pd.col);
            const y = pos.y - (this.gridStartY - GRID.startY);
            let plant;
            switch (pd.type) {
                case 'peashooter': plant = new Peashooter(this, pos.x, y, pd.row, pd.col); break;
                case 'sunflower': plant = new Sunflower(this, pos.x, y, pd.row, pd.col); break;
                case 'wallnut': plant = new Wallnut(this, pos.x, y, pd.row, pd.col); break;
                case 'repeater': plant = new Repeater(this, pos.x, y, pd.row, pd.col); break;
                case 'snowpea': plant = new Snowpea(this, pos.x, y, pd.row, pd.col); break;
                default: plant = new Peashooter(this, pos.x, y, pd.row, pd.col); break;
            }
            gridManager.placePlant(pd.row, pd.col, plant);
            this.plants.push(plant);
        });
    }

    setupInput() {
        this.input.on('pointerdown', (pointer, currentlyOver) => {
            if (this.isGameOver) return;
            if (currentlyOver && currentlyOver.length > 0) return;
            if (!this.selectedZombie) return;

            const spawnAreaX = GRID.startX + GRID.cols * GRID.cellWidth;
            if (pointer.x < spawnAreaX) return;

            const row = Math.floor((pointer.y - this.gridStartY) / GRID.cellHeight);
            if (row < 0 || row >= this.rows) return;

            this.spawnZombie(row, this.selectedZombie);
        });

        this.input.on('pointermove', (pointer) => {
            this.updateCursorPreview(pointer.x, pointer.y);
        });
    }

    updateCursorPreview(px, py) {
        if (this.cursorPreview) {
            this.cursorPreview.destroy();
            this.cursorPreview = null;
        }
        if (!this.selectedZombie) return;

        const spawnAreaX = GRID.startX + GRID.cols * GRID.cellWidth;
        if (px < spawnAreaX) return;

        const row = Math.floor((py - this.gridStartY) / GRID.cellHeight);
        if (row < 0 || row >= this.rows) return;

        this.cursorPreview = this.add.graphics();
        const previewY = this.gridStartY + row * GRID.cellHeight + GRID.cellHeight / 2;
        this.cursorPreview.fillStyle(0x8B0000, 0.3);
        this.cursorPreview.fillCircle(spawnAreaX + 30, previewY, 25);
        this.cursorPreview.setDepth(5);
    }

    spawnZombie(row, type) {
        const cost = this.levelData.costs[type] || 1;
        if (this.brains < cost) return;

        this.brains -= cost;
        this.updateBrainsDisplay();

        const spawnX = GAME_WIDTH + 20;
        const spawnY = this.gridStartY + row * GRID.cellHeight + GRID.cellHeight / 2;

        let zombie;
        switch (type) {
            case 'basic': zombie = new BasicZombie(this, spawnX, spawnY, row); break;
            case 'conehead': zombie = new ConeheadZombie(this, spawnX, spawnY, row); break;
            case 'buckethead': zombie = new BucketheadZombie(this, spawnX, spawnY, row); break;
            case 'polevault': zombie = new PoleVaultZombie(this, spawnX, spawnY, row); break;
            default: zombie = new BasicZombie(this, spawnX, spawnY, row); break;
        }

        this.zombies.push(zombie);
        this.clearSelection();
    }

    clearSelection() {
        this.selectedZombie = null;
        this.zombieCards.forEach(c => {
            c.selectBorder.setVisible(false);
            c.container.setScale(1);
        });
        if (this.cursorPreview) {
            this.cursorPreview.destroy();
            this.cursorPreview = null;
        }
    }

    updateBrainsDisplay() {
        this.brainsText.setText(`🧠 ${this.brains}`);
        this.zombieCards.forEach(c => {
            c.container.setAlpha(this.brains >= c.cost ? 1 : 0.5);
        });
    }

    update(time, delta) {
        if (this.isGameOver) return;

        this.plants.forEach(p => {
            if (p && p.active && p.alive) p.update(time, delta);
        });
        this.zombies.forEach(z => {
            if (z && z.active && z.alive) z.update(time, delta);
        });

        this.checkProjectileCollisions();
        this.checkBrainsEaten();
        this.cleanup();
        this.checkGameOver();
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

    checkBrainsEaten() {
        for (let i = 0; i < this.brainMarkers.length; i++) {
            const marker = this.brainMarkers[i];
            if (marker.eaten) continue;

            for (let j = 0; j < this.zombies.length; j++) {
                const zombie = this.zombies[j];
                if (!zombie || !zombie.active || !zombie.alive) continue;
                if (zombie.row !== marker.row) continue;

                if (zombie.x <= marker.px) {
                    marker.eaten = true;
                    this.brainsEaten++;
                    this.brainsEatenText.setText(`已吃: ${this.brainsEaten}/${this.totalBrains}`);
                    this.tweens.add({
                        targets: marker.g,
                        alpha: 0,
                        scaleX: 0,
                        scaleY: 0,
                        duration: 300,
                        ease: 'Back.easeIn'
                    });
                    break;
                }
            }
        }

        if (this.brainsEaten >= this.totalBrains) {
            this.onWin();
        }
    }

    onZombieReachHouse(row) {
        for (const z of this.zombies) {
            if (z && z.active && z.alive && z.row === row && z.x < GRID.startX - 20) {
                z.alive = false;
                z.eating = false;
                if (z.body) z.body.setVelocity(0, 0);
                if (z.walkTween) z.walkTween.stop();
                if (z.eatTween) z.eatTween.stop();
                z.destroy();
                break;
            }
        }
    }

    checkGameOver() {
        const aliveZombies = this.zombies.filter(z => z && z.active && z.alive);
        const allBrainsEaten = this.brainsEaten >= this.totalBrains;
        if (allBrainsEaten) return;

        const canAffordAny = this.levelData.availableZombies.some(
            type => this.brains >= (this.levelData.costs[type] || 1)
        );

        if (!canAffordAny && aliveZombies.length === 0) {
            this.onLose();
        }
    }

    cleanup() {
        this.plants = this.plants.filter(p => p && p.active && p.alive);
        this.zombies = this.zombies.filter(z => z && z.active && z.alive);
        this.projectiles = this.projectiles.filter(p => p && p.active && p.alive);
    }

    onWin() {
        if (this.isGameOver) return;
        this.isGameOver = true;
        this.showOverlay('胜利！', '所有脑子已被吃掉！', 0x4CAF50, '#4CAF50');
    }

    onLose() {
        if (this.isGameOver) return;
        this.isGameOver = true;
        this.showOverlay('失败', '脑子不够了！', 0xCC3333, '#CC3333');
    }

    showOverlay(title, subtitle, btnColor, btnColorStr) {
        const overlay = this.add.graphics().setDepth(100);
        overlay.fillStyle(0x000000, 0.6);
        overlay.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

        const titleText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 60, title, {
            font: 'bold 42px Arial',
            fill: '#FFD700',
            stroke: '#000000',
            strokeThickness: 5
        }).setOrigin(0.5, 0.5).setDepth(101);

        titleText.setScale(0);
        this.tweens.add({
            targets: titleText,
            scaleX: 1,
            scaleY: 1,
            duration: 500,
            ease: 'Back.easeOut'
        });

        this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 15, subtitle, {
            font: '20px Arial',
            fill: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5, 0.5).setDepth(101);

        const retryBg = this.add.graphics().setDepth(101);
        retryBg.fillStyle(btnColor);
        retryBg.fillRoundedRect(GAME_WIDTH / 2 - 70, GAME_HEIGHT / 2 + 30, 140, 45, 10);

        this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 52, '重试', {
            font: 'bold 20px Arial',
            fill: '#FFFFFF'
        }).setOrigin(0.5, 0.5).setDepth(102);

        this.add.zone(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 52, 140, 45)
            .setInteractive({ useHandCursor: true }).setDepth(102)
            .on('pointerdown', () => {
                this.scene.restart({ level: this.levelIndex });
            });

        const menuBg = this.add.graphics().setDepth(101);
        menuBg.fillStyle(0x666666);
        menuBg.fillRoundedRect(GAME_WIDTH / 2 - 60, GAME_HEIGHT / 2 + 85, 120, 45, 10);

        this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 107, '返回', {
            font: 'bold 18px Arial',
            fill: '#FFFFFF'
        }).setOrigin(0.5, 0.5).setDepth(102);

        this.add.zone(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 107, 120, 45)
            .setInteractive({ useHandCursor: true }).setDepth(102)
            .on('pointerdown', () => {
                this.scene.start('ExtraModeSelectScene');
            });

        if (this.brainsEaten >= this.totalBrains) {
            try {
                saveManager.completeIZombie(this.levelIndex);
            } catch (e) {}
        }
    }
}
