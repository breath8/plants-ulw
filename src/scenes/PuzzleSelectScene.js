// PuzzleSelectScene.js - 解谜模式选择
class PuzzleSelectScene extends Phaser.Scene {
    constructor() {
        super('PuzzleSelectScene');
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // 重置相机状态
        this.cameras.main.resetFX();

        // 背景
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x1a0a2e, 0x2d1b4e, 0x1a1a2e, 0x16213e);
        bg.fillRect(0, 0, width, height);

        // 标题
        this.add.text(width / 2, 30, '解谜模式', {
            font: 'bold 32px Arial',
            fill: '#FFD700',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5, 0.5);

        this.add.text(width / 2, 60, '选择一种解谜玩法', {
            font: '16px Arial',
            fill: '#CCCCCC'
        }).setOrigin(0.5, 0.5);

        // 两种解谜模式
        const puzzles = [
            {
                id: 'vasebreaker',
                name: '砸花瓶',
                subtitle: '砸开花瓶，消灭僵尸',
                desc: '每个花瓶里藏着植物或僵尸，小心选择！',
                levels: VASEBREAKER_LEVELS,
                icon: '🏺',
                color: 0xFF8F00
            },
            {
                id: 'izombie',
                name: '我是僵尸',
                subtitle: '控制僵尸，吃掉脑子',
                desc: '从僵尸的视角挑战植物防线！',
                levels: IZOMBIE_LEVELS,
                icon: '🧟',
                color: 0x7B1FA2
            }
        ];

        const startY = 95;
        const btnWidth = 420;
        const btnHeight = 150;
        const btnX = width / 2 - btnWidth / 2;

        puzzles.forEach((puzzle, i) => {
            const by = startY + i * (btnHeight + 20);

            // 主按钮
            const bg = this.add.graphics();
            bg.fillStyle(puzzle.color, 0.85);
            bg.fillRoundedRect(btnX, by, btnWidth, btnHeight, 12);
            bg.fillStyle(0x000000, 0.1);
            bg.fillRoundedRect(btnX + 3, by + 3, btnWidth - 6, btnHeight - 6, 10);

            // 图标
            this.add.text(btnX + 50, by + btnHeight / 2 - 10, puzzle.icon, {
                font: '42px Arial'
            }).setOrigin(0.5, 0.5);

            // 名称
            this.add.text(btnX + 100, by + 35, puzzle.name, {
                font: 'bold 26px Arial',
                fill: '#FFFFFF',
                stroke: '#000000',
                strokeThickness: 2
            }).setOrigin(0, 0.5);

            // 副标题
            this.add.text(btnX + 100, by + 62, puzzle.subtitle, {
                font: '16px Arial',
                fill: '#DDDDDD'
            }).setOrigin(0, 0.5);

            // 描述
            this.add.text(btnX + 100, by + 88, puzzle.desc, {
                font: '13px Arial',
                fill: '#BBBBBB'
            }).setOrigin(0, 0.5);

            // 关卡数
            this.add.text(btnX + btnWidth - 15, by + btnHeight - 12, `${puzzle.levels.length}关`, {
                font: '12px Arial',
                fill: '#AAAAAA'
            }).setOrigin(1, 0.5);

            // 交互
            const zone = this.add.zone(btnX + btnWidth / 2, by + btnHeight / 2, btnWidth, btnHeight)
                .setInteractive({ useHandCursor: true });

            zone.on('pointerover', () => {
                bg.clear();
                bg.fillStyle(puzzle.color, 1);
                bg.fillRoundedRect(btnX, by, btnWidth, btnHeight, 12);
                bg.fillStyle(0xFFFFFF, 0.05);
                bg.fillRoundedRect(btnX + 3, by + 3, btnWidth - 6, btnHeight - 6, 10);
            });

            zone.on('pointerout', () => {
                bg.clear();
                bg.fillStyle(puzzle.color, 0.85);
                bg.fillRoundedRect(btnX, by, btnWidth, btnHeight, 12);
                bg.fillStyle(0x000000, 0.1);
                bg.fillRoundedRect(btnX + 3, by + 3, btnWidth - 6, btnHeight - 6, 10);
            });

            zone.on('pointerdown', () => {
                if (puzzle.id === 'vasebreaker') {
                    this.scene.start('VasebreakerScene', { level: 0 });
                } else {
                    this.scene.start('IZombieScene', { level: 0 });
                }
            });
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
}
