// BalloonZombie.js - 气球僵尸（飞行单位）
// 飘在气球上，可以越过地面植物
// 只能被仙人掌(cactus)或三叶草(blover)击落
// 被击落气球后变为普通地面僵尸继续前进
class BalloonZombie extends Zombie {
    constructor(scene, x, y, row) {
        super(scene, x, y, row, 'balloon');
        this.flying = true;
        this.balloonHp = 1; // 气球只需1次攻击
        this.flyHeight = -50; // 飞行高度偏移
        // 飞行状态：忽略地面植物碰撞
        if (this.body) {
            this.body.setOffset(-15, -90);
        }
        // 初始飞行位置
        this.y += this.flyHeight;
    }

    createVisual(type) {
        const g = this.scene.add.graphics();
        // === 气球 ===
        // 气球绳子
        g.lineStyle(1, 0x8B6914);
        g.beginPath();
        g.moveTo(0, -48);
        g.lineTo(0, -12);
        g.strokePath();
        // 气球本体
        g.fillStyle(0xFF3333);
        g.fillCircle(0, -56, 16);
        g.fillStyle(0xFF6666, 0.5);
        g.fillCircle(-4, -60, 6);
        // 气球反光
        g.fillStyle(0xFF9999, 0.4);
        g.fillCircle(-5, -62, 3);
        // === 僵尸本体 ===
        const skinColor = 0x7B8B6F;
        const shirtColor = 0x8B6914;
        const pantsColor = 0x4A4A2A;

        // 头
        g.fillStyle(skinColor);
        g.fillCircle(0, 0, 12);
        // 眼睛
        g.fillStyle(0xFFFFFF);
        g.fillCircle(-4, -2, 3.5);
        g.fillCircle(4, -2, 3.5);
        g.fillStyle(0xCC0000);
        g.fillCircle(-3, -2, 1.8);
        g.fillCircle(5, -2, 1.8);
        // 嘴
        g.fillStyle(0x4A3A2A);
        g.fillEllipse(0, 6, 8, 4);
        // 身体
        g.fillStyle(shirtColor);
        g.fillRoundedRect(-10, 12, 20, 22, 3);
        // 领带
        g.fillStyle(0x6A4A0A);
        g.fillTriangle(0, 12, -3, 24, 3, 24);
        // 左臂
        g.fillStyle(skinColor);
        g.fillRect(-18, 14, 6, 18);
        // 右臂（伸出前方）
        g.fillStyle(skinColor);
        g.fillRect(12, 12, 6, 18);
        // 左腿
        g.fillStyle(pantsColor);
        g.fillRoundedRect(-8, 32, 6, 18, 2);
        g.fillStyle(0x3A3A1A);
        g.fillRoundedRect(-10, 47, 10, 4, 2);
        // 右腿
        g.fillStyle(pantsColor);
        g.fillRoundedRect(2, 32, 6, 18, 2);
        g.fillStyle(0x3A3A1A);
        g.fillRoundedRect(0, 47, 10, 4, 2);
        this.add(g);
        this.graphics = g;
    }

    update(time, delta) {
        if (!this.alive) return;

        // 飞行状态：移动但不检查植物碰撞
        if (this.flying) {
            this.x -= this.speed * delta / 1000;

            // 检查是否到达房屋
            if (this.x < GRID.startX - 20) {
                this.reachHouse();
            }
        } else {
            // 落地后，调用基类逻辑
            super.update(time, delta);
        }
    }

    takeDamage(amount, slow = false) {
        if (!this.alive) return;

        if (this.flying) {
            // 只有特定攻击能打到飞行中的气球
            // 由 cactus/blover 调用 popBalloon 方法
            return;
        }

        super.takeDamage(amount, slow);
    }

    popBalloon() {
        if (!this.flying) return;
        this.flying = false;

        // 气球爆破效果
        const pop = this.scene.add.graphics();
        pop.setDepth(10);
        pop.fillStyle(0xFF4444, 0.7);
        pop.fillCircle(0, 0, 15);
        pop.setPosition(this.x, this.y - 40);

        this.scene.tweens.add({
            targets: pop,
            scaleX: 2,
            scaleY: 2,
            alpha: 0,
            duration: 300,
            onComplete: () => {
                pop.destroy();
            }
        });

        // 重绘视觉（去掉气球）
        if (this.graphics) {
            this.graphics.destroy();
        }

        // 下落动画
        const targetY = this.y - this.flyHeight;
        this.scene.tweens.add({
            targets: this,
            y: targetY,
            duration: 500,
            ease: 'Bounce.easeOut',
            onComplete: () => {
                // 恢复正常物理
                this.body.setVelocityX(-this.speed);
                this.body.setOffset(-15, -40);
            }
        });

        // 重绘没有气球的僵尸
        const g = this.scene.add.graphics();
        const skinColor = 0x7B8B6F;
        const shirtColor = 0x8B6914;
        const pantsColor = 0x4A4A2A;

        // 头
        g.fillStyle(skinColor);
        g.fillCircle(0, -30, 14);
        // 眼睛
        g.fillStyle(0xFFFFFF);
        g.fillCircle(-5, -32, 4);
        g.fillCircle(5, -32, 4);
        g.fillStyle(0xCC0000);
        g.fillCircle(-4, -32, 2);
        g.fillCircle(6, -32, 2);
        // 嘴
        g.fillStyle(0x4A3A2A);
        g.fillEllipse(0, -22, 10, 5);
        // 身体
        g.fillStyle(shirtColor);
        g.fillRoundedRect(-12, -16, 24, 28, 3);
        g.fillStyle(0x6A4A0A);
        g.fillTriangle(0, -16, -4, 0, 4, 0);
        // 手臂
        g.fillStyle(skinColor);
        g.fillRect(-22, -10, 8, 24);
        g.fillRect(14, -14, 8, 24);
        // 腿
        g.fillStyle(pantsColor);
        g.fillRoundedRect(-10, 12, 8, 24, 3);
        g.fillStyle(0x3A3A1A);
        g.fillRoundedRect(-12, 33, 12, 5, 2);
        g.fillStyle(pantsColor);
        g.fillRoundedRect(2, 12, 8, 24, 3);
        g.fillStyle(0x3A3A1A);
        g.fillRoundedRect(0, 33, 12, 5, 2);

        this.add(g);
        this.graphics = g;

        // 被打落后变为正常僵尸
        this.type = 'basic';
    }
}
