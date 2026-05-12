// Squash.js - 南瓜
// 瞬间使用植物：检测到附近僵尸后跳过去压扁它
class Squash extends Plant {
    constructor(scene, x, y, row, col) {
        super(scene, x, y, row, col, 'squash');
        this.damage = PLANT_CONFIG.squash.damage;
        this.activated = false;
    }

    update(time, delta) {
        if (!this.alive || this.activated) return;

        // 检测前方附近僵尸
        const zombies = this.scene.zombies.filter(z => {
            if (!z.alive || z.row !== this.row) return false;
            const dist = z.x - this.x;
            return dist > 0 && dist < 160;
        });

        if (zombies.length > 0) {
            // 找最近的僵尸
            zombies.sort((a, b) => a.x - b.x);
            this.jumpAttack(zombies[0]);
        }
    }

    jumpAttack(target) {
        this.activated = true;
        const targetX = target.x;
        const targetY = target.y;
        const originalY = this.y;

        // 跳起
        this.scene.tweens.add({
            targets: this,
            y: originalY - 80,
            x: this.x + (targetX - this.x) * 0.5,
            scaleX: 1.3,
            scaleY: 1.3,
            duration: 250,
            ease: 'Quad.easeOut',
            onComplete: () => {
                // 落下砸到僵尸
                this.scene.tweens.add({
                    targets: this,
                    y: targetY,
                    x: targetX,
                    scaleX: 1.5,
                    scaleY: 0.7,
                    duration: 200,
                    ease: 'Quad.easeIn',
                    onComplete: () => {
                        // 造成伤害
                        if (target.alive) {
                            target.takeDamage(this.damage);
                        }

                        // 砸击特效
                        const impact = this.scene.add.graphics();
                        impact.fillStyle(0x8B6914, 0.6);
                        impact.fillCircle(this.x, this.y, 40);
                        this.scene.tweens.add({
                            targets: impact,
                            alpha: 0,
                            scaleX: 1.5,
                            scaleY: 1.5,
                            duration: 300,
                            onComplete: () => impact.destroy()
                        });

                        // 屏幕震动
                        this.scene.cameras.main.shake(200, 0.008);

                        this.die();
                    }
                });
            }
        });
    }

    createVisual(type) {
        const g = this.scene.add.graphics();

        // 南瓜身体 - 圆形
        g.fillStyle(0xD4A030);
        g.fillCircle(0, 0, 18);

        // 南瓜棱纹
        g.lineStyle(1.5, 0xB8881A, 0.5);
        g.beginPath();
        g.moveTo(-6, -16);
        g.lineTo(-6, 16);
        g.strokePath();
        g.beginPath();
        g.moveTo(6, -16);
        g.lineTo(6, 16);
        g.strokePath();
        g.beginPath();
        g.moveTo(-14, -8);
        g.lineTo(-14, 8);
        g.strokePath();
        g.beginPath();
        g.moveTo(14, -8);
        g.lineTo(14, 8);
        g.strokePath();

        // 阴影
        g.fillStyle(0xC49020, 0.3);
        g.fillEllipse(-5, 5, 16, 10);

        // 茎
        g.fillStyle(0x4A8C2A);
        g.fillRect(-2, -24, 4, 8);

        // 愤怒的眼睛
        g.fillStyle(0xFFFFFF);
        g.fillEllipse(-6, -4, 7, 8);
        g.fillEllipse(6, -4, 7, 8);
        g.fillStyle(0x000000);
        g.fillCircle(-5, -3, 3);
        g.fillCircle(7, -3, 3);

        // 愤怒的眉毛
        g.lineStyle(2, 0x000000);
        g.beginPath();
        g.moveTo(-10, -10);
        g.lineTo(-3, -8);
        g.strokePath();
        g.beginPath();
        g.moveTo(10, -10);
        g.lineTo(3, -8);
        g.strokePath();

        // 嘴巴
        g.lineStyle(1.5, 0x000000);
        g.beginPath();
        g.moveTo(-5, 6);
        g.lineTo(5, 6);
        g.strokePath();

        this.add(g);
        this.graphics = g;
    }
}
