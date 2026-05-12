// Tallnut.js - 高坚果
// 超高HP的防御植物，僵尸无法跳过
class Tallnut extends Plant {
    constructor(scene, x, y, row, col) {
        super(scene, x, y, row, col, 'tallnut');
        this.damageThresholds = [0.75, 0.5, 0.25]; // 裂缝阈值
        this.lastThreshold = 1;
    }

    takeDamage(amount) {
        super.takeDamage(amount);

        const ratio = this.hp / this.maxHp;
        if (ratio < this.lastThreshold) {
            this.updateCracks(ratio);
        }
    }

    updateCracks(ratio) {
        // 第一次裂缝
        if (ratio <= 0.75 && this.lastThreshold > 0.75) {
            this.graphics.lineStyle(2, 0x5A4510);
            this.graphics.beginPath();
            this.graphics.moveTo(-10, -20);
            this.graphics.lineTo(-6, -10);
            this.graphics.lineTo(-9, 0);
            this.graphics.strokePath();
            this.lastThreshold = 0.75;
        }
        // 第二次裂缝
        if (ratio <= 0.5 && this.lastThreshold > 0.5) {
            this.graphics.lineStyle(2, 0x5A4510);
            this.graphics.beginPath();
            this.graphics.moveTo(8, -18);
            this.graphics.lineTo(4, -8);
            this.graphics.lineTo(7, 2);
            this.graphics.strokePath();
            this.lastThreshold = 0.5;
        }
        // 第三次裂缝
        if (ratio <= 0.25 && this.lastThreshold > 0.25) {
            this.graphics.lineStyle(2, 0x5A4510);
            this.graphics.beginPath();
            this.graphics.moveTo(-2, -15);
            this.graphics.lineTo(2, -5);
            this.graphics.lineTo(-1, 5);
            this.graphics.strokePath();
            this.graphics.lineStyle(1.5, 0x5A4510);
            this.graphics.beginPath();
            this.graphics.moveTo(-8, 5);
            this.graphics.lineTo(8, 8);
            this.graphics.strokePath();
            this.lastThreshold = 0.25;
        }
    }

    createVisual(type) {
        const g = this.scene.add.graphics();

        // 高坚果主体 - 比普通坚果更高更大
        g.fillStyle(0x8B6914);
        g.fillRoundedRect(-20, -30, 40, 60, 6);

        // 深色内圈
        g.fillStyle(0x6B4F10, 0.3);
        g.fillRoundedRect(-16, -26, 32, 52, 4);

        // 纹理线条
        g.lineStyle(1, 0x6B4F10, 0.5);
        g.beginPath();
        g.moveTo(-14, -10);
        g.lineTo(14, -10);
        g.strokePath();
        g.beginPath();
        g.moveTo(-12, 5);
        g.lineTo(12, 5);
        g.strokePath();
        g.beginPath();
        g.moveTo(-12, 18);
        g.lineTo(12, 18);
        g.strokePath();

        // 坚果顶部
        g.fillStyle(0x7A5A10);
        g.fillEllipse(0, -30, 36, 10);

        // 眼睛
        g.fillStyle(0xFFFFFF);
        g.fillEllipse(-7, -15, 10, 12);
        g.fillEllipse(7, -15, 10, 12);
        g.fillStyle(0x000000);
        g.fillCircle(-6, -14, 4);
        g.fillCircle(8, -14, 4);

        // 坚定的表情
        g.lineStyle(2, 0x4A3510);
        g.beginPath();
        g.moveTo(-4, -2);
        g.lineTo(4, -2);
        g.strokePath();

        this.add(g);
        this.graphics = g;
    }
}
