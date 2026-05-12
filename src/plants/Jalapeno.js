// Jalapeno.js - 辣椒
// 瞬间使用：用火焰摧毁整行所有僵尸
class Jalapeno extends Plant {
    constructor(scene, x, y, row, col) {
        super(scene, x, y, row, col, 'jalapeno');
        this.damage = PLANT_CONFIG.jalapeno.damage;
        this.detonateTimer = 500;
        this.detonated = false;
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

        // 对整行所有僵尸造成伤害
        this.scene.zombies.forEach(zombie => {
            if (zombie.alive && zombie.row === this.row) {
                zombie.takeDamage(this.damage);
            }
        });

        // 火焰贯穿整行特效
        const startX = GRID.startX;
        const endX = GAME_WIDTH;
        const flame = this.scene.add.graphics();

        // 核心火焰
        flame.fillStyle(0xFF2200, 0.7);
        flame.fillRect(startX, this.y - 30, endX - startX, 60);

        // 外层火焰
        flame.fillStyle(0xFF6600, 0.5);
        flame.fillRect(startX, this.y - 40, endX - startX, 80);

        // 火焰顶部
        flame.fillStyle(0xFFCC00, 0.4);
        flame.fillRect(startX, this.y - 50, endX - startX, 100);

        this.scene.tweens.add({
            targets: flame,
            alpha: 0,
            duration: 600,
            onComplete: () => flame.destroy()
        });

        // 额外的火焰粒子效果
        for (let i = 0; i < 8; i++) {
            const spark = this.scene.add.graphics();
            spark.fillStyle(0xFF4400, 0.8);
            spark.fillCircle(0, 0, 5 + Math.random() * 8);
            spark.setPosition(
                startX + Math.random() * (endX - startX),
                this.y + (Math.random() - 0.5) * 60
            );
            this.scene.tweens.add({
                targets: spark,
                alpha: 0,
                y: spark.y - 30 - Math.random() * 40,
                duration: 400 + Math.random() * 300,
                onComplete: () => spark.destroy()
            });
        }

        // 屏幕震动
        this.scene.cameras.main.shake(400, 0.015);

        this.die();
    }

    createVisual(type) {
        const g = this.scene.add.graphics();

        // 辣椒主体
        g.fillStyle(0xCC0000);
        g.fillEllipse(0, 0, 14, 28);

        // 辣椒渐变高光
        g.fillStyle(0xFF2200, 0.6);
        g.fillEllipse(-2, -3, 8, 20);

        // 辣椒尖端
        g.fillStyle(0xAA0000);
        g.fillTriangle(-3, 14, 3, 14, 0, 22);

        // 茎
        g.fillStyle(0x4A8C2A);
        g.fillRect(-2, -18, 4, 8);

        // 叶子
        g.fillStyle(0x3D7A1F);
        g.fillEllipse(-6, -16, 8, 4);
        g.fillEllipse(6, -16, 8, 4);

        // 愤怒的表情
        g.fillStyle(0xFFFFFF);
        g.fillEllipse(-3, -5, 5, 6);
        g.fillEllipse(3, -5, 5, 6);
        g.fillStyle(0x000000);
        g.fillCircle(-3, -5, 2);
        g.fillCircle(3, -5, 2);

        // 愤怒的嘴
        g.lineStyle(1.5, 0x660000);
        g.beginPath();
        g.moveTo(-4, 4);
        g.lineTo(0, 2);
        g.lineTo(4, 4);
        g.strokePath();

        // 火焰效果
        g.fillStyle(0xFF6600, 0.6);
        g.fillTriangle(-4, -20, 0, -28, 4, -20);
        g.fillStyle(0xFFCC00, 0.4);
        g.fillTriangle(-2, -20, 0, -26, 2, -20);

        this.add(g);
        this.graphics = g;
    }
}
