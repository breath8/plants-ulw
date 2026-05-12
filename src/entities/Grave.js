// Grave.js - 墓碑（夜间关卡障碍物）
class Grave extends Phaser.GameObjects.Container {
    constructor(scene, x, y, row, col) {
        super(scene, x, y);
        scene.add.existing(this);

        this.scene = scene;
        this.row = row;
        this.col = col;
        this.alive = true;
        this.hp = 400;
        this.maxHp = 400;
        this.setDepth(3);

        this.createVisual();
    }

    createVisual() {
        const g = this.scene.add.graphics();

        // 墓碑底座
        g.fillStyle(0x5A5A5A);
        g.fillRect(-14, 8, 28, 18);
        g.fillStyle(0x6A6A6A);
        g.fillRect(-12, 10, 24, 14);

        // 墓碑主体（圆顶矩形）
        g.fillStyle(0x7A7A7A);
        g.fillRoundedRect(-16, -22, 32, 34, 6);

        // 墓碑顶部拱形细节
        g.fillStyle(0x8A8A8A);
        g.fillRoundedRect(-12, -18, 24, 28, 4);

        // 墓碑装饰线
        g.lineStyle(1, 0x5A5A5A, 0.5);
        g.strokeRect(-10, -14, 20, 18);

        // 墓碑文字/符号
        g.fillStyle(0x4A4A4A);
        g.fillCircle(0, -4, 3);
        g.fillRect(-1, 2, 2, 8);

        // 破损效果
        this.damageGraphics = this.scene.add.graphics();
        this.damageGraphics.setVisible(false);
        this.add(this.damageGraphics);

        this.add(g);
        this.graphics = g;
    }

    takeDamage(amount) {
        if (!this.alive) return;

        this.hp -= amount;
        if (this.hp <= 0) {
            this.destroyGrave();
            return;
        }

        // 破损效果
        if (this.hp < this.maxHp * 0.5) {
            this.damageGraphics.clear();
            this.damageGraphics.fillStyle(0xFFFFFF, 0.3);
            this.damageGraphics.fillRect(-14, -18, 6, 4);
            this.damageGraphics.setVisible(true);
        }
    }

    destroyGrave() {
        this.alive = false;

        // 清除网格占用
        gridManager.removePlant(this.row, this.col);

        // 从场景墓碑列表移除
        if (this.scene && this.scene.graves) {
            const idx = this.scene.graves.indexOf(this);
            if (idx !== -1) {
                this.scene.graves.splice(idx, 1);
            }
        }

        // 破碎动画
        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            scaleX: 0.5,
            scaleY: 0.5,
            duration: 200,
            onComplete: () => {
                this.destroy();
            }
        });
    }
}
