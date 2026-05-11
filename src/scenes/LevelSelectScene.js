// LevelSelectScene.js - 关卡选择场景
class LevelSelectScene extends Phaser.Scene {
    constructor() {
        super('LevelSelectScene');
        this.currentLevel = 0;
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // 从registry获取进度
        if (!this.registry.has('unlockedLevel')) {
            this.registry.set('unlockedLevel', 0);
        }
        const unlockedLevel = this.registry.get('unlockedLevel');

        // 背景
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x87CEEB, 0x87CEEB, 0x4A90D9, 0x4A90D9);
        bg.fillRect(0, 0, width, height / 2);
        bg.fillStyle(0x4A8C2A);
        bg.fillRect(0, height / 2, width, height / 2);

        // 标题
        this.add.text(width / 2, 40, '选择关卡', {
            font: 'bold 36px Arial',
            fill: '#FFD700',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5, 0.5);

        // 关卡按钮网格 - 2行5列
        const startX = width / 2 - 200;
        const startY = 120;
        const spacing = 100;

        for (let i = 0; i < 10; i++) {
            const row = Math.floor(i / 5);
            const col = i % 5;
            const x = startX + col * spacing;
            const y = startY + row * spacing;
            const isUnlocked = i <= unlockedLevel;

            this.createLevelButton(x, y, i, isUnlocked);
        }

        // 返回按钮
        const backX = 80;
        const backY = height - 50;
        const backBg = this.add.graphics();
        backBg.fillStyle(0x666666);
        backBg.fillRoundedRect(backX - 50, backY - 20, 100, 40, 10);

        const backText = this.add.text(backX, backY, '返回', {
            font: 'bold 20px Arial',
            fill: '#FFFFFF'
        }).setOrigin(0.5, 0.5);

        const backZone = this.add.zone(backX, backY, 100, 40).setInteractive({ useHandCursor: true });
        backZone.on('pointerdown', () => {
            this.scene.start('MenuScene');
        });
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

        // 玩法提示
        this.add.text(width / 2, height - 40, '点击关卡开始游戏 | 种植物抵御僵尸', {
            font: '16px Arial',
            fill: '#CCCCCC'
        }).setOrigin(0.5, 0.5);

        this.cameras.main.fadeIn(300);
    }

    createLevelButton(x, y, levelIndex, isUnlocked) {
        const container = this.add.container(x, y);

        // 按钮背景
        const bg = this.add.graphics();
        if (isUnlocked) {
            bg.fillStyle(0x4CAF50);
        } else {
            bg.fillStyle(0x666666);
        }
        bg.fillRoundedRect(-35, -30, 70, 60, 10);

        if (isUnlocked) {
            bg.fillStyle(0x66BB6A);
            bg.fillRoundedRect(-30, -25, 60, 25, 8);
        }

        container.add(bg);

        // 关卡编号
        const levelText = this.add.text(0, -5, `1-${levelIndex + 1}`, {
            font: 'bold 22px Arial',
            fill: isUnlocked ? '#FFFFFF' : '#999999'
        }).setOrigin(0.5, 0.5);
        container.add(levelText);

        // 描述（已解锁时显示）
        if (isUnlocked && LEVELS[levelIndex]) {
            const desc = this.add.text(0, 18, LEVELS[levelIndex].name, {
                font: '12px Arial',
                fill: '#CCCCCC'
            }).setOrigin(0.5, 0.5);
            container.add(desc);
        }

        // 锁图标
        if (!isUnlocked) {
            const lock = this.add.text(0, -5, '🔒', {
                font: '20px Arial'
            }).setOrigin(0.5, 0.5);
            container.add(lock);
        }

        // 交互
        if (isUnlocked) {
            const zone = this.add.zone(x, y, 70, 60).setInteractive({ useHandCursor: true });
            zone.on('pointerover', () => {
                bg.clear();
                bg.fillStyle(0x66BB6A);
                bg.fillRoundedRect(-35, -30, 70, 60, 10);
                bg.fillStyle(0x81C784);
                bg.fillRoundedRect(-30, -25, 60, 25, 8);
                container.setScale(1.05);
            });
            zone.on('pointerout', () => {
                bg.clear();
                bg.fillStyle(0x4CAF50);
                bg.fillRoundedRect(-35, -30, 70, 60, 10);
                bg.fillStyle(0x66BB6A);
                bg.fillRoundedRect(-30, -25, 60, 25, 8);
                container.setScale(1);
            });
            zone.on('pointerdown', () => {
                this.cameras.main.fadeOut(300);
                this.cameras.main.once('camerafadeoutcomplete', () => {
                    this.scene.start('GameScene', { level: levelIndex });
                });
            });
        }

        // 入场动画
        container.setScale(0);
        this.tweens.add({
            targets: container,
            scaleX: 1,
            scaleY: 1,
            duration: 300,
            delay: levelIndex * 50,
            ease: 'Back.easeOut'
        });
    }
}
