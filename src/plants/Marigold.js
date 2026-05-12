// Marigold.js - 金盏花
// 装饰性植物，周期性产出金币
// 主要用于额外模式中的经济来源
class Marigold extends Plant {
    constructor(scene, x, y, row, col) {
        super(scene, x, y, row, col, 'marigold');
        this.coinInterval = 20000; // 每20秒产一枚金币
        this.coinTimer = Math.random() * 10000; // 随机初始偏移
        this.coinValue = 50; // 金币价值
    }

    createVisual(type) {
        const g = this.scene.add.graphics();
        // 茎
        g.fillStyle(0x4A8C2A);
        g.fillRect(-3, 15, 6, 18);
        // 叶子
        g.fillStyle(0x3D7A1F);
        g.fillEllipse(-12, 24, 14, 6);
        g.fillEllipse(12, 26, 14, 6);
        // 花瓣 - 金盏花橙黄色花瓣
        for (let i = 0; i < 12; i++) {
            const angle = (i * 30) * Math.PI / 180;
            const px = Math.cos(angle) * 16;
            const py = Math.sin(angle) * 16 - 2;
            g.fillStyle(i % 2 === 0 ? 0xFFA000 : 0xFF8F00);
            g.fillEllipse(px, py, 8, 16);
        }
        // 花心 - 深橙色
        g.fillStyle(0xE65100);
        g.fillCircle(0, -2, 11);
        // 花心纹理
        g.fillStyle(0xBF360C, 0.4);
        g.fillCircle(-3, -4, 4);
        g.fillCircle(3, -3, 3);
        // 眼睛
        g.fillStyle(0xFFFFFF);
        g.fillCircle(-4, -4, 3);
        g.fillCircle(4, -4, 3);
        g.fillStyle(0x000000);
        g.fillCircle(-4, -4, 1.5);
        g.fillCircle(4, -4, 1.5);
        // 微笑
        g.lineStyle(1.5, 0xBF360C);
        g.beginPath();
        g.arc(0, 0, 4, 0.3, Math.PI - 0.3);
        g.strokePath();
        // 腮红
        g.fillStyle(0xFF6F00, 0.3);
        g.fillCircle(-8, 0, 3);
        g.fillCircle(8, 0, 3);
        this.add(g);
        this.graphics = g;
    }

    update(time, delta) {
        if (!this.alive) return;
        this.coinTimer += delta;
        if (this.coinTimer >= this.coinInterval) {
            this.coinTimer = 0;
            this.produceCoin();
        }
    }

    produceCoin() {
        // 金币产出动画
        const coin = this.scene.add.graphics();
        // 金币主体
        coin.fillStyle(0xFFD700);
        coin.fillCircle(0, 0, 10);
        coin.fillStyle(0xFFE53B, 0.6);
        coin.fillCircle(-2, -2, 4);
        // 金币边框
        coin.lineStyle(1.5, 0xDAA520);
        coin.strokeCircle(0, 0, 10);
        // $符号
        coin.lineStyle(1.5, 0xB8860B);
        coin.beginPath();
        coin.moveTo(0, -6);
        coin.lineTo(0, 6);
        coin.strokePath();
        coin.beginPath();
        coin.arc(0, -2, 4, Math.PI * 1.5, Math.PI * 0.5, false);
        coin.strokePath();
        coin.beginPath();
        coin.arc(0, 2, 4, Math.PI * 0.5, Math.PI * 1.5, false);
        coin.strokePath();

        coin.setPosition(this.x, this.y - 10);
        coin.setDepth(50);

        // 金币飞出动画
        this.scene.tweens.add({
            targets: coin,
            y: this.y - 40,
            alpha: 0.8,
            duration: 300,
            ease: 'Quad.easeOut',
            onComplete: () => {
                // 金币飘浮等待收集
                this.scene.tweens.add({
                    targets: coin,
                    y: this.y - 35,
                    duration: 1000,
                    yoyo: true,
                    repeat: 2,
                    ease: 'Sine.easeInOut'
                });
                // 自动消失
                this.scene.time.delayedCall(4000, () => {
                    if (coin.active) {
                        this.scene.tweens.add({
                            targets: coin,
                            alpha: 0,
                            duration: 500,
                            onComplete: () => { coin.destroy(); }
                        });
                    }
                });
            }
        });

        // 花朵绽放反馈
        this.scene.tweens.add({
            targets: this,
            scaleX: 1.15,
            scaleY: 1.15,
            duration: 200,
            yoyo: true,
            ease: 'Quad.easeOut'
        });
    }
}
