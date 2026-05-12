// Hypnoshroom.js - 催眠菇（被吃后催眠僵尸）
class Hypnoshroom extends Plant {
    constructor(scene, x, y, row, col) {
        super(scene, x, y, row, col, 'hypnoshroom');
        this.hypnotized = false;
    }

    createVisual(type) {
        const g = this.scene.add.graphics();
        // 茎
        g.fillStyle(0x8A5AA0);
        g.fillRect(-4, 15, 8, 20);
        // 叶子
        g.fillStyle(0x7A4A90);
        g.fillEllipse(-12, 25, 16, 6);
        g.fillEllipse(12, 28, 16, 6);
        // 菌帽
        g.fillStyle(0xB060D0);
        g.fillEllipse(0, 0, 48, 40);
        // 菌帽高光
        g.fillStyle(0xC080E0, 0.6);
        g.fillEllipse(-6, -6, 30, 22);
        // 螺旋纹（催眠效果）
        g.lineStyle(2, 0xFFFFFF, 0.8);
        g.beginPath();
        g.arc(0, -2, 6, 0, Math.PI * 1.5);
        g.strokePath();
        g.beginPath();
        g.arc(0, -2, 11, Math.PI * 0.5, Math.PI * 2.2);
        g.strokePath();
        g.beginPath();
        g.arc(0, -2, 16, Math.PI * 1.0, Math.PI * 2.8);
        g.strokePath();
        this.add(g);
        this.graphics = g;
    }

    // 重写takeDamage - 拦截僵尸吃它的伤害，触发催眠
    takeDamage(amount) {
        if (!this.alive || this.hypnotized) return;

        // 找到正在吃这个植物的僵尸
        const eater = this.scene.zombies.find(z =>
            z.alive && z.eating && z.currentPlant === this
        );

        // 触发催眠
        this.hypnotize(eater);

        // 自毁
        this.hp = 0;
        this.die();
    }

    hypnotize(zombie) {
        // 催眠特效 - 扩散光环
        const effect = this.scene.add.graphics();
        effect.lineStyle(3, 0xB060D0, 0.8);
        effect.strokeCircle(0, 0, 25);
        effect.setPosition(this.x, this.y);

        this.scene.tweens.add({
            targets: effect,
            scaleX: 2,
            scaleY: 2,
            alpha: 0,
            duration: 500,
            onComplete: () => effect.destroy()
        });

        // 催眠僵尸 - 使其反向行走（为玩家战斗）
        if (zombie && zombie.alive) {
            zombie.stopEating();
            zombie.eating = false;
            zombie.currentPlant = null;

            // 反向行走 - 僵尸改为向右走（朝屏幕外方向）
            zombie.speed = zombie.baseSpeed;
            zombie.body.setVelocityX(zombie.baseSpeed);

            // 改变色调表示被催眠
            zombie.applyTint(0xFF88FF);

            // 标记为已催眠
            zombie.hypnotized = true;
        }
    }
}
