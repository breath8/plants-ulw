// Sunflower.js - 向日葵
class Sunflower extends Plant {
    constructor(scene, x, y, row, col) {
        super(scene, x, y, row, col, 'sunflower');
        this.sunInterval = SUN.sunflowerInterval;
        this.sunTimer = 10000; // 首次阳光较快
    }

    update(time, delta) {
        if (!this.alive) return;

        this.sunTimer += delta;
        if (this.sunTimer >= this.sunInterval) {
            this.sunTimer = 0;
            this.produceSun();
        }
    }

    produceSun() {
        const sun = new Sun(this.scene, this.x, this.y - 20, this.y + 30, false);
        this.scene.suns.push(sun);

        // 产出动画
        this.scene.tweens.add({
            targets: this,
            scaleX: 1.15,
            scaleY: 0.85,
            duration: 150,
            yoyo: true
        });
    }
}
