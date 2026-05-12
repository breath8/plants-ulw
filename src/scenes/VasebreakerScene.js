class VasebreakerScene extends Phaser.Scene {
    constructor() {
        super('VasebreakerScene');
    }

    init(data) {
        this.levelIndex = data.level || 0;
        this.levelData = VASEBREAKER_LEVELS[this.levelIndex];
        this.vases = [];
        this.plants = [];
        this.zombies = [];
        this.projectiles = [];
        this.isGameOver = false;
        this.brokenCount = 0;
        this.totalVases = this.levelData.vases.length;
        this.allBroken = false;
    }

    getCellPosition(row, col) {
        return {
            x: this.vaseStartX + col * GRID.cellWidth + GRID.cellWidth / 2,
            y: this.vaseStartY + row * GRID.cellHeight + GRID.cellHeight / 2
        };
    }

    create() {
        this.cameras.main.resetFX();
        this.cameras.main.setAlpha(1);

        this.vaseCols = 7;
        this.vaseStartX = GRID.startX + (GRID.cols - this.vaseCols) * GRID.cellWidth / 2;
        this.vaseStartY = GRID.startY;

        gridManager.reset(GRID.rows);

        this.createBackground();
        this.createGrid();
        this.createVases();
    }

    createBackground() {
        const g = this.add.graphics();
        const gridHeight = GRID.rows * GRID.cellHeight;
        const gridEndY = GRID.startY + gridHeight;

        g.fillStyle(0x87CEEB);
        g.fillRect(0, 0, GAME_WIDTH, GRID.startY);
        g.fillStyle(0x4A90D9, 0.3);
        g.fillRect(0, 0, GAME_WIDTH, GRID.startY);

        const lawnEndX = GRID.startX + GRID.cols * GRID.cellWidth;

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

        g.fillStyle(0x7B7B7B);
        g.fillRect(lawnEndX, GRID.startY, GAME_WIDTH - lawnEndX, gridHeight);
        g.fillStyle(0x8B7355);
        g.fillRect(0, gridEndY, GAME_WIDTH, 100);
    }

    createGrid() {
        for (let row = 0; row < GRID.rows; row++) {
            for (let col = 0; col < this.vaseCols; col++) {
                const x = this.vaseStartX + col * GRID.cellWidth;
                const y = this.vaseStartY + row * GRID.cellHeight;
                const isDark = (row + col) % 2 === 0;
                const g = this.add.graphics();
                g.fillStyle(isDark ? 0x5AA035 : 0x4A8C2A);
                g.fillRect(x, y, GRID.cellWidth, GRID.cellHeight);
            }
        }
    }

    createVases() {
        for (const vaseData of this.levelData.vases) {
            const pos = this.getCellPosition(vaseData.row, vaseData.col);
            const g = this.add.graphics();
            this.drawVase(g, pos.x, pos.y);

            const zone = this.add.zone(pos.x, pos.y, GRID.cellWidth - 10, GRID.cellHeight - 10)
                .setInteractive({ useHandCursor: true });

            const vase = {
                row: vaseData.row,
                col: vaseData.col,
                graphics: g,
                zone: zone,
                type: vaseData.type,
                content: vaseData.content,
                broken: false,
                x: pos.x,
                y: pos.y
            };

            zone.on('pointerdown', () => this.breakVase(vase));
            zone.on('pointerover', () => {
                if (!vase.broken) g.setAlpha(0.8);
            });
            zone.on('pointerout', () => {
                g.setAlpha(1);
            });

            this.vases.push(vase);
        }
    }

    drawVase(g, x, y) {
        g.fillStyle(0x6B3410);
        g.fillRoundedRect(x - 26, y - 32, 52, 64, 10);
        g.fillStyle(0x8B4513);
        g.fillRoundedRect(x - 24, y - 30, 48, 60, 8);
        g.fillStyle(0x6B3410);
        g.fillRoundedRect(x - 28, y - 36, 56, 12, 5);
        g.fillStyle(0x8B6914, 0.4);
        g.fillRoundedRect(x - 16, y - 22, 10, 28, 4);
        g.lineStyle(1, 0x5A2A0E, 0.3);
        g.strokeRoundedRect(x - 24, y - 30, 48, 60, 8);
    }

    breakVase(vase) {
        if (vase.broken || this.isGameOver) return;
        vase.broken = true;
        this.brokenCount++;

        vase.zone.removeInteractive();

        const crackGfx = this.add.graphics();
        crackGfx.setPosition(vase.x, vase.y);
        crackGfx.lineStyle(2, 0x333333, 0.8);
        crackGfx.beginPath();
        crackGfx.moveTo(-8, -12);
        crackGfx.lineTo(-3, -4);
        crackGfx.lineTo(-10, 6);
        crackGfx.lineTo(-2, 14);
        crackGfx.strokePath();
        crackGfx.beginPath();
        crackGfx.moveTo(4, -8);
        crackGfx.lineTo(10, 0);
        crackGfx.lineTo(6, 10);
        crackGfx.strokePath();

        this.time.delayedCall(150, () => {
            crackGfx.destroy();
            this.tweens.add({
                targets: vase.graphics,
                alpha: 0,
                scaleX: 0.7,
                scaleY: 0.7,
                duration: 150,
                onComplete: () => {
                    vase.graphics.destroy();
                    vase.zone.destroy();
                    this.spawnContent(vase);
                }
            });
        });
    }

    spawnContent(vase) {
        if (vase.type === 'plant') {
            this.createPlant(vase.row, vase.col, vase.content);
        } else if (vase.type === 'zombie') {
            this.spawnZombie(vase.row, vase.col, vase.content);
        }

        if (this.brokenCount >= this.totalVases) {
            this.allBroken = true;
            this.checkWinCondition();
        }
    }

    createPlant(row, col, type) {
        const pos = this.getCellPosition(row, col);
        let plant;
        switch(type) {
            case 'peashooter': plant = new Peashooter(this, pos.x, pos.y, row, col); break;
            case 'sunflower': plant = new Sunflower(this, pos.x, pos.y, row, col); break;
            case 'wallnut': plant = new Wallnut(this, pos.x, pos.y, row, col); break;
            case 'snowpea': plant = new Snowpea(this, pos.x, pos.y, row, col); break;
            case 'repeater': plant = new Repeater(this, pos.x, pos.y, row, col); break;
        }
        if (plant) {
            this.plants.push(plant);
            gridManager.placePlant(row, col, plant);
        }
    }

    spawnZombie(row, col, type) {
        const pos = this.getCellPosition(row, col);
        let zombie;
        switch(type) {
            case 'basic': zombie = new BasicZombie(this, pos.x, pos.y, row); break;
            case 'conehead': zombie = new ConeheadZombie(this, pos.x, pos.y, row); break;
            case 'buckethead': zombie = new BucketheadZombie(this, pos.x, pos.y, row); break;
            case 'polevault': zombie = new PoleVaultZombie(this, pos.x, pos.y, row); break;
        }
        if (zombie) {
            zombie.checkForPlant = () => {
                for (const p of this.plants) {
                    if (p && p.alive && p.row === zombie.row) {
                        const dist = zombie.x - p.x;
                        if (dist > 0 && dist < 30) {
                            zombie.startEating(p);
                            break;
                        }
                    }
                }
            };
            this.zombies.push(zombie);
        }
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
        this.checkLoseCondition();
        this.checkWinCondition();
        this.cleanup();
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

    checkLoseCondition() {
        for (const zombie of this.zombies) {
            if (zombie && zombie.alive && zombie.x < GRID.startX - 50) {
                this.gameOver();
                return;
            }
        }
    }

    checkWinCondition() {
        if (!this.allBroken || this.isGameOver) return;
        const alive = this.zombies.filter(z => z && z.alive);
        if (alive.length === 0) {
            this.showVictory();
        }
    }

    cleanup() {
        this.plants = this.plants.filter(p => p && p.active && p.alive);
        this.zombies = this.zombies.filter(z => z && z.active && z.alive);
        this.projectiles = this.projectiles.filter(p => p && p.active && p.alive);
    }

    onZombieKilled() {
        if (this.allBroken && !this.isGameOver) {
            this.checkWinCondition();
        }
    }

    onZombieReachHouse(row) {
        if (!this.isGameOver) {
            this.gameOver();
        }
    }

    gameOver() {
        if (this.isGameOver) return;
        this.isGameOver = true;
        this.showGameOver();
    }

    showVictory() {
        if (this.isGameOver) return;
        this.isGameOver = true;

        const overlay = this.add.graphics().setDepth(100);
        overlay.fillStyle(0x000000, 0.5);
        overlay.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

        const winText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 40, '胜利', {
            font: 'bold 48px Arial',
            fill: '#FFD700',
            stroke: '#000000',
            strokeThickness: 5
        }).setOrigin(0.5, 0.5).setDepth(101);

        winText.setScale(0);
        this.tweens.add({
            targets: winText,
            scaleX: 1, scaleY: 1,
            duration: 500,
            ease: 'Back.easeOut'
        });

        const backBg = this.add.graphics().setDepth(101);
        backBg.fillStyle(0x666666);
        backBg.fillRoundedRect(GAME_WIDTH / 2 - 55, GAME_HEIGHT / 2 + 30, 110, 42, 10);

        const backText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 51, '返回', {
            font: 'bold 20px Arial',
            fill: '#FFFFFF'
        }).setOrigin(0.5, 0.5).setDepth(102);

        const backZone = this.add.zone(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 51, 110, 42)
            .setInteractive({ useHandCursor: true }).setDepth(102);
        backZone.on('pointerdown', () => this.scene.start('ExtraModeSelectScene'));
        backZone.on('pointerover', () => {
            backBg.clear();
            backBg.fillStyle(0x888888);
            backBg.fillRoundedRect(GAME_WIDTH / 2 - 55, GAME_HEIGHT / 2 + 30, 110, 42, 10);
        });
        backZone.on('pointerout', () => {
            backBg.clear();
            backBg.fillStyle(0x666666);
            backBg.fillRoundedRect(GAME_WIDTH / 2 - 55, GAME_HEIGHT / 2 + 30, 110, 42, 10);
        });
    }

    showGameOver() {
        const overlay = this.add.graphics().setDepth(100);
        overlay.fillStyle(0x000000, 0.6);
        overlay.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

        this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 40, '失败', {
            font: 'bold 48px Arial',
            fill: '#FF0000',
            stroke: '#000000',
            strokeThickness: 5
        }).setOrigin(0.5, 0.5).setDepth(101);

        const retryBg = this.add.graphics().setDepth(101);
        retryBg.fillStyle(0x4CAF50);
        retryBg.fillRoundedRect(GAME_WIDTH / 2 - 55, GAME_HEIGHT / 2 + 10, 110, 42, 10);

        const retryText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 31, '重试', {
            font: 'bold 20px Arial',
            fill: '#FFFFFF'
        }).setOrigin(0.5, 0.5).setDepth(102);

        const retryZone = this.add.zone(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 31, 110, 42)
            .setInteractive({ useHandCursor: true }).setDepth(102);
        retryZone.on('pointerdown', () => {
            this.scene.restart({ level: this.levelIndex });
        });

        const backBg = this.add.graphics().setDepth(101);
        backBg.fillStyle(0x666666);
        backBg.fillRoundedRect(GAME_WIDTH / 2 - 55, GAME_HEIGHT / 2 + 65, 110, 42, 10);

        const backText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 86, '返回', {
            font: 'bold 20px Arial',
            fill: '#FFFFFF'
        }).setOrigin(0.5, 0.5).setDepth(102);

        const backZone = this.add.zone(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 86, 110, 42)
            .setInteractive({ useHandCursor: true }).setDepth(102);
        backZone.on('pointerdown', () => this.scene.start('ExtraModeSelectScene'));
    }
}
