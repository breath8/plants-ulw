// Zombie.js - 僵尸基类
class Zombie extends Phaser.GameObjects.Container {
    constructor(scene, x, y, row, type) {
        super(scene, x, y);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.scene = scene;
        this.row = row;
        this.type = type;
        this.alive = true;
        this.eating = false;
        this.slowed = false;
        this.slowTimer = 0;
        this.jumped = false;
        this.currentPlant = null;
        this.eatTimer = 0;

        // 从配置获取属性
        const cfg = ZOMBIE_CONFIG[type];
        this.maxHp = cfg.hp;
        this.hp = cfg.hp;
        this.baseSpeed = cfg.speed;
        this.speed = cfg.speed;
        this.damage = cfg.damage;
        this.eatRate = cfg.eatRate;

        // 创建视觉
        this.createVisual(type);

        // 物理设置
        this.body.setVelocityX(-this.speed);
        this.body.setSize(30, 80);
        this.body.setOffset(-15, -40);

        // 行走动画
        this.walkTween = scene.tweens.add({
            targets: this,
            angle: { from: -3, to: 3 },
            duration: 400,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    createVisual(type) {
        const g = this.scene.add.graphics();

        // 所有僵尸共用基础形状
        this.drawBaseZombie(g, type);
        this.add(g);
        this.graphics = g;
    }

    drawBaseZombie(g, type) {
        // 颜色
        const skinColor = 0x7B8B6F;
        const shirtColor = 0x8B6914;
        const pantsColor = 0x4A4A2A;

        // 头
        g.fillStyle(skinColor);
        g.fillCircle(0, -30, 14);

        // 眼睛
        g.fillStyle(0xFFFFFF);
        g.fillCircle(-5, -32, 4);
        g.fillCircle(5, -32, 4);
        g.fillStyle(0xCC0000);
        g.fillCircle(-4, -32, 2);
        g.fillCircle(6, -32, 2);

        // 嘴
        g.fillStyle(0x4A3A2A);
        g.fillEllipse(0, -22, 10, 5);

        // 身体
        g.fillStyle(shirtColor);
        g.fillRoundedRect(-12, -16, 24, 28, 3);

        // 领带
        g.fillStyle(0x6A4A0A);
        g.fillTriangle(0, -16, -4, 0, 4, 0);

        // 左臂
        g.fillStyle(skinColor);
        g.fillRect(-22, -10, 8, 24);

        // 右臂 (伸出前方)
        g.fillStyle(skinColor);
        g.fillRect(14, -14, 8, 24);

        // 左腿
        g.fillStyle(pantsColor);
        g.fillRoundedRect(-10, 12, 8, 24, 3);
        g.fillStyle(0x3A3A1A);
        g.fillRoundedRect(-12, 33, 12, 5, 2);

        // 右腿
        g.fillStyle(pantsColor);
        g.fillRoundedRect(2, 12, 8, 24, 3);
        g.fillStyle(0x3A3A1A);
        g.fillRoundedRect(0, 33, 12, 5, 2);

        // 根据类型添加特征
        switch(type) {
            case 'flag':
                // 红旗
                g.fillStyle(0x8B6914);
                g.fillRect(14, -50, 3, 50);
                g.fillStyle(0xCC0000);
                g.fillTriangle(17, -50, 17, -35, 30, -42);
                break;

            case 'conehead':
                // 路障帽
                g.fillStyle(0xE8751A);
                g.fillTriangle(0, -55, -12, -25, 12, -25);
                g.fillStyle(0xC65A00, 0.3);
                g.fillTriangle(0, -55, -6, -35, 6, -35);
                // 条纹
                g.lineStyle(1, 0xC65A00);
                g.beginPath();
                g.moveTo(-8, -30);
                g.lineTo(8, -30);
                g.strokePath();
                g.beginPath();
                g.moveTo(-6, -38);
                g.lineTo(6, -38);
                g.strokePath();
                break;

            case 'buckethead':
                // 铁桶
                g.fillStyle(0x8A8A8A);
                g.fillRoundedRect(-14, -50, 28, 28, 2);
                g.fillStyle(0xAAAAAA);
                g.fillRoundedRect(-15, -50, 30, 4, 1);
                g.lineStyle(1, 0x6A6A6A);
                g.beginPath();
                g.moveTo(-10, -40);
                g.lineTo(10, -40);
                g.strokePath();
                g.beginPath();
                g.moveTo(-10, -32);
                g.lineTo(10, -32);
                g.strokePath();
                break;

            case 'polevault':
                // 头带
                g.fillStyle(0xCC0000);
                g.fillRoundedRect(-14, -36, 28, 4, 1);
                // 撑杆
                g.fillStyle(0x8B6914);
                g.fillRect(20, -40, 4, 60);
                break;
        }
    }

    update(time, delta) {
        if (!this.alive) return;

        // 减速效果更新
        if (this.slowed) {
            this.slowTimer -= delta;
            if (this.slowTimer <= 0) {
                this.slowed = false;
                this.speed = this.baseSpeed;
                if (!this.eating) {
                    this.body.setVelocityX(-this.speed);
                }
            }
        }

        // 检测前方植物
        if (!this.eating) {
            this.checkForPlant();
        } else {
            this.eatPlant(delta);
        }

        // 检查是否到达房屋
        if (this.x < GRID.startX - 20) {
            this.reachHouse();
        }
    }

    checkForPlant() {
        const cell = gridManager.getCellFromPosition(this.x - 10, this.y);
        if (cell && cell.row === this.row) {
            const plant = gridManager.getPlant(cell.row, cell.col);
            if (plant && plant.alive) {
                this.startEating(plant);
            }
        }
    }

    startEating(plant) {
        this.eating = true;
        this.currentPlant = plant;
        this.eatTimer = 0;
        this.body.setVelocityX(0);

        // 停止行走动画
        if (this.walkTween) {
            this.walkTween.pause();
        }

        // 进食动画
        this.eatTween = this.scene.tweens.add({
            targets: this,
            x: this.x + 3,
            duration: 200,
            yoyo: true,
            repeat: -1
        });
    }

    eatPlant(delta) {
        if (!this.currentPlant || !this.currentPlant.alive) {
            this.stopEating();
            return;
        }

        this.eatTimer += delta;
        if (this.eatTimer >= this.eatRate) {
            this.eatTimer = 0;
            this.currentPlant.takeDamage(this.damage);
        }
    }

    stopEating() {
        this.eating = false;
        this.currentPlant = null;

        if (this.eatTween) {
            this.eatTween.stop();
        }

        // 恢复行走
        if (this.walkTween) {
            this.walkTween.resume();
        }
        this.body.setVelocityX(-this.speed);
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

        if (slow) {
            this.applySlow();
        }

        if (this.hp <= 0) {
            this.die();
        }
    }

    applySlow() {
        this.slowed = true;
        this.slowTimer = 5000;
        this.speed = this.baseSpeed * 0.5;

        // 蓝色色调
        this.setTint(0x88CCFF);

        if (!this.eating) {
            this.body.setVelocityX(-this.speed);
        }
    }

    die() {
        this.alive = false;
        this.body.setVelocityX(0);

        if (this.walkTween) this.walkTween.stop();
        if (this.eatTween) this.eatTween.stop();

        // 死亡动画
        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            angle: 90,
            y: this.y + 20,
            duration: 500,
            onComplete: () => {
                this.destroy();
            }
        });
    }

    reachHouse() {
        // 僵尸到达房屋 - 触发游戏失败
        this.scene.onZombieReachHouse(this.row);
        this.die();
    }
}
