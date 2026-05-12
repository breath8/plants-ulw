// JackboxZombie.js - 携带惊吓盒的僵尸
// 手持惊吓盒，接近植物时有几率引爆，对周围植物造成大量伤害
class JackboxZombie extends Zombie {
    constructor(scene, x, y, row) {
        super(scene, x, y, row, 'jackbox');
        this.hasBox = true;
        this.explodeChance = 0.02; // 每帧引爆概率
        this.explodeRange = 1; // 爆炸范围（格数）
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

        if (this.hasBox) {
            // 惊吓盒（左手持）
            // 盒子本体
            g.fillStyle(0xFF4444);
            g.fillRoundedRect(-28, -16, 18, 22, 3);
            g.fillStyle(0xFF6666, 0.5);
            g.fillRoundedRect(-26, -14, 10, 10, 2);
            // 盒子装饰（条纹）
            g.fillStyle(0xFFCC00);
            g.fillRect(-27, -8, 16, 2);
            g.fillRect(-27, -2, 16, 2);
            // 盒子盖（弹开的弹簧暗示）
            g.fillStyle(0xFF4444);
            g.fillRoundedRect(-28, -24, 18, 8, 2);
            // 弹簧线
            g.lineStyle(1.5, 0xAAAAAA);
            g.beginPath();
            g.moveTo(-19, -16);
            g.lineTo(-16, -20);
            g.lineTo(-13, -16);
            g.lineTo(-10, -20);
            g.strokePath();
            // 盒子上的"?"标记
            g.fillStyle(0xFFFFFF);
            g.fillRect(-20, -12, 3, 5);
            g.fillCircle(-18.5, -6, 1.5);
        }
    }

    update(time, delta) {
        if (!this.alive) return;

        // 爆炸检查
        if (this.hasBox && !this.eating) {
            // 靠近植物时有几率引爆
            const cell = gridManager.getCellFromPosition(this.x - 10, this.y);
            if (cell) {
                const plant = gridManager.getPlant(cell.row, cell.col);
                if (plant && plant.alive) {
                    if (Math.random() < this.explodeChance) {
                        this.explode();
                        return;
                    }
                }
            }
        }

        // 调用基类更新
        super.update(time, delta);
    }

    explode() {
        this.hasBox = false;
        this.redrawVisual();

        // 爆炸范围内的植物受到大量伤害
        const explosionDamage = ZOMBIE_CONFIG.jackbox.damage;
        const cell = gridManager.getCellFromPosition(this.x, this.y);
        if (cell) {
            for (let r = cell.row - this.explodeRange; r <= cell.row + this.explodeRange; r++) {
                for (let c = cell.col - this.explodeRange; c <= cell.col + this.explodeRange; c++) {
                    const plant = gridManager.getPlant(r, c);
                    if (plant && plant.alive) {
                        plant.takeDamage(explosionDamage);
                    }
                }
            }
        }

        // 爆炸视觉效果
        const explosion = this.scene.add.graphics();
        explosion.setDepth(10);
        explosion.fillStyle(0xFF6600, 0.8);
        explosion.fillCircle(0, 0, 40);
        explosion.fillStyle(0xFFCC00, 0.6);
        explosion.fillCircle(0, 0, 25);
        explosion.fillStyle(0xFFFFFF, 0.4);
        explosion.fillCircle(0, 0, 12);
        explosion.setPosition(this.x, this.y - 20);

        this.scene.tweens.add({
            targets: explosion,
            scaleX: 2,
            scaleY: 2,
            alpha: 0,
            duration: 400,
            onComplete: () => {
                explosion.destroy();
            }
        });

        // 自身也受到一定伤害
        this.takeDamage(200);
    }

    redrawVisual() {
        if (this.graphics) {
            this.graphics.destroy();
        }
        const g = this.scene.add.graphics();
        this.drawBaseZombie(g, 'basic');
        // 没有盒子时，手臂空空的
        this.add(g);
        this.graphics = g;
    }
}
