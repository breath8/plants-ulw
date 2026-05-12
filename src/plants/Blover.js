// Blover.js - 三叶草（一次性使用，吹走所有气球僵尸）
// 点击后立即生效，移除屏幕上所有气球僵尸
class Blover extends Plant {
    constructor(scene, x, y, row, col) {
        super(scene, x, y, row, col, 'blover');
        // 即刻效果 - 种下后立即触发
        this.triggered = false;
        this.scene.time.delayedCall(200, () => {
            this.blow();
        });
    }

    createVisual(type) {
        const g = this.scene.add.graphics();
        // 茎
        g.fillStyle(0x4A8C2A);
        g.fillRect(-3, 8, 6, 20);
        // 叶子（三叶草形状）
        for (let i = 0; i < 3; i++) {
            const angle = (i * 120 - 90) * Math.PI / 180;
            const lx = Math.cos(angle) * 12;
            const ly = Math.sin(angle) * 12 - 2;
            g.fillStyle(0x4CAF50);
            g.fillEllipse(lx, ly, 18, 14);
            g.fillStyle(0x66BB6A, 0.5);
            g.fillEllipse(lx - 2, ly - 2, 10, 8);
            // 叶脉
            g.lineStyle(0.8, 0x2E7D32);
            g.beginPath();
            g.moveTo(lx, ly - 6);
            g.lineTo(lx, ly + 6);
            g.strokePath();
        }
        // 中心
        g.fillStyle(0x2E7D32);
        g.fillCircle(0, -2, 5);
        // 风的线条（动态效果暗示）
        g.lineStyle(1.5, 0xAADDAA, 0.6);
        g.beginPath();
        g.moveTo(15, -8);
        g.lineTo(25, -12);
        g.strokePath();
        g.beginPath();
        g.moveTo(15, 0);
        g.lineTo(28, -2);
        g.strokePath();
        g.beginPath();
        g.moveTo(15, 8);
        g.lineTo(22, 6);
        g.strokePath();
        this.add(g);
        this.graphics = g;
    }

    blow() {
        if (this.triggered) return;
        this.triggered = true;

        // 吹走所有气球僵尸
        const balloonZombies = this.scene.zombies.filter(z =>
            z.alive && z.type === 'balloon'
        );
        balloonZombies.forEach(z => {
            if (z.popBalloon) {
                z.popBalloon();
            }
        });

        // 风暴视觉效果
        const windGfx = this.scene.add.graphics();
        windGfx.setDepth(10);
        for (let i = 0; i < 8; i++) {
            const startX = this.x + (Math.random() - 0.5) * 40;
            const startY = this.y + (Math.random() - 0.5) * 40;
            windGfx.lineStyle(2, 0xAADDAA, 0.6);
            windGfx.beginPath();
            windGfx.moveTo(startX, startY);
            windGfx.lineTo(startX + 60 + Math.random() * 40, startY + (Math.random() - 0.5) * 30);
            windGfx.strokePath();
        }

        // 风暴扩散动画
        this.scene.tweens.add({
            targets: windGfx,
            scaleX: 3,
            scaleY: 2,
            alpha: 0,
            duration: 800,
            onComplete: () => {
                windGfx.destroy();
            }
        });

        // 植物消失
        this.alive = false;
        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            scaleY: 0,
            duration: 400,
            onComplete: () => {
                this.destroy();
            }
        });
    }

    update(time, delta) {
        // 即刻效果植物，不需要持续更新
    }
}
