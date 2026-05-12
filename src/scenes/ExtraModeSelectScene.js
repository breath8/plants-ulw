// ExtraModeSelectScene.js - 额外模式选择场景
class ExtraModeSelectScene extends Phaser.Scene {
    constructor() {
        super('ExtraModeSelectScene');
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

        // 装饰星星
        for (let i = 0; i < 40; i++) {
            const sx = Math.random() * width;
            const sy = Math.random() * height;
            bg.fillStyle(0xFFFFFF, Math.random() * 0.3 + 0.1);
            bg.fillCircle(sx, sy, Math.random() * 2 + 0.5);
        }

        // 标题
        this.add.text(width / 2, 35, '额外模式', {
            font: 'bold 36px Arial',
            fill: '#FFD700',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5, 0.5);

        // 模式数据
        const modes = [
            {
                id: 'mini',
                name: '小游戏',
                subtitle: '特色关卡挑战',
                desc: '体验各种有趣的特殊关卡',
                color: 0xE91E63,
                darkColor: 0xAD1457,
                icon: '🎮'
            },
            {
                id: 'puzzle',
                name: '解谜模式',
                subtitle: '砸花瓶 & 我是僵尸',
                desc: '策略与智慧的考验',
                color: 0x9C27B0,
                darkColor: 0x6A1B9A,
                icon: '🧩'
            },
            {
                id: 'survival',
                name: '生存模式',
                subtitle: '无尽挑战',
                desc: '面对源源不断的僵尸大军',
                color: 0xFF5722,
                darkColor: 0xBF360C,
                icon: '⚔️'
            },
            {
                id: 'zengarden',
                name: '禅境花园',
                subtitle: '轻松一刻',
                desc: '种植、浇水、收获的宁静时光',
                color: 0x4CAF50,
                darkColor: 0x2E7D32,
                icon: '🌺'
            }
        ];

        // 布局参数
        const cols = 2;
        const btnWidth = 380;
        const btnHeight = 170;
        const spacingX = 30;
        const spacingY = 25;
        const totalGridWidth = cols * btnWidth + (cols - 1) * spacingX;
        const startX = (width - totalGridWidth) / 2;
        const startY = 80;

        modes.forEach((mode, i) => {
            const row = Math.floor(i / cols);
            const col = i % cols;
            const bx = startX + col * (btnWidth + spacingX);
            const by = startY + row * (btnHeight + spacingY);

            this.createModeButton(bx, by, btnWidth, btnHeight, mode);
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

    createModeButton(x, y, w, h, mode) {
        const container = this.add.container(x, y);

        // 背景
        const bg = this.add.graphics();
        bg.fillStyle(mode.color, 0.9);
        bg.fillRoundedRect(0, 0, w, h, 12);
        bg.fillStyle(mode.darkColor, 0.3);
        bg.fillRoundedRect(4, 4, w - 8, h - 8, 10);
        container.add(bg);

        // 图标
        const icon = this.add.text(40, h / 2 - 15, mode.icon, {
            font: '48px Arial'
        }).setOrigin(0.5, 0.5);
        container.add(icon);

        // 模式名称
        const nameText = this.add.text(90, h / 2 - 35, mode.name, {
            font: 'bold 26px Arial',
            fill: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0, 0.5);
        container.add(nameText);

        // 副标题
        const subtitle = this.add.text(90, h / 2, mode.subtitle, {
            font: '16px Arial',
            fill: '#DDDDDD'
        }).setOrigin(0, 0.5);
        container.add(subtitle);

        // 描述
        const desc = this.add.text(90, h / 2 + 30, mode.desc, {
            font: '13px Arial',
            fill: '#AAAAAA'
        }).setOrigin(0, 0.5);
        container.add(desc);

        // 交互区域
        const zone = this.add.zone(x + w / 2, y + h / 2, w, h)
            .setInteractive({ useHandCursor: true });

        zone.on('pointerover', () => {
            bg.clear();
            bg.fillStyle(mode.darkColor, 0.9);
            bg.fillRoundedRect(0, 0, w, h, 12);
            bg.fillStyle(mode.color, 0.2);
            bg.fillRoundedRect(4, 4, w - 8, h - 8, 10);
        });

        zone.on('pointerout', () => {
            bg.clear();
            bg.fillStyle(mode.color, 0.9);
            bg.fillRoundedRect(0, 0, w, h, 12);
            bg.fillStyle(mode.darkColor, 0.3);
            bg.fillRoundedRect(4, 4, w - 8, h - 8, 10);
        });

        zone.on('pointerdown', () => {
            this.onModeSelected(mode.id);
        });
    }

    onModeSelected(modeId) {
        switch (modeId) {
            case 'mini':
                this.scene.start('MiniGameSelectScene');
                break;
            case 'puzzle':
                this.scene.start('PuzzleSelectScene');
                break;
            case 'survival':
                this.scene.start('GameScene', { mode: 'survival', level: 0 });
                break;
            case 'zengarden':
                this.scene.start('ZenGardenScene');
                break;
        }
    }
}
