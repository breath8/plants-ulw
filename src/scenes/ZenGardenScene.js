class ZenGardenScene extends Phaser.Scene {
    constructor() {
        super('ZenGardenScene');
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        this.cameras.main.resetFX();

        this.coins = 0;
        this.selectedPlant = null;
        this.wateringMode = false;
        this.plots = [];
        this.plants = [];

        this.drawBackground(width, height);
        this.drawTopBar(width);
        this.createPlots(width, height);
        this.drawBottomPanel(width, height);
    }

    drawBackground(width, height) {
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x87CEEB, 0x87CEEB, 0xE0F0FF, 0xE0F0FF);
        bg.fillRect(0, 0, width, height * 0.5);
        bg.fillStyle(0x5DAA3A);
        bg.fillRect(0, height * 0.5, width, height * 0.5);
        bg.fillStyle(0x4A8C2A);
        bg.fillRect(0, height * 0.5, width, 15);
        for (let i = 0; i < 40; i++) {
            bg.fillStyle(0x6BBF4A, 0.3);
            bg.fillEllipse(Math.random() * width, height * 0.5 + 20 + Math.random() * (height * 0.5 - 40), 6, 12);
        }

        this.drawCloud(bg, 100, 60, 1);
        this.drawCloud(bg, 350, 40, 0.8);
        this.drawCloud(bg, 700, 70, 1.2);
        this.drawCloud(bg, 900, 35, 0.7);

        this.drawDecoFlower(bg, 50, height - 60);
        this.drawDecoFlower(bg, 150, height - 80);
        this.drawDecoFlower(bg, width - 60, height - 70);
        this.drawDecoFlower(bg, width - 140, height - 55);
        this.drawDecoFlower(bg, 30, height - 50);
        this.drawDecoFlower(bg, width - 100, height - 85);
    }

    drawCloud(g, x, y, s) {
        g.fillStyle(0xFFFFFF, 0.8);
        g.fillEllipse(x, y, 60 * s, 25 * s);
        g.fillEllipse(x - 20 * s, y + 5 * s, 40 * s, 20 * s);
        g.fillEllipse(x + 20 * s, y + 5 * s, 40 * s, 20 * s);
    }

    drawDecoFlower(g, x, y) {
        const colors = [0xFF69B4, 0xFF6347, 0xFFD700, 0xDA70D6, 0xFF1493];
        const c = colors[Math.floor(Math.random() * colors.length)];
        g.fillStyle(0x228B22);
        g.fillRect(x - 1, y - 30, 3, 30);
        g.fillStyle(c);
        g.fillCircle(x, y - 38, 6);
        g.fillCircle(x - 6, y - 32, 5);
        g.fillCircle(x + 6, y - 32, 5);
        g.fillCircle(x - 4, y - 42, 5);
        g.fillCircle(x + 4, y - 42, 5);
        g.fillStyle(0xFFEB3B);
        g.fillCircle(x, y - 38, 3);
    }

    drawTopBar(width) {
        const bar = this.add.graphics();
        bar.fillStyle(0x000000, 0.3);
        bar.fillRect(0, 0, width, 50);

        this.add.text(width / 2, 25, '禅境花园', {
            font: 'bold 24px Arial',
            fill: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5, 0.5);

        this.add.text(50, 25, '$', {
            font: 'bold 22px Arial',
            fill: '#FFD700',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5, 0.5);

        this.coinText = this.add.text(75, 25, '0', {
            font: 'bold 20px Arial',
            fill: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0, 0.5);

        const bx = width - 60;
        const by = 25;
        const bb = this.add.graphics();
        bb.fillStyle(0x8B4513);
        bb.fillRoundedRect(bx - 40, by - 18, 80, 36, 8);
        this.add.text(bx, by, '返回', {
            font: 'bold 18px Arial',
            fill: '#FFFFFF'
        }).setOrigin(0.5, 0.5);

        const bz = this.add.zone(bx, by, 80, 36).setInteractive({ useHandCursor: true });
        bz.on('pointerdown', () => this.scene.start('ExtraModeSelectScene'));
        bz.on('pointerover', () => { bb.clear(); bb.fillStyle(0xA0522D); bb.fillRoundedRect(bx - 40, by - 18, 80, 36, 8); });
        bz.on('pointerout', () => { bb.clear(); bb.fillStyle(0x8B4513); bb.fillRoundedRect(bx - 40, by - 18, 80, 36, 8); });
    }

    createPlots(width, height) {
        const cols = 6;
        const rows = 3;
        const potW = 80;
        const potH = 70;
        const gap = 20;
        const totalW = cols * potW + (cols - 1) * gap;
        const totalH = rows * potH + (rows - 1) * gap;
        const startX = (width - totalW) / 2 + potW / 2;
        const startY = 60 + (height * 0.5 - 60 - totalH) / 2 + potH / 2;

        this.plotStartX = startX;
        this.plotStartY = startY;
        this.potW = potW;
        this.potH = potH;
        this.plotGap = gap;
        this.plotCols = cols;
        this.plotRows = rows;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const px = startX + c * (potW + gap);
                const py = startY + r * (potH + gap);
                this.plots.push(this.createPot(px, py, potW, potH, r, c));
            }
        }
    }

    createPot(x, y, w, h, row, col) {
        const gfx = this.add.graphics();
        gfx.fillStyle(0x8B4513);
        gfx.fillRoundedRect(x - w / 2, y - h / 2, w, h, 8);
        gfx.fillStyle(0xA0522D);
        gfx.fillRoundedRect(x - w / 2, y - h / 2 - 5, w, 15, { tl: 6, tr: 6, bl: 0, br: 0 });
        gfx.fillStyle(0x6B3410);
        gfx.fillRoundedRect(x - w / 2 + 3, y - h / 2 + 3, w - 6, h - 6, 6);
        gfx.fillStyle(0x3E2723);
        gfx.fillRoundedRect(x - w / 2 + 5, y - h / 2 + 5, w - 10, h - 10, 4);

        const hint = this.add.text(x, y, '点击种植', {
            font: '12px Arial',
            fill: '#8D6E63'
        }).setOrigin(0.5, 0.5);

        const zone = this.add.zone(x, y, w, h).setInteractive({ useHandCursor: true });
        zone.on('pointerdown', () => this.onPlotClick(row, col));

        const pb = this.add.graphics();
        const pf = this.add.graphics();

        return { gfx, hint, zone, row, col, x, y, w, h, plant: null, pb, pf, plantGfx: null, coinText: null, waterDrop: null };
    }

    drawBottomPanel(width, height) {
        const panelY = height - 150;
        const panel = this.add.graphics();
        panel.fillStyle(0x5D4037, 0.9);
        panel.fillRect(0, panelY, width, 150);
        panel.fillStyle(0x4E342E, 1);
        panel.fillRect(0, panelY, width, 4);

        const plants = ['sunflower', 'marigold', 'peashooter'];
        const cardW = 100;
        const cardH = 110;
        const gap = 20;
        const totalW = plants.length * cardW + (plants.length - 1) * gap;
        const startX = (width - totalW) / 2 + cardW / 2;

        this.cardBgs = [];
        plants.forEach((name, i) => {
            const cx = startX + i * (cardW + gap);
            const cy = panelY + 75;
            this.createPlantCard(cx, cy, cardW, cardH, name);
        });

        this.createWateringCan(width - 80, panelY + 75);
    }

    createPlantCard(x, y, w, h, plantName) {
        const bg = this.add.graphics();
        bg.fillStyle(0xFFFFFF, 0.15);
        bg.fillRoundedRect(x - w / 2, y - h / 2, w, h, 8);
        this.cardBgs.push({ bg, x, y, w, h, plantName });

        const ig = this.add.graphics();
        this.drawPlantIcon(ig, x, y - 15, plantName);

        this.add.text(x, y + 35, this.getPlantDisplayName(plantName), {
            font: '13px Arial',
            fill: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 1
        }).setOrigin(0.5, 0.5);

        const zone = this.add.zone(x, y, w, h).setInteractive({ useHandCursor: true });
        zone.on('pointerdown', () => {
            this.selectedPlant = plantName;
            this.wateringMode = false;
            this.resetWateringCan();
            this.clearCardHighlights();
            bg.clear();
            bg.fillStyle(0xFFFFFF, 0.35);
            bg.fillRoundedRect(x - w / 2, y - h / 2, w, h, 8);
            bg.lineStyle(2, 0xFFD700);
            bg.strokeRoundedRect(x - w / 2, y - h / 2, w, h, 8);
        });
    }

    drawPlantIcon(g, x, y, name) {
        if (name === 'sunflower') {
            g.fillStyle(0xFFD700);
            for (let a = 0; a < 8; a++) {
                const angle = (a / 8) * Math.PI * 2;
                g.fillCircle(x + Math.cos(angle) * 8, y + Math.sin(angle) * 8, 4);
            }
            g.fillStyle(0x8B4513);
            g.fillCircle(x, y, 6);
        } else if (name === 'marigold') {
            g.fillStyle(0xFF8C00);
            for (let a = 0; a < 6; a++) {
                const angle = (a / 6) * Math.PI * 2;
                g.fillCircle(x + Math.cos(angle) * 7, y + Math.sin(angle) * 7, 4);
            }
            g.fillStyle(0x8B4513);
            g.fillCircle(x, y, 5);
        } else if (name === 'peashooter') {
            g.fillStyle(0x4CAF50);
            g.fillRect(x - 4, y - 10, 8, 20);
            g.fillCircle(x, y - 14, 7);
            g.fillStyle(0x388E3C);
            g.fillCircle(x, y - 14, 4);
        }
    }

    getPlantDisplayName(name) {
        const map = { sunflower: '向日葵', marigold: '万寿菊', peashooter: '豌豆射手' };
        return map[name] || name;
    }

    createWateringCan(x, y) {
        this.waterCanX = x;
        this.waterCanY = y;
        this.waterCanBg = this.add.graphics();
        this.waterCanBg.fillStyle(0xFFFFFF, 0.15);
        this.waterCanBg.fillCircle(x, y, 25);

        const can = this.add.graphics();
        can.fillStyle(0x42A5F5);
        can.fillRoundedRect(x - 12, y - 8, 24, 16, 3);
        can.fillStyle(0x1E88E5);
        can.fillRect(x - 12, y + 4, 18, 4);
        can.fillRect(x + 10, y - 14, 4, 10);

        this.add.text(x, y + 30, '浇水', {
            font: '12px Arial',
            fill: '#FFFFFF'
        }).setOrigin(0.5, 0.5);

        const zone = this.add.zone(x, y, 50, 50).setInteractive({ useHandCursor: true });
        zone.on('pointerdown', () => {
            this.wateringMode = !this.wateringMode;
            this.selectedPlant = null;
            this.clearCardHighlights();
            this.waterCanBg.clear();
            if (this.wateringMode) {
                this.waterCanBg.fillStyle(0x42A5F5, 0.4);
                this.waterCanBg.fillCircle(x, y, 25);
                this.waterCanBg.lineStyle(2, 0x42A5F5);
                this.waterCanBg.strokeCircle(x, y, 25);
            } else {
                this.waterCanBg.fillStyle(0xFFFFFF, 0.15);
                this.waterCanBg.fillCircle(x, y, 25);
            }
        });
    }

    resetWateringCan() {
        if (this.waterCanBg) {
            this.wateringMode = false;
            this.waterCanBg.clear();
            this.waterCanBg.fillStyle(0xFFFFFF, 0.15);
            this.waterCanBg.fillCircle(this.waterCanX, this.waterCanY, 25);
        }
    }

    clearCardHighlights() {
        this.cardBgs.forEach(({ bg, x, y, w, h }) => {
            bg.clear();
            bg.fillStyle(0xFFFFFF, 0.15);
            bg.fillRoundedRect(x - w / 2, y - h / 2, w, h, 8);
        });
    }

    onPlotClick(row, col) {
        const plot = this.plots.find(p => p.row === row && p.col === col);
        if (!plot) return;

        if (this.wateringMode) {
            this.waterPlant(plot);
            return;
        }

        if (plot.plant) {
            if (plot.plant.coinReady) {
                this.collectCoin(plot);
            }
            return;
        }

        if (this.selectedPlant) {
            this.plantInPlot(plot, this.selectedPlant);
            this.selectedPlant = null;
            this.clearCardHighlights();
        }
    }

    plantInPlot(plot, plantType) {
        if (this.plants.length >= ZEN_GARDEN_CONFIG.maxSlots) return;

        plot.hint.setVisible(false);

        const plant = {
            type: plantType,
            stage: 'seed',
            stageStartTime: this.time.now,
            watered: false,
            waterEndTime: 0,
            coinReady: false,
            lastCoinTime: this.time.now
        };
        plot.plant = plant;
        this.plants.push(plant);
        this.drawPlantInPlot(plot);
    }

    waterPlant(plot) {
        if (!plot.plant) return;
        plot.plant.watered = true;
        plot.plant.waterEndTime = this.time.now + ZEN_GARDEN_CONFIG.waterDuration;
        this.wateringMode = false;
        this.resetWateringCan();
        this.drawPlantInPlot(plot);
    }

    drawPlantInPlot(plot) {
        if (plot.plantGfx) { plot.plantGfx.destroy(); plot.plantGfx = null; }
        if (plot.waterDrop) { plot.waterDrop.destroy(); plot.waterDrop = null; }
        if (plot.coinText) { plot.coinText.destroy(); plot.coinText = null; }

        const p = plot.plant;
        if (!p) return;

        const g = this.add.graphics();
        plot.plantGfx = g;

        const drawFn = {
            sunflower: this.drawSunflower.bind(this),
            marigold: this.drawMarigold.bind(this),
            peashooter: this.drawPeashooter.bind(this)
        }[p.type];

        if (drawFn) drawFn(g, plot.x, plot.y, p.stage);

        if (p.watered) {
            plot.waterDrop = this.add.text(plot.x + 15, plot.y - 20, '💧', {
                font: '14px Arial'
            }).setOrigin(0.5, 0.5);
        }

        if (p.coinReady) {
            this.showCoinOnPlot(plot);
        }

        this.drawProgressBar(plot);
    }

    drawSunflower(g, x, y, stage) {
        if (stage === 'seed') {
            g.fillStyle(0x8B4513);
            g.fillEllipse(x, y + 5, 10, 8);
        } else if (stage === 'sprout') {
            g.fillStyle(0x4CAF50);
            g.fillRect(x - 2, y - 8, 4, 16);
            g.fillStyle(0x66BB6A);
            g.fillEllipse(x + 5, y - 4, 8, 5);
            g.fillEllipse(x - 5, y - 4, 8, 5);
        } else if (stage === 'growing') {
            g.fillStyle(0x4CAF50);
            g.fillRect(x - 3, y - 15, 6, 25);
            g.fillStyle(0x66BB6A);
            g.fillEllipse(x, y - 18, 16, 10);
            g.fillEllipse(x + 7, y - 10, 10, 8);
            g.fillEllipse(x - 7, y - 10, 10, 8);
        } else if (stage === 'mature') {
            g.fillStyle(0x4CAF50);
            g.fillRect(x - 3, y - 18, 6, 28);
            g.fillStyle(0xFFD700);
            for (let a = 0; a < 10; a++) {
                const angle = (a / 10) * Math.PI * 2;
                g.fillCircle(x + Math.cos(angle) * 10, y - 24 + Math.sin(angle) * 10, 5);
            }
            g.fillStyle(0x8B4513);
            g.fillCircle(x, y - 24, 7);
        }
    }

    drawMarigold(g, x, y, stage) {
        if (stage === 'seed') {
            g.fillStyle(0x8B4513);
            g.fillEllipse(x, y + 5, 10, 8);
        } else if (stage === 'sprout') {
            g.fillStyle(0x4CAF50);
            g.fillRect(x - 2, y - 8, 4, 16);
            g.fillStyle(0x81C784);
            g.fillEllipse(x + 5, y - 4, 7, 4);
            g.fillEllipse(x - 5, y - 4, 7, 4);
        } else if (stage === 'growing') {
            g.fillStyle(0x4CAF50);
            g.fillRect(x - 3, y - 14, 6, 24);
            g.fillStyle(0x81C784);
            g.fillEllipse(x, y - 17, 14, 8);
            g.fillEllipse(x + 6, y - 10, 9, 7);
            g.fillEllipse(x - 6, y - 10, 9, 7);
        } else if (stage === 'mature') {
            g.fillStyle(0x4CAF50);
            g.fillRect(x - 3, y - 16, 6, 26);
            g.fillStyle(0xFF8C00);
            for (let a = 0; a < 8; a++) {
                const angle = (a / 8) * Math.PI * 2;
                g.fillCircle(x + Math.cos(angle) * 9, y - 22 + Math.sin(angle) * 9, 5);
            }
            g.fillStyle(0x8B4513);
            g.fillCircle(x, y - 22, 6);
        }
    }

    drawPeashooter(g, x, y, stage) {
        if (stage === 'seed') {
            g.fillStyle(0x8B4513);
            g.fillEllipse(x, y + 5, 10, 8);
        } else if (stage === 'sprout') {
            g.fillStyle(0x4CAF50);
            g.fillRect(x - 2, y - 8, 4, 16);
            g.fillStyle(0x4CAF50);
            g.fillEllipse(x, y - 10, 8, 6);
        } else if (stage === 'growing') {
            g.fillStyle(0x388E3C);
            g.fillRect(x - 3, y - 14, 6, 24);
            g.fillStyle(0x4CAF50);
            g.fillEllipse(x, y - 16, 12, 8);
            g.fillEllipse(x + 6, y - 8, 8, 10);
        } else if (stage === 'mature') {
            g.fillStyle(0x388E3C);
            g.fillRect(x - 4, y - 18, 8, 28);
            g.fillStyle(0x4CAF50);
            g.fillCircle(x, y - 24, 10);
            g.fillStyle(0x388E3C);
            g.fillRect(x + 6, y - 28, 10, 8);
            g.fillCircle(x + 16, y - 24, 5);
            g.fillStyle(0xFFFFFF);
            g.fillCircle(x - 3, y - 27, 3);
            g.fillStyle(0x000000);
            g.fillCircle(x - 3, y - 27, 1.5);
        }
    }

    drawProgressBar(plot) {
        const p = plot.plant;
        if (!p) return;

        const barW = 50;
        const barH = 5;
        const bx = plot.x - barW / 2;
        const by = plot.y + plot.h / 2 + 8;

        plot.pb.clear();
        plot.pb.fillStyle(0x333333);
        plot.pb.fillRoundedRect(bx, by, barW, barH, 2);
    }

    updateProgressBar(plot) {
        const p = plot.plant;
        if (!p) return;

        const barW = 50;
        const barH = 5;
        const bx = plot.x - barW / 2;
        const by = plot.y + plot.h / 2 + 8;

        const prog = this.getGrowProgress(p);

        plot.pf.clear();
        if (prog > 0 && prog < 1) {
            const color = p.watered ? 0x42A5F5 : 0x4CAF50;
            plot.pf.fillStyle(color);
            plot.pf.fillRoundedRect(bx, by, barW * prog, barH, 2);
        } else if (prog >= 1 && p.stage !== 'mature') {
            plot.pf.fillStyle(0x66BB6A);
            plot.pf.fillRoundedRect(bx, by, barW, barH, 2);
        }
    }

    getGrowProgress(plant) {
        if (plant.stage === 'mature') return 1;
        const stages = ['seed', 'sprout', 'growing', 'mature'];
        const idx = stages.indexOf(plant.stage);
        if (idx < 0 || idx >= stages.length - 1) return 1;
        const elapsed = this.time.now - plant.stageStartTime;
        const duration = ZEN_GARDEN_CONFIG.growTimes[plant.stage];
        const adj = plant.watered ? duration / ZEN_GARDEN_CONFIG.waterBoost : duration;
        return adj > 0 ? Math.min(elapsed / adj, 1) : 1;
    }

    update(time) {
        if (!this.plots) return;

        for (const plot of this.plots) {
            const p = plot.plant;
            if (!p) continue;

            const stages = ['seed', 'sprout', 'growing', 'mature'];
            const ci = stages.indexOf(p.stage);
            if (ci < stages.length - 1) {
                const elapsed = time - p.stageStartTime;
                const duration = ZEN_GARDEN_CONFIG.growTimes[p.stage];
                const adj = p.watered ? duration / ZEN_GARDEN_CONFIG.waterBoost : duration;
                if (elapsed >= adj) {
                    p.stage = stages[ci + 1];
                    p.stageStartTime = time;
                    this.drawPlantInPlot(plot);
                }
            }

            if (p.watered && time >= p.waterEndTime) {
                p.watered = false;
                this.drawPlantInPlot(plot);
            }

            if (p.stage === 'mature' && !p.coinReady && time - p.lastCoinTime >= ZEN_GARDEN_CONFIG.coinInterval) {
                p.coinReady = true;
                this.showCoinOnPlot(plot);
            }

            this.updateProgressBar(plot);
        }
    }

    showCoinOnPlot(plot) {
        if (plot.coinText) plot.coinText.destroy();
        plot.coinText = this.add.text(plot.x, plot.y - 30, '$', {
            font: 'bold 20px Arial',
            fill: '#FFD700',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5, 0.5).setDepth(10);

        this.tweens.add({
            targets: plot.coinText,
            y: plot.y - 38,
            duration: 800,
            yoyo: true,
            repeat: -1
        });
    }

    collectCoin(plot) {
        if (!plot.plant || !plot.plant.coinReady) return;
        this.coins++;
        this.coinText.setText(String(this.coins));
        plot.plant.coinReady = false;
        plot.plant.lastCoinTime = this.time.now;
        if (plot.coinText) {
            plot.coinText.destroy();
            plot.coinText = null;
        }
    }
}
