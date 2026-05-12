// CatapultZombie.js - 蹦床僵尸（投石车僵尸）
// 驾驶投石车，发射篮球远程攻击植物
// 高HP，远程输出，被摧毁后变普通僵尸
class CatapultZombie extends Zombie {
    constructor(scene, x, y, row) {
        super(scene, x, y, row, 'catapult');
        this.launchRate = 2000; // 每2秒发射一次
        this.launchTimer = 1000; // 首次延迟1秒
        this.basketballDamage = 50; // 篮球伤害
        this.vehicleHp = 780; // 载具HP（等于总HP）
        this.inVehicle = true;
        this.launchCount = 0; // 已发射次数
        this.maxLaunches = 30; // 最大发射次数（投石车弹药有限）
    }

    createVisual(type) {
        const g = this.scene.add.graphics();
        const skinColor = 0x7B8B6F;

        // 投石车主体
        g.fillStyle(0x5D4037);
        g.fillRoundedRect(-20, 0, 40, 24, 4);
        // 投石车侧板
        g.fillStyle(0x4E342E);
        g.fillRoundedRect(-22, -4, 44, 8, 2);
        // 车轮
        g.fillStyle(0x333333);
        g.fillCircle(-14, 24, 8);
        g.fillCircle(14, 24, 8);
        g.fillStyle(0x555555);
        g.fillCircle(-14, 24, 4);
        g.fillCircle(14, 24, 4);
        // 轮毂
        g.fillStyle(0x888888);
        g.fillCircle(-14, 24, 2);
        g.fillCircle(14, 24, 2);
        // 投石臂
        g.fillStyle(0x6D4C41);
        g.fillRect(-4, -30, 6, 32);
        // 投石勺
        g.fillStyle(0x5D4037);
        g.fillEllipse(2, -32, 16, 10);
        // 僵尸坐在车上
        g.fillStyle(skinColor);
        g.fillCircle(0, -40, 12);
        // 眼睛
        g.fillStyle(0xFFFFFF);
        g.fillCircle(-4, -42, 3);
        g.fillCircle(4, -42, 3);
        g.fillStyle(0xCC0000);
        g.fillCircle(-3, -42, 1.5);
        g.fillCircle(5, -42, 1.5);
        // 头盔
        g.fillStyle(0x8B0000);
        g.fillRoundedRect(-10, -52, 20, 8, 3);
        // 身体
        g.fillStyle(0x8B6914);
        g.fillRoundedRect(-8, -30, 16, 14, 2);
        // 手臂（操控投石臂）
        g.fillStyle(skinColor);
        g.fillRect(-14, -28, 6, 10);
        g.fillRect(8, -28, 6, 10);
        this.add(g);
        this.graphics = g;
    }

    update(time, delta) {
        if (!this.alive) return;

        if (this.inVehicle) {
            this.launchTimer += delta;
            if (this.launchTimer >= this.launchRate && this.launchCount < this.maxLaunches) {
                this.launchTimer = 0;
                this.launchBasketball();
            }
        }
    }

    launchBasketball() {
        // 发射篮球
        this.launchCount++;

        // 寻找最近的植物目标
        let targetPlant = null;
        this.scene.plants.forEach(plant => {
            if (!plant.alive) return;
            const dist = Math.abs(plant.x - this.x);
            if (dist < 400 && plant.row === this.row) {
                if (!targetPlant || plant.x < targetPlant.x) {
                    targetPlant = plant;
                }
            }
        });

        if (targetPlant) {
            const ball = new BasketballProjectile(
                this.scene, this.x, this.y - 35,
                this.row, this.basketballDamage, targetPlant
            );
            this.scene.projectiles.push(ball);

            // 投臂挥动动画
            this.scene.tweens.add({
                targets: this.graphics,
                angle: -15,
                duration: 100,
                yoyo: true,
                ease: 'Quad.easeOut'
            });
        }
    }

    takeDamage(amount, slow = false) {
        if (!this.alive) return;

        this.hp -= amount;

        // 闪烁效果
        this.scene.tweens.add({
            targets: this,
            alpha: 0.5,
            duration: 50,
            yoyo: true
        });

        // 车辆HP单独追踪
        if (this.inVehicle) {
            this.vehicleHp -= amount;
            if (this.vehicleHp <= 0) {
                this.destroyVehicle();
            }
        }

        if (this.hp <= 0) {
            this.die();
        }
    }

