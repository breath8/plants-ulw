// MenuScene.js - 主菜单场景
class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // 重置相机状态
        this.cameras.main.resetFX();

        // 背景
        const bg = this.add.graphics();
        // 天空渐变
        bg.fillGradientStyle(0x87CEEB, 0x87CEEB, 0x4A90D9, 0x4A90D9);
        bg.fillRect(0, 0, width, height / 2);
        // 草地
        bg.fillStyle(0x4A8C2A);
        bg.fillRect(0, height / 2, width, height / 2);
        bg.fillStyle(0x3D7A1F);
        bg.fillRect(0, height / 2, width, 20);

        // 草地纹理
        for (let i = 0; i < 30; i++) {
            const x = Math.random() * width;
            const y = height / 2 + 20 + Math.random() * (height / 2 - 40);
            bg.fillStyle(0x5AA035, 0.3);
            bg.fillEllipse(x, y, 8, 15);
        }

        // 标题背景
        const titleBg = this.add.graphics();
        titleBg.fillStyle(0x000000, 0.3);
        titleBg.fillRoundedRect(width / 2 - 280, 60, 560, 120, 20);

        // 标题
        const title = this.add.text(width / 2, 100, '植物大战僵尸', {
            font: 'bold 52px Arial',
            fill: '#FFD700',
            stroke: '#000000',
            strokeThickness: 6,
            shadow: { offsetX: 3, offsetY: 3, color: '#000', blur: 5, fill: true }
        }).setOrigin(0.5, 0.5);

        const subtitle = this.add.text(width / 2, 150, '复刻版 - 前10关', {
            font: 'bold 24px Arial',
            fill: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5, 0.5);

        // 装饰 - 太阳
        const sun = this.add.graphics();
        sun.fillStyle(0xFFD700);
        sun.fillCircle(0, 0, 40);
        sun.fillStyle(0xFFEC8B);
        sun.fillCircle(0, 0, 30);
        sun.fillStyle(0xFFFF99, 0.5);
        sun.fillCircle(-8, -8, 12);
        sun.setPosition(150, 100);

        this.tweens.add({
            targets: sun,
            angle: 360,
            duration: 8000,
            repeat: -1
        });
        this.tweens.add({
            targets: sun,
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 1500,
            yoyo: true,
            repeat: -1
        });

        // 开始按钮
        const btnX = width / 2;
        const btnY = 320;
        const btnBg = this.add.graphics();
        btnBg.fillStyle(0x4CAF50);
        btnBg.fillRoundedRect(btnX - 120, btnY - 35, 240, 70, 15);
        btnBg.fillStyle(0x66BB6A);
        btnBg.fillRoundedRect(btnX - 115, btnY - 30, 230, 30, 10);

        const btnText = this.add.text(btnX, btnY, '开始冒险', {
            font: 'bold 32px Arial',
            fill: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5, 0.5);

        const btnZone = this.add.zone(btnX, btnY, 240, 70).setInteractive({ useHandCursor: true });

        btnZone.on('pointerover', () => {
            btnBg.clear();
            btnBg.fillStyle(0x66BB6A);
            btnBg.fillRoundedRect(btnX - 120, btnY - 35, 240, 70, 15);
            btnBg.fillStyle(0x81C784);
            btnBg.fillRoundedRect(btnX - 115, btnY - 30, 230, 30, 10);
        });

        btnZone.on('pointerout', () => {
            btnBg.clear();
            btnBg.fillStyle(0x4CAF50);
            btnBg.fillRoundedRect(btnX - 120, btnY - 35, 240, 70, 15);
            btnBg.fillStyle(0x66BB6A);
            btnBg.fillRoundedRect(btnX - 115, btnY - 30, 230, 30, 10);
        });

        btnZone.on('pointerdown', () => {
            this.scene.start('LevelSelectScene');
        });

        // 版本信息
        this.add.text(width / 2, height - 30, '使用 Phaser 3 + 纯图形绘制 | v1.0', {
            font: '14px Arial',
            fill: '#AAAAAA'
        }).setOrigin(0.5, 0.5);

        // 入场动画
        title.setScale(0);
        subtitle.setAlpha(0);
        btnBg.setAlpha(0);
        btnText.setAlpha(0);

        this.tweens.add({
            targets: title,
            scaleX: 1,
            scaleY: 1,
            duration: 500,
            ease: 'Back.easeOut'
        });

        this.time.delayedCall(300, () => {
            this.tweens.add({ targets: subtitle, alpha: 1, duration: 300 });
        });

        this.time.delayedCall(500, () => {
            this.tweens.add({ targets: [btnBg, btnText, btnZone], alpha: 1, duration: 300 });
        });
    }
}
