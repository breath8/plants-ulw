// Repeater.js - 双发射手
class Repeater extends Plant {
    constructor(scene, x, y, row, col) {
        super(scene, x, y, row, col, 'repeater');
        this.fireRate = PLANT_CONFIG.repeater.fireRate;
        this.fireTimer = 0;
        this.secondShotDelay = 150; // 第二发延迟
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
        const zombies = this.scene.zombies.filter(z => z.alive && z.row === this.row && z.x > this.x);
        if (zombies.length > 0) {
            // 第一发
            const pea1 = new Projectile(this.scene, this.x + 20, this.y - 5, this.row, 'pea');
            this.scene.projectiles.push(pea1);

            // 第二发（延迟）
            this.scene.time.delayedCall(this.secondShotDelay, () => {
                if (this.alive) {
                    const pea2 = new Projectile(this.scene, this.x + 20, this.y - 5, this.row, 'pea');
                    this.scene.projectiles.push(pea2);
                }
            });

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
