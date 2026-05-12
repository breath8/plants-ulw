// Scaredyshroom.js - 胆小菇（远程射击，僵尸靠近时躲藏）
class Scaredyshroom extends Plant {
    constructor(scene, x, y, row, col) {
        super(scene, x, y, row, col, 'scaredyshroom');
        this.damage = PLANT_CONFIG.scaredyshroom.damage;
        this.fireRate = PLANT_CONFIG.scaredyshroom.fireRate;
        this.hideRange = PLANT_CONFIG.scaredyshroom.hideRange;
        this.fireTimer = 0;
        this.hidden = false;
        this.visible = true;
    }

    createVisual(type) {
        const g = this.scene.add.graphics();
        // 茎
        g.fillStyle(0x5A8AAA);
        g.fillRect(-4, 15, 8, 20);
        // 叶子
        g.fillStyle(0x4A7A9A);
        g.fillEllipse(-12, 25, 16, 6);
        g.fillEllipse(12, 28, 16, 6);
        // 菌帽
        g.fillStyle(0x6A9ABA);
        g.fillEllipse(0, 0, 44, 36);
        // 菌帽高光
        g.fillStyle(0x8ABACA, 0.6);
        g.fillEllipse(-4, -4, 28, 20);
        // 害怕的眼睛
        g.fillStyle(0xFFFFFF);
        g.fillEllipse(-8, -2, 10, 12);
        g.fillEllipse(8, -2, 10, 12);
        g.fillStyle(0x000000);
        g.fillCircle(-7, -1, 3);
        g.fillCircle(9, -1, 3);
        // 害怕的嘴
        g.fillStyle(0x3A6A8A);
        g.fillEllipse(0, 10, 8, 6);
        // 汗珠
        g.fillStyle(0xAAE0FF);
        g.fillEllipse(18, -8, 3, 5);
        this.add(g);
        this.graphics = g;

        // 缩小的隐藏状态图形
        this.hiddenGraphics = this.scene.add.graphics();
        const hg = this.hiddenGraphics;
        // 缩小版 - 只露出菌帽顶部
        hg.fillStyle(0x6A9ABA);
        hg.fillEllipse(0, 8, 44, 20);
        hg.fillStyle(0x8ABACA, 0.6);
        hg.fillEllipse(-4, 4, 28, 12);
        hg.setVisible(false);
        this.add(hg);
    }

    update(time, delta) {
        if (!this.alive) return;

        // 检测是否有僵尸在hideRange内
        const nearbyZombies = this.scene.zombies.filter(z =>
            z.alive && z.row === this.row &&
            Math.abs(z.x - this.x) < this.hideRange
        );

        if (nearbyZombies.length > 0 && !this.hidden) {
            this.hide();
        } else if (nearbyZombies.length === 0 && this.hidden) {
            this.show();
        }

        // 只有在可见状态下才能射击
        if (!this.hidden) {
            this.fireTimer += delta;
            if (this.fireTimer >= this.fireRate) {
                this.fireTimer = 0;
                this.shoot();
            }
        }
    }

    hide() {
        this.hidden = true;
        if (this.graphics) this.graphics.setVisible(false);
        if (this.hiddenGraphics) this.hiddenGraphics.setVisible(true);
    }

    show() {
        this.hidden = false;
        if (this.graphics) this.graphics.setVisible(true);
        if (this.hiddenGraphics) this.hiddenGraphics.setVisible(false);
    }

    shoot() {
        // 远程射击（无射程限制）
        const zombies = this.scene.zombies.filter(z =>
            z.alive && z.row === this.row && z.x > this.x
        );
        if (zombies.length > 0) {
            const spore = new Projectile(this.scene, this.x + 20, this.y - 5, this.row, 'pea');
            this.scene.projectiles.push(spore);
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
