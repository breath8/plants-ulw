// main.js - Phaser 游戏配置与启动
const config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 600,
    parent: 'game-container',
    backgroundColor: '#2d5a1b',
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: [BootScene, MenuScene, WorldSelectScene, LevelSelectScene, SettingsScene, GameScene, VictoryScene,
            ExtraModeSelectScene, MiniGameSelectScene, PuzzleSelectScene, VasebreakerScene, IZombieScene, ZenGardenScene],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

// 全局暴露游戏实例以便调试
window.game = new Phaser.Game(config);
