// Threepeater.js - 三发射手
// 同时发射3颗豌豆到不同行（当前行、上一行、下一行）
class Threepeater extends Plant {
    constructor(scene, x, y, row, col) {
        super(scene, x, y, row, col, 'threepeater');
        this.fireRate = PLANT_CONFIG.threepeater.fireRate;
        this.fireTimer = 0;
    }

    update(time, delta) {
        if (!this.alive) return;

        this.fireTimer += delta;
        if (this.fireTimer >= this.fireRate) {
            this.fireTimer = 0;
            this.shoot();
        }
    }

    shoot() {
        // 检查三个方向的行是否有僵尸
        const rows = [this.row - 1, this.row, this.row + 1];
        let hasTarget = false;

        for (const r of rows) {
            if (r >= 0 && r < (this.scene.gridRows || 6)) {
                const zombies = this.scene.zombies.filter(z => z.alive && z.row === r && z.x > this.x);
                if (zombies.length > 0) {
                    hasTarget = true;
                    break;
                }
            }
        }

        if (!hasTarget) return;

        // 向三个方向发射豌豆
        for (const r of rows) {
            if (r >= 0 && r < (this.scene.gridRows || 6)) {
                // 检查该行是否有僵尸
                const zombies = this.scene.zombies.filter(z => z.alive && z.row === r && z.x > this.x);
                if (zombies.length > 0) {
                    const pea = new Projectile(this.scene, this.x + 20, this.y - 5, r, 'pea');
                    this.scene.projectiles.push(pea);
                }
            }
        }

        // 射击动画
        this.scene.tweens.add({
            targets: this,
            scaleX: 1.1,
            scaleY: 0.9,
            duration: 80,
            yoyo: true
        });
    }

    createVisual(type) {
        const g = this.scene.add.graphics();

        // 茎
        g.fillStyle(0x4A8C2A);
        g.fillRect(-4, 15, 8, 20);

        // 叶子
        g.fillStyle(0x3D7A1F);
        g.fillEllipse(-15, 25, 20, 8);
        g.fillEllipse(15, 28, 20, 8);

        // 主头（中间）
        g.fillStyle(0x6ABF3A);
        g.fillCircle(0, 0, 18);

        // 左头
        g.fillStyle(0x5AAE2A);
        g.fillCircle(-16, -8, 12);

        // 右头
        g.fillStyle(0x5AAE2A);
        g.fillCircle(16, -8, 12);

        // 主头嘴部
        g.fillStyle(0x2D5A1B);
        g.fillEllipse(12, 2, 10, 6);

        // 左头嘴部
        g.fillStyle(0x2D5A1B);
        g.fillEllipse(-16 + 8, -8, 6, 4);

        // 右头嘴部
        g.fillStyle(0x2D5A1B);
        g.fillEllipse(16 + 8, -8, 6, 4);

        // 眼睛
        g.fillStyle(0xFFFFFF);
        g.fillEllipse(-4, -4, 10, 12);
        g.fillStyle(0x000000);
        g.fillCircle(-3, -4, 3);

        // 小眼睛
        g.fillStyle(0xFFFFFF);
        g.fillCircle(-16, -10, 4);
        g.fillCircle(16, -10, 4);
        g.fillStyle(0x000000);
        g.fillCircle(-15, -10, 2);
        g.fillCircle(17, -10, 2);

        this.add(g);
        this.graphics = g;
    }
}
