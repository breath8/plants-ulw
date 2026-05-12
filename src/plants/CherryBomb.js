// CherryBomb.js - 樱桃炸弹
class CherryBomb extends Plant {
    constructor(scene, x, y, row, col) {
        super(scene, x, y, row, col, 'cherrybomb');
        this.detonateTimer = 500; // 0.5秒后爆炸
        this.detonated = false;
    }

    update(time, delta) {
        if (!this.alive || this.detonated) return;

        this.detonateTimer -= delta;
        if (this.detonateTimer <= 0) {
            this.detonate();
        }
    }

    detonate() {
        this.detonated = true;
        const range = PLANT_CONFIG.cherrybomb.range;
        const damage = PLANT_CONFIG.cherrybomb.damage;

        // 播放爆炸音效
        audioManager.playSFX('sfx_explosion');

        // 爆炸范围内的僵尸
        this.scene.zombies.forEach(zombie => {
            if (!zombie.alive) return;
            const rowDiff = Math.abs(zombie.row - this.row);
            const colCell = gridManager.getCellFromPosition(zombie.x, zombie.y);
            if (colCell) {
                const colDiff = Math.abs(colCell.col - this.col);
                if (rowDiff <= range && colDiff <= range) {
                    zombie.takeDamage(damage);
                }
            }
        });

        // 爆炸特效
        const explosion = this.scene.add.graphics();
        explosion.fillStyle(0xFF4400, 0.6);
        explosion.fillCircle(this.x, this.y, 80);
        explosion.fillStyle(0xFFCC00, 0.4);
        explosion.fillCircle(this.x, this.y, 50);
        this.scene.tweens.add({
            targets: explosion,
            alpha: 0,
            scaleX: 1.5,
            scaleY: 1.5,
            duration: 400,
            onComplete: () => explosion.destroy()
        });

        // 屏幕震动
        this.scene.cameras.main.shake(300, 0.01);

        this.die();
    }
}
