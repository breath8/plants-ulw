// SnorkelZombie.js - 潜水僵尸
// 潜入水下躲避攻击，浮出水面吃植物
class SnorkelZombie extends Zombie {
    constructor(scene, x, y, row) {
        super(scene, x, y, row, 'snorkel');
        this.diving = false;
        this.diveTimer = 0;
        this.diveDuration = 4000; // 潜水持续时间
        this.surfaceInterval = 6000; // 浮出水面间隔
    }

    createVisual(type) {
        const g = this.scene.add.graphics();
        this.drawBaseZombie(g, type);
        this.drawAccessory(g);
        this.add(g);
        this.graphics = g;
    }

    drawAccessory(g) {
        // 潜水呼吸管
        g.fillStyle(0x333333);
        g.fillRect(16, -40, 3, 30);

        // 呼吸管顶部（弯曲）
        g.fillStyle(0x333333);
        g.fillRect(14, -42, 8, 4);

        // 呼吸管口
        g.fillStyle(0x555555);
        g.fillCircle(18, -44, 3);

        // 潜水镜/护目镜
        g.fillStyle(0x222222);
        g.fillRoundedRect(-12, -36, 24, 10, 3);

        // 镜片
        g.fillStyle(0x88CCFF, 0.6);
        g.fillEllipse(-6, -31, 8, 6);
        g.fillEllipse(6, -31, 8, 6);
    }

    update(time, delta) {
        if (!this.alive) return;

        // 先调用基类update
        super.update(time, delta);

        // 潜水逻辑
        this.diveTimer += delta;

        if (!this.diving && this.diveTimer >= this.surfaceInterval) {
            this.dive();
        } else if (this.diving && this.diveTimer >= this.diveDuration) {
            this.surface();
        }
    }

    dive() {
        this.diving = true;
        this.diveTimer = 0;

        // 下潜动画 - 视觉缩小并半透明
        this.scene.tweens.add({
            targets: this,
            scaleY: 0.4,
            alpha: 0.5,
            y: this.y + 10,
            duration: 500,
            ease: 'Sine.easeInOut'
        });
    }

    surface() {
        this.diving = false;
        this.diveTimer = 0;

        // 上浮动画
        this.scene.tweens.add({
            targets: this,
            scaleY: 1,
            alpha: 1,
            y: this.y - 10,
            duration: 500,
            ease: 'Sine.easeInOut'
        });
    }
}
