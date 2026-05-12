// Fumeshroom.js - 大喷菇（毒烟穿透射击）
class Fumeshroom extends Plant {
    constructor(scene, x, y, row, col) {
        super(scene, x, y, row, col, 'fumeshroom');
        this.damage = PLANT_CONFIG.fumeshroom.damage;
        this.fireRate = PLANT_CONFIG.fumeshroom.fireRate;
        this.fireTimer = 0;
    }

    createVisual(type) {
        const g = this.scene.add.graphics();
        // 茎
        g.fillStyle(0x5A7A3A);
        g.fillRect(-4, 15, 8, 20);
        // 叶子
        g.fillStyle(0x4A6A2A);
        g.fillEllipse(-12, 25, 16, 6);
        g.fillEllipse(12, 28, 16, 6);
        // 菌帽（大）
        g.fillStyle(0x7B9B4A);
        g.fillEllipse(0, 0, 52, 44);
        // 菌帽高光
        g.fillStyle(0x8BAB5A, 0.6);
        g.fillEllipse(-6, -6, 34, 26);
        // 喷嘴
        g.fillStyle(0x4A6A2A);
        g.fillEllipse(0, 14, 24, 14);
        g.fillStyle(0x3A5A1A);
        g.fillEllipse(0, 14, 16, 8);
        // 毒气云效果
        g.fillStyle(0x8BAB5A, 0.3);
        g.fillCircle(28, 0, 8);
        g.fillCircle(36, -6, 5);
        g.fillCircle(32, 6, 4);
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
        // 射程3格
        const maxDist = 3 * GRID.cellWidth;
        const zombies = this.scene.zombies.filter(z =>
            z.alive && z.row === this.row && z.x > this.x && (z.x - this.x) <= maxDist
        );
        if (zombies.length > 0) {
            const fume = new FumeProjectile(this.scene, this.x + 20, this.y - 5, this.row);
            this.scene.projectiles.push(fume);
            // 射击动画
            this.scene.tweens.add({
                targets: this,
                scaleX: 1.15,
                scaleY: 0.85,
                duration: 100,
                yoyo: true
            });
        }
    }
}

// FumeProjectile.js - 毒烟投射物（穿透）
class FumeProjectile extends Phaser.GameObjects.Container {
    constructor(scene, x, y, row) {
        super(scene, x, y);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.row = row;
        this.type = 'fume';
        this.damage = PLANT_CONFIG.fumeshroom.damage;
        this.speed = 200;
        this.alive = true;
        this.hitZombies = new Set(); // 已命中的僵尸，避免重复伤害

        this.createVisual();

        // 设置物理
        this.body.setVelocityX(this.speed);
        this.body.setSize(24, 24);

        // 生命周期 - 穿透射程距离后消失
        this.maxDist = 3 * GRID.cellWidth + 40;
        this.startX = x;
    }

    createVisual() {
        const g = this.scene.add.graphics();
        // 毒烟云
        g.fillStyle(0x8BAB5A, 0.5);
        g.fillCircle(0, 0, 12);
        g.fillStyle(0x9BCB6A, 0.3);
        g.fillCircle(-4, -3, 8);
        g.fillCircle(5, 2, 7);
        g.fillStyle(0xAADB7A, 0.2);
        g.fillCircle(2, -5, 6);
        this.add(g);
    }

    update(time, delta) {
        if (!this.alive) return;

        // 检查距离是否超过射程
        if (this.x - this.startX > this.maxDist) {
            this.destroy();
            return;
        }

        // 穿透碰撞检测
        const zombies = this.scene.zombies;
        for (let j = zombies.length - 1; j >= 0; j--) {
            const zombie = zombies[j];
            if (!zombie || !zombie.active || !zombie.alive) continue;
            if (zombie.row !== this.row) continue;
            if (this.hitZombies.has(zombie)) continue; // 跳过已命中的

            const dist = Math.abs(this.x - zombie.x);
            const yDist = Math.abs(this.y - zombie.y);
            if (dist < 25 && yDist < 40) {
                zombie.takeDamage(this.damage);
                this.hitZombies.add(zombie);

                // 命中特效
                const hitGfx = this.scene.add.graphics();
                hitGfx.fillStyle(0x8BAB5A, 0.5);
                hitGfx.fillCircle(this.x, this.y, 15);
                this.scene.tweens.add({
                    targets: hitGfx,
                    alpha: 0,
                    scaleX: 1.5,
                    scaleY: 1.5,
                    duration: 200,
                    onComplete: () => hitGfx.destroy()
                });
            }
        }
    }

    hit() {
        // 不调用 destroy，因为需要穿透
    }

    destroy() {
        this.alive = false;
        if (this.checkBounds) this.checkBounds.destroy();
        super.destroy();
    }
}
