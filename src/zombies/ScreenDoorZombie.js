// ScreenDoorZombie.js - 铁门僵尸
// 特性：手持铁门，可吸收投射物伤害，铁门被摧毁前投射物不会伤害僵尸本体
class ScreenDoorZombie extends Zombie {
    constructor(scene, x, y, row) {
        super(scene, x, y, row, 'screendoor');
        
        this.screenDoorHp = 560;
        this.maxScreenDoorHp = 560;
        this.hasScreenDoor = true;
    }

    createVisual(type) {
        const g = this.scene.add.graphics();
        this.drawBaseZombie(g, type);
        this.drawAccessory(g);
        this.add(g);
        this.graphics = g;
    }

    drawAccessory(g) {
        // 铁门（遮挡在身体前方）
        if (this.hasScreenDoor) {
            // 门框
            g.fillStyle(0x8B4513);
            g.fillRoundedRect(12, -20, 20, 50, 2);
            // 门内网格
            g.fillStyle(0x555555, 0.3);
            g.fillRect(14, -18, 16, 46);
            // 网格线
            g.lineStyle(0.5, 0x777777);
            for (let i = 0; i < 5; i++) {
                g.beginPath();
                g.moveTo(14, -14 + i * 9);
                g.lineTo(30, -14 + i * 9);
                g.strokePath();
            }
            for (let i = 0; i < 3; i++) {
                g.beginPath();
                g.moveTo(18 + i * 5, -18);
                g.lineTo(18 + i * 5, 28);
                g.strokePath();
            }
        }
    }

    takeDamage(amount, slow = false) {
        if (!this.alive) return;

        // 如果铁门还在，投射物伤害由铁门吸收
        if (this.hasScreenDoor) {
            this.screenDoorHp -= amount;

            // 铁门受伤闪烁效果
            this.scene.tweens.add({
                targets: this,
                alpha: 0.7,
                duration: 30,
                yoyo: true
            });

            // 铁门被摧毁
            if (this.screenDoorHp <= 0) {
                this.destroyScreenDoor();
            }
            return; // 投射物伤害被铁门吸收，不伤害本体
        }

        // 铁门已毁，正常受伤
        super.takeDamage(amount, slow);
    }

    destroyScreenDoor() {
        this.hasScreenDoor = false;
        this.screenDoorHp = 0;

        // 碎片飞散效果
        for (let i = 0; i < 5; i++) {
            const fragment = this.scene.add.graphics();
            fragment.fillStyle(0x8B4513);
            fragment.fillRect(-2, -2, 4, 4);
            fragment.x = this.x;
            fragment.y = this.y;
            this.scene.add.existing(fragment);

            this.scene.tweens.add({
                targets: fragment,
                x: this.x + Phaser.Math.Between(-40, 40),
                y: this.y + Phaser.Math.Between(-30, 30),
                alpha: 0,
                angle: Phaser.Math.Between(-180, 180),
                duration: 400,
                onComplete: () => fragment.destroy()
            });
        }

        // 重绘视觉（移除铁门）
        this.redrawVisual();
    }

    redrawVisual() {
        if (this.graphics) {
            this.graphics.destroy();
        }
        const g = this.scene.add.graphics();
        this.drawBaseZombie(g, 'basic');
        this.add(g);
        this.graphics = g;
    }
}
