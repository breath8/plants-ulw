// LevelSelectScene.js - 关卡选择场景（支持50关5世界）
class LevelSelectScene extends Phaser.Scene {
    constructor() {
        super('LevelSelectScene');
    }

    init(data) {
        this.worldIndex = data.worldIndex || 0;
        this.startLevel = this.worldIndex * 10;
        this.endLevel = this.startLevel + 9;
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // 解锁进度
        this.unlockedLevel = saveManager.getUnlockedLevel();

        // 背景
        const bg = this.add.graphics();
        const bgColors = [
            0x4A90D9, // Day - 蓝色天空
            0x1a1a2e, // Night - 深蓝夜
            0x4A90D9, // Pool - 蓝色
            0x263238, // Fog - 灰暗
            0xFF8F00  // Roof - 橙黄
        ];
        const bgColor = bgColors[this.worldIndex] || bgColors[0];
        bg.fillGradientStyle(bgColor, bgColor, bgColor, bgColor);
        bg.fillRect(0, 0, width, height);

        // 草地
        bg.fillStyle(0x4A8C2A);
        bg.fillRect(0, height * 0.45, width, height * 0.55);
        bg.fillStyle(0x3D7A1F);
        bg.fillRect(0, height * 0.45, width, 15);

        // 世界标题
        const worldNames = ['白天 - 前院', '夜晚 - 前院', '泳池 - 后院', '迷雾 - 后院', '屋顶'];
        this.add.text(width / 2, 25, worldNames[this.worldIndex], {
            font: 'bold 28px Arial',
            fill: '#FFD700',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5, 0.5);

        // 关卡子标题
        const levelRange = `${this.worldIndex + 1}-1 ~ ${this.worldIndex + 1}-10`;
        this.add.text(width / 2, 55, levelRange, {
            font: '18px Arial',
            fill: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5, 0.5);

        // 关卡按钮网格 - 2行5列
        const startX = width / 2 - 220;
        const startY = 100;
        const spacingX = 110;
        const spacingY = 140;

        for (let i = 0; i < 10; i++) {
            const row = Math.floor(i / 5);
            const col = i % 5;
            const bx = startX + col * spacingX;
            const by = startY + row * spacingY;

            const globalLevel = this.startLevel + i;
            const isUnlocked = globalLevel <= this.unlockedLevel;
            const isCleared = globalLevel < this.unlockedLevel;
            const isCurrent = globalLevel === this.unlockedLevel;

            this.createLevelButton(bx, by, i, globalLevel, isUnlocked, isCleared, isCurrent);
        }

        // 返回按钮 - 左下角
        const backX = 80;
        const backY = height - 40;
        const backBg = this.add.graphics();
        backBg.fillStyle(0x666666);
        backBg.fillRoundedRect(backX - 50, backY - 20, 100, 40, 10);
        this.add.text(backX, backY, '← 世界', {
            font: 'bold 18px Arial',
            fill: '#FFFFFF'
        }).setOrigin(0.5, 0.5);

        const backZone = this.add.zone(backX, backY, 100, 40).setInteractive({ useHandCursor: true });
        backZone.on('pointerdown', () => this.scene.start('WorldSelectScene'));
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

        // 进度显示
        const worldProgress = saveManager.getWorldProgress(this.worldIndex);
        this.add.text(width / 2, height - 25, `已完成 ${worldProgress.completed}/10`, {
            font: '14px Arial',
            fill: '#CCCCCC',
            stroke: '#000000',
            strokeThickness: 1
        }).setOrigin(0.5, 0.5);
    }

    createLevelButton(x, y, localIndex, globalLevel, isUnlocked, isCleared, isCurrent) {
        const container = this.add.container(x, y);
        const size = 80;

        // 按钮背景
        const bg = this.add.graphics();
        if (isCurrent) {
            // 当前可玩关卡 - 高亮
            bg.fillStyle(0x4CAF50);
            bg.fillRoundedRect(-size / 2, -size / 2, size, size, 10);
            bg.lineStyle(3, 0xFFD700);
            bg.strokeRoundedRect(-size / 2, -size / 2, size, size, 10);
        } else if (isCleared) {
            // 已通关
            bg.fillStyle(0x2E7D32);
            bg.fillRoundedRect(-size / 2, -size / 2, size, size, 10);
            bg.fillStyle(0x388E3C);
            bg.fillRoundedRect(-size / 2 + 3, -size / 2 + 3, size - 6, size - 6, 8);
        } else if (isUnlocked) {
            // 已解锁但未通过
            bg.fillStyle(0x558B2F);
            bg.fillRoundedRect(-size / 2, -size / 2, size, size, 10);
        } else {
            // 未解锁
            bg.fillStyle(0x444444);
            bg.fillRoundedRect(-size / 2, -size / 2, size, size, 10);
        }
        container.add(bg);

        // 关卡编号
        const levelNum = this.worldIndex * 10 + localIndex + 1;
        const levelStr = `${this.worldIndex + 1}-${localIndex + 1}`;

        if (isUnlocked) {
            const numText = this.add.text(0, -8, levelStr, {
                font: 'bold 17px Arial',
                fill: '#FFFFFF',
                stroke: '#000000',
                strokeThickness: 2
            }).setOrigin(0.5, 0.5);
            container.add(numText);
        } else {
            // 锁定图标
            const lockIcon = this.add.text(0, -5, '🔒', {
                font: '18px Arial'
            }).setOrigin(0.5, 0.5);
            container.add(lockIcon);

            const numText = this.add.text(0, 20, levelStr, {
                font: '12px Arial',
                fill: '#888888'
            }).setOrigin(0.5, 0.5);
            container.add(numText);
        }

        // 通关标记
        if (isCleared) {
            const star = this.add.text(size / 2 - 12, -size / 2 + 8, '★', {
                font: '18px Arial',
                fill: '#FFD700'
            }).setOrigin(0.5, 0.5);
            container.add(star);
        }

        // 交互 - 只有已解锁的可以点击
        if (isUnlocked) {
            const zone = this.add.zone(x, y, size, size).setInteractive({ useHandCursor: true });
            zone.on('pointerdown', () => {
                this.scene.start('GameScene', { level: globalLevel });
            });
            zone.on('pointerover', () => {
                if (!isCleared) {
                    container.setScale(1.1);
                }
            });
            zone.on('pointerout', () => {
                container.setScale(1);
            });
        }
    }
}
