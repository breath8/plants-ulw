// Sun.js - 阳光实体
class Sun extends Phaser.GameObjects.Container {
    constructor(scene, x, y, targetY, isFromSky = true) {
        super(scene, x, y);
        scene.add.existing(this);

        this.value = SUN.sunValue;
        this.isFromSky = isFromSky;
        this.targetY = targetY || y + 100;
        this.collected = false;
        this.lifetime = SUN.lifetime;

        // 创建阳光图形
        this.createVisual();

        // 设置交互 - 使用hitArea
        this.setSize(50, 50);
        this.setInteractive(new Phaser.Geom.Circle(0, 0, 25), Phaser.Geom.Circle.Contains);

        // 点击收集
        this.on('pointerdown', () => {
            this.collect();
        });

        // 下落动画
        if (isFromSky) {
            scene.tweens.add({
                targets: this,
                y: this.targetY,
                duration: 3000,
                ease: 'Sine.easeOut',
                onComplete: () => {
                    this.startFadeTimer();
                }
            });
        } else {
            // 向日葵产出 - 先弹出再下落
            scene.tweens.add({
                targets: this,
                y: y - 40,
                x: x + Phaser.Math.Between(-30, 30),
                duration: 500,
                ease: 'Quad.easeOut',
                onComplete: () => {
                    scene.tweens.add({
                        targets: this,
                        y: y + 40,
                        duration: 1500,
                        ease: 'Sine.easeIn',
                        onComplete: () => {
                            this.startFadeTimer();
                        }
                    });
                }
            });
        }

        // 脉冲动画
        scene.tweens.add({
            targets: this,
            scaleX: 1.15,
            scaleY: 1.15,
            duration: 600,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    createVisual() {
        this.visual = this.scene.add.graphics();
        this.drawSun();
        this.add(this.visual);
    }

    drawSun() {
        this.visual.clear();

        // 外圈光晕
        this.visual.fillStyle(0xFFD700, 0.3);
        this.visual.fillCircle(0, 0, 25);

        // 主体
        this.visual.fillStyle(0xFFD700);
        this.visual.fillCircle(0, 0, 18);

        // 内圈
        this.visual.fillStyle(0xFFEC8B);
        this.visual.fillCircle(0, 0, 14);

        // 高光
        this.visual.fillStyle(0xFFFF99, 0.5);
        this.visual.fillCircle(-5, -5, 6);

        // 25数字
        const txt = this.scene.add.text(0, 0, '25', {
            font: 'bold 11px Arial',
            fill: '#8B6914'
        }).setOrigin(0.5, 0.5);
        this.add(txt);
    }

    startFadeTimer() {
        this.fadeTimer = this.scene.time.delayedCall(this.lifetime, () => {
            if (!this.collected) {
                this.fadeAway();
            }
        });

        // 快消失时闪烁
        this.scene.time.delayedCall(this.lifetime - 2000, () => {
            if (!this.collected) {
                this.blinkTween = this.scene.tweens.add({
                    targets: this,
                    alpha: 0.3,
                    duration: 300,
                    yoyo: true,
                    repeat: 5
                });
            }
        });
    }

    collect() {
        if (this.collected) return;
        this.collected = true;

        // 停止所有动画
        this.scene.tweens.killTweensOf(this);
        if (this.blinkTween) this.blinkTween.stop();
        if (this.fadeTimer) this.fadeTimer.destroy();

        // 更新阳光数量
        this.scene.sunAmount += this.value;
        this.scene.updateSunDisplay();

        // 飞向阳光计数器动画
        this.scene.tweens.add({
            targets: this,
            x: 80,
            y: 25,
            scaleX: 0.4,
            scaleY: 0.4,
            alpha: 0.8,
            duration: 400,
            ease: 'Power2',
            onComplete: () => {
                this.destroy();
            }
        });
    }

    fadeAway() {
        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            duration: 500,
            onComplete: () => {
                this.destroy();
            }
        });
    }
}
