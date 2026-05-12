// SaveManager.js - 游戏存档管理
const SAVE_KEY = 'plants_ulw_save';
const TOTAL_LEVELS = 50;

const DEFAULT_SETTINGS = {
    initialSun: 50,        // 初始阳光
    sunFallInterval: 10000, // 天空掉落阳光间隔(ms)
    sunflowerInterval: 24000, // 向日葵产出间隔(ms)
    cooldownMultiplier: 1,  // 冷却倍率 (1=正常, 0.5=减半)
    costMultiplier: 1,      // 阳光消耗倍率
    autoCollectSun: false   // 自动收集阳光
};

class SaveManager {
    constructor() {
        this.data = this.load();
    }

    // 加载存档
    load() {
        try {
            const raw = localStorage.getItem(SAVE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                return {
                    unlockedLevel: parsed.unlockedLevel || 0,
                    settings: { ...DEFAULT_SETTINGS, ...(parsed.settings || {}) },
                    extraProgress: parsed.extraProgress || {
                        miniGames: [],
                        vasebreaker: [],
                        izombie: [],
                        zenGarden: { coins: 0, plants: [] }
                    }
                };
            }
        } catch (e) {
            console.warn('读取存档失败，使用默认值', e);
        }
        return {
            unlockedLevel: 0,
            settings: { ...DEFAULT_SETTINGS },
            extraProgress: {
                miniGames: [],
                vasebreaker: [],
                izombie: [],
                zenGarden: { coins: 0, plants: [] }
            }
        };
    }

    // 保存存档
    save() {
        try {
            localStorage.setItem(SAVE_KEY, JSON.stringify(this.data));
        } catch (e) {
            console.warn('保存存档失败', e);
        }
    }

    // 获取已解锁的最高关卡索引 (0=1-1已解锁)
    getUnlockedLevel() {
        return this.data.unlockedLevel;
    }

    // 设置已解锁的关卡
    setUnlockedLevel(level) {
        if (level > this.data.unlockedLevel) {
            this.data.unlockedLevel = Math.min(level, TOTAL_LEVELS - 1);
            this.save();
        }
    }

    // 检查指定关卡是否已解锁
    isLevelUnlocked(globalLevelIndex) {
        return globalLevelIndex <= this.data.unlockedLevel;
    }

    // 检查世界是否已解锁
    isWorldUnlocked(worldIndex) {
        if (worldIndex === 0) return true;
        return this.data.unlockedLevel >= worldIndex * 10;
    }

    // 获取某个世界的进度
    getWorldProgress(worldIndex) {
        const startLevel = worldIndex * 10;
        const completed = Math.min(
            Math.max(0, this.data.unlockedLevel - startLevel),
            10
        );
        return {
            unlocked: this.isWorldUnlocked(worldIndex),
            completed: completed,
            remaining: 10 - completed
        };
    }

    // 从世界索引和本地关卡索引获取全局索引
    getGlobalLevelIndex(worldIndex, localLevelIndex) {
        return worldIndex * 10 + localLevelIndex;
    }

    // 从全局索引获取世界和本地关卡索引
    getWorldAndLevel(globalLevelIndex) {
        return {
            worldIndex: Math.floor(globalLevelIndex / 10),
            localLevel: globalLevelIndex % 10
        };
    }

    // 获取设置
    getSettings() {
        return { ...this.data.settings };
    }

    // 更新设置
    updateSettings(newSettings) {
        Object.assign(this.data.settings, newSettings);
        this.save();
    }

    // 获取额外模式进度
    getExtraProgress() {
        return this.data.extraProgress;
    }

    // 标记小游戏已完成
    completeMiniGame(index) {
        const prog = this.data.extraProgress;
        if (!prog.miniGames.includes(index)) {
            prog.miniGames.push(index);
            this.save();
        }
    }

    // 标记砸花瓶关卡已完成
    completeVasebreaker(index) {
        const prog = this.data.extraProgress;
        if (!prog.vasebreaker.includes(index)) {
            prog.vasebreaker.push(index);
            this.save();
        }
    }

    // 标记我是僵尸关卡已完成
    completeIZombie(index) {
        const prog = this.data.extraProgress;
        if (!prog.izombie.includes(index)) {
            prog.izombie.push(index);
            this.save();
        }
    }

    // 获取禅境花园数据
    getZenGardenData() {
        return this.data.extraProgress.zenGarden;
    }

    // 更新禅境花园数据
    updateZenGarden(gardenData) {
        this.data.extraProgress.zenGarden = gardenData;
        this.save();
    }

    // 重置存档
    reset() {
        this.data = {
            unlockedLevel: 0,
            settings: { ...DEFAULT_SETTINGS },
            extraProgress: {
                miniGames: [],
                vasebreaker: [],
                izombie: [],
                zenGarden: { coins: 0, plants: [] }
            }
        };
        this.save();
    }
}

// 全局存档管理器
const saveManager = new SaveManager();
