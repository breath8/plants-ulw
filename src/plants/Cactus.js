// Cactus.js - 仙人掌（射针攻击，优先打气球僵尸）
// 普通模式：发射针，类似豌豆射手
// 升起模式：可以击落气球僵尸
class Cactus extends Plant {
    constructor(scene, x, y, row, col) {
        super(scene, x, y, row, col, 'cactus');
        this.fireRate = PLANT_CONFIG.cactus.fireRate;
        this.damage = PLANT_CONFIG.cactus.damage;
        this.fireTimer = 0;
        this.extended = false; // 是否升起（伸长）
        this.extendTimer = 0;
        this.extendDuration = 2000; // 升起持续时间
        this.extendCooldown = 0;
    }

    createVisual(type) {
        const g = this.scene.add.graphics();
        // 茎（绿色仙人掌体）
        g.fillStyle(0x2A8A3A);
        g.fillRoundedRect(-10, -20, 20, 45, 8);
        // 浅色高光
        g.fillStyle(0x4AAA5A, 0.5);
        g.fillRoundedRect(-8, -18, 8, 40, 5);
        // 刺
        g.fillStyle(0xD4C8A0);
        g.fillTriangle(-12, -10, -10, -8, -16, -14);
        g.fillTriangle(12, -5, 10, -3, 16, -9);
        g.fillTriangle(-12, 5, -10, 3, -16, 1);
        g.fillTriangle(12, 10, 10, 8, 16, 6);
        g.fillTriangle(-12, 18, -10, 16, -14, 14);
        g.fillTriangle(12, 16, 10, 14, 16, 12);
        // 顶部花
        g.fillStyle(0xFF4444);
        g.fillCircle(0, -22, 6);
        g.fillStyle(0xFF6666, 0.6);
        g.fillCircle(-1, -23, 3);
        // 眼睛
        g.fillStyle(0xFFFFFF);
        g.fillEllipse(-4, 2, 6, 8);
        g.fillEllipse(4, 2, 6, 8);
        g.fillStyle(0x000000);
        g.fillCircle(-3, 3, 2.5);
        g.fillCircle(5, 3, 2.5);
        // 嘴
        g.fillStyle(0x1A6A2A);
        g.fillEllipse(0, 12, 6, 4);
        this.add(g);
        this.graphics = g;

        // 升起状态的额外图形
        this.extendedGraphics = this.scene.add.graphics();
        const eg = this.extendedGraphics;
        // 伸长的身体
        eg.fillStyle(0x2A8A3A);
        eg.fillRoundedRect(-8, -40, 16, 65, 8);
        eg.fillStyle(0x4AAA5A, 0.5);
        eg.fillRoundedRect(-6, -38, 6, 60, 5);
        // 更多刺
        eg.fillStyle(0xD4C8A0);
        eg.fillTriangle(-10, -30, -8, -28, -14, -34);
        eg.fillTriangle(10, -25, 8, -23, 14, -29);
        eg.fillTriangle(-10, -10, -8, -8, -14, -14);
        eg.fillTriangle(10, -5, 8, -3, 14, -9);
        // 顶部针管
        eg.fillStyle(0xD4C8A0);
        eg.fillTriangle(0, -44, -3, -38, 3, -38);
        eg.fillRect(-1, -50, 2, 12);
        eg.fillCircle(0, -50, 3);
        eg.setVisible(false);
        this.add(eg);
    }

    update(time, delta) {
        if (!this.alive) return;

        // 检测气球僵尸，自动升起
        const balloonZombies = this.scene.zombies.filter(z =>
            z.alive && z.row === this.row && z.x > this.x - 20 && z.x < this.x + 200 && z.type === 'balloon'
        );

        if (balloonZombies.length > 0 && !this.extended && this.extendCooldown <= 0) {
            this.extend();
        }

        // 升起状态计时
        if (this.extended) {
            this.extendTimer -= delta;
            if (this.extendTimer <= 0) {
                this.retract();
            }
        }

        // 冷却计时
        if (this.extendCooldown > 0) {
            this.extendCooldown -= delta;
        }

        // 射击逻辑
        this.fireTimer += delta;
        if (this.fireTimer >= this.fireRate) {
            this.fireTimer = 0;
            this.shoot();
        }
    }

    extend() {
        this.extended = true;
        this.extendTimer = this.extendDuration;
        if (this.graphics) this.graphics.setVisible(false);
        if (this.extendedGraphics) this.extendedGraphics.setVisible(true);

        // 击落范围内所有气球僵尸
        const balloonZombies = this.scene.zombies.filter(z =>
            z.alive && z.row === this.row && z.x > this.x - 20 && z.x < this.x + 200 && z.type === 'balloon'
        );
        balloonZombies.forEach(z => {
            if (z.popBalloon) {
                z.popBalloon();
            }
        });
    }

    retract() {
        this.extended = false;
        this.extendCooldown = 3000;
        if (this.graphics) this.graphics.setVisible(true);
        if (this.extendedGraphics) this.extendedGraphics.setVisible(false);
    }

    shoot() {
        // 检查行内僵尸
        const zombies = this.scene.zombies.filter(z =>
            z.alive && z.row === this.row && z.x > this.x
        );
        if (zombies.length > 0) {
            const needle = new Projectile(this.scene, this.x + 20, this.y - 10, this.row, 'pea');
            this.scene.projectiles.push(needle);
            // 射击动画
            this.scene.tweens.add({
                targets: this,
                scaleX: 1.1,
                scaleY: 0.9,
                duration: 80,
                yoyo: true
            });
        }
    }
}
