// Garlic.js - 大蒜
// 僵尸驱逐植物，被吃时僵尸被引导到相邻行
// 低HP但策略性极强
class Garlic extends Plant {
    constructor(scene, x, y, row, col) {
        super(scene, x, y, row, col, 'garlic');
    }

    createVisual(type) {
        const g = this.scene.add.graphics();
        // 蒜头 - 白色椭圆
        g.fillStyle(0xF5F5DC);
        g.fillEllipse(0, -2, 36, 40);
        // 蒜皮纹理
        g.fillStyle(0xE8E0C8, 0.4);
        g.fillEllipse(-4, -4, 28, 32);
        // 蒜瓣分隔线
        g.lineStyle(1.5, 0xD4C99A, 0.6);
        g.beginPath();
        g.moveTo(0, -18);
        g.lineTo(0, 12);
        g.strokePath();
        g.beginPath();
        g.moveTo(-8, -16);
        g.lineTo(-6, 14);
        g.strokePath();
        g.beginPath();
        g.moveTo(8, -16);
        g.lineTo(6, 14);
        g.strokePath();
        // 蒜头顶部茎
        g.fillStyle(0x8BC34A);
        g.fillRect(-2, -22, 4, 8);
        // 叶子
        g.fillStyle(0x689F38);
        g.fillEllipse(-8, -20, 8, 4);
        g.fillEllipse(8, -22, 8, 4);
        // 眼睛 - 害怕的表情
        g.fillStyle(0xFFFFFF);
        g.fillCircle(-7, -6, 5);
        g.fillCircle(7, -6, 5);
        g.fillStyle(0x000000);
        g.fillCircle(-8, -5, 2.5);
        g.fillCircle(8, -5, 2.5);
        // 汗水/紧张表情
        g.fillStyle(0xADD8E6, 0.6);
        g.fillCircle(14, -8, 3);
        // 害怕的嘴巴
        g.lineStyle(2, 0x795548);
        g.beginPath();
        g.arc(0, 4, 4, 0.3, Math.PI - 0.3);
        g.strokePath();
        this.add(g);
        this.graphics = g;
    }

    takeDamage(amount) {
        if (!this.alive) return;
        this.hp -= amount;
        // 闪烁效果
        this.scene.tweens.add({
            targets: this,
            alpha: 0.5,
            duration: 50,
            yoyo: true
        });
        if (this.hp <= 0) {
            this.die();
        }
    }

    // 重写被吃逻辑 - 当僵尸吃大蒜时，引导僵尸到相邻行
    onEaten(zombie) {
        if (!this.alive || !zombie || !zombie.alive) return;

        // 找到相邻行
        const adjacentRow = this.findAdjacentRow(zombie.row);

        if (adjacentRow !== null) {
            // 停止当前吃的行为
            zombie.stopEating();
            // 移动僵尸到相邻行
            zombie.row = adjacentRow;
            const targetY = GRID.startY + adjacentRow * GRID.cellHeight + GRID.cellHeight / 2;
            // 平滑移动到相邻行
            this.scene.tweens.add({
                targets: zombie,
                y: targetY,
                duration: 300,
                ease: 'Quad.easeInOut',
                onComplete: () => {
                    // 确保物理位置同步
                    zombie.body.y = targetY - zombie.body.height / 2;
                    zombie.body.setVelocityX(-zombie.speed);
                }
            });
            // 蒜味驱散特效
            this.garlicBurstEffect();
        }
    }

    findAdjacentRow(currentRow) {
        // 随机选择上方或下方的行
        const candidates = [];
        if (currentRow > 0) candidates.push(currentRow - 1);
        if (currentRow < GRID.rows - 1) candidates.push(currentRow + 1);
        if (candidates.length === 0) return null;
        return candidates[Math.floor(Math.random() * candidates.length)];
    }

    garlicBurstEffect() {
        // 大蒜味爆散特效
        const effect = this.scene.add.graphics();
        effect.setDepth(100);
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            effect.fillStyle(0xF5F5DC, 0.6);
            effect.fillCircle(Math.cos(angle) * 15, Math.sin(angle) * 15, 4);
        }
        effect.setPosition(this.x, this.y);
        this.scene.tweens.add({
            targets: effect,
            scaleX: 2,
            scaleY: 2,
            alpha: 0,
            duration: 400,
            onComplete: () => { effect.destroy(); }
        });
    }
}
