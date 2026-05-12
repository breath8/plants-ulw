// BootScene.js - 资源加载场景
class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        // Load all SVG assets as textures
        this.load.image('plant_peashooter', 'assets/svg/plants/peashooter.svg');
        this.load.image('plant_sunflower', 'assets/svg/plants/sunflower.svg');
        this.load.image('plant_wallnut', 'assets/svg/plants/wallnut.svg');
        this.load.image('plant_snowpea', 'assets/svg/plants/snowpea.svg');
        this.load.image('plant_cherrybomb', 'assets/svg/plants/cherrybomb.svg');
        this.load.image('plant_chomper', 'assets/svg/plants/chomper.svg');
        this.load.image('plant_repeater', 'assets/svg/plants/repeater.svg');
        this.load.image('plant_potatomine', 'assets/svg/plants/potatomine.svg');
        this.load.image('plant_fumeshroom', 'assets/svg/plants/fumeshroom.svg');
        this.load.image('plant_puffshroom', 'assets/svg/plants/puffshroom.svg');
        this.load.image('plant_sunshroom', 'assets/svg/plants/sunshroom.svg');
        this.load.image('plant_gravebuster', 'assets/svg/plants/gravebuster.svg');
        this.load.image('plant_hypnoshroom', 'assets/svg/plants/hypnoshroom.svg');
        this.load.image('plant_scaredyshroom', 'assets/svg/plants/scaredyshroom.svg');
        this.load.image('plant_iceshroom', 'assets/svg/plants/iceshroom.svg');
        this.load.image('plant_doomshroom', 'assets/svg/plants/doomshroom.svg');
        this.load.image('zombie_basic', 'assets/svg/zombies/zombie.svg');
        this.load.image('zombie_flag', 'assets/svg/zombies/flagzombie.svg');
        this.load.image('zombie_conehead', 'assets/svg/zombies/coneheadzombie.svg');
        this.load.image('zombie_buckethead', 'assets/svg/zombies/bucketheadzombie.svg');
        this.load.image('zombie_polevault', 'assets/svg/zombies/polevaultzombie.svg');
        this.load.image('zombie_newspaper', 'assets/svg/zombies/newspaper.svg');
        this.load.image('zombie_screendoor', 'assets/svg/zombies/screendorzombie.svg');
        this.load.image('zombie_football', 'assets/svg/zombies/footballzombie.svg');
        this.load.image('zombie_dancing', 'assets/svg/zombies/dancingzombie.svg');
        this.load.image('zombie_backupdancer', 'assets/svg/zombies/backupdancer.svg');
        // Pool plant textures
        this.load.image('plant_lilypad', 'assets/svg/plants/lilypad.svg');
        this.load.image('plant_squash', 'assets/svg/plants/squash.svg');
        this.load.image('plant_threepeater', 'assets/svg/plants/threepeater.svg');
        this.load.image('plant_tanglekelp', 'assets/svg/plants/tanglekelp.svg');
        this.load.image('plant_jalapeno', 'assets/svg/plants/jalapeno.svg');
        this.load.image('plant_spikeweed', 'assets/svg/plants/spikeweed.svg');
        this.load.image('plant_torchwood', 'assets/svg/plants/torchwood.svg');
        this.load.image('plant_tallnut', 'assets/svg/plants/tallnut.svg');
        // Fog plant textures
        this.load.image('plant_seashroom', 'assets/svg/plants/seashroom.svg');
        this.load.image('plant_plantern', 'assets/svg/plants/plantern.svg');
        this.load.image('plant_cactus', 'assets/svg/plants/cactus.svg');
        this.load.image('plant_blover', 'assets/svg/plants/blover.svg');
        this.load.image('plant_splitpea', 'assets/svg/plants/splitpea.svg');
        this.load.image('plant_starfruit', 'assets/svg/plants/starfruit.svg');
        this.load.image('plant_pumpkin', 'assets/svg/plants/pumpkin.svg');
        this.load.image('plant_magnetshroom', 'assets/svg/plants/magnetshroom.svg');
        // Roof plant textures
        this.load.image('plant_cabbagepult', 'assets/svg/plants/cabbagepult.svg');
        this.load.image('plant_kernelpult', 'assets/svg/plants/kernelpult.svg');
        this.load.image('plant_melonpult', 'assets/svg/plants/melonpult.svg');
        this.load.image('plant_coffeebean', 'assets/svg/plants/coffeebean.svg');
        this.load.image('plant_garlic', 'assets/svg/plants/garlic.svg');
        this.load.image('plant_flowerpot', 'assets/svg/plants/flowerpot.svg');
        this.load.image('plant_umbrellaleaf', 'assets/svg/plants/umbrellaleaf.svg');
        this.load.image('plant_marigold', 'assets/svg/plants/marigold.svg');
        // Pool zombie textures
        this.load.image('zombie_duckytube', 'assets/svg/zombies/duckytube.svg');
        this.load.image('zombie_snorkel', 'assets/svg/zombies/snorkel.svg');
        this.load.image('zombie_zomboni', 'assets/svg/zombies/zomboni.svg');
        this.load.image('zombie_dolphinrider', 'assets/svg/zombies/dolphinrider.svg');
        // Fog zombie textures
        this.load.image('zombie_jackbox', 'assets/svg/zombies/jackbox.svg');
        this.load.image('zombie_balloon', 'assets/svg/zombies/balloon.svg');
        // Roof zombie textures
        this.load.image('zombie_bungee', 'assets/svg/zombies/bungee.svg');
        this.load.image('zombie_catapult', 'assets/svg/zombies/catapult.svg');
        this.load.image('zombie_ladder', 'assets/svg/zombies/ladder.svg');
        this.load.image('zombie_gargantuar', 'assets/svg/zombies/gargantuar.svg');
        this.load.image('zombie_imp', 'assets/svg/zombies/imp.svg');

        // 加载音频
        // BGM
        this.load.audio('bgm_menu', 'assets/sounds/bgm/menu.mp3');
        this.load.audio('bgm_game_day', 'assets/sounds/bgm/game_day.mp3');
        this.load.audio('bgm_game_night', 'assets/sounds/bgm/game_night.mp3');
        this.load.audio('bgm_game_boss', 'assets/sounds/bgm/game_boss.mp3');
        // SFX
        this.load.audio('sfx_plant', 'assets/sounds/sfx/plant.wav');
        this.load.audio('sfx_chomp', 'assets/sounds/sfx/chomp.wav');
        this.load.audio('sfx_hit', 'assets/sounds/sfx/hit.wav');
        this.load.audio('sfx_explosion', 'assets/sounds/sfx/explosion.wav');
        this.load.audio('sfx_zombie_die', 'assets/sounds/sfx/zombie_die.wav');
        this.load.audio('sfx_zombie_groan', 'assets/sounds/sfx/zombie_groan.wav');
        this.load.audio('sfx_lawn_mower', 'assets/sounds/sfx/lawn_mower.wav');
        this.load.audio('sfx_huge_wave', 'assets/sounds/sfx/huge_wave.wav');
        this.load.audio('sfx_error', 'assets/sounds/sfx/error.wav');

        // 创建1像素纹理用于粒子
        const particleGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        particleGraphics.fillStyle(0xffffff);
        particleGraphics.fillRect(0, 0, 4, 4);
        particleGraphics.generateTexture('particle', 4, 4);
        particleGraphics.destroy();
    }

    create() {
        // 从本地存储同步进度到 registry
        const unlockedLevel = saveManager.getUnlockedLevel();
        this.registry.set('unlockedLevel', unlockedLevel);

        this.scene.start('MenuScene');
    }
}
