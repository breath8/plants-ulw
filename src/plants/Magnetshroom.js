// Magnetshroom.js - 磁力菇（吸引并移除僵尸的金属物品）
// 范围内检测带金属物品的僵尸（铁桶、铁门等），吸走其金属装备
class Magnetshroom extends Plant {
    constructor(scene, x, y, row, col) {
        super(scene, x, y, row, col, 'magnetshroom');
        this.attractRange = 200; // 吸引范围（像素）
        this.cooldownTime = 5000; // 吸引冷却
        this.attractTimer = 0;
        this.onCooldown = false;
        this.cooldownTimer = 0;
        // 可以吸走的僵尸类型
        this.metalTypes = ['buckethead', 'screendoor', 'jackbox'];
    }

    createVisual(type) {
        const g = this.scene.add.graphics();
        // 茎
        g.fillStyle(0x6A4A8A);
        g.fillRect(-4, 12, 8, 20);
        // 叶子
        g.fillStyle(0x5A3A7A);
        g.fillEllipse(-12, 22, 14, 6);
        g.fillEllipse(12, 25, 14, 6);
        // 菌帽（马蹄磁铁形状）
        g.fillStyle(0x888888);
        g.fillEllipse(0, -4, 44, 36);
        // 磁铁极（红色N极和蓝色S极）
        g.fillStyle(0xCC2200);
        g.fillRoundedRect(-18, -18, 16, 14, 3);
        g.fillStyle(0x2244CC);
        g.fillRoundedRect(2, -18, 16, 14, 3);
        // 极标记
        g.fillStyle(0xFFFFFF);
        // N
        g.fillRect(-14, -14, 2, 6);
        g.fillTriangle(-12, -14, -10, -14, -14, -8);
        g.fillRect(-10, -14, 2, 6);
        // S
        g.fillRect(6, -14, 6, 2);
        g.fillRect(6, -14, 2, 3);
        g.fillRect(10, -12, 2, 2);
        g.fillRect(6, -10, 6, 2);
        // 磁力线
        g.lineStyle(1, 0xAAAAAA, 0.4);
        g.beginPath();
        g.arc(0, -10, 28, -0.8, Math.PI + 0.8);
        g.strokePath();
        // 菌帽底部
        g.fillStyle(0x5A3A7A);
        g.fillEllipse(0, 12, 32, 8);
        // 眼睛
        g.fillStyle(0xFFFFFF);
        g.fillCircle(-6, 2, 5);
        g.fillCircle(6, 2, 5);
        g.fillStyle(0x000000);
        g.fillCircle(-5, 2, 2.5);
        g.fillCircle(7, 2, 2.5);
        // 嘴
        g.fillStyle(0x3A2A5A);
        g.fillEllipse(0, 10, 6, 4);
        this.add(g);
        this.graphics = g;

        // 磁力波效果（冷却时显示）
        this.magnetWave = this.scene.add.graphics();
        this.magnetWave.setVisible(false);
        this.add(this.magnetWave);
    }

    update(time, delta) {
        if (!this.alive) return;

        // 冷却管理
        if (this.onCooldown) {
            this.cooldownTimer -= delta;
            if (this.cooldownTimer <= 0) {
                this.onCooldown = false;
                this.magnetWave.setVisible(false);
            }
            return;
        }

        // 检测范围内带金属的僵尸
        this.attractTimer += delta;
        if (this.attractTimer >= 500) {
            this.attractTimer = 0;
            this.checkForMetal();
        }
    }

    checkForMetal() {
        const zombies = this.scene.zombies.filter(z =>
            z.alive && z.type === this.metalTypes.find(t => t === z.type) &&
            Math.abs(z.x - this.x) <= this.attractRange &&
            Math.abs(z.row - this.row) <= 1
        );

        if (zombies.length > 0) {
            this.attractMetal(zombies[0]);
        }
    }

    attractMetal(zombie) {
        // 显示磁力波效果
        this.magnetWave.clear();
        this.magnetWave.setVisible(true);
        this.magnetWave.lineStyle(2, 0xAAAAFF, 0.6);
        this.magnetWave.strokeCircle(0, 0, 25);
        this.magnetWave.lineStyle(1, 0xAAAAFF, 0.4);
        this.magnetWave.strokeCircle(0, 0, 35);

        // 根据僵尸类型移除金属装备
        if (zombie.type === 'buckethead') {
            zombie.hp = Math.min(zombie.hp, 200); // 铁桶僵尸变为基础僵尸HP
            zombie.redrawVisual && zombie.redrawVisual();
        } else if (zombie.type === 'screendoor') {
            zombie.hp = Math.min(zombie.hp, 200);
            zombie.redrawVisual && zombie.redrawVisual();
        } else if (zombie.type === 'jackbox') {
            zombie.hp = Math.min(zombie.hp, 340);
            zombie.redrawVisual && zombie.redrawVisual();
        }

        // 启动冷却
        this.onCooldown = true;
        this.cooldownTimer = this.cooldownTime;

        // 磁力波消失动画
        this.scene.tweens.add({
            targets: this.magnetWave,
            alpha: 0,
            duration: 500,
            onComplete: () => {
                this.magnetWave.setVisible(false);
                this.magnetWave.setAlpha(1);
            }
        });

        // 吸引动画
        this.scene.tweens.add({
            targets: this,
            scaleX: 1.15,
            scaleY: 0.85,
            duration: 150,
            yoyo: true
        });
    }
}
