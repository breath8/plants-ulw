// WorldSelectScene.js - 世界选择场景
class WorldSelectScene extends Phaser.Scene {
    constructor() {
        super('WorldSelectScene');
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // 背景 - 渐变色
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x1a1a2e, 0x1a1a2e, 0x16213e, 0x16213e);
        bg.fillRect(0, 0, width, height);
        // 装饰星星
        for (let i = 0; i < 40; i++) {
            const sx = Math.random() * width;
            const sy = Math.random() * height;
            bg.fillStyle(0xFFFFFF, Math.random() * 0.3 + 0.1);
            bg.fillCircle(sx, sy, Math.random() * 2 + 0.5);
        }

        // 标题
        this.add.text(width / 2, 35, '选择世界', {
            font: 'bold 36px Arial',
            fill: '#FFD700',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5, 0.5);

        const unlockedLevel = saveManager.getUnlockedLevel();

        // 世界数据
        const worlds = [
            { index: 0, name: '前院 (白天)', subtitle: '僵尸来了', color: 0x4CAF50, darkColor: 0x2E7D32 },
            { index: 1, name: '前院 (夜晚)', subtitle: '夜幕降临', color: 0x37474F, darkColor: 0x1A237E },
            { index: 2, name: '后院 (泳池)', subtitle: '后院危机', color: 0x2196F3, darkColor: 0x0D47A1 },
            { index: 3, name: '后院 (迷雾)', subtitle: '迷雾重重', color: 0x607D8B, darkColor: 0x263238 },
            { index: 4, name: '屋顶', subtitle: '屋顶决战', color: 0xFF8F00, darkColor: 0xE65100 }
        ];

        // 布局参数
        const cols = 3;
        const btnWidth = 260;
        const btnHeight = 140;
        const spacingX = 40;
        const spacingY = 30;
        const totalGridWidth = cols * btnWidth + (cols - 1) * spacingX;
        const startX = (width - totalGridWidth) / 2;
        const startY = 85;

        worlds.forEach((world, i) => {
            const row = Math.floor(i / cols);
            const col = i % cols;
            const bx = startX + col * (btnWidth + spacingX);
            const by = startY + row * (btnHeight + spacingY);

            // 检查解锁状态
            const worldUnlockLevel = world.index * 10;
            const isUnlocked = unlockedLevel >= worldUnlockLevel || world.index === 0;

            // 完成进度
            const completedCount = Math.min(
                Math.max(0, unlockedLevel - worldUnlockLevel),
                10
            );

            this.createWorldButton(bx, by, btnWidth, btnHeight, world, isUnlocked, completedCount);
        });

        // 返回按钮
        const backX = 80;
        const backY = height - 40;
        const backBg = this.add.graphics();
        backBg.fillStyle(0x666666);
        backBg.fillRoundedRect(backX - 50, backY - 20, 100, 40, 10);
        this.add.text(backX, backY, '返回', {
            font: 'bold 20px Arial',
            fill: '#FFFFFF'
        }).setOrigin(0.5, 0.5);

        const backZone = this.add.zone(backX, backY, 100, 40).setInteractive({ useHandCursor: true });
        backZone.on('pointerdown', () => this.scene.start('MenuScene'));
        backZone.on('pointerover', () => {
            backBg.clear();
            backBg.fillStyle(0x888888);
            backBg.fillRoundedRect(backX - 50, backY - 20, 100, 40, 10);
        });
        backZone.on('pointerout', () => {
            backBg.clear();
            backBg.fillStyle(0x666666);
            backBg.fillRoundedRect(backX - 50, backY - 20, 100, 40, 10);
        });
    }

    createWorldButton(x, y, w, h, world, isUnlocked, completed) {
        const container = this.add.container(x, y);

        // 背景
        const bg = this.add.graphics();
        if (isUnlocked) {
            bg.fillStyle(world.color, 0.9);
            bg.fillRoundedRect(0, 0, w, h, 12);
            bg.fillStyle(world.darkColor, 0.3);
            bg.fillRoundedRect(4, 4, w - 8, h - 8, 10);
        } else {
            bg.fillStyle(0x555555, 0.9);
            bg.fillRoundedRect(0, 0, w, h, 12);
        }
        container.add(bg);

        // 世界图标（emoji简图）
        const icons = ['☀️', '🌙', '🏊', '🌫️', '🏠'];
        const icon = this.add.text(w / 2, 38, icons[world.index], {
            font: '36px Arial'
        }).setOrigin(0.5, 0.5);
        if (!isUnlocked) icon.setAlpha(0.3);
        container.add(icon);

        // 世界名
        const nameText = this.add.text(w / 2, 72, world.name, {
            font: 'bold 17px Arial',
            fill: isUnlocked ? '#FFFFFF' : '#888888',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5, 0.5);
        container.add(nameText);

        // 副标题
        const subtitle = this.add.text(w / 2, 92, world.subtitle, {
            font: '13px Arial',
            fill: isUnlocked ? '#CCCCCC' : '#666666'
        }).setOrigin(0.5, 0.5);
        container.add(subtitle);

        // 进度条
        if (isUnlocked) {
            const barW = w - 30;
            const barH = 10;
            const barX = 15;
            const barY = h - 28;

            const barBg = this.add.graphics();
            barBg.fillStyle(0x000000, 0.4);
            barBg.fillRoundedRect(barX, barY, barW, barH, 4);
            container.add(barBg);

            const fillW = (completed / 10) * barW;
            if (fillW > 0) {
                const barFill = this.add.graphics();
                barFill.fillStyle(0xFFD700);
                barFill.fillRoundedRect(barX, barY, fillW, barH, 4);
                container.add(barFill);
            }

            const progressText = this.add.text(w / 2, barY + barH + 8, `${completed}/10`, {
                font: '11px Arial',
                fill: '#AAAAAA'
            }).setOrigin(0.5, 0);
            container.add(progressText);

            // 交互
            const zone = this.add.zone(x + w / 2, y + h / 2, w, h).setInteractive({ useHandCursor: true });
            zone.on('pointerdown', () => {
                this.scene.start('LevelSelectScene', { worldIndex: world.index });
            });
            zone.on('pointerover', () => {
                container.setScale(1.05);
            });
            zone.on('pointerout', () => {
                container.setScale(1);
            });
        } else {
            // 锁定标志
            const lockText = this.add.text(w / 2, h - 18, '🔒 未解锁', {
                font: '13px Arial',
                fill: '#888888'
            }).setOrigin(0.5, 0.5);
            container.add(lockText);
        }
    }
}
