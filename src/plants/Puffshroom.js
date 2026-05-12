// Puffshroom.js - 小喷菇（免费，短程射击）
class Puffshroom extends Plant {
    constructor(scene, x, y, row, col) {
        super(scene, x, y, row, col, 'puffshroom');
        this.damage = PLANT_CONFIG.puffshroom.damage;
        this.fireRate = PLANT_CONFIG.puffshroom.fireRate;
        this.range = PLANT_CONFIG.puffshroom.range; // 3格
        this.fireTimer = 0;
    }

    createVisual(type) {
        const g = this.scene.add.graphics();
        // 茎
        g.fillStyle(0x8B6AAF);
        g.fillRect(-4, 15, 8, 20);
        // 叶子
        g.fillStyle(0x6B4A8A);
        g.fillEllipse(-12, 25, 16, 6);
        g.fillEllipse(12, 28, 16, 6);
        // 菌帽
        g.fillStyle(0x9B59B6);
        g.fillEllipse(0, 0, 48, 40);
        // 菌帽高光
        g.fillStyle(0xB07CC6, 0.6);
        g.fillEllipse(-6, -6, 30, 22);
        // 白色斑点
        g.fillStyle(0xFFFFFF);
        g.fillCircle(-10, -8, 3);
        g.fillCircle(6, -12, 2.5);
        g.fillCircle(-2, -14, 2);
        g.fillCircle(12, -4, 2);
        // 菌帽底部
        g.fillStyle(0x7B49A6);
        g.fillEllipse(0, 14, 40, 10);
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
        // 只射程3格内的僵尸（3格 * 80像素/格 = 240像素）
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
