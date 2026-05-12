// DolphinRiderZombie.js - 海豚骑士僵尸
// 骑着海豚快速前进，遇到第一棵植物时跳过去
class DolphinRiderZombie extends Zombie {
    constructor(scene, x, y, row) {
        super(scene, x, y, row, 'dolphinrider');
        this.hasVaulted = false;
        this.jumping = false;
        this.vaultRange = PLANT_CONFIG.dolphinrider ? 200 : 200;
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

        // 海豚身体
        g.fillStyle(0x6699BB);
        g.fillEllipse(0, 15, 40, 16);

        // 海豚头部
        g.fillStyle(0x5588AA);
        g.fillEllipse(-20, 12, 18, 12);

        // 海豚嘴巴
        g.fillStyle(0x447799);
        g.fillEllipse(-30, 14, 8, 5);

        // 海豚眼睛
        g.fillStyle(0xFFFFFF);
        g.fillCircle(-22, 10, 3);
        g.fillStyle(0x000000);
        g.fillCircle(-21, 10, 1.5);

        // 海豚背鳍
        g.fillStyle(0x5588AA);
        g.fillTriangle(-5, 7, 0, 2, 5, 7);

        // 海豚尾巴
        g.fillStyle(0x6699BB);
        g.fillTriangle(18, 12, 28, 6, 28, 18);

        // 海豚腹部高光
        g.fillStyle(0x99CCDD, 0.4);
        g.fillEllipse(-5, 17, 30, 6);
    }

    checkForPlant() {
        if (this.hasVaulted || this.jumping) {
            // 已跳过植物后恢复正常行为
            if (this.hasVaulted) {
                super.checkForPlant();
            }
            return;
        }

        // 检测前方植物
        const cell = gridManager.getCellFromPosition(this.x - 25, this.y);
        if (cell && cell.row === this.row) {
            const plant = gridManager.getPlant(cell.row, cell.col);
            if (plant && plant.alive && plant.type !== 'cherrybomb' && plant.type !== 'potatomine') {
                this.jump();
            }
        }
    }

    jump() {
        this.jumping = true;
        const jumpDistance = 200;
        const originalY = this.y;

        // 停止物理移动
        this.body.setVelocityX(0);

        // 跳跃动画 - 抛物线
        this.scene.tweens.add({
            targets: this,
            y: originalY - 70,
            x: this.x - jumpDistance / 2,
            duration: 300,
            ease: 'Quad.easeOut',
            onComplete: () => {
                this.scene.tweens.add({
                    targets: this,
                    y: originalY,
                    x: this.x - jumpDistance / 2,
                    duration: 300,
                    ease: 'Quad.easeIn',
                    onComplete: () => {
                        this.hasVaulted = true;
                        this.jumping = false;
                        // 跳过后速度减半
                        this.speed = this.baseSpeed * 0.6;
                        this.body.setVelocityX(-this.speed);
                    }
                });
            }
        });
    }
}
