// DancingZombie.js - 迪斯科僵尸
// 特性：周期性召唤伴舞僵尸，死亡时所有伴舞僵尸一同死亡
class DancingZombie extends Zombie {
    constructor(scene, x, y, row) {
        super(scene, x, y, row, 'dancing');
        
        this.summonTimer = 0;
        this.summonInterval = 8000; // 8秒召唤一次
        this.backupDancers = [];
        this.maxDancers = 4;
        this.hasSummoned = false;
    }

    createVisual(type) {
        const g = this.scene.add.graphics();
        this.drawBaseZombie(g, type);
        this.drawAccessory(g);
        this.add(g);
        this.graphics = g;
    }

    drawAccessory(g) {
        // 迪斯科风格 - 墨镜 + 大型爆炸头
        const afroColor = 0x1A1A1A;
        const shirtColor = 0xFF1493;

        // 爆炸头
        g.fillStyle(afroColor);
        g.fillEllipse(0, -8, 36, 28);

        // 墨镜
        g.fillStyle(0x222222);
        g.fillRoundedRect(-12, -36, 24, 6, 2);

        // 亮色衬衫
        g.fillStyle(shirtColor);
        g.fillRoundedRect(-12, -16, 24, 28, 3);

        // 金色项链/装饰
        g.fillStyle(0xFFD700);
        g.fillCircle(-12, 2, 3);
        g.fillCircle(12, 2, 3);

        // 粉色领带
        g.fillStyle(0xFF69B4);
        g.fillTriangle(0, -16, -4, 0, 4, 0);
    }

    update(time, delta) {
        if (!this.alive) return;

        super.update(time, delta);

        // 召唤计时
        this.summonTimer += delta;
        if (this.summonTimer >= this.summonInterval && this.backupDancers.length < this.maxDancers) {
            this.summonTimer = 0;
            this.spawnBackupDancers();
        }
    }

    spawnBackupDancers() {
        if (!this.alive) return;

        // 在僵尸周围4个位置召唤伴舞
        const positions = [
            { x: this.x - 50, y: this.y },
            { x: this.x + 50, y: this.y },
            { x: this.x - 30, y: this.y - 40 },
            { x: this.x + 30, y: this.y + 40 }
        ];

        // 只召唤到有效格子的位置
        for (const pos of positions) {
            if (this.backupDancers.length >= this.maxDancers) break;

            const cell = gridManager.getCellFromPosition(pos.x, pos.y);
            if (cell && cell.row === this.row) {
                const existing = gridManager.getPlant(cell.row, cell.col);
                if (!existing || !existing.alive) {
                    this.summonOneDancer(pos.x, pos.y, this.row);
                }
            }
        }
    }

    summonOneDancer(x, y, row) {
        if (!this.alive) return;

        const dancer = new BackupDancer(this.scene, x, y, row, this);
        this.scene.zombies.push(dancer);
        this.backupDancers.push(dancer);

        // 召唤动画 - 从地下升起
        dancer.setAlpha(0);
        this.scene.tweens.add({
            targets: dancer,
            alpha: 1,
            y: y - 20,
            duration: 500,
            ease: 'Back.easeOut'
        });
    }

    die() {
        // 死亡时杀死所有伴舞僵尸
        for (const dancer of this.backupDancers) {
            if (dancer && dancer.alive) {
                dancer.die();
            }
        }
        this.backupDancers = [];

        super.die();
    }

    removeDancer(dancer) {
        const index = this.backupDancers.indexOf(dancer);
        if (index > -1) {
            this.backupDancers.splice(index, 1);
        }
    }
}
