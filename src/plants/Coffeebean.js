// Coffeebean.js - 咖啡豆
// 一次性使用物品，唤醒沉睡的蘑菇类植物
// 在白天关卡中，蘑菇类植物处于睡眠状态，需要咖啡豆唤醒
class Coffeebean extends Plant {
    constructor(scene, x, y, row, col) {
        super(scene, x, y, row, col, 'coffeebean');
        this.activated = false;
    }

    createVisual(type) {
        const g = this.scene.add.graphics();
        // 咖啡豆形状 - 椭圆
        g.fillStyle(0x5D4037);
        g.fillEllipse(0, 0, 28, 22);
        // 高光
        g.fillStyle(0x795548, 0.6);
        g.fillEllipse(-4, -4, 16, 10);
        // 中间凹槽
        g.lineStyle(2, 0x3E2723);
        g.beginPath();
        g.moveTo(0, -10);
        g.lineTo(0, 10);
        g.strokePath();
        // 微小眼睛 - 可爱感
        g.fillStyle(0xFFFFFF);
        g.fillCircle(-5, -3, 3);
        g.fillCircle(5, -3, 3);
        g.fillStyle(0x000000);
        g.fillCircle(-5, -3, 1.5);
        g.fillCircle(5, -3, 1.5);
        // 微笑
        g.lineStyle(1.5, 0x3E2723);
        g.beginPath();
        g.arc(0, 2, 4, 0.2, Math.PI - 0.2);
        g.strokePath();
        // 咖啡香气波纹（装饰）
        g.lineStyle(1, 0x8D6E63, 0.4);
        g.beginPath();
        g.arc(-8, -12, 5, Math.PI * 1.2, Math.PI * 1.8);
        g.strokePath();
        g.beginPath();
        g.arc(8, -14, 4, Math.PI * 1.3, Math.PI * 1.7);
        g.strokePath();
        this.add(g);
        this.graphics = g;
    }

    update(time, delta) {
        if (!this.alive || this.activated) return;
        // 咖啡豆放置后立即激活
        this.activate();
    }

    activate() {
        if (this.activated) return;
        this.activated = true;

        // 查找同一格上的沉睡蘑菇
        const plant = gridManager.getPlant(this.row, this.col);
        if (plant && plant.alive && plant !== this) {
            // 检查是否为蘑菇类且在睡眠状态
            if (this.isSleepingMushroom(plant)) {
                this.wakeUpMushroom(plant);
            }
        }

        // 咖啡豆自身被消耗 - 消失动画
        const wakeEffect = this.scene.add.graphics();
        wakeEffect.setDepth(100);
        // 唤醒光环 - 棕色咖啡环
        wakeEffect.lineStyle(3, 0x8D6E63, 0.8);
        wakeEffect.strokeCircle(this.x, this.y, 15);
        wakeEffect.fillStyle(0xD7CCC8, 0.3);
        wakeEffect.fillCircle(this.x, this.y, 15);
        this.scene.tweens.add({
            targets: wakeEffect,
            scaleX: 2.5,
            scaleY: 2.5,
            alpha: 0,
            duration: 500,
            onComplete: () => { wakeEffect.destroy(); }
        });

        // 飘散的咖啡豆粒子
        for (let i = 0; i < 6; i++) {
            const particle = this.scene.add.graphics();
            particle.fillStyle(0x5D4037);
            particle.fillCircle(0, 0, 3);
            particle.setPosition(this.x, this.y);
            const angle = (i / 6) * Math.PI * 2;
            this.scene.tweens.add({
                targets: particle,
                x: this.x + Math.cos(angle) * 30,
                y: this.y - 20 + Math.sin(angle) * 15,
                alpha: 0,
                duration: 400,
                delay: i * 50,
                onComplete: () => { particle.destroy(); }
            });
        }

        // 延迟移除自身
        this.scene.time.delayedCall(200, () => {
            this.hp = 0;
            this.die();
        });
    }

    isSleepingMushroom(plant) {
        const mushrooms = ['puffshroom', 'sunshroom', 'fumeshroom', 'hypnoshroom', 'iceshroom', 'doomshroom', 'scaredyshroom'];
        return mushrooms.includes(plant.type) && plant.sleeping;
    }

    wakeUpMushroom(mushroom) {
        mushroom.sleeping = false;
        mushroom.setAlpha(1);
        // 唤醒特效 - 蘑菇头上冒出ZZZ消失
        const zzz = this.scene.add.graphics();
        zzz.fillStyle(0xFFFFFF, 0.8);
        zzz.fillCircle(-5, -30, 4);
        zzz.fillCircle(5, -36, 3);
        zzz.fillCircle(10, -40, 2);
        zzz.setPosition(mushroom.x, mushroom.y);
        this.scene.tweens.add({
            targets: zzz,
            y: zzz.y - 20,
            alpha: 0,
            duration: 600,
            onComplete: () => { zzz.destroy(); }
        });
    }
}
