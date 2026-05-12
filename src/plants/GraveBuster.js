// GraveBuster.js - 坟墓破坏者（放在墓碑上，倒计时摧毁墓碑）
class GraveBuster extends Plant {
    constructor(scene, x, y, row, col) {
        super(scene, x, y, row, col, 'gravebuster');
        this.armTimer = 15000; // 15秒后摧毁墓碑
        this.countdown = 0;
        this.targetGrave = null;

        // 寻找同格的墓碑
        if (scene.graves) {
            for (let i = 0; i < scene.graves.length; i++) {
                const grave = scene.graves[i];
                if (grave && grave.active && grave.row === row && grave.col === col) {
                    this.targetGrave = grave;
                    break;
                }
            }
        }

        // 开始倒计时动画
        this.countdownBar = this.scene.add.graphics();
        this.countdownBar.setDepth(10);
    }

    createVisual(type) {
        const g = this.scene.add.graphics();
        // 身体（骷髅形状）
        g.fillStyle(0xE8E8E8);
        g.fillEllipse(0, -2, 44, 48);
        // 高光
        g.fillStyle(0xF5F5F5, 0.6);
        g.fillEllipse(-4, -8, 28, 28);
        // 空洞眼睛
        g.fillStyle(0x1A1A2E);
        g.fillEllipse(-10, -8, 12, 14);
        g.fillEllipse(10, -8, 12, 14);
        // 眼睛内红点
        g.fillStyle(0xCC2222);
        g.fillCircle(-9, -8, 2);
        g.fillCircle(11, -8, 2);
        // 鼻子
        g.fillStyle(0x1A1A2E);
        g.fillTriangle(0, 2, -3, 6, 3, 6);
        // 嘴
        g.fillStyle(0x1A1A2E);
        g.fillRoundedRect(-10, 12, 20, 4, 2);
        g.fillStyle(0xE8E8E8);
        g.fillRect(-6, 12, 1.5, 4);
        g.fillRect(-1, 12, 1.5, 4);
        g.fillRect(4, 12, 1.5, 4);
        // 小手
        g.fillStyle(0xD0D0D0);
        g.fillRoundedRect(-28, 0, 8, 16, 4);
        g.fillRoundedRect(20, 0, 8, 16, 4);
        // 底部碎骨
        g.fillStyle(0xD0D0D0);
        g.fillEllipse(0, 22, 32, 10);
        this.add(g);
        this.graphics = g;
    }

    update(time, delta) {
        if (!this.alive) return;

        this.countdown += delta;

        // 绘制倒计时条
        if (this.countdownBar) {
            this.countdownBar.clear();
            const progress = Math.min(this.countdown / this.armTimer, 1);
            const barWidth = 36;
            const barX = this.x - barWidth / 2;
            const barY = this.y - 35;

            // 背景
            this.countdownBar.fillStyle(0x333333, 0.7);
            this.countdownBar.fillRoundedRect(barX, barY, barWidth, 5, 2);
            // 填充
            this.countdownBar.fillStyle(0xFFD700);
            this.countdownBar.fillRoundedRect(barX, barY, barWidth * progress, 5, 2);
        }

        if (this.countdown >= this.armTimer) {
            this.destroyGrave();
        }
    }

    destroyGrave() {
        // 摧毁墓碑
        if (this.targetGrave && this.targetGrave.active) {
            // 墓碑碎裂特效
            const fragments = this.scene.add.graphics();
            fragments.fillStyle(0x5A5A5A);
            for (let i = 0; i < 8; i++) {
                const angle = (i / 8) * Math.PI * 2;
                const dist = 10 + Math.random() * 20;
                fragments.fillCircle(
                    this.targetGrave.x + Math.cos(angle) * dist,
                    this.targetGrave.y + Math.sin(angle) * dist,
                    3 + Math.random() * 5
                );
            }
            this.scene.tweens.add({
                targets: fragments,
                alpha: 0,
                duration: 500,
                onComplete: () => fragments.destroy()
            });

            // 从场景墓碑列表中移除
            const idx = this.scene.graves.indexOf(this.targetGrave);
            if (idx !== -1) {
                this.scene.graves.splice(idx, 1);
            }
            this.targetGrave.destroy();
        }

        // 移除倒计时条
        if (this.countdownBar) {
            this.countdownBar.destroy();
            this.countdownBar = null;
        }

        this.die();
    }

    die() {
        if (this.countdownBar) {
            this.countdownBar.destroy();
            this.countdownBar = null;
        }
        super.die();
    }
}
