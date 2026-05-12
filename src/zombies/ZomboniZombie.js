// ZomboniZombie.js - 冰车僵尸
// 驾驶冰压路机，碾碎植物并留下冰道
class ZomboniZombie extends Zombie {
    constructor(scene, x, y, row) {
        super(scene, x, y, row, 'zomboni');
        this.crushDamage = 1800; // 碾碎植物伤害
        this.iceTrailActive = true;
        this.lastTrailX = 0;
    }

    createVisual(type) {
        const g = this.scene.add.graphics();
        this.drawBaseZombie(g, type);
        this.drawAccessory(g);
        this.add(g);
        this.graphics = g;
    }

    drawAccessory(g) {
        const skinColor = 0x7B8B6F;

        // 压路机主体
        g.fillStyle(0x4444AA);
        g.fillRoundedRect(-22, -10, 44, 20, 4);

        // 挡风玻璃
        g.fillStyle(0x88BBDD, 0.6);
        g.fillRect(-18, -20, 36, 12);

        // 滚轮
        g.fillStyle(0x333333);
        g.fillRect(-24, 8, 48, 8);
        g.fillStyle(0x555555, 0.5);
        g.fillRect(-22, 10, 44, 4);

        // 滚轮条纹
        g.lineStyle(1, 0x666666);
        for (let i = 0; i < 8; i++) {
            g.beginPath();
            g.moveTo(-20 + i * 6, 8);
            g.lineTo(-20 + i * 6, 16);
            g.strokePath();
        }

        // 驾驶员（僵尸头从车顶探出）
        g.fillStyle(skinColor);
        g.fillCircle(0, -26, 10);
        g.fillStyle(0xFFFFFF);
        g.fillCircle(-4, -28, 3);
        g.fillCircle(4, -28, 3);
        g.fillStyle(0xCC0000);
        g.fillCircle(-3, -28, 1.5);
        g.fillCircle(5, -28, 1.5);
    }

    // 重写植物检测 - 冰车直接碾碎植物而非啃食
    checkForPlant() {
        const cell = gridManager.getCellFromPosition(this.x - 10, this.y);
        if (cell && cell.row === this.row) {
            const plant = gridManager.getPlant(cell.row, cell.col);
            if (plant && plant.alive) {
                // 碾碎植物
                plant.takeDamage(this.crushDamage);
                if (!plant.alive) {
                    // 碾碎特效
                    const crushEffect = this.scene.add.graphics();
                    crushEffect.fillStyle(0x88AA44, 0.5);
                    crushEffect.fillCircle(plant.x, plant.y, 20);
                    this.scene.tweens.add({
                        targets: crushEffect,
                        alpha: 0,
                        duration: 300,
                        onComplete: () => crushEffect.destroy()
                    });
                }
            }
        }
    }

    update(time, delta) {
        if (!this.alive) return;

        // 冰道效果 - 每隔一段距离留下冰痕
        if (this.iceTrailActive && Math.abs(this.x - this.lastTrailX) > 40) {
            this.createIceTrail();
            this.lastTrailX = this.x;
        }

        // 减速效果更新
        if (this.slowed) {
            this.slowTimer -= delta;
            if (this.slowTimer <= 0) {
                this.slowed = false;
                this.speed = this.baseSpeed;
                this.body.setVelocityX(-this.speed);
            }
        }

        // 检测前方植物并碾碎
        this.checkForPlant();

        // 检查是否到达房屋
        if (this.x < GRID.startX - 20) {
            this.reachHouse();
        }
    }

    createIceTrail() {
        const trail = this.scene.add.graphics();
        trail.fillStyle(0xAADDFF, 0.4);
        trail.fillRect(this.x, this.y - 45, 60, 90);
        trail.lineStyle(1, 0x88BBEE, 0.3);
        trail.strokeRect(this.x, this.y - 45, 60, 90);
        this.scene.tweens.add({
            targets: trail,
            alpha: 0.1,
            duration: 8000,
            onComplete: () => trail.destroy()
        });
    }
}
