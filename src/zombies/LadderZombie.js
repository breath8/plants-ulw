// LadderZombie.js - 扶梯僵尸
// 携带扶梯，到达植物处时放置扶梯
// 扶梯允许后续僵尸直接翻越该植物
class LadderZombie extends Zombie {
    constructor(scene, x, y, row) {
        super(scene, x, y, row, 'ladder');
        this.hasLadder = true;
        this.ladderPlaced = false;
        this.placeTimer = 0;
        this.placeDelay = 800; // 放置扶梯所需时间
    }

    createVisual(type) {
        const g = this.scene.add.graphics();
        const skinColor = 0x7B8B6F;

        // 头
        g.fillStyle(skinColor);
        g.fillCircle(0, -30, 14);
        // 眼睛
        g.fillStyle(0xFFFFFF);
        g.fillCircle(-5, -32, 4);
        g.fillCircle(5, -32, 4);
        g.fillStyle(0xCC0000);
        g.fillCircle(-4, -32, 2);
        g.fillCircle(6, -32, 2);
        // 嘴
        g.fillStyle(0x4A3A2A);
        g.fillEllipse(0, -22, 10, 5);
        // 头盔
        g.fillStyle(0x4A4A4A);
        g.fillRoundedRect(-14, -44, 28, 10, 3);
        g.fillStyle(0x666666);
        g.fillRect(-12, -40, 24, 3);
        // 身体
        g.fillStyle(0x8B6914);
        g.fillRoundedRect(-12, -16, 24, 28, 3);
        // 领带
        g.fillStyle(0x6A4A0A);
        g.fillTriangle(0, -16, -4, 0, 4, 0);
        // 左臂
        g.fillStyle(skinColor);
        g.fillRect(-22, -10, 8, 20);
        // 右臂（扶着梯子）
        g.fillStyle(skinColor);
        g.fillRect(14, -14, 8, 16);
        // 扶梯
        if (this.hasLadder) {
            // 梯子竖杆
            g.fillStyle(0xBDBDBD);
            g.fillRect(20, -40, 3, 50);
            g.fillRect(28, -40, 3, 50);
            // 梯子横档
            g.fillStyle(0x9E9E9E);
            for (let i = 0; i < 5; i++) {
                g.fillRect(20, -36 + i * 10, 11, 3);
            }
            // 梯子高光
            g.fillStyle(0xE0E0E0, 0.4);
            g.fillRect(20, -40, 1, 50);
        }
        // 左腿
        g.fillStyle(0x4A4A2A);
        g.fillRoundedRect(-10, 12, 8, 24, 3);
        g.fillStyle(0x3A3A1A);
        g.fillRoundedRect(-12, 33, 12, 5, 2);
        // 右腿
        g.fillStyle(0x4A4A2A);
        g.fillRoundedRect(2, 12, 8, 24, 3);
        g.fillStyle(0x3A3A1A);
        g.fillRoundedRect(0, 33, 12, 5, 2);
        this.add(g);
        this.graphics = g;
    }

    update(time, delta) {
        if (!this.alive) return;

        // 检测前方植物
        if (!this.eating && this.hasLadder) {
            const cell = gridManager.getCellFromPosition(this.x - 10, this.y);
            if (cell && cell.row === this.row) {
                const plant = gridManager.getPlant(cell.row, cell.col);
                if (plant && plant.alive && plant.type !== 'cherrybomb' && plant.type !== 'potatomine') {
                    this.startPlacingLadder(plant, cell);
                    return;
                }
            }
        }

        // 正在放置扶梯
        if (this.ladderPlacing) {
            this.placeTimer += delta;
            if (this.placeTimer >= this.placeDelay) {
                this.placeLadder();
            }
        }
    }

    startPlacingLadder(plant, cell) {
        this.ladderPlacing = true;
        this.placeTimer = 0;
        this.body.setVelocityX(0);
        if (this.walkTween) this.walkTween.pause();

        // 面对植物放置动画
        this.scene.tweens.add({
            targets: this,
            scaleX: 1.1,
            duration: 200,
            yoyo: true,
            repeat: 2
        });
    }

    placeLadder() {
        this.ladderPlacing = false;
        this.hasLadder = false;
        this.ladderPlaced = true;
        this.placeTimer = 0;

        // 在当前位置放置扶梯
        const cell = gridManager.getCellFromPosition(this.x - 10, this.y);
        if (cell) {
            const plant = gridManager.getPlant(cell.row, cell.col);
            if (plant && plant.alive) {
                // 扶梯视觉 - 放在植物旁边
                const ladder = this.scene.add.graphics();
                ladder.setDepth(30);
                ladder.fillStyle(0xBDBDBD);
                ladder.fillRect(plant.x + 15, plant.y - 30, 3, 45);
                ladder.fillRect(plant.x + 23, plant.y - 30, 3, 45);
                ladder.fillStyle(0x9E9E9E);
                for (let i = 0; i < 4; i++) {
                    ladder.fillRect(plant.x + 15, plant.y - 26 + i * 12, 11, 3);
                }
                // 扶梯放置特效
                const effect = this.scene.add.graphics();
                effect.setDepth(100);
                effect.lineStyle(2, 0xFFFFFF, 0.8);
                effect.strokeCircle(plant.x + 20, plant.y, 15);
                this.scene.tweens.add({
                    targets: effect,
                    alpha: 0,
                    scaleX: 1.5,
                    scaleY: 1.5,
                    duration: 300,
                    onComplete: () => { effect.destroy(); }
                });
            }
        }

        // 继续前进 - 重绘去掉梯子
        this.redrawWithoutLadder();
        this.body.setVelocityX(-this.speed);
        if (this.walkTween) this.walkTween.resume();
    }

    redrawWithoutLadder() {
        if (this.graphics) {
            this.graphics.destroy();
        }
        const g = this.scene.add.graphics();
        this.drawBaseZombie(g, 'basic');
        // 戴头盔的标记
        g.fillStyle(0x4A4A4A);
        g.fillRoundedRect(-14, -44, 28, 10, 3);
        this.add(g);
        this.graphics = g;
    }

    // 扶梯僵尸免疫减速（在放置扶梯时）
    applySlow() {
        if (!this.ladderPlacing) {
            super.applySlow();
        }
    }
}
