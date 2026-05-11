// Wallnut.js - 坚果墙
class Wallnut extends Plant {
    constructor(scene, x, y, row, col) {
        super(scene, x, y, row, col, 'wallnut');
        this.damageThresholds = [0.66, 0.33]; // 裂缝出现阈值
        this.lastThreshold = 1;
    }

    takeDamage(amount) {
        super.takeDamage(amount);

        // 根据血量显示不同裂缝
        const ratio = this.hp / this.maxHp;
        if (ratio < this.lastThreshold) {
            this.updateCracks(ratio);
        }
    }

    updateCracks(ratio) {
        if (ratio <= 0.66 && this.lastThreshold > 0.66) {
            // 第一次裂缝
            this.graphics.lineStyle(2, 0x5A4510);
            this.graphics.beginPath();
            this.graphics.moveTo(-8, -10);
            this.graphics.lineTo(-4, -2);
            this.graphics.lineTo(-7, 5);
            this.graphics.strokePath();
            this.lastThreshold = 0.66;
        }
        if (ratio <= 0.33 && this.lastThreshold > 0.33) {
            // 第二次裂缝
            this.graphics.lineStyle(2, 0x5A4510);
            this.graphics.beginPath();
            this.graphics.moveTo(8, -10);
            this.graphics.lineTo(4, -2);
            this.graphics.lineTo(7, 5);
            this.graphics.strokePath();
            this.graphics.lineStyle(1.5, 0x5A4510);
            this.graphics.beginPath();
            this.graphics.moveTo(-3, 0);
            this.graphics.lineTo(3, 5);
            this.graphics.strokePath();
            this.lastThreshold = 0.33;
        }
    }
}
