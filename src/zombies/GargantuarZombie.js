// GargantuarZombie.js - 巨人僵尸（BOSS）
// 超高HP（3000+），携带电线杆武器
// 砸碎植物，免疫减速，HP减半时抛出小鬼
class GargantuarZombie extends Zombie {
    constructor(scene, x, y, row) {
        super(scene, x, y, row, 'gargantuar');
        this.body.setVelocityX(-this.speed);
        this.body.setSize(40, 90);
        this.body.setOffset(-20, -45);

        this.smashDamage = 1000; // 砸击伤害（秒杀大多数植物）
        this.smashRate = 1500; // 砸击间隔
        this.smashTimer = 0;
        this.impDropped = false; // 是否已投出小鬼
        this.smashing = false;

        // 调整行走动画 - 更沉重
        if (this.walkTween) this.walkTween.stop();
        this.walkTween = scene.tweens.add({
            targets: this,
            angle: { from: -2, to: 2 },
            duration: 600,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    createVisual(type) {
        const g = this.scene.add.graphics();
        const skinColor = 0x6B7B5F;

        // 巨大的身体
        g.fillStyle(0x4A4A2A);
        g.fillRoundedRect(-20, -16, 40, 36, 4);
        // 红色衬衫
        g.fillStyle(0x8B0000);
        g.fillRoundedRect(-18, -14, 36, 30, 3);
        // 肚子
        g.fillStyle(0xAA2222, 0.4);
        g.fillEllipse(0, 4, 30, 20);

        // 头 - 更大
        g.fillStyle(skinColor);
        g.fillCircle(0, -32, 18);
        // 额头皱纹
        g.lineStyle(1.5, 0x5A6A4F, 0.5);
        g.beginPath();
        g.moveTo(-10, -40);
        g.lineTo(10, -40);
        g.strokePath();
        g.beginPath();
        g.moveTo(-8, -36);
        g.lineTo(8, -36);
        g.strokePath();
        // 眼睛 - 凶狠
        g.fillStyle(0xFFFFFF);
        g.fillCircle(-7, -34, 5);
        g.fillCircle(7, -34, 5);
        g.fillStyle(0xCC0000);
        g.fillCircle(-6, -34, 3);
        g.fillCircle(8, -34, 3);
        // 眉毛 - 愤怒
        g.lineStyle(3, 0x3A2A1A);
        g.beginPath();
        g.moveTo(-12, -42);
        g.lineTo(-4, -38);
        g.strokePath();
        g.beginPath();
        g.moveTo(12, -42);
        g.lineTo(4, -38);
        g.strokePath();
        // 嘴 - 大嘴
        g.fillStyle(0x2A1A0A);
        g.fillEllipse(0, -22, 14, 8);
        // 牙齿
        g.fillStyle(0xFFFFFF);
        g.fillRect(-5, -26, 3, 4);
        g.fillRect(2, -26, 3, 4);

        // 左臂 - 巨大
        g.fillStyle(skinColor);
        g.fillRect(-28, -12, 12, 28);
        g.fillStyle(0x5A6A4F, 0.3);
        g.fillRect(-26, -8, 8, 20);

        // 右臂 - 持武器
        g.fillStyle(skinColor);
        g.fillRect(16, -16, 12, 24);

        // 武器 - 电线杆
        g.fillStyle(0x8B8B8B);
        g.fillRect(22, -60, 6, 70);
        // 电线杆纹理
        g.lineStyle(1, 0x6A6A6A, 0.5);
        g.beginPath();
        g.moveTo(24, -55);
        g.lineTo(24, 8);
        g.strokePath();
        // 电线杆横臂
        g.fillStyle(0x7A7A7A);
        g.fillRect(18, -58, 18, 4);
        g.fillRect(18, -52, 18, 4);
        // 电线
        g.lineStyle(1, 0x333333, 0.5);
        g.beginPath();
        g.moveTo(18, -56);
        g.lineTo(36, -56);
        g.strokePath();

        // 左腿
        g.fillStyle(0x4A4A2A);
        g.fillRoundedRect(-14, 18, 10, 28, 3);
        g.fillStyle(0x3A3A1A);
        g.fillRoundedRect(-16, 42, 14, 6, 2);

        // 右腿
        g.fillStyle(0x4A4A2A);
        g.fillRoundedRect(4, 18, 10, 28, 3);
        g.fillStyle(0x3A3A1A);
        g.fillRoundedRect(2, 42, 14, 6, 2);

        this.add(g);
        this.graphics = g;
    }

    update(time, delta) {
        if (!this.alive) return;

        // HP减半时投出小鬼
        if (!this.impDropped && this.hp <= this.maxHp / 2) {
            this.dropImp();
        }

        // 砸击计时
        if (this.eating) {
            this.smashTimer += delta;
            if (this.smashTimer >= this.smashRate) {
                this.smashTimer = 0;
                this.smashAttack();
            }
        }
    }

    dropImp() {
        this.impDropped = true;

        // 抛出小鬼动画
        const impStartX = this.x + 30;
        const impStartY = this.y - 30;
        const impTargetX = this.x - 120;
        const impTargetY = this.y;

        // 创建小鬼僵尸
        const imp = new ImpZombie(this.scene, impStartX, impStartY, this.row);
        this.scene.zombies.push(imp);
        imp.body.setVelocityX(0);
        imp.body.setVelocityY(0);

        // 抛掷弧线动画
        this.scene.tweens.add({
            targets: imp,
            x: impTargetX,
            duration: 800,
            ease: 'Quad.easeOut'
        });
        this.scene.tweens.add({
            targets: imp,
            y: impTargetY - 80,
            duration: 400,
            yoyo: true,
            ease: 'Quad.easeOut'
        });

        // 抛出特效
        const throwEffect = this.scene.add.graphics();
        throwEffect.setDepth(100);
        throwEffect.lineStyle(2, 0xFF4444, 0.6);
        throwEffect.beginPath();
        throwEffect.arc(this.x + 15, this.y - 20, 20, Math.PI * 1.5, Math.PI * 0.5);
        throwEffect.strokePath();
        this.scene.tweens.add({
            targets: throwEffect,
            alpha: 0,
            duration: 400,
            onComplete: () => { throwEffect.destroy(); }
        });

        // 受伤变红
        this.applyTint(0xFF6666);
        this.scene.time.delayedCall(200, () => {
            if (this.alive) this.clearTint();
        });
    }

    smashAttack() {
        // 砸击动画 - 挥动电线杆
        this.smashing = true;

        // 电线杆挥击
        this.scene.tweens.add({
            targets: this.graphics,
            angle: -30,
            duration: 150,
            ease: 'Quad.easeIn',
            onComplete: () => {
                this.scene.tweens.add({
                    targets: this.graphics,
                    angle: 0,
                    duration: 100,
                    ease: 'Quad.easeOut',
                    onComplete: () => {
                        this.smashing = false;
                    }
                });
            }
        });

        // 砸击范围伤害
        const cell = gridManager.getCellFromPosition(this.x - 10, this.y);
        if (cell && cell.row === this.row) {
            const plant = gridManager.getPlant(cell.row, cell.col);
            if (plant && plant.alive) {
                plant.takeDamage(this.smashDamage);
                // 砸击地面震动效果
                this.scene.cameras.main.shake(100, 0.005);
                // 碎片效果
                for (let i = 0; i < 4; i++) {
                    const debris = this.scene.add.graphics();
                    debris.fillStyle(0x5A4020);
                    debris.fillRect(-2, -1, 4, 2);
                    debris.setPosition(plant.x, plant.y);
                    const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI;
                    this.scene.tweens.add({
                        targets: debris,
                        x: plant.x + Math.cos(angle) * 30,
                        y: plant.y + Math.sin(angle) * 20 - 15,
                        alpha: 0,
                        duration: 400,
                        onComplete: () => { debris.destroy(); }
                    });
                }
            }
        }
    }

    // 巨人僵尸免疫减速
    applySlow() {
        // 不受减速影响
    }

    die() {
        this.alive = false;
        this.body.setVelocityX(0);

        if (this.walkTween) this.walkTween.stop();
        if (this.eatTween) this.eatTween.stop();

        // 通知场景
        if (this.scene && this.scene.onZombieKilled) {
            this.scene.onZombieKilled();
        }

        // 死亡动画 - 缓慢倒下
        this.scene.tweens.add({
            targets: this,
            angle: 90,
            y: this.y + 20,
            alpha: 0.3,
            duration: 1200,
            ease: 'Quad.easeIn',
            onComplete: () => {
                // 倒地震动
                this.scene.cameras.main.shake(200, 0.008);
                this.destroy();
            }
        });
    }
}
