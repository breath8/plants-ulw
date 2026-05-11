// Peashooter.js - 豌豆射手
class Peashooter extends Plant {
    constructor(scene, x, y, row, col) {
        super(scene, x, y, row, col, 'peashooter');
        this.fireRate = PLANT_CONFIG.peashooter.fireRate;
        this.fireTimer = 0;
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
        // 检查行内是否有僵尸
        const zombies = this.scene.zombies.filter(z => z.alive && z.row === this.row && z.x > this.x);
        if (zombies.length > 0) {
            const pea = new Projectile(this.scene, this.x + 20, this.y - 5, this.row, 'pea');
            this.scene.projectiles.push(pea);
            // 射击动画
            this.scene.tweens.add({
                targets: this,
                scaleX: 1.1,
                scaleY: 0.9,
                duration: 80,
                yoyo: true
            });
        }
    }
}
