// NewspaperZombie.js - 报纸僵尸
// 特性：手持报纸，报纸被摧毁后进入暴怒状态（速度加快）
class NewspaperZombie extends Zombie {
    constructor(scene, x, y, row) {
        super(scene, x, y, row, 'newspaper');
        
        const cfg = ZOMBIE_CONFIG.newspaper;
        this.rageHp = cfg.rageHp;
        this.rageSpeed = cfg.rageSpeed;
        this.enraged = false;
        this.hasNewspaper = true;
    }

    createVisual(type) {
        const g = this.scene.add.graphics();
        this.drawBaseZombie(g, type);
        this.drawAccessory(g);
        this.add(g);
        this.graphics = g;
    }

    drawAccessory(g) {
        // 手持报纸
        const skinColor = 0x7B8B6F;
        
        // 报纸（右手持）
        if (this.hasNewspaper) {
            g.fillStyle(0xF5F5DC);
            g.fillRoundedRect(14, -14, 16, 20, 1);
            // 报纸文字线条
            g.lineStyle(0.5, 0x999999);
            for (let i = 0; i < 4; i++) {
                g.beginPath();
                g.moveTo(16, -10 + i * 4);
                g.lineTo(28, -10 + i * 4);
                g.strokePath();
            }
            // 报纸标题
            g.fillStyle(0x333333);
            g.fillRect(16, -12, 10, 2);
        }
    }

    takeDamage(amount, slow = false) {
        if (!this.alive) return;

        // 先检查是否即将进入暴怒（hp减少前判断）
        const willEnrage = this.hp - amount <= this.rageHp && !this.enraged;

        super.takeDamage(amount, slow);

        // 如果僵尸还活着且应该暴怒
        if (this.alive && willEnrage) {
            this.enrage();
        }
    }

    enrage() {
        this.enraged = true;
        this.hasNewspaper = false;
        this.speed = this.rageSpeed;
        this.baseSpeed = this.rageSpeed; // 同步更新，防止减速恢复后速度重置

        // 更新移动速度
        if (!this.eating) {
            this.body.setVelocityX(-this.speed);
        }

        // 重绘视觉 - 报纸撕裂效果
        this.redrawVisual();

        // 暴怒视觉反馈 - 红色覆盖层
        this.applyTint(0xFF6666);
        this.scene.time.delayedCall(300, () => {
            if (this.alive) this.clearTint();
        });
    }

    redrawVisual() {
        // 移除旧的图形
        if (this.graphics) {
            this.graphics.destroy();
        }

        // 重新创建
        const g = this.scene.add.graphics();
        this.drawBaseZombie(g, 'basic');
        this.drawTornNewspaper(g);
        this.add(g);
        this.graphics = g;
    }

    drawTornNewspaper(g) {
        // 撕裂的报纸碎片（残留在手中）
        g.fillStyle(0xF5F5DC);
        g.fillTriangle(14, -8, 22, -12, 20, -2);
        g.fillStyle(0xE8E0C8);
        g.fillRect(16, -6, 4, 6);
    }
}
