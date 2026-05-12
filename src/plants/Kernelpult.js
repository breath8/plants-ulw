// Kernelpult.js - 玉米投手
// 投掷玉米粒（普通伤害）或黄油（眩晕效果）
class Kernelpult extends Plant {
    constructor(scene, x, y, row, col) {
        super(scene, x, y, row, col, 'kernelpult');
        this.fireRate = PLANT_CONFIG.kernelpult.fireRate;
        this.damage = PLANT_CONFIG.kernelpult.damage;
        this.fireTimer = 0;
        this.butterChance = 0.3; // 30%概率投掷黄油
    }

    createVisual(type) {
        const g = this.scene.add.graphics();
        // 底座
        g.fillStyle(0x8B6914);
        g.fillEllipse(0, 18, 40, 14);
        // 支架
        g.fillStyle(0x6B4F10);
        g.fillRect(-3, 2, 6, 20);
        // 投射臂
        g.fillStyle(0x8B6914);
        g.fillRoundedRect(-18, -4, 36, 6, 2);
        // 勺子
        g.fillStyle(0x7A5A10);
        g.fillEllipse(14, -8, 16, 10);
        // 玉米粒（在勺子中）
        g.fillStyle(0xF4D03F);
        g.fillCircle(14, -10, 9);
        g.fillStyle(0xF9E154, 0.6);
        g.fillCircle(12, -12, 4);
        // 玉米纹理 - 小格子
        g.lineStyle(0.5, 0xD4AC0D, 0.5);
        for (let r = -2; r <= 2; r++) {
            g.beginPath();
            g.moveTo(10, -10 + r * 3);
            g.lineTo(18, -10 + r * 3);
            g.strokePath();
        }
        // 叶子
        g.fillStyle(0x3D7A1F);
        g.fillEllipse(-16, 10, 14, 6);
        g.fillEllipse(16, 14, 14, 6);
        // 眼睛
        g.fillStyle(0xFFFFFF);
        g.fillCircle(-4, -6, 4);
        g.fillCircle(6, -6, 4);
        g.fillStyle(0x000000);
        g.fillCircle(-3, -6, 2);
        g.fillCircle(7, -6, 2);
        this.add(g);
        this.graphics = g;
    }

    update(time, delta) {
        if (!this.alive) return;
        this.fireTimer += delta;
        if (this.fireTimer >= this.fireRate) {
            this.fireTimer = 0;
            this.shoot();
        }
    }

    shoot() {
        const zombies = this.scene.zombies.filter(z =>
            z.alive && z.row === this.row && z.x > this.x
        );
        if (zombies.length > 0) {
            const isButter = Math.random() < this.butterChance;
            const proj = new KernelProjectile(
                this.scene, this.x + 16, this.y - 10,
                this.row, this.damage, isButter
            );
            this.scene.projectiles.push(proj);
            // 投掷动画
            this.scene.tweens.add({
                targets: this,
                scaleY: 0.85,
                duration: 120,
                yoyo: true,
                ease: 'Quad.easeOut'
            });
        }
    }
}

// KernelProjectile - 玉米/黄油投掷物
class KernelProjectile extends Phaser.GameObjects.Container {
    constructor(scene, x, y, row, damage, isButter) {
        super(scene, x, y);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.row = row;
        this.damage = damage;
        this.isButter = isButter;
        this.speed = 200;
        this.alive = true;

        const g = scene.add.graphics();
        if (isButter) {
            // 黄油 - 金黄色方形
            g.fillStyle(0xFFC107);
            g.fillRoundedRect(-8, -6, 16, 12, 2);
            g.fillStyle(0xFFD54F, 0.6);
            g.fillRoundedRect(-6, -4, 12, 8, 1);
            // 黄油纹理
            g.lineStyle(0.5, 0xF9A825, 0.5);
            g.beginPath();
            g.moveTo(-4, -2);
            g.lineTo(4, -2);
            g.strokePath();
        } else {
            // 玉米粒 - 金黄圆形
            g.fillStyle(0xF4D03F);
            g.fillCircle(0, 0, 8);
            g.fillStyle(0xF9E154, 0.6);
            g.fillCircle(-2, -2, 3);
        }
        this.add(g);

        this.body.setVelocityX(this.speed);
        this.body.setSize(16, 16);
    }

    update(time, delta) {
        if (!this.alive) return;
        this.scene.zombies.forEach(zombie => {
            if (!zombie.alive || zombie.row !== this.row) return;
            const dist = Phaser.Math.Distance.Between(this.x, this.y, zombie.x, zombie.y);
            if (dist < 25) {
                if (this.isButter) {
                    zombie.takeDamage(40);
                    zombie.body.setVelocityX(0);
                    zombie.eating = true;
                    zombie.applyTint(0xFFC107);
                    this.scene.time.delayedCall(4000, () => {
                        if (zombie.alive) {
                            zombie.eating = false;
                            zombie.body.setVelocityX(-zombie.speed);
                            zombie.clearTint();
                        }
                    });
                } else {
                    zombie.takeDamage(this.damage);
                }
                this.hit();
            }
        });
        if (this.x > GAME_WIDTH + 30) {
            this.alive = false;
            this.destroy();
        }
    }

    hit() {
        if (!this.alive) return;
        this.alive = false;
        const hitGfx = this.scene.add.graphics();
        const color = this.isButter ? 0xFFC107 : 0xF4D03F;
        for (let i = 0; i < 4; i++) {
            const angle = Math.random() * Math.PI * 2;
            const dist = 8 + Math.random() * 10;
            hitGfx.fillStyle(color, 0.7);
            hitGfx.fillCircle(Math.cos(angle) * dist, Math.sin(angle) * dist, 2 + Math.random() * 3);
        }
        hitGfx.setPosition(this.x, this.y);
        this.scene.tweens.add({
            targets: hitGfx,
            alpha: 0,
            scaleX: 2,
            scaleY: 2,
            duration: 300,
            onComplete: () => { hitGfx.destroy(); }
        });
        this.destroy();
    }
}
