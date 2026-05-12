// Melonpult.js - 西瓜投手
// 投掷西瓜造成重伤害，命中后对周围僵尸造成溅射伤害（AOE）
class Melonpult extends Plant {
    constructor(scene, x, y, row, col) {
        super(scene, x, y, row, col, 'melonpult');
        this.fireRate = PLANT_CONFIG.melonpult.fireRate;
        this.damage = PLANT_CONFIG.melonpult.damage;
        this.fireTimer = 0;
        this.splashRadius = 60; // 溅射半径
        this.splashDamage = 30; // 溅射伤害
    }

    createVisual(type) {
        const g = this.scene.add.graphics();
        // 底座 - 加固底座
        g.fillStyle(0x6B4F10);
        g.fillEllipse(0, 18, 44, 16);
        g.fillStyle(0x8B6914);
        g.fillEllipse(0, 16, 38, 12);
        // 支架 - 更粗
        g.fillStyle(0x5A3E0A);
        g.fillRect(-4, 0, 8, 22);
        // 投射臂 - 更粗壮
        g.fillStyle(0x7A5A10);
        g.fillRoundedRect(-20, -6, 40, 8, 3);
        // 勺子 - 更大
        g.fillStyle(0x6B4F10);
        g.fillEllipse(14, -10, 20, 14);
        // 西瓜 - 大个的
        g.fillStyle(0x2E7D32);
        g.fillCircle(14, -12, 13);
        // 西瓜条纹
        g.lineStyle(2, 0x1B5E20, 0.6);
        g.beginPath();
        g.moveTo(14, -24);
        g.lineTo(14, -2);
        g.strokePath();
        g.beginPath();
        g.arc(14, -12, 10, -0.5, Math.PI * 0.5);
        g.strokePath();
        g.beginPath();
        g.arc(14, -12, 10, Math.PI * 0.5, Math.PI * 1.5);
        g.strokePath();
        // 西瓜高光
        g.fillStyle(0x4CAF50, 0.4);
        g.fillCircle(10, -16, 5);
        // 叶子
        g.fillStyle(0x2D6A2A);
        g.fillEllipse(-18, 10, 16, 6);
        g.fillEllipse(18, 14, 16, 6);
        // 眼睛 - 更大更有威慑力
        g.fillStyle(0xFFFFFF);
        g.fillCircle(-6, -6, 5);
        g.fillCircle(6, -6, 5);
        g.fillStyle(0x1B5E20);
        g.fillCircle(-5, -6, 3);
        g.fillCircle(7, -6, 3);
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
            // 锁定最近的僵尸作为目标
            const target = zombies.reduce((a, b) => a.x < b.x ? a : b);
            const proj = new MelonProjectile(
                this.scene, this.x + 16, this.y - 10,
                this.row, this.damage, target, this.splashRadius, this.splashDamage
            );
            this.scene.projectiles.push(proj);
            // 投掷动画 - 更大的后仰
            this.scene.tweens.add({
                targets: this,
                scaleY: 0.8,
                scaleX: 1.05,
                duration: 150,
                yoyo: true,
                ease: 'Quad.easeOut'
            });
        }
    }
}

// MelonProjectile - 西瓜弹（带AOE溅射）
class MelonProjectile extends Phaser.GameObjects.Container {
    constructor(scene, x, y, row, damage, target, splashRadius, splashDamage) {
        super(scene, x, y);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.row = row;
        this.damage = damage;
        this.target = target;
        this.splashRadius = splashRadius;
        this.splashDamage = splashDamage;
        this.speed = 180;
        this.alive = true;
        this.targetX = target ? target.x : x + 300;
        this.targetY = target ? target.y : y;

        // 西瓜视觉
        const g = scene.add.graphics();
        g.fillStyle(0x2E7D32);
        g.fillCircle(0, 0, 12);
        g.lineStyle(1.5, 0x1B5E20, 0.6);
        g.beginPath();
        g.moveTo(0, -10);
        g.lineTo(0, 10);
        g.strokePath();
        g.beginPath();
        g.arc(0, 0, 8, -0.5, Math.PI * 0.5);
        g.strokePath();
        g.fillStyle(0x4CAF50, 0.4);
        g.fillCircle(-3, -4, 4);
        this.add(g);

        // 飞行动画 - 弧线
        const dist = Phaser.Math.Distance.Between(x, y, this.targetX, this.targetY);
        const duration = (dist / this.speed) * 1000;

        scene.tweens.add({
            targets: this,
            x: this.targetX,
            y: this.targetY,
            duration: Math.max(duration, 400),
            ease: 'Quad.easeOut',
            onComplete: () => {
                this.explode();
            }
        });

        // 旋转效果
        scene.tweens.add({
            targets: this,
            angle: 360,
            duration: 600,
            repeat: -1
        });
    }

    update(time, delta) {
        if (!this.alive) return;
    }

    explode() {
        if (!this.alive) return;
        this.alive = false;

        // 对目标造成主伤害
        if (this.target && this.target.alive) {
            this.target.takeDamage(this.damage);
        }

        // 溅射伤害 - 范围内所有僵尸
        this.scene.zombies.forEach(zombie => {
            if (!zombie.alive) return;
            const dist = Phaser.Math.Distance.Between(this.x, this.y, zombie.x, zombie.y);
            if (dist <= this.splashRadius && zombie !== this.target) {
                zombie.takeDamage(this.splashDamage);
            }
        });

        // 爆炸特效
        const explosion = this.scene.add.graphics();
        explosion.setDepth(100);
        explosion.fillStyle(0x4CAF50, 0.4);
        explosion.fillCircle(this.x, this.y, this.splashRadius);
        explosion.fillStyle(0x81C784, 0.3);
        explosion.fillCircle(this.x, this.y, this.splashRadius * 0.6);
        explosion.fillStyle(0xA5D6A7, 0.2);
        explosion.fillCircle(this.x, this.y, this.splashRadius * 0.3);
        // 碎片
        for (let i = 0; i < 8; i++) {
            const angle = Math.random() * Math.PI * 2;
            const dist = 20 + Math.random() * 30;
            explosion.fillStyle(0x2E7D32, 0.8);
            explosion.fillCircle(
                this.x + Math.cos(angle) * dist,
                this.y + Math.sin(angle) * dist,
                3 + Math.random() * 4
            );
        }
        this.scene.tweens.add({
            targets: explosion,
            alpha: 0,
            duration: 400,
            onComplete: () => { explosion.destroy(); }
        });
        this.destroy();
    }
}
