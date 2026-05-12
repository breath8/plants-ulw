// SettingsScene.js - 游戏设置场景
class SettingsScene extends Phaser.Scene {
    constructor() {
        super('SettingsScene');
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        const settings = saveManager.getSettings();

        // 重置相机状态
        this.cameras.main.resetFX();

        // 背景
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x1a1a2e, 0x16213e, 0x0f3460, 0x533483);
        bg.fillRect(0, 0, width, height);

        // 装饰星星
        for (let i = 0; i < 20; i++) {
            const star = this.add.graphics();
            star.fillStyle(0xFFFFFF, Math.random() * 0.5 + 0.2);
            star.fillCircle(Math.random() * width, Math.random() * height, Math.random() * 2 + 1);
        }

        // 标题
        this.add.text(width / 2, 50, '游戏设置', {
            font: 'bold 40px Arial',
            fill: '#FFD700',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5, 0.5);

        // 设置项容器
        const startY = 100;
        const rowHeight = 68;

        // === 初始阳光 ===
        this.createSettingRow(
            width / 2 - 200, startY,
            '初始阳光',
            settings.initialSun,
            (val) => `当前: ${val}`,
            (val) => {
                const clamped = Math.max(25, Math.min(9999, val));
                settings.initialSun = clamped;
                saveManager.updateSettings({ initialSun: clamped });
                this.refreshAll();
            },
            50, 100, 150, 200, 300, 500, 9999
        );

        // === 阳光掉落间隔 ===
        this.createSettingRow(
            width / 2 - 200, startY + rowHeight,
            '阳光掉落间隔',
            settings.sunFallInterval,
            (val) => `每 ${(val / 1000).toFixed(1)} 秒`,
            (val) => {
                const clamped = Math.max(2000, Math.min(60000, val));
                settings.sunFallInterval = clamped;
                saveManager.updateSettings({ sunFallInterval: clamped });
                this.refreshAll();
            },
            2000, 5000, 8000, 10000, 15000, 30000, 60000,
            (val) => `${val / 1000}秒`
        );

        // === 向日葵产出间隔 ===
        this.createSettingRow(
            width / 2 - 200, startY + rowHeight * 2,
            '向日葵产出间隔',
            settings.sunflowerInterval,
            (val) => `每 ${(val / 1000).toFixed(1)} 秒`,
            (val) => {
                const clamped = Math.max(3000, Math.min(60000, val));
                settings.sunflowerInterval = clamped;
                saveManager.updateSettings({ sunflowerInterval: clamped });
                this.refreshAll();
            },
            3000, 6000, 12000, 18000, 24000, 36000, 60000,
            (val) => `${val / 1000}秒`
        );

        // === 植物冷却倍率 ===
        this.createSettingSlider(
            width / 2 - 200, startY + rowHeight * 3,
            '植物冷却倍率',
            settings.cooldownMultiplier,
            0.25, 3, 0.25,
            (val) => `×${val.toFixed(2)}`,
            (val) => {
                const clamped = Math.max(0.25, Math.min(3, Math.round(val * 100) / 100));
                settings.cooldownMultiplier = clamped;
                saveManager.updateSettings({ cooldownMultiplier: clamped });
                this.refreshAll();
            }
        );

        // === 阳光消耗倍率 ===
        this.createSettingSlider(
            width / 2 - 200, startY + rowHeight * 4,
            '植物阳光消耗倍率',
            settings.costMultiplier,
            0.25, 3, 0.25,
            (val) => `×${val.toFixed(2)}`,
            (val) => {
                const clamped = Math.max(0.25, Math.min(3, Math.round(val * 100) / 100));
                settings.costMultiplier = clamped;
                saveManager.updateSettings({ costMultiplier: clamped });
                this.refreshAll();
            }
        );

        // === 自动收集阳光 ===
        this.createToggleRow(
            width / 2 - 200, startY + rowHeight * 5,
            '自动收集阳光',
            settings.autoCollectSun,
            (val) => {
                settings.autoCollectSun = val;
                saveManager.updateSettings({ autoCollectSun: val });
                this.refreshAll();
            }
        );

        // === 返回按钮 ===
        const btnX = width / 2;
        const btnY = height - 40;
        const btnBg = this.add.graphics();
        btnBg.fillStyle(0x666666);
        btnBg.fillRoundedRect(btnX - 80, btnY - 25, 160, 50, 10);

        this.add.text(btnX, btnY, '返回主菜单', {
            font: 'bold 22px Arial',
            fill: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5, 0.5);

        const backZone = this.add.zone(btnX, btnY, 160, 50).setInteractive({ useHandCursor: true });
        backZone.on('pointerdown', () => this.scene.start('MenuScene'));
        backZone.on('pointerover', () => {
            btnBg.clear();
            btnBg.fillStyle(0x888888);
            btnBg.fillRoundedRect(btnX - 80, btnY - 25, 160, 50, 10);
        });
        backZone.on('pointerout', () => {
            btnBg.clear();
            btnBg.fillStyle(0x666666);
            btnBg.fillRoundedRect(btnX - 80, btnY - 25, 160, 50, 10);
        });

        // 重置存档按钮
        const resetBtnX = width - 80;
        const resetBtnY = 50;
        const resetBg = this.add.graphics();
        resetBg.fillStyle(0x883333);
        resetBg.fillRoundedRect(resetBtnX - 50, resetBtnY - 18, 100, 36, 8);

        this.add.text(resetBtnX, resetBtnY, '重置存档', {
            font: '16px Arial',
            fill: '#FFAAAA',
            stroke: '#000000',
            strokeThickness: 1
        }).setOrigin(0.5, 0.5);

        const resetZone = this.add.zone(resetBtnX, resetBtnY, 100, 36).setInteractive({ useHandCursor: true });
        resetZone.on('pointerdown', () => {
            saveManager.reset();
            this.refreshAll();
            // 同步到 registry
            this.registry.set('unlockedLevel', 0);
        });
        resetZone.on('pointerover', () => {
            resetBg.clear();
            resetBg.fillStyle(0xCC4444);
            resetBg.fillRoundedRect(resetBtnX - 50, resetBtnY - 18, 100, 36, 8);
        });
        resetZone.on('pointerout', () => {
            resetBg.clear();
            resetBg.fillStyle(0x883333);
            resetBg.fillRoundedRect(resetBtnX - 50, resetBtnY - 18, 100, 36, 8);
        });

        // 存储刷新函数引用
        this._refreshAll = () => {};
    }

    // 创建离散值设置行（按钮组）
    // btnFormatFunc: 可选，自定义按钮标签格式；默认显示原始数值
    createSettingRow(x, y, label, currentValue, formatFunc, onChange, ...values) {
        // 最后一个参数可能是 btnFormatFunc
        let btnFormatFunc = null;
        if (values.length > 0 && typeof values[values.length - 1] === 'function') {
            btnFormatFunc = values.pop();
        }

        // 标签
        this.add.text(x + 200, y + 5, label, {
            font: 'bold 20px Arial',
            fill: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5, 0);

        // 当前值显示
        const valueText = this.add.text(x + 200, y + 30, formatFunc(currentValue), {
            font: '18px Arial',
            fill: '#FFD700'
        }).setOrigin(0.5, 0);

        // 预设按钮
        const btnStartX = x + 10;
        const btnWidth = 60;
        const btnGap = 8;
        const totalWidth = values.length * btnWidth + (values.length - 1) * btnGap;
        const btnAreaX = x + 200 - totalWidth / 2;

        values.forEach((val, i) => {
            const bx = btnAreaX + i * (btnWidth + btnGap);
            const by = y + 50;

            const active = currentValue === val;
            const btnBg = this.add.graphics();
            btnBg.fillStyle(active ? 0x4CAF50 : 0x555555);
            btnBg.fillRoundedRect(bx, by, btnWidth, 28, 5);

            const label2 = btnFormatFunc ? btnFormatFunc(val) : (val >= 10000 ? String(val) : String(val));
            const btnText = this.add.text(bx + btnWidth / 2, by + 14, label2, {
                font: '13px Arial',
                fill: active ? '#FFFFFF' : '#AAAAAA'
            }).setOrigin(0.5, 0.5);

            const zone = this.add.zone(bx + btnWidth / 2, by + 14, btnWidth, 28).setInteractive({ useHandCursor: true });
            zone.on('pointerdown', () => {
                onChange(val);
            });
            zone.on('pointerover', () => {
                if (currentValue !== val) {
                    btnBg.clear();
                    btnBg.fillStyle(0x777777);
                    btnBg.fillRoundedRect(bx, by, btnWidth, 28, 5);
                }
            });
            zone.on('pointerout', () => {
                btnBg.clear();
                btnBg.fillStyle(currentValue === val ? 0x4CAF50 : 0x555555);
                btnBg.fillRoundedRect(bx, by, btnWidth, 28, 5);
            });
        });
    }

    // 创建滑块设置行
    createSettingSlider(x, y, label, currentValue, min, max, step, formatFunc, onChange) {
        // 标签
        this.add.text(x + 200, y + 5, label, {
            font: 'bold 20px Arial',
            fill: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5, 0);

        // 当前值显示
        const valueText = this.add.text(x + 200, y + 30, formatFunc(currentValue), {
            font: '18px Arial',
            fill: '#FFD700'
        }).setOrigin(0.5, 0);

        // 滑块背景
        const sliderX = x + 100;
        const sliderY = y + 55;
        const sliderWidth = 200;

        const sliderBg = this.add.graphics();
        sliderBg.fillStyle(0x333333);
        sliderBg.fillRoundedRect(sliderX, sliderY, sliderWidth, 8, 4);

        // 滑块填充
        const ratio = (currentValue - min) / (max - min);
        const fillX = sliderX + ratio * sliderWidth;
        const sliderFill = this.add.graphics();
        sliderFill.fillStyle(0x4CAF50);
        sliderFill.fillRoundedRect(sliderX, sliderY, fillX - sliderX, 8, 4);

        // 滑块手柄
        const handle = this.add.graphics();
        handle.fillStyle(0xFFFFFF);
        handle.fillCircle(fillX, sliderY + 4, 10);

        // 减号按钮
        const decBg = this.add.graphics();
        decBg.fillStyle(0x555555);
        decBg.fillCircle(sliderX - 20, sliderY + 4, 12);
        this.add.text(sliderX - 20, sliderY + 4, '-', {
            font: 'bold 18px Arial', fill: '#FFFFFF'
        }).setOrigin(0.5, 0.5);

        const decZone = this.add.zone(sliderX - 20, sliderY + 4, 24, 24).setInteractive({ useHandCursor: true });
        decZone.on('pointerdown', () => {
            const newVal = Math.max(min, Math.round((currentValue - step) / step) * step);
            onChange(newVal);
        });

        // 加号按钮
        const incBg = this.add.graphics();
        incBg.fillStyle(0x555555);
        incBg.fillCircle(sliderX + sliderWidth + 20, sliderY + 4, 12);
        this.add.text(sliderX + sliderWidth + 20, sliderY + 4, '+', {
            font: 'bold 18px Arial', fill: '#FFFFFF'
        }).setOrigin(0.5, 0.5);

        const incZone = this.add.zone(sliderX + sliderWidth + 20, sliderY + 4, 24, 24).setInteractive({ useHandCursor: true });
        incZone.on('pointerdown', () => {
            const newVal = Math.min(max, Math.round((currentValue + step) / step) * step);
            onChange(newVal);
        });
    }

    // 创建开关设置行
    createToggleRow(x, y, label, currentValue, onChange) {
        // 标签
        this.add.text(x + 200, y + 5, label, {
            font: 'bold 20px Arial',
            fill: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5, 0);

        // 状态文字
        const statusText = this.add.text(x + 200, y + 30, currentValue ? '已开启' : '已关闭', {
            font: '18px Arial',
            fill: currentValue ? '#66BB6A' : '#FF6666'
        }).setOrigin(0.5, 0);

        // 开关背景
        const toggleX = x + 200 - 30;
        const toggleY = y + 55;
        const toggleWidth = 60;
        const toggleHeight = 30;

        const toggleBg = this.add.graphics();
        const bgColor = currentValue ? 0x4CAF50 : 0x555555;
        toggleBg.fillStyle(bgColor);
        toggleBg.fillRoundedRect(toggleX, toggleY, toggleWidth, toggleHeight, 15);

        // 开关滑块
        const knobX = currentValue ? toggleX + toggleWidth - 26 : toggleX + 4;
        const knob = this.add.graphics();
        knob.fillStyle(0xFFFFFF);
        knob.fillCircle(knobX + 11, toggleY + 15, 11);

        // 交互区域
        const zone = this.add.zone(x + 200, toggleY + 15, 100, 36).setInteractive({ useHandCursor: true });
        zone.on('pointerdown', () => {
            onChange(!currentValue);
        });
        zone.on('pointerover', () => {
            toggleBg.clear();
            toggleBg.fillStyle(currentValue ? 0x66BB6A : 0x777777);
            toggleBg.fillRoundedRect(toggleX, toggleY, toggleWidth, toggleHeight, 15);
        });
        zone.on('pointerout', () => {
            toggleBg.clear();
            toggleBg.fillStyle(currentValue ? 0x4CAF50 : 0x555555);
            toggleBg.fillRoundedRect(toggleX, toggleY, toggleWidth, toggleHeight, 15);
        });
    }

    // 刷新当前页面（重新应用设置）
    refreshAll() {
        this.scene.restart();
    }
}
