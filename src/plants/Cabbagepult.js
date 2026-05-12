// Cabbagepult.js - 卷心菜投手（屋顶投掷植物）
// 弧线投掷卷心菜，造成中等伤害，越过障碍物
class Cabbagepult extends Plant {
    constructor(scene, x, y, row, col) {
        super(scene, x, y, row, col, 'cabbagepult');
        this.fireRate = PLANT_CONFIG.cabbagepult.fireRate;
        this.damage = PLANT_CONFIG.cabbagepult.damage;
        this.fireTimer = 0;
        this.loadTime = 0;
        this.loaded = true;
    }

    createVisual(type) {
        const g = this.scene.add.graphics();
        // 底座 - 花盆基座
        g.fillStyle(0x8B6914);
        g.fillEllipse(0, 18, 40, 14);
        // 投射臂支架
        g.fillStyle(0x6B4F10);
        g.fillRect(-3, 2, 6, 20);
        // 投射臂
        g.fillStyle(0x8B6914);
        g.fillRoundedRect(-18, -4, 36, 6, 2);
        // 投射勺
        g.fillStyle(0x7A5A10);
        g.fillEllipse(14, -8, 16, 10);
        // 卷心菜（在勺子中）
        g.fillStyle(0x4CAF50);
        g.fillCircle(14, -10, 10);
        g.fillStyle(0x66BB6A, 0.6);
        g.fillCircle(12, -12, 5);
        // 卷心菜纹理
        g.lineStyle(1, 0x388E3C, 0.5);
        g.beginPath();
        g.moveTo(14, -16);
        g.lineTo(14, -6);
        g.strokePath();
        g.beginPath();
        g.moveTo(9, -10);
        g.lineTo(19, -10);
        g.strokePath();
        // 叶子装饰
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

        // 装填计时
        if (!this.loaded) {
            this.loadTime += delta;
            if (this.loadTime >= 500) {
                this.loaded = true;
                this.loadTime = 0;
            }
        }

        this.fireTimer += delta;
        if (this.fireTimer >= this.fireRate && this.loaded) {
            this.fireTimer = 0;
            this.shoot();
        }
    }

    shoot() {
        // 检查行内是否有僵尸
        const zombies = this.scene.zombies.filter(z =>
            z.alive && z.row === this.row && z.x > this.x
        );
        if (zombies.length > 0) {
            // 生成投掷物 - 卷心菜弹
            const cabbage = new CabbageProjectile(this.scene, this.x + 16, this.y - 10, this.row, this.damage);
            this.scene.projectiles.push(cabbage);
            this.loaded = false;

            // 投掷动画 - 投臂上扬
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

// CabbageProjectile - 卷心菜弹投掷物
class CabbageProjectile extends Phaser.GameObjects.Container {
    constructor(scene, x, y, row, damage) {
        super(scene, x, y);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.row = row;
        this.damage = damage;
        this.speed = 200;
        this.alive = true;

        // 创建视觉
        const g = scene.add.graphics();
        g.fillStyle(0x4CAF50);
        g.fillCircle(0, 0, 10);
        g.fillStyle(0x66BB6A, 0.6);
        g.fillCircle(-3, -3, 5);
        g.lineStyle(1, 0x388E3C, 0.5);
        g.beginPath();
        g.moveTo(0, -8);
        g.lineTo(0, 8);
        g.strokePath();
        this.add(g);

        this.body.setVelocityX(this.speed);
        this.body.setSize(16, 16);
    }

    update(time, delta) {
        if (!this.alive) return;
        // 检测与僵尸碰撞
        this.scene.zombies.forEach(zombie => {
            if (!zombie.alive || zombie.row !== this.row) return;
            const dist = Phaser.Math.Distance.Between(this.x, this.y, zombie.x, zombie.y);
            if (dist < 25) {
                zombie.takeDamage(this.damage);
                this.hit();
            }
        });
        // 超出屏幕
        if (this.x > GAME_WIDTH + 30) {
            this.alive = false;
            this.destroy();
        }
    }

    hit() {
        if (!this.alive) return;
        this.alive = false;
        // 击中特效
        const hitGfx = this.scene.add.graphics();
        for (let i = 0; i < 4; i++) {
            const angle = Math.random() * Math.PI * 2;
            const dist = 8 + Math.random() * 10;
            hitGfx.fillStyle(0x4CAF50, 0.7);
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
