// ImpZombie.js - 小鬼僵尸
// 体型小、速度快、HP低
// 通常由巨人僵尸抛出，也可单独出现
class ImpZombie extends Zombie {
    constructor(scene, x, y, row) {
        super(scene, x, y, row, 'imp');
        // 小鬼调整碰撞体
        this.body.setSize(20, 40);
        this.body.setOffset(-10, -20);
        this.body.setVelocityX(-this.speed);

        // 调整行走动画 - 更快更小
        if (this.walkTween) this.walkTween.stop();
        this.walkTween = scene.tweens.add({
            targets: this,
            angle: { from: -5, to: 5 },
            duration: 200,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    createVisual(type) {
        const g = this.scene.add.graphics();
        const skinColor = 0x6B8B5F;

        // 小身体
        g.fillStyle(0x8B0000);
        g.fillRoundedRect(-8, -4, 16, 14, 2);
        // 头 - 相对身体更大
        g.fillStyle(skinColor);
        g.fillCircle(0, -14, 11);
        // 眼睛 - 大大的
        g.fillStyle(0xFFFFFF);
        g.fillCircle(-4, -16, 4);
        g.fillCircle(4, -16, 4);
        g.fillStyle(0xCC0000);
        g.fillCircle(-3, -16, 2);
        g.fillCircle(5, -16, 2);
        // 嘴 - 小尖牙
        g.fillStyle(0x2A1A0A);
        g.fillEllipse(0, -9, 8, 4);
        // 尖牙
        g.fillStyle(0xFFFFFF);
        g.fillTriangle(-3, -9, -1, -6, 1, -9);
        g.fillTriangle(1, -9, 3, -6, 5, -9);
        // 小手臂
        g.fillStyle(skinColor);
        g.fillRect(-12, -2, 5, 10);
        g.fillRect(7, -2, 5, 10);
        // 小腿
        g.fillStyle(0x4A4A2A);
        g.fillRect(-6, 10, 4, 10);
        g.fillRect(2, 10, 4, 10);
        // 小鞋子
        g.fillStyle(0x3A3A1A);
        g.fillRoundedRect(-7, 18, 6, 3, 1);
        g.fillRoundedRect(1, 18, 6, 3, 1);
        this.add(g);
        this.graphics = g;
    }

    update(time, delta) {
        if (!this.alive) return;

        // 小鬼的update逻辑与普通僵尸类似但更快检测
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

        if (!this.eating) {
            this.checkForPlant();
        } else {
            this.eatPlant(delta);
        }

        if (this.x < GRID.startX - 20) {
            this.reachHouse();
        }
    }

    // 小鬼吃植物更快
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
}
