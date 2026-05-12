// Projectile.js - 投射物实体
class Projectile extends Phaser.GameObjects.Container {
    constructor(scene, x, y, row, type = 'pea') {
        super(scene, x, y);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.row = row;
        this.type = type;
        this.speed = 300;
        this.alive = true;

        // 根据类型设置属性
        if (type === 'snowpea') {
            this.damage = 20;
            this.slowDuration = 5000;
            this.slowFactor = 0.5;
        } else {
            this.damage = 20;
            this.slowDuration = 0;
            this.slowFactor = 1;
        }

        this.createVisual();

        // 设置物理
        this.body.setVelocityX(this.speed);
        this.body.setSize(16, 16);

        // 设置边界检查
        this.checkBounds = scene.time.addEvent({
            delay: 500,
            callback: () => {
                if (this.x > GAME_WIDTH + 20) {
                    this.destroy();
                }
            },
            loop: true
        });
    }

    createVisual() {
        const g = this.scene.add.graphics();
        if (this.type === 'snowpea') {
            // 冰豌豆 - 蓝色
            g.fillStyle(0x88CCFF);
            g.fillCircle(0, 0, 8);
            g.fillStyle(0xB8E8FF, 0.6);
            g.fillCircle(-2, -2, 3);
            g.lineStyle(1, 0xB8E8FF, 0.4);
            g.strokeCircle(0, 0, 6);
        } else {
            // 普通豌豆 - 绿色
            g.fillStyle(0x6ABF3A);
            g.fillCircle(0, 0, 8);
            g.fillStyle(0x8ADF5A, 0.6);
            g.fillCircle(-2, -2, 3);
        }
        this.add(g);
    }

    hit() {
        if (!this.alive) return;
        this.alive = false;
        if (this.checkBounds) this.checkBounds.destroy();

        // 播放命中音效
        audioManager.playSFX('sfx_hit', 0.5);

        // 击中特效 - 使用简单图形代替粒子
        const hitGfx = this.scene.add.graphics();
        const color = this.type === 'snowpea' ? 0x88CCFF : 0x6ABF3A;
        for (let i = 0; i < 5; i++) {
            const angle = Math.random() * Math.PI * 2;
            const dist = 10 + Math.random() * 15;
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
