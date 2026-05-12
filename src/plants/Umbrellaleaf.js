// Umbrellaleaf.js - 保护伞
// 保护相邻3x3区域内的植物免受蹦极僵尸抓取
// 无攻击能力，纯防御植物
class Umbrellaleaf extends Plant {
    constructor(scene, x, y, row, col) {
        super(scene, x, y, row, col, 'umbrellaleaf');
        this.protectionRadius = 1; // 保护周围1格范围
    }

    createVisual(type) {
        const g = this.scene.add.graphics();
        // 伞柄
        g.fillStyle(0x5D4037);
        g.fillRect(-2, -5, 4, 28);
        // 伞柄底座
        g.fillStyle(0x795548);
        g.fillEllipse(0, 22, 14, 6);
        // 伞面 - 展开的伞
        g.fillStyle(0x4CAF50);
        g.fillEllipse(0, -10, 50, 20);
        // 伞面分段
        g.fillStyle(0x388E3C, 0.4);
        // 左半
        g.fillEllipse(-12, -10, 24, 18);
        // 伞面高光
        g.fillStyle(0x66BB6A, 0.3);
        g.fillEllipse(-4, -14, 20, 10);
        // 伞面骨架线条
        g.lineStyle(1, 0x2E7D32, 0.5);
        g.beginPath();
        g.moveTo(-24, -10);
        g.lineTo(0, -2);
        g.lineTo(24, -10);
        g.strokePath();
        g.beginPath();
        g.moveTo(-18, -14);
        g.lineTo(0, -4);
        g.strokePath();
        g.beginPath();
        g.moveTo(18, -14);
        g.lineTo(0, -4);
        g.strokePath();
        // 伞尖
        g.fillStyle(0x8BC34A);
        g.fillCircle(0, -18, 3);
        // 保护光环（微弱显示）
        g.lineStyle(1, 0x81C784, 0.2);
        g.strokeCircle(0, 0, 40);
        // 眼睛
        g.fillStyle(0xFFFFFF);
        g.fillCircle(-6, -2, 4);
        g.fillCircle(6, -2, 4);
        g.fillStyle(0x1B5E20);
        g.fillCircle(-6, -2, 2);
        g.fillCircle(6, -2, 2);
        this.add(g);
        this.graphics = g;
    }

    update(time, delta) {
        if (!this.alive) return;
        // 保护伞持续显示保护范围（可选的微弱脉冲动画）
    }

    // 检查某个位置是否在保护范围内
    isProtected(row, col) {
        const rowDiff = Math.abs(row - this.row);
        const colDiff = Math.abs(col - this.col);
        return rowDiff <= this.protectionRadius && colDiff <= this.protectionRadius;
    }

    // 挡住蹦极僵尸 - 被调用时产生保护特效
    deflectBungee() {
        // 保护特效 - 绿色冲击波
        const shield = this.scene.add.graphics();
        shield.setDepth(100);
        shield.lineStyle(3, 0x4CAF50, 0.8);
        shield.strokeCircle(0, 0, 40);
        shield.fillStyle(0x81C784, 0.2);
        shield.fillCircle(0, 0, 40);
        shield.setPosition(this.x, this.y);

        this.scene.tweens.add({
            targets: shield,
            scaleX: 2,
            scaleY: 2,
            alpha: 0,
            duration: 500,
            onComplete: () => { shield.destroy(); }
        });

        // 伞弹跳动画
        this.scene.tweens.add({
            targets: this,
            scaleY: 0.8,
            scaleX: 1.2,
            duration: 150,
            yoyo: true,
            ease: 'Quad.easeOut'
        });
    }
}
