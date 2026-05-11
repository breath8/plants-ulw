// PotatoMine.js - 土豆地雷
class PotatoMine extends Plant {
    constructor(scene, x, y, row, col) {
        super(scene, x, y, row, col, 'potatomine');
        this.armTime = PLANT_CONFIG.potatomine.armTime;
        this.armed = false;
        this.armTimer = 0;
        this.alpha = 0.7; // 未激活时半透明
    }

    update(time, delta) {
        if (!this.alive) return;

        if (!this.armed) {
            this.armTimer += delta;
            if (this.armTimer >= this.armTime) {
                this.arm();
            }
            return;
        }

        // 检测同一格的僵尸
        const zombies = this.scene.zombies.filter(z => {
            if (!z.alive || z.row !== this.row) return false;
            const dist = Math.abs(z.x - this.x);
            return dist < 40;
        });

        if (zombies.length > 0) {
            this.explode(zombies);
        }
    }

    arm() {
        this.armed = true;
        this.setAlpha(1);

        // 弹出动画
        this.scene.tweens.add({
            targets: this,
            y: this.y - 10,
            duration: 300,
            ease: 'Back.easeOut'
        });
    }

    explode(zombies) {
        const damage = PLANT_CONFIG.potatomine.damage;

        zombies.forEach(z => {
            if (z.alive) {
                z.takeDamage(damage);
            }
        });

        // 爆炸特效
        const explosion = this.scene.add.graphics();
        explosion.fillStyle(0xFF6600, 0.5);
        explosion.fillCircle(this.x, this.y, 50);
        this.scene.tweens.add({
            targets: explosion,
            alpha: 0,
            scaleX: 1.3,
            scaleY: 1.3,
            duration: 300,
            onComplete: () => explosion.destroy()
        });

        this.die();
    }
}
