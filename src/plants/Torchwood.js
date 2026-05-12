// Torchwood.js - 火炬树桩
// 通过的豌豆变成火豌豆（2倍伤害），不会被僵尸吃掉时阻挡豌豆
class Torchwood extends Plant {
    constructor(scene, x, y, row, col) {
        super(scene, x, y, row, col, 'torchwood');
        this.fireIntensity = 0;
        this.flickerTimer = 0;
    }

    update(time, delta) {
        if (!this.alive) return;

        // 火焰闪烁效果
        this.flickerTimer += delta;
        if (this.flickerTimer > 200) {
            this.flickerTimer = 0;
            this.flickerAnimation();
        }

        // 检查是否有豌豆飞过，将其变成火豌豆
        // 这个逻辑在场景中通过碰撞检测处理
    }

    // 将豌豆变成火豌豆的方法
    convertPea(pea) {
        if (!pea || !pea.alive) return;
        if (pea.type === 'firepea') return; // 已经是火豌豆

        pea.type = 'firepea';
        pea.damage = pea.damage * 2;

        // 重绘豌豆视觉
        if (pea.graphics) {
            pea.graphics.destroy();
        }
        const g = this.scene.add.graphics();
        g.fillStyle(0xFF6600);
        g.fillCircle(0, 0, 8);
        g.fillStyle(0xFFCC00, 0.6);
        g.fillCircle(-2, -2, 3);
        pea.add(g);
        pea.graphics = g;

        // 火豌豆视觉 - 豌豆已有重绘的火焰颜色，无需setTint
    }

    flickerAnimation() {
        this.scene.tweens.add({
            targets: this,
            scaleY: { from: 0.95, to: 1.05 },
            scaleX: { from: 1.02, to: 0.98 },
            duration: 150,
            ease: 'Sine.easeInOut'
        });
    }

    createVisual(type) {
        const g = this.scene.add.graphics();

        // 树桩身体
        g.fillStyle(0x6B4226);
        g.fillRoundedRect(-16, -10, 32, 40, 4);

        // 树桩纹理
        g.lineStyle(1, 0x5A3520, 0.5);
        g.beginPath();
        g.moveTo(-12, 0);
        g.lineTo(12, 0);
        g.strokePath();
        g.beginPath();
        g.moveTo(-10, 10);
        g.lineTo(10, 10);
        g.strokePath();
        g.beginPath();
        g.moveTo(-10, 20);
        g.lineTo(10, 20);
        g.strokePath();

        // 顶部年轮
        g.fillStyle(0x8B6040);
        g.fillEllipse(0, -10, 28, 8);
        g.lineStyle(1, 0x6B4226, 0.6);
        g.strokeEllipse(0, -10, 20, 5);
        g.strokeEllipse(0, -10, 12, 3);

        // 火焰
        g.fillStyle(0xFF4400, 0.8);
        g.fillTriangle(-10, -12, 0, -30, 10, -12);
        g.fillStyle(0xFF8800, 0.7);
        g.fillTriangle(-6, -12, 0, -25, 6, -12);
        g.fillStyle(0xFFCC00, 0.5);
        g.fillTriangle(-3, -12, 0, -20, 3, -12);

        // 小火焰
        g.fillStyle(0xFF6600, 0.6);
        g.fillTriangle(-12, -12, -8, -22, -4, -12);
        g.fillTriangle(4, -12, 8, -20, 12, -12);

        this.add(g);
        this.graphics = g;
    }
}
