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

        // 初始化音频管理器并播放菜单BGM
        audioManager.init(this);
        audioManager.playBGM('bgm_menu');

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

        // 标题木牌
        const signW = 540;
        const signH = 120;
        const signX = width / 2 - signW / 2;
        const signY = 38;

        const titleBg = this.add.graphics();
        // 阴影
        titleBg.fillStyle(0x1A0E05, 0.5);
        titleBg.fillRoundedRect(signX + 2, signY + 4, signW, signH, 14);
        // 外框
        titleBg.fillStyle(0x3D2B10);
        titleBg.fillRoundedRect(signX - 4, signY - 4, signW + 8, signH + 8, 14);
        // 主体棕色
        titleBg.fillStyle(0x6B4226);
        titleBg.fillRoundedRect(signX, signY, signW, signH, 12);
        // 木纹
        titleBg.lineStyle(1, 0x5A3520, 0.4);
        for (let i = 0; i < 10; i++) {
            const ly = signY + 6 + i * 12;
            titleBg.beginPath();
            titleBg.moveTo(signX + 10, ly);
            titleBg.lineTo(signX + signW - 10, ly + Phaser.Math.Between(-1, 1));
            titleBg.strokePath();
        }
        // 上部高光
        titleBg.fillStyle(0x8B6234, 0.35);
        titleBg.fillRoundedRect(signX + 4, signY + 4, signW - 8, signH / 2 - 6, { tl: 10, tr: 10, bl: 0, br: 0 });
        // 下部暗影
        titleBg.fillStyle(0x3D2B10, 0.25);
        titleBg.fillRoundedRect(signX + 4, signY + signH / 2 + 2, signW - 8, signH / 2 - 8, { tl: 0, tr: 0, bl: 10, br: 10 });
        // 边框线
        titleBg.lineStyle(2, 0xA08050, 0.3);
        titleBg.strokeRoundedRect(signX + 1, signY + 1, signW - 2, signH - 2, 11);
        // 四角铆钉
        [
            [signX + 20, signY + 20],
            [signX + signW - 20, signY + 20],
            [signX + 20, signY + signH - 20],
            [signX + signW - 20, signY + signH - 20]
        ].forEach(([nx, ny]) => {
            titleBg.fillStyle(0x8B7355);
            titleBg.fillCircle(nx, ny, 7);
            titleBg.fillStyle(0xA08B6A);
            titleBg.fillCircle(nx - 1, ny - 1, 4);
            titleBg.fillStyle(0xC0A880, 0.6);
            titleBg.fillCircle(nx - 2, ny - 2, 2);
        });

        // 标题文字
        const title = this.add.text(width / 2, signY + signH / 2 - 10, '植物大战僵尸', {
            font: 'bold 48px "Microsoft YaHei", "SimHei", Arial',
            fill: '#FFD700',
            stroke: '#5C3A1E',
            strokeThickness: 7,
            shadow: { offsetX: 3, offsetY: 4, color: '#2A1A08', blur: 6, fill: true }
        }).setOrigin(0.5, 0.5);

        const subtitle = this.add.text(width / 2, signY + signH / 2 + 34, 'Plants vs. Zombies · 复刻版', {
            font: '15px "Microsoft YaHei", "SimHei", Arial',
            fill: '#E8D8B0',
            stroke: '#3D2B10',
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
            this.scene.start('WorldSelectScene');
        });

        // === 额外模式按钮 ===
        const extraBtnX = width / 2;
        const extraBtnY = 370;
        const extraBtnBg = this.add.graphics();
        extraBtnBg.fillStyle(0xE91E63);
        extraBtnBg.fillRoundedRect(extraBtnX - 100, extraBtnY - 25, 200, 50, 10);
        extraBtnBg.fillStyle(0xF06292);
        extraBtnBg.fillRoundedRect(extraBtnX - 95, extraBtnY - 20, 190, 22, 8);

        const extraBtnText = this.add.text(extraBtnX, extraBtnY, '额外模式', {
            font: 'bold 24px Arial',
            fill: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5, 0.5);

        const extraBtnZone = this.add.zone(extraBtnX, extraBtnY, 200, 50).setInteractive({ useHandCursor: true });
        extraBtnZone.on('pointerover', () => {
            extraBtnBg.clear();
            extraBtnBg.fillStyle(0xF06292);
            extraBtnBg.fillRoundedRect(extraBtnX - 100, extraBtnY - 25, 200, 50, 10);
            extraBtnBg.fillStyle(0xF48FB1);
            extraBtnBg.fillRoundedRect(extraBtnX - 95, extraBtnY - 20, 190, 22, 8);
        });
        extraBtnZone.on('pointerout', () => {
            extraBtnBg.clear();
            extraBtnBg.fillStyle(0xE91E63);
            extraBtnBg.fillRoundedRect(extraBtnX - 100, extraBtnY - 25, 200, 50, 10);
            extraBtnBg.fillStyle(0xF06292);
            extraBtnBg.fillRoundedRect(extraBtnX - 95, extraBtnY - 20, 190, 22, 8);
        });
        extraBtnZone.on('pointerdown', () => {
            this.scene.start('ExtraModeSelectScene');
        });

        // === 设置按钮 ===
        const setBtnX = width / 2;
        const setBtnY = 430;
        const setBtnBg = this.add.graphics();
        setBtnBg.fillStyle(0x2196F3);
        setBtnBg.fillRoundedRect(setBtnX - 100, setBtnY - 25, 200, 50, 10);
        setBtnBg.fillStyle(0x42A5F5);
        setBtnBg.fillRoundedRect(setBtnX - 95, setBtnY - 20, 190, 22, 8);

        const setBtnText = this.add.text(setBtnX, setBtnY, '游戏设置', {
            font: 'bold 24px Arial',
            fill: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5, 0.5);

        const setBtnZone = this.add.zone(setBtnX, setBtnY, 200, 50).setInteractive({ useHandCursor: true });
        setBtnZone.on('pointerover', () => {
            setBtnBg.clear();
            setBtnBg.fillStyle(0x42A5F5);
            setBtnBg.fillRoundedRect(setBtnX - 100, setBtnY - 25, 200, 50, 10);
            setBtnBg.fillStyle(0x64B5F6);
            setBtnBg.fillRoundedRect(setBtnX - 95, setBtnY - 20, 190, 22, 8);
        });
        setBtnZone.on('pointerout', () => {
            setBtnBg.clear();
            setBtnBg.fillStyle(0x2196F3);
            setBtnBg.fillRoundedRect(setBtnX - 100, setBtnY - 25, 200, 50, 10);
            setBtnBg.fillStyle(0x42A5F5);
            setBtnBg.fillRoundedRect(setBtnX - 95, setBtnY - 20, 190, 22, 8);
        });
        setBtnZone.on('pointerdown', () => {
            this.scene.start('SettingsScene');
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
        extraBtnBg.setAlpha(0);
        extraBtnText.setAlpha(0);
        setBtnBg.setAlpha(0);
        setBtnText.setAlpha(0);

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
        this.time.delayedCall(650, () => {
            this.tweens.add({ targets: [extraBtnBg, extraBtnText, extraBtnZone], alpha: 1, duration: 300 });
        });
        this.time.delayedCall(800, () => {
            this.tweens.add({ targets: [setBtnBg, setBtnText, setBtnZone], alpha: 1, duration: 300 });
        });
    }
}
