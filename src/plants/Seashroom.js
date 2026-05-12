// Seashroom.js - 海蘑菇（水生蘑菇，短程孢子攻击）
// 只能放在泳池水面上的睡莲上，类似小喷菇的水生版本
class Seashroom extends Plant {
    constructor(scene, x, y, row, col) {
        super(scene, x, y, row, col, 'seashroom');
        this.damage = PLANT_CONFIG.seashroom.damage;
        this.fireRate = PLANT_CONFIG.seashroom.fireRate;
        this.range = PLANT_CONFIG.seashroom.range;
        this.fireTimer = 0;
    }

    createVisual(type) {
        const g = this.scene.add.graphics();
        // 茎（水面以下部分）
        g.fillStyle(0x5A8A7A);
        g.fillRect(-4, 12, 8, 16);
        // 水波纹
        g.lineStyle(1, 0x4AA8D8, 0.5);
        g.beginPath();
        g.moveTo(-18, 24);
        g.lineTo(-10, 20);
        g.lineTo(0, 24);
        g.lineTo(10, 20);
        g.lineTo(18, 24);
        g.strokePath();
        // 菌帽（贝壳形状）
        g.fillStyle(0x7ABAB0);
        g.fillEllipse(0, 0, 46, 34);
        // 菌帽纹理（贝壳条纹）
        g.lineStyle(1.5, 0x5A9A90);
        for (let i = -2; i <= 2; i++) {
            g.beginPath();
            g.moveTo(i * 6, -16);
            g.lineTo(i * 8, 14);
            g.strokePath();
        }
        // 菌帽高光
        g.fillStyle(0xA0DAD0, 0.5);
        g.fillEllipse(-6, -4, 24, 16);
        // 白色斑点
        g.fillStyle(0xFFFFFF);
        g.fillCircle(-8, -6, 2.5);
        g.fillCircle(4, -10, 2);
        g.fillCircle(10, -2, 2);
        // 菌帽底部阴影
        g.fillStyle(0x4A7A70);
        g.fillEllipse(0, 14, 36, 8);
        // 眼睛
        g.fillStyle(0xFFFFFF);
        g.fillEllipse(-7, -2, 8, 10);
        g.fillEllipse(7, -2, 8, 10);
        g.fillStyle(0x000000);
        g.fillCircle(-6, -1, 3);
        g.fillCircle(8, -1, 3);
        // 嘴
        g.fillStyle(0x3A6A60);
        g.fillEllipse(0, 8, 6, 4);
        this.add(g);
        this.graphics = g;
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
        // 短程攻击，只打3格内的僵尸
        const maxDist = this.range * GRID.cellWidth;
        const zombies = this.scene.zombies.filter(z =>
            z.alive && z.row === this.row && z.x > this.x && (z.x - this.x) <= maxDist
        );
        if (zombies.length > 0) {
            const spore = new Projectile(this.scene, this.x + 20, this.y - 5, this.row, 'pea');
            this.scene.projectiles.push(spore);
            // 射击动画
            this.scene.tweens.add({
                targets: this,
                scaleX: 1.1,
                scaleY: 0.9,
                duration: 80,
                yoyo: true
            });
        }
    }
}
