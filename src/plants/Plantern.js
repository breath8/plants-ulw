// Plantern.js - 路灯花（照亮迷雾，3x3范围内驱散迷雾）
// 无攻击能力，提供HP，在迷雾世界中驱散周围迷雾
class Plantern extends Plant {
    constructor(scene, x, y, row, col) {
        super(scene, x, y, row, col, 'plantern');
        this.lightRadius = 2; // 驱散半径（格数）
        this.glowTimer = 0;
    }

    createVisual(type) {
        const g = this.scene.add.graphics();
        // 光照区域（底层光圈）
        g.fillStyle(0xFFFF88, 0.15);
        g.fillCircle(0, 0, 30);
        g.fillStyle(0xFFFF88, 0.08);
        g.fillCircle(0, 0, 40);
        // 茎
        g.fillStyle(0x6B8A4A);
        g.fillRect(-4, 10, 8, 24);
        // 叶子
        g.fillStyle(0x5A7A3A);
        g.fillEllipse(-12, 22, 14, 6);
        g.fillEllipse(12, 25, 14, 6);
        // 灯罩（灯笼形状）
        g.fillStyle(0xF5D83C);
        g.fillRoundedRect(-14, -18, 28, 30, 8);
        // 灯罩高光
        g.fillStyle(0xFFF8A0, 0.6);
        g.fillRoundedRect(-10, -14, 12, 22, 5);
        // 灯罩纹理
        g.lineStyle(1, 0xD4B82A);
        g.beginPath();
        g.moveTo(-10, -4);
        g.lineTo(10, -4);
        g.strokePath();
        g.beginPath();
        g.moveTo(-10, 4);
        g.lineTo(10, 4);
        g.strokePath();
        // 灯芯
        g.fillStyle(0xFF8C00);
        g.fillCircle(0, 0, 5);
        g.fillStyle(0xFFCC00, 0.7);
        g.fillCircle(0, 0, 3);
        // 灯顶装饰
        g.fillStyle(0x8B6914);
        g.fillRoundedRect(-8, -22, 16, 6, 3);
        // 灯底
        g.fillStyle(0x8B6914);
        g.fillRoundedRect(-6, 10, 12, 4, 2);
        // 眼睛
        g.fillStyle(0xFFFFFF);
        g.fillCircle(-5, -2, 4);
        g.fillCircle(5, -2, 4);
        g.fillStyle(0x000000);
        g.fillCircle(-4, -2, 2);
        g.fillCircle(6, -2, 2);
        // 微笑
        g.lineStyle(1.5, 0x8B6914);
        g.beginPath();
        g.arc(0, 4, 4, 0.2, Math.PI - 0.2);
        g.strokePath();
        this.add(g);
        this.graphics = g;
    }

    update(time, delta) {
        if (!this.alive) return;

        // 灯光脉动效果
        this.glowTimer += delta;
        const glowScale = 1 + Math.sin(this.glowTimer / 500) * 0.05;
        this.setScale(glowScale);
    }
}
