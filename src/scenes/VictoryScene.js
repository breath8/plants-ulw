// VictoryScene.js - 过关场景
class VictoryScene extends Phaser.Scene {
    constructor() {
        super('VictoryScene');
    }

    init(data) {
        this.levelIndex = data.level || 0;
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // 重置相机状态
        this.cameras.main.resetFX();

        // 背景
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x1a1a2e, 0x16213e, 0x0f3460, 0x533483);
        bg.fillRect(0, 0, width, height);

        // 星星特效
        for (let i = 0; i < 30; i++) {
            const star = this.add.graphics();
            const sx = Math.random() * width;
            const sy = Math.random() * height;
            star.fillStyle(0xFFFFFF, Math.random() * 0.5 + 0.3);
            star.fillCircle(sx, sy, Math.random() * 2 + 1);
            this.tweens.add({
                targets: star,
                alpha: { from: 0.3, to: 1 },
                duration: 1000 + Math.random() * 2000,
                yoyo: true,
                repeat: -1,
                delay: Math.random() * 1000
            });
        }

        // 大星星
        const bigStar = this.add.graphics();
        bigStar.fillStyle(0xFFD700);
        this.drawStar(bigStar, width / 2, 150, 5, 80, 40);
        bigStar.fillStyle(0xFFEC8B);
        this.drawStar(bigStar, width / 2, 150, 5, 50, 25);

        this.tweens.add({
            targets: bigStar,
            angle: 360,
            duration: 6000,
            repeat: -1
        });
        this.tweens.add({
            targets: bigStar,
            scaleX: 1.15,
            scaleY: 1.15,
            duration: 1500,
            yoyo: true,
            repeat: -1
        });

        // 标题
        const title = this.add.text(width / 2, 280, '关卡完成！', {
            font: 'bold 48px Arial',
            fill: '#FFD700',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5, 0.5);

        const sub = this.add.text(width / 2, 330, `关卡 1-${this.levelIndex + 1} 已通过`, {
            font: '24px Arial',
            fill: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5, 0.5);

        // 入场动画
        title.setScale(0);
        sub.setAlpha(0);
        this.tweens.add({ targets: title, scaleX: 1, scaleY: 1, duration: 600, ease: 'Back.easeOut' });
        this.time.delayedCall(400, () => {
            this.tweens.add({ targets: sub, alpha: 1, duration: 400 });
        });

        // 按钮区
        if (this.levelIndex + 1 < LEVELS.length) {
            this.createButton(width / 2 - 100, 420, '下一关', 0x4CAF50, () => {
                this.scene.start('GameScene', { level: this.levelIndex + 1 });
            });
        }
        this.createButton(width / 2 + 100, 420, '返回菜单', 0x666666, () => {
            this.scene.start('MenuScene');
        });
    }

    drawStar(graphics, cx, cy, points, outerRadius, innerRadius) {
        const angleStep = Math.PI / points;
        graphics.beginPath();
        for (let i = 0; i < points * 2; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const angle = i * angleStep - Math.PI / 2;
            const x = cx + Math.cos(angle) * radius;
            const y = cy + Math.sin(angle) * radius;
            if (i === 0) {
                graphics.moveTo(x, y);
            } else {
                graphics.lineTo(x, y);
            }
        }
        graphics.closePath();
        graphics.fillPath();
    }

    createButton(x, y, label, color, callback) {
        const bg = this.add.graphics();
        bg.fillStyle(color);
        bg.fillRoundedRect(x - 60, y - 22, 120, 44, 10);

        const text = this.add.text(x, y, label, {
            font: 'bold 20px Arial',
            fill: '#FFFFFF'
        }).setOrigin(0.5, 0.5);

        const zone = this.add.zone(x, y, 120, 44).setInteractive({ useHandCursor: true });
        zone.on('pointerover', () => {
            bg.clear();
            const lighterColor = Phaser.Display.Color.ValueToColor(color).lighten(30).color;
            bg.fillStyle(lighterColor);
            bg.fillRoundedRect(x - 60, y - 22, 120, 44, 10);
        });
        zone.on('pointerout', () => {
            bg.clear();
            bg.fillStyle(color);
            bg.fillRoundedRect(x - 60, y - 22, 120, 44, 10);
        });
        zone.on('pointerdown', callback);
    }
}
