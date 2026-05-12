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
        this.load.image('proj_pea', 'assets/svg/projectiles/pea.svg');
        this.load.image('proj_snowpea', 'assets/svg/projectiles/snowpea.svg');
        this.load.image('proj_sun', 'assets/svg/projectiles/sun.svg');
        this.load.image('ui_lawnmower', 'assets/svg/ui/lawnmower.svg');
        // 显示加载进度
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRoundedRect(width / 2 - 160, height / 2 - 25, 320, 50, 10);

        const loadingText = this.add.text(width / 2, height / 2 - 50, '加载中...', {
            font: '20px Arial',
            fill: '#ffffff'
        }).setOrigin(0.5, 0.5);

        this.load.on('progress', (value) => {
            progressBar.clear();
            progressBar.fillStyle(0x4CAF50, 1);
            progressBar.fillRoundedRect(width / 2 - 150, height / 2 - 15, 300 * value, 30, 8);
        });

        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
        });

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
