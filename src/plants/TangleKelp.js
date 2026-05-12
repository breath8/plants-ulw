// TangleKelp.js - 缠绕水草
// 水生瞬间秒杀植物：将僵尸拖入水下消灭
class TangleKelp extends Plant {
    constructor(scene, x, y, row, col) {
        super(scene, x, y, row, col, 'tanglekelp');
        this.damage = PLANT_CONFIG.tanglekelp.damage;
        this.activated = false;
    }

    update(time, delta) {
        if (!this.alive || this.activated) return;

        // 检测前方僵尸（水下植物检测范围较小）
        const zombies = this.scene.zombies.filter(z => {
            if (!z.alive || z.row !== this.row) return false;
            const dist = z.x - this.x;
            return dist > -10 && dist < 80;
        });

        if (zombies.length > 0) {
            zombies.sort((a, b) => a.x - b.x);
            this.grabZombie(zombies[0]);
        }
    }

    grabZombie(target) {
        this.activated = true;

        // 缠绕拖拽动画
        this.scene.tweens.add({
            targets: target,
            y: target.y + 30,
            scaleX: 0.6,
            scaleY: 0.6,
            alpha: 0,
            duration: 800,
            ease: 'Back.easeIn',
            onComplete: () => {
                if (target.alive) {
                    target.takeDamage(this.damage);
                }

                // 水花特效
                const splash = this.scene.add.graphics();
                splash.fillStyle(0x4A90D9, 0.6);
                splash.fillCircle(this.x, this.y, 25);
                splash.fillStyle(0x88CCEE, 0.4);
                splash.fillCircle(this.x, this.y, 15);
                this.scene.tweens.add({
                    targets: splash,
                    alpha: 0,
                    scaleX: 1.8,
                    scaleY: 1.8,
                    duration: 400,
                    onComplete: () => splash.destroy()
                });

                this.die();
            }
        });

        // 水草扭动动画
        this.scene.tweens.add({
            targets: this,
            angle: 15,
            duration: 100,
            yoyo: true,
            repeat: 3
        });
    }

    createVisual(type) {
        const g = this.scene.add.graphics();

        // 水草主体 - 多条缠绕的藤蔓
        g.lineStyle(3, 0x2E8B57);

        // 左藤蔓
        g.beginPath();
        g.moveTo(-5, 15);
        g.lineTo(-8, 8);
        g.lineTo(-3, 2);
        g.lineTo(0, -5);
        g.lineTo(3, -12);
        g.lineTo(0, -18);
        g.strokePath();

        // 右藤蔓
        g.beginPath();
        g.moveTo(5, 15);
        g.lineTo(8, 5);
        g.lineTo(3, -2);
        g.lineTo(-2, -8);
        g.lineTo(2, -15);
        g.strokePath();

        // 小叶子
        g.fillStyle(0x3D9B2F);
        g.fillEllipse(-8, 0, 8, 4);
        g.fillEllipse(8, -3, 8, 4);
        g.fillEllipse(-3, -12, 6, 3);
        g.fillEllipse(3, -8, 6, 3);

        // 缠绕圈
        g.lineStyle(2, 0x2E8B57, 0.7);
        g.strokeCircle(0, 0, 10);

        // 水面效果
        g.fillStyle(0x4A90D9, 0.2);
        g.fillEllipse(0, 12, 40, 10);

        this.add(g);
        this.graphics = g;
    }
}
