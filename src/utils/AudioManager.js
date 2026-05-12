// AudioManager.js - 全局音频管理器（单例）
// 管理背景音乐（BGM）和音效（SFX）的播放
const audioManager = {
    currentBGM: null,
    bgmVolume: 0.5,
    sfxVolume: 0.7,
    scene: null,
    pendingBGM: null,     // 等待解锁后播放的BGM key
    unlocked: false,

    // 初始化 - 保存场景引用
    init(scene) {
        this.scene = scene;

        if (!this.scene.sound) return;

        // 如果已解锁
        if (!this.scene.sound.locked) {
            this.unlocked = true;
            return;
        }

        // 尝试立即恢复音频上下文
        if (this.scene.sound.context) {
            this.scene.sound.context.resume();
        }

        // Phaser 内置解锁事件
        this.scene.sound.once('unlocked', () => {
            this.unlocked = true;
            if (this.pendingBGM) {
                this.playBGM(this.pendingBGM);
                this.pendingBGM = null;
            }
        });

        // 后备：监听任意用户交互（Canvas 点击或键盘）
        const tryUnlock = () => {
            if (this.unlocked) return;
            if (this.scene.sound.context) {
                this.scene.sound.context.resume().then(() => {
                    // 检查是否真的解锁了
                    if (!this.scene.sound.locked) {
                        this.unlocked = true;
                        if (this.pendingBGM) {
                            this.playBGM(this.pendingBGM);
                            this.pendingBGM = null;
                        }
                    }
                });
            }
            // Phaser 的 unlockAll 需要事件触发
            if (this.scene.sound && this.scene.sound.unlock) {
                this.scene.sound.unlock();
            }
        };
        // 在 canvas 上监听，这是 Phaser 真正捕获交互的地方
        const canvas = this.scene.game.canvas;
        if (canvas) {
            canvas.addEventListener('pointerdown', tryUnlock, { once: false });
            canvas.addEventListener('touchstart', tryUnlock, { once: false });
        }
    },

    // 播放背景音乐（自动停止旧BGM）
    playBGM(key, loop = true) {
        if (!this.scene || !this.scene.sound) return;

        // 如果音频被锁定，记录为待播放
        if (this.scene.sound.locked) {
            this.pendingBGM = key;
            return;
        }

        // 如果已经在播放同一首BGM，不重复
        if (this.currentBGM && this.currentBGM.key === key && this.currentBGM.isPlaying) {
            return;
        }

        // 停止旧BGM
        this.stopBGM();

        // 播放新BGM
        try {
            this.currentBGM = this.scene.sound.add(key, {
                volume: this.bgmVolume,
                loop: loop
            });
            this.currentBGM.play();
        } catch (e) {
            console.warn('[AudioManager] BGM播放失败:', key, e);
        }
    },

    // 停止当前BGM
    stopBGM() {
        if (this.currentBGM) {
            try {
                this.currentBGM.stop();
                this.currentBGM.destroy();
            } catch (e) { }
            this.currentBGM = null;
        }
    },

    // 播放音效（一次性）
    playSFX(key, volume) {
        if (!this.scene || !this.scene.sound || this.scene.sound.locked) return;

        try {
            const sfx = this.scene.sound.add(key, {
                volume: volume !== undefined ? volume : this.sfxVolume,
                loop: false
            });
            sfx.play();
            sfx.once('complete', () => sfx.destroy());
        } catch (e) {
            // 静默忽略音频播放失败
        }
    },

    // 暂停BGM
    pauseBGM() {
        if (this.currentBGM && this.currentBGM.isPlaying) {
            this.currentBGM.pause();
        }
    },

    // 恢复BGM
    resumeBGM() {
        if (this.currentBGM && this.currentBGM.isPaused) {
            this.currentBGM.resume();
        }
    },

    // 根据世界类型选择BGM
    playWorldBGM(worldIndex, isConveyor) {
        if (isConveyor) {
            this.playBGM('bgm_game_boss');
        } else if (worldIndex <= 0) {
            this.playBGM('bgm_game_day');
        } else if (worldIndex >= 1) {
            this.playBGM('bgm_game_night');
        }
    }
};
