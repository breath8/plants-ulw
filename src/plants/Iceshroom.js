// Iceshroom.js - 冰冻菇（全屏冻结所有僵尸）
class Iceshroom extends Plant {
    constructor(scene, x, y, row, col) {
        super(scene, x, y, row, col, 'iceshroom');
        this.detonateTimer = 500; // 0.5秒后引爆
        this.detonated = false;
    }

    createVisual(type) {
        const g = this.scene.add.graphics();
        // 冰霜光环
        g.fillStyle(0xAAE0FF, 0.2);
        g.fillCircle(0, 0, 36);
        // 茎
        g.fillStyle(0x4A8ABB);
        g.fillRect(-4, 15, 8, 20);
        // 叶子
        g.fillStyle(0x3A7AAA);
        g.fillEllipse(-12, 25, 16, 6);
        g.fillEllipse(12, 28, 16, 6);
        // 菌帽
        g.fillStyle(0x5AAADF);
        g.fillEllipse(0, 0, 48, 40);
        // 冰晶高光
        g.fillStyle(0x8ACAFF, 0.7);
        g.fillEllipse(-4, -6, 30, 22);
        // 冰晶装饰
        g.fillStyle(0xFFFFFF, 0.7);
        g.fillTriangle(0, -18, -3, -10, 3, -10);
        g.fillTriangle(-10, -2, -8, -8, -6, -2);
        g.fillTriangle(10, -4, 12, -10, 14, -4);
        // 雪花图案
        g.lineStyle(1.5, 0xFFFFFF, 0.6);
        g.beginPath();
        g.moveTo(0, -10); g.lineTo(0, -2);
        g.moveTo(-4, -6); g.lineTo(4, -6);
        g.strokePath();
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
        const freezeDuration = PLANT_CONFIG.iceshroom.freezeDuration;

        // 全屏蓝色闪光
        const flash = this.scene.add.graphics();
        flash.setDepth(200);
        flash.fillStyle(0x88CCFF, 0.3);
        flash.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
        this.scene.tweens.add({
            targets: flash,
            alpha: 0,
            duration: 500,
            onComplete: () => flash.destroy()
        });

        // 冻结所有僵尸
        this.scene.zombies.forEach(zombie => {
            if (zombie.alive) {
                // 直接设置冻结状态（完全停止，速度0）
                zombie.slowed = true;
                zombie.slowTimer = freezeDuration;
                zombie.speed = 0;
                if (!zombie.eating) {
                    zombie.body.setVelocityX(0);
                }
                // 蓝色色调
                zombie.setTint(0x6688CC);
            }
        });

        // 冻结结束后清除蓝色色调
        this.scene.time.delayedCall(freezeDuration, () => {
            this.scene.zombies.forEach(zombie => {
                if (zombie.alive && !zombie.slowed) {
                    zombie.clearTint();
                }
            });
        });

        // 冰冻特效 - 从中心扩散
        const iceRing = this.scene.add.graphics();
        iceRing.setPosition(this.x, this.y);
        iceRing.lineStyle(4, 0xAAE0FF, 0.8);
        iceRing.strokeCircle(0, 0, 10);
        this.scene.tweens.add({
            targets: iceRing,
            scaleX: 8,
            scaleY: 8,
            alpha: 0,
            duration: 600,
            onComplete: () => iceRing.destroy()
        });

        // 屏幕震动
        this.scene.cameras.main.shake(200, 0.005);

        this.die();
    }
}
