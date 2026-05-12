// Splitpea.js - 双发射手（双头豌豆，同时向前和向后射击）
// 两个头：前面的头向前射击，后面的头向后射击
class Splitpea extends Plant {
    constructor(scene, x, y, row, col) {
        super(scene, x, y, row, col, 'splitpea');
        this.damage = PLANT_CONFIG.splitpea.damage;
        this.fireRate = PLANT_CONFIG.splitpea.fireRate;
        this.fireTimer = 0;
    }

    createVisual(type) {
        const g = this.scene.add.graphics();
        // 茎
        g.fillStyle(0x4A8C2A);
        g.fillRect(-4, 12, 8, 22);
        // 叶子
        g.fillStyle(0x3D7A1F);
        g.fillEllipse(-14, 22, 16, 6);
        g.fillEllipse(14, 25, 16, 6);
        // === 前面的头（右侧） ===
        g.fillStyle(0x6ABF3A);
        g.fillCircle(12, 0, 18);
        // 前头凹槽
        g.fillStyle(0x3D7A1F, 0.4);
        g.fillEllipse(22, 2, 12, 10);
        // 前头眼睛
        g.fillStyle(0xFFFFFF);
        g.fillEllipse(8, -4, 10, 12);
        g.fillStyle(0x000000);
        g.fillCircle(9, -4, 3.5);
        // 前头嘴
        g.fillStyle(0x2D5A1B);
        g.fillEllipse(22, 2, 10, 5);
        // === 后面的头（左侧） ===
        g.fillStyle(0x5AAF2A);
        g.fillCircle(-12, 0, 16);
        // 后头凹槽
        g.fillStyle(0x3D7A1F, 0.4);
        g.fillEllipse(-22, 2, 10, 8);
        // 后头眼睛
        g.fillStyle(0xFFFFFF);
        g.fillEllipse(-6, -4, 8, 10);
        g.fillStyle(0x000000);
        g.fillCircle(-5, -4, 3);
        // 后头嘴（朝左）
        g.fillStyle(0x2D5A1B);
        g.fillEllipse(-22, 2, 8, 4);
        this.add(g);
        this.graphics = g;
    }

    update(time, delta) {
        if (!this.alive) return;

        this.fireTimer += delta;
        if (this.fireTimer >= this.fireRate) {
            this.fireTimer = 0;
            this.shootForward();
            this.shootBackward();
        }
    }

    shootForward() {
        // 向前射击（右侧），只在前方有僵尸时
        const zombies = this.scene.zombies.filter(z =>
            z.alive && z.row === this.row && z.x > this.x
        );
        if (zombies.length > 0) {
            const pea = new Projectile(this.scene, this.x + 30, this.y - 5, this.row, 'pea');
            this.scene.projectiles.push(pea);
        }
    }

    shootBackward() {
        // 向后射击（左侧），只在后方有僵尸时
        const zombies = this.scene.zombies.filter(z =>
            z.alive && z.row === this.row && z.x < this.x
        );
        if (zombies.length > 0) {
            const pea = new Projectile(this.scene, this.x - 30, this.y - 5, this.row, 'pea');
            // 向后飞的豌豆需要反向速度
            this.scene.projectiles.push(pea);
            pea.body.setVelocityX(-pea.speed);
        }
    }
}
