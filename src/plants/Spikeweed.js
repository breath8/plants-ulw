// Spikeweed.js - 地刺
// 铺设在地面上，对踏过的僵尸造成持续伤害，可承受3次攻击
class Spikeweed extends Plant {
    constructor(scene, x, y, row, col) {
        super(scene, x, y, row, col, 'spikeweed');
        this.damage = PLANT_CONFIG.spikeweed.damage;
        this.fireRate = PLANT_CONFIG.spikeweed.fireRate;
        this.hitsLeft = 3; // 可承受3次攻击
    }

    update(time, delta) {
        if (!this.alive) return;

        // 检测该格子上是否有僵尸经过
        const zombies = this.scene.zombies.filter(z => {
            if (!z.alive || z.row !== this.row) return false;
            const dist = Math.abs(z.x - this.x);
            return dist < 40;
        });

        zombies.forEach(zombie => {
            // 持续伤害
            zombie.takeDamage(this.damage);
        });
    }

    takeDamage(amount) {
        super.takeDamage(amount);
        this.hitsLeft--;
        if (this.hitsLeft <= 0) {
            this.die();
        }
    }

    createVisual(type) {
        const g = this.scene.add.graphics();

        // 底部圆盘
        g.fillStyle(0x8B7355, 0.6);
        g.fillEllipse(0, 8, 44, 10);

        // 尖刺 - 从左到右排列
        g.fillStyle(0xAAAAAA);
        const spikePositions = [-18, -12, -6, 0, 6, 12, 18];
        spikePositions.forEach(xPos => {
            // 刺的底部
            g.fillStyle(0x888888);
            g.fillRect(xPos - 2, -2, 4, 10);
            // 刺的尖端
            g.fillStyle(0xCCCCCC);
            g.fillTriangle(xPos - 3, -2, xPos + 3, -2, xPos, -12);
        });

        // 高光
        g.fillStyle(0xDDDDDD, 0.4);
        g.fillEllipse(-6, -6, 4, 2);
        g.fillEllipse(6, -8, 4, 2);

        this.add(g);
        this.graphics = g;
    }
}
