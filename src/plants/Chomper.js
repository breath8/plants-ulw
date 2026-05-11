// Chomper.js - 大嘴花
class Chomper extends Plant {
    constructor(scene, x, y, row, col) {
        super(scene, x, y, row, col, 'chomper');
        this.chewTime = PLANT_CONFIG.chomper.chewTime;
        this.chewing = false;
        this.chewTimer = 0;
        this.attackRange = 1; // 相邻1格
    }

    update(time, delta) {
        if (!this.alive) return;

        if (this.chewing) {
            this.chewTimer += delta;
            if (this.chewTimer >= this.chewTime) {
                this.chewing = false;
                this.chewTimer = 0;
            }
            return;
        }

        // 检测前方僵尸
        const zombies = this.scene.zombies.filter(z => {
            if (!z.alive || z.row !== this.row) return false;
            const dist = z.x - this.x;
            return dist > 0 && dist < 80;
        });

        if (zombies.length > 0) {
            this.chomp(zombies[0]);
        }
    }

    chomp(zombie) {
        this.chewing = true;
        zombie.takeDamage(PLANT_CONFIG.chomper.damage);

        // 吞噬动画
        this.scene.tweens.add({
            targets: this,
            scaleX: 1.3,
            scaleY: 0.8,
            duration: 200,
            yoyo: true,
            repeat: 1
        });
    }
}
