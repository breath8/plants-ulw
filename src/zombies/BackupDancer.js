// BackupDancer.js - 伴舞僵尸
// 特性：由迪斯科僵尸召唤，死亡时不会触发游戏场景击杀计数，主人死亡时一同死亡
class BackupDancer extends Zombie {
    constructor(scene, x, y, row, master) {
        super(scene, x, y, row, 'backupdancer');
        this.master = master;
    }

    createVisual(type) {
        const g = this.scene.add.graphics();
        this.drawBaseZombie(g, type);
        this.drawAccessory(g);
        this.add(g);
        this.graphics = g;
    }

    drawAccessory(g) {
        // 80年代迪斯科风格 - 头带 + 亮色服装
        const headbandColor = 0xFF4500;
        const shirtColor = 0x9932CC;

        // 头带
        g.fillStyle(headbandColor);
        g.fillRoundedRect(-14, -36, 28, 4, 1);

        // 紫色衬衫
        g.fillStyle(shirtColor);
        g.fillRoundedRect(-12, -16, 24, 28, 3);

        // 淡紫领带
        g.fillStyle(0xDDA0DD);
        g.fillTriangle(0, -16, -4, 0, 4, 0);
    }

    update(time, delta) {
        if (!this.alive) return;

        // 如果主人已死亡，自己也死亡
        if (this.master && !this.master.alive) {
            this.die();
            return;
        }

        super.update(time, delta);
    }

    die() {
        // 通知主人移除自己
        if (this.master && this.master.alive) {
            this.master.removeDancer(this);
        }

        // 伴舞僵尸死亡不触发场景击杀计数（因为是附带死亡）
        this.alive = false;
        this.body.setVelocityX(0);

        if (this.walkTween) this.walkTween.stop();
        if (this.eatTween) this.eatTween.stop();

        // 死亡动画
        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            angle: 90,
            y: this.y + 20,
            duration: 500,
            onComplete: () => {
                this.destroy();
            }
        });
    }
}
