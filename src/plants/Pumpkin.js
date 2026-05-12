// Pumpkin.js - 南瓜头（保护壳，叠加在另一个植物上）
// 高HP，吸收僵尸伤害，保护内部植物
class Pumpkin extends Plant {
    constructor(scene, x, y, row, col) {
        super(scene, x, y, row, col, 'pumpkin');
        this.isPumpkin = true; // 标记为南瓜壳
        this.protectedPlant = null;
    }

    createVisual(type) {
        const g = this.scene.add.graphics();
        // 南瓜外壳
        g.fillStyle(0xE88A10);
        g.fillEllipse(0, 0, 50, 56);
        // 深色纹路（南瓜棱线）
        g.lineStyle(2, 0xC06A00, 0.5);
        g.beginPath();
        g.moveTo(0, -24);
        g.lineTo(0, 24);
        g.strokePath();
        g.beginPath();
        g.moveTo(-14, -22);
        g.lineTo(-14, 22);
        g.strokePath();
        g.beginPath();
        g.moveTo(14, -22);
        g.lineTo(14, 22);
        g.strokePath();
        // 高光
        g.fillStyle(0xF5A830, 0.5);
        g.fillEllipse(-10, -8, 14, 20);
        // 南瓜蒂
        g.fillStyle(0x4A8C2A);
        g.fillRect(-3, -28, 6, 8);
        g.fillStyle(0x3D7A1F);
        g.fillEllipse(4, -26, 10, 4);
        // 眼睛（凶恶的）
        g.fillStyle(0x000000);
        g.fillTriangle(-12, -8, -4, -8, -8, -2);
        g.fillTriangle(4, -8, 12, -8, 8, -2);
        // 嘴（锯齿状）
        g.lineStyle(2, 0x000000);
        g.beginPath();
        g.moveTo(-10, 8);
        g.lineTo(-6, 4);
        g.lineTo(-2, 10);
        g.lineTo(2, 4);
        g.lineTo(6, 10);
        g.lineTo(10, 4);
        g.strokePath();
        // 南瓜厚度感（内侧阴影）
        g.lineStyle(1, 0xA05A00, 0.4);
        g.strokeEllipse(0, 0, 46, 52);
        this.add(g);
        this.graphics = g;
    }

    update(time, delta) {
        if (!this.alive) return;
        // 南瓜壳不需要主动逻辑，只在被攻击时吸收伤害
    }

    takeDamage(amount) {
        if (!this.alive) return;
        this.hp -= amount;

        // 闪烁效果
        this.scene.tweens.add({
            targets: this,
            alpha: 0.5,
            duration: 50,
            yoyo: true
        });

        if (this.hp <= 0) {
            this.die();
        }
    }

    die() {
        this.alive = false;
        // 南瓜碎裂效果
        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            scaleX: 1.3,
            scaleY: 0.5,
            duration: 400,
            onComplete: () => {
                this.destroy();
            }
        });
    }
}
