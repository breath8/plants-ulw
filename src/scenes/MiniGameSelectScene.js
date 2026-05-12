// MiniGameSelectScene.js - 小游戏关卡选择
class MiniGameSelectScene extends Phaser.Scene {
    constructor() {
        super('MiniGameSelectScene');
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // 重置相机状态
        this.cameras.main.resetFX();

        // 背景
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x2d1b4e, 0x1a1a2e, 0x16213e, 0x0f3460);
        bg.fillRect(0, 0, width, height);

        // 标题
        this.add.text(width / 2, 30, '小游戏模式', {
            font: 'bold 32px Arial',
            fill: '#FFD700',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5, 0.5);

        this.add.text(width / 2, 60, '选择一个小游戏开始挑战', {
            font: '16px Arial',
            fill: '#CCCCCC'
        }).setOrigin(0.5, 0.5);

        // 关卡按钮
        const startX = width / 2 - 320;
        const startY = 95;
        const btnWidth = 300;
        const btnHeight = 130;
        const spacingX = 40;
        const spacingY = 20;
        const cols = 2;

        MINI_GAMES.forEach((game, i) => {
            const row = Math.floor(i / cols);
            const col = i % cols;
            const bx = startX + col * (btnWidth + spacingX);
            const by = startY + row * (btnHeight + spacingY);

            this.createLevelButton(bx, by, btnWidth, btnHeight, game, i);
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
        backZone.on('pointerdown', () => this.scene.start('ExtraModeSelectScene'));
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

    createLevelButton(x, y, w, h, game, index) {
        const container = this.add.container(x, y);

        // 背景
        const bg = this.add.graphics();
        bg.fillStyle(0xE91E63, 0.85);
        bg.fillRoundedRect(0, 0, w, h, 10);
        bg.fillStyle(0xAD1457, 0.2);
        bg.fillRoundedRect(3, 3, w - 6, h - 6, 8);
        container.add(bg);

        // 图标（随机颜色方块作为装饰）
        const iconBg = this.add.graphics();
        const iconColors = [0xFF4081, 0xE040FB, 0x7C4DFF, 0x448AFF];
        iconBg.fillStyle(iconColors[index % iconColors.length], 0.5);
        iconBg.fillRoundedRect(15, 20, 60, 60, 8);
        container.add(iconBg);

        // 关卡编号
        const numText = this.add.text(45, 50, `MG${index + 1}`, {
            font: 'bold 14px Arial',
            fill: '#FFFFFF'
        }).setOrigin(0.5, 0.5);
        container.add(numText);

        // 名称
        const nameText = this.add.text(90, 32, game.name, {
            font: 'bold 22px Arial',
            fill: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0, 0.5);
        container.add(nameText);

        // 描述
        const descText = this.add.text(90, 60, game.description, {
            font: '13px Arial',
            fill: '#DDDDDD'
        }).setOrigin(0, 0.5);
        container.add(descText);

        // 植物数
        const plantText = this.add.text(90, 82, `可用植物: ${game.plants.length}种`, {
            font: '12px Arial',
            fill: '#AAAAAA'
        }).setOrigin(0, 0.5);
        container.add(plantText);

        // 波次数
        const waveText = this.add.text(90, 100, `波次: ${game.waves.length}`, {
            font: '12px Arial',
            fill: '#AAAAAA'
        }).setOrigin(0, 0.5);
        container.add(waveText);

        // 交互
        const zone = this.add.zone(x + w / 2, y + h / 2, w, h)
            .setInteractive({ useHandCursor: true });

        zone.on('pointerover', () => {
            bg.clear();
            bg.fillStyle(0xAD1457, 0.9);
            bg.fillRoundedRect(0, 0, w, h, 10);
            bg.fillStyle(0xE91E63, 0.2);
            bg.fillRoundedRect(3, 3, w - 6, h - 6, 8);
        });

        zone.on('pointerout', () => {
            bg.clear();
            bg.fillStyle(0xE91E63, 0.85);
            bg.fillRoundedRect(0, 0, w, h, 10);
            bg.fillStyle(0xAD1457, 0.2);
            bg.fillRoundedRect(3, 3, w - 6, h - 6, 8);
        });

        zone.on('pointerdown', () => {
            this.scene.start('GameScene', { mode: 'mini', level: index });
        });
    }
}
