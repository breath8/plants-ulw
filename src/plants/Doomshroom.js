// Doomshroom.js - 毁灭菇（大范围爆炸，留下弹坑）
class Doomshroom extends Plant {
    constructor(scene, x, y, row, col) {
        super(scene, x, y, row, col, 'doomshroom');
        this.detonateTimer = 500; // 0.5秒后引爆
        this.detonated = false;
    }

    createVisual(type) {
        const g = this.scene.add.graphics();
        // 危险光环
        g.fillStyle(0xFF2200, 0.15);
        g.fillCircle(0, 0, 36);
        // 茎
        g.fillStyle(0x3A2A1A);
        g.fillRect(-4, 15, 8, 20);
        // 菌帽
        g.fillStyle(0x5A2A3A);
        g.fillEllipse(0, 0, 48, 40);
        // 菌帽纹理
        g.fillStyle(0x7A3A4A, 0.7);
        g.fillEllipse(-4, -6, 30, 22);
        // 骷髅标记
        g.fillStyle(0x1A0A0A);
        g.fillEllipse(-8, -6, 8, 10);
        g.fillEllipse(8, -6, 8, 10);
        // 骷髅鼻子
        g.fillTriangle(0, 2, -3, 7, 3, 7);
        // 骷髅嘴
        g.fillRoundedRect(-8, 10, 16, 4, 1);
        g.fillStyle(0x5A2A3A);
        g.fillRect(-4, 10, 1.5, 4);
        g.fillRect(-0.5, 10, 1.5, 4);
        g.fillRect(3, 10, 1.5, 4);
        // 危险标记
        g.fillStyle(0xFF4400, 0.6);
        g.fillTriangle(0, -18, -4, -10, 4, -10);
        g.fillStyle(0xFFFFFF, 0.8);
        g.fillTriangle(0, -16, -1.5, -12, 1.5, -12);
        // 底部碎屑
        g.fillStyle(0x4A1A2A);
        g.fillEllipse(0, 18, 36, 8);
        this.add(g);
        this.graphics = g;
    }

    update(time, delta) {
        if (!this.alive || this.detonated) return;

        this.detonateTimer -= delta;
        if (this.detonateTimer <= 0) {
            this.detonate();
        }
    }

    detonate() {
        this.detonated = true;
        const range = PLANT_CONFIG.doomshroom.range;
        const damage = PLANT_CONFIG.doomshroom.damage;

        // 播放爆炸音效
        audioManager.playSFX('sfx_explosion');

        // 爆炸范围内的僵尸
        this.scene.zombies.forEach(zombie => {
            if (!zombie.alive) return;
            const rowDiff = Math.abs(zombie.row - this.row);
            const colCell = gridManager.getCellFromPosition(zombie.x, zombie.y);
            if (colCell) {
                const colDiff = Math.abs(colCell.col - this.col);
                if (rowDiff <= range && colDiff <= range) {
                    zombie.takeDamage(damage);
                }
            }
        });

        // 巨大爆炸特效
        const explosion = this.scene.add.graphics();
        explosion.setDepth(100);
        // 外圈 - 暗红
        explosion.fillStyle(0x880000, 0.4);
        explosion.fillCircle(this.x, this.y, 120);
        // 中圈 - 橙红
        explosion.fillStyle(0xFF2200, 0.6);
        explosion.fillCircle(this.x, this.y, 80);
        // 内圈 - 黄
        explosion.fillStyle(0xFFCC00, 0.8);
        explosion.fillCircle(this.x, this.y, 50);
        // 核心 - 白
        explosion.fillStyle(0xFFFFFF, 0.9);
        explosion.fillCircle(this.x, this.y, 25);

        this.scene.tweens.add({
            targets: explosion,
            alpha: 0,
            scaleX: 1.5,
            scaleY: 1.5,
            duration: 600,
            onComplete: () => explosion.destroy()
        });

        // 屏幕震动
        this.scene.cameras.main.shake(500, 0.02);

        // 留下弹坑（禁止种植30秒）
        this.createCrater();

        this.die();
    }

    createCrater() {
        // 在爆炸中心创建弹坑标记
        const crater = this.scene.add.graphics();
        crater.setDepth(5);
        crater.fillStyle(0x2A1A0A);
        crater.fillEllipse(this.x, this.y + 10, GRID.cellWidth * 0.8, GRID.cellHeight * 0.6);
        crater.fillStyle(0x1A0A00);
        crater.fillEllipse(this.x, this.y + 10, GRID.cellWidth * 0.5, GRID.cellHeight * 0.35);
        crater.lineStyle(2, 0x4A2A0A, 0.5);
        crater.strokeEllipse(this.x, this.y + 10, GRID.cellWidth * 0.8, GRID.cellHeight * 0.6);

        // 30秒后移除弹坑
        this.scene.time.delayedCall(30000, () => {
            if (crater && crater.active) {
                this.scene.tweens.add({
                    targets: crater,
                    alpha: 0,
                    duration: 1000,
                    onComplete: () => crater.destroy()
                });
            }
        });
    }
}
