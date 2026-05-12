// BungeeZombie.js - 蹦极僵尸
// 从天而降，抓住一个植物后飞走
// 无法被普通攻击拦截，只有保护伞能挡住
class BungeeZombie extends Zombie {
    constructor(scene, x, y, row) {
        // 蹦极僵尸从顶部进入，不需要物理移动
        super(scene, x, y, row, 'bungee');
        this.body.setVelocityX(0);
        this.body.setVelocityY(0);

        this.descending = true; // 正在下降
        this.grabbing = false; // 正在抓取
        this.ascending = false; // 正在上升
        this.descendSpeed = 80; // 下降速度
        this.ascendSpeed = 120; // 上升速度
        this.grabTimer = 0;
        this.grabDelay = 500; // 抓取延迟

        this.targetPlant = null;
        this.targetCol = -1;
        this.targetRow = row;

        // 随机选择目标列（2-8列，避开最边缘）
        this.targetCol = 2 + Math.floor(Math.random() * 6);

        // 设置初始位置 - 从顶部开始
        this.y = -30;
        const targetX = GRID.startX + this.targetCol * GRID.cellWidth + GRID.cellWidth / 2;
        this.x = targetX;

        // 行走动画 - 不需要
        if (this.walkTween) this.walkTween.stop();
    }

    createVisual(type) {
        const g = this.scene.add.graphics();
        const skinColor = 0x7B8B6F;

        // 蹦极绳
        g.lineStyle(3, 0x8B4513);
        g.beginPath();
        g.moveTo(0, -50);
        g.lineTo(0, -20);
        g.strokePath();
        g.lineStyle(2, 0xA0522D);
        g.beginPath();
        g.moveTo(-1, -48);
        g.lineTo(-1, -22);
        g.strokePath();

        // 僵尸头（朝下看）
        g.fillStyle(skinColor);
        g.fillCircle(0, -10, 14);
        // 眼睛
        g.fillStyle(0xFFFFFF);
        g.fillCircle(-5, -12, 4);
        g.fillCircle(5, -12, 4);
        g.fillStyle(0xCC0000);
        g.fillCircle(-4, -11, 2);
        g.fillCircle(6, -11, 2);
        // 嘴
        g.fillStyle(0x4A3A2A);
        g.fillEllipse(0, -4, 10, 5);
        // 身体
        g.fillStyle(0x8B0000);
        g.fillRoundedRect(-10, 2, 20, 18, 3);
        // 手臂（向下伸）
        g.fillStyle(skinColor);
        g.fillRect(-18, 4, 8, 16);
        g.fillRect(10, 4, 8, 16);
        // 爪子（准备抓取）
        g.fillStyle(0x6B7B5F);
        g.fillTriangle(-18, 20, -14, 20, -16, 24);
        g.fillTriangle(10, 20, 14, 20, 12, 24);
        // 眼罩/面具
        g.fillStyle(0x1A1A1A, 0.3);
        g.fillRoundedRect(-10, -18, 20, 6, 2);
        this.add(g);
        this.graphics = g;
    }

    update(time, delta) {
        if (!this.alive) return;

        if (this.descending) {
            // 下降阶段
            this.y += this.descendSpeed * (delta / 1000);

            // 到达目标位置
            const targetY = GRID.startY + this.targetRow * GRID.cellHeight + GRID.cellHeight / 2;
            if (this.y >= targetY) {
                this.y = targetY;
                this.descending = false;
                this.grabbing = true;
                this.grabTimer = 0;
            }
        } else if (this.grabbing) {
            // 抓取阶段
            this.grabTimer += delta;
            if (this.grabTimer >= this.grabDelay) {
                this.tryGrab();
            }
        } else if (this.ascending) {
            // 上升阶段 - 带着植物飞走
            this.y -= this.ascendSpeed * (delta / 1000);
            if (this.y < -60) {
                // 飞出屏幕，移除
                this.alive = false;
                this.destroy();
            }
        }
    }

    tryGrab() {
        // 检查目标位置是否有保护伞
        let blocked = false;
        this.scene.zombies.forEach(z => {
            // 检查植物中是否有umbrellaleaf保护此位置
        });
        this.scene.plants.forEach(plant => {
            if (plant.alive && plant.type === 'umbrellaleaf') {
                const rowDiff = Math.abs(plant.row - this.targetRow);
                const colDiff = Math.abs(plant.col - this.targetCol);
                if (rowDiff <= 1 && colDiff <= 1) {
                    blocked = true;
                    plant.deflectBungee();
                }
            }
        });

        if (blocked) {
            // 被保护伞挡住，直接飞走
            this.grabbing = false;
            this.ascending = true;
            return;
        }

        // 检查目标位置是否有植物
        const targetPlant = gridManager.getPlant(this.targetRow, this.targetCol);
        if (targetPlant && targetPlant.alive) {
            this.targetPlant = targetPlant;
            // 抓取植物 - 植物跟着飞走
            this.scene.tweens.add({
                targets: targetPlant,
                y: targetPlant.y - 5,
                duration: 200,
                ease: 'Quad.easeOut',
                onComplete: () => {
                    // 移除植物
                    gridManager.removePlant(targetPlant.row, targetPlant.col);
                    targetPlant.alive = false;
                    targetPlant.y = this.y;
                    this.scene.tweens.add({
                        targets: targetPlant,
                        y: targetPlant.y - 100,
                        alpha: 0,
                        duration: 500,
                        onComplete: () => { targetPlant.destroy(); }
                    });
                }
            });
            // 抓取特效
            this.grabEffect();
        }

        this.grabbing = false;
        this.ascending = true;
    }

    grabEffect() {
        const effect = this.scene.add.graphics();
        effect.setDepth(100);
        effect.lineStyle(2, 0xFF4444, 0.8);
        effect.strokeCircle(this.x, this.y + 20, 15);
        effect.setPosition(0, 0);
        this.scene.tweens.add({
            targets: effect,
            scaleX: 2,
            scaleY: 2,
            alpha: 0,
            duration: 300,
            onComplete: () => { effect.destroy(); }
        });
    }

    // 蹦极僵尸免疫普通减速
    applySlow() {
        // 不受减速影响
    }
}