    destroyVehicle() {
        this.inVehicle = false;

        // 车辆爆炸特效
        const explosion = this.scene.add.graphics();
        explosion.setDepth(100);
        explosion.fillStyle(0xFF6600, 0.6);
        explosion.fillCircle(this.x, this.y + 10, 25);
        explosion.fillStyle(0xFFAA00, 0.4);
        explosion.fillCircle(this.x, this.y + 5, 15);
        this.scene.tweens.add({
            targets: explosion,
            alpha: 0,
            scaleX: 2,
            scaleY: 2,
            duration: 400,
            onComplete: () => { explosion.destroy(); }
        });

        // 碎片飞散
        for (let i = 0; i < 5; i++) {
            const debris = this.scene.add.graphics();
            debris.fillStyle(0x5D4037);
            debris.fillRect(-3, -2, 6, 4);
            debris.setPosition(this.x, this.y + 10);
            const angle = Math.random() * Math.PI * 2;
            this.scene.tweens.add({
                targets: debris,
                x: this.x + Math.cos(angle) * 40,
                y: this.y + 10 + Math.sin(angle) * 30 - 20,
                alpha: 0,
                duration: 500,
                onComplete: () => { debris.destroy(); }
            });
        }

        // 变为步行僵尸 - 速度增加
        this.speed = this.baseSpeed * 1.2;
        this.body.setVelocityX(-this.speed);

        // 重绘视觉 - 去掉车辆
        if (this.graphics) {
            this.graphics.destroy();
        }
        const g = this.scene.add.graphics();
        this.drawBaseZombie(g, 'basic');
        this.add(g);
        this.graphics = g;

        // 调整碰撞体
        this.body.setSize(30, 70);
        this.body.setOffset(-15, -35);
    }

    // 投石车僵尸免疫减速
    applySlow() {
        if (this.inVehicle) {
            // 车辆状态不受减速
        } else {
            super.applySlow();
        }
    }
}

// BasketballProjectile - 篮球投掷物
class BasketballProjectile extends Phaser.GameObjects.Container {
    constructor(scene, x, y, row, damage, target) {
        super(scene, x, y);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.row = row;
        this.damage = damage;
        this.target = target;
        this.alive = true;

        // 篮球视觉
        const g = scene.add.graphics();
        g.fillStyle(0xE65100);
        g.fillCircle(0, 0, 7);
        g.fillStyle(0xFF8F00, 0.5);
        g.fillCircle(-2, -2, 3);
        // 篮球线条
        g.lineStyle(1, 0xBF360C, 0.6);
        g.beginPath();
        g.moveTo(-7, 0);
        g.lineTo(7, 0);
        g.strokePath();
        g.beginPath();
        g.moveTo(0, -7);
        g.lineTo(0, 7);
        g.strokePath();
        this.add(g);

        // 飞向目标
        if (target && target.alive) {
            const dist = Phaser.Math.Distance.Between(x, y, target.x, target.y);
            const duration = (dist / 300) * 1000;
            scene.tweens.add({
                targets: this,
                x: target.x,
                y: target.y,
                duration: Math.max(duration, 300),
                ease: 'Quad.easeIn',
                onComplete: () => {
                    this.hit();
                }
            });
        } else {
            // 无目标则直线飞行
            this.body.setVelocityX(300);
            scene.time.delayedCall(2000, () => {
                if (this.alive) this.destroy();
            });
        }
    }

    update(time, delta) {
        if (!this.alive) return;
    }

    hit() {
        if (!this.alive) return;
        this.alive = false;

        // 命中植物
        if (this.target && this.target.alive) {
            this.target.takeDamage(this.damage);
        }

        // 击中特效
        const hitGfx = this.scene.add.graphics();
        hitGfx.fillStyle(0xE65100, 0.6);
        hitGfx.fillCircle(0, 0, 8);
        hitGfx.setPosition(this.x, this.y);
        this.scene.tweens.add({
            targets: hitGfx,
            alpha: 0,
            scaleX: 2,
            scaleY: 2,
            duration: 200,
            onComplete: () => { hitGfx.destroy(); }
        });
        this.destroy();
    }
}
