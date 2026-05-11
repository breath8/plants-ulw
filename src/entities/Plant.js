// Plant.js - 植物基类
class Plant extends Phaser.GameObjects.Container {
    constructor(scene, x, y, row, col, type) {
        super(scene, x, y);
        scene.add.existing(this);

        this.scene = scene;
        this.row = row;
        this.col = col;
        this.type = type;
        this.alive = true;

        // 从配置获取属性
        const cfg = PLANT_CONFIG[type];
        this.maxHp = cfg.hp;
        this.hp = cfg.hp;
        this.cost = cfg.cost;
        this.cooldown = cfg.cooldown;

        // 创建视觉
        this.createVisual(type);

        // 入场动画
        this.setScale(0);
        scene.tweens.add({
            targets: this,
            scaleX: 1,
            scaleY: 1,
            duration: 300,
            ease: 'Back.easeOut'
        });
    }

    createVisual(type) {
        // 使用图形绘制植物（不依赖SVG加载）
        const g = this.scene.add.graphics();
        const cfg = PLANT_CONFIG[type];

        switch(type) {
            case 'peashooter':
                this.drawPeashooter(g);
                break;
            case 'sunflower':
                this.drawSunflower(g);
                break;
            case 'wallnut':
                this.drawWallnut(g);
                break;
            case 'snowpea':
                this.drawSnowpea(g);
                break;
            case 'cherrybomb':
                this.drawCherryBomb(g);
                break;
            case 'chomper':
                this.drawChomper(g);
                break;
            case 'repeater':
                this.drawRepeater(g);
                break;
            case 'potatomine':
                this.drawPotatoMine(g);
                break;
            default:
                // 默认绘制
                g.fillStyle(0x6ABF3A);
                g.fillCircle(0, 0, 20);
                break;
        }
        this.add(g);
        this.graphics = g;
    }

    drawPeashooter(g) {
        // 茎
        g.fillStyle(0x4A8C2A);
        g.fillRect(-4, 15, 8, 20);
        // 叶子
        g.fillStyle(0x3D7A1F);
        g.fillEllipse(-15, 25, 20, 8);
        g.fillEllipse(15, 28, 20, 8);
        // 头
        g.fillStyle(0x6ABF3A);
        g.fillCircle(0, 0, 22);
        // 深色凹槽
        g.fillStyle(0x3D7A1F, 0.4);
        g.fillEllipse(14, 2, 16, 14);
        // 眼白
        g.fillStyle(0xFFFFFF);
        g.fillEllipse(-6, -6, 12, 14);
        // 瞳孔
        g.fillStyle(0x000000);
        g.fillCircle(-4, -6, 4);
        // 嘴
        g.fillStyle(0x2D5A1B);
        g.fillEllipse(12, 2, 12, 6);
    }

    drawSunflower(g) {
        // 茎
        g.fillStyle(0x4A8C2A);
        g.fillRect(-3, 15, 6, 20);
        // 叶子
        g.fillStyle(0x3D7A1F);
        g.fillEllipse(-12, 25, 16, 6);
        g.fillEllipse(12, 28, 16, 6);
        // 花瓣
        for (let i = 0; i < 8; i++) {
            const angle = (i * 45) * Math.PI / 180;
            const px = Math.cos(angle) * 16;
            const py = Math.sin(angle) * 16 - 5;
            g.fillStyle(i % 2 === 0 ? 0xF5C842 : 0xE6B520);
            g.fillEllipse(px, py, 10, 20);
        }
        // 花心
        g.fillStyle(0x5A3810);
        g.fillCircle(0, -5, 12);
        // 笑脸
        g.fillStyle(0xFFFFFF);
        g.fillCircle(-5, -8, 3);
        g.fillCircle(5, -8, 3);
        g.fillStyle(0x000000);
        g.fillCircle(-5, -8, 1.5);
        g.fillCircle(5, -8, 1.5);
        // 嘴
        g.lineStyle(1.5, 0x000000);
        g.beginPath();
        g.arc(0, -2, 5, 0.2, Math.PI - 0.2);
        g.strokePath();
        // 腮红
        g.fillStyle(0xF5A0A0, 0.4);
        g.fillCircle(-10, -3, 4);
        g.fillCircle(10, -3, 4);
    }

    drawWallnut(g) {
        // 身体
        g.fillStyle(0x8B6914);
        g.fillEllipse(0, 5, 44, 60);
        // 深色纹理
        g.fillStyle(0x6B4F10, 0.3);
        g.fillEllipse(0, 5, 36, 50);
        // 裂缝
        g.lineStyle(2, 0x5A4510);
        g.beginPath();
        g.moveTo(-10, -5);
        g.lineTo(-6, 0);
        g.lineTo(-9, 5);
        g.strokePath();
        g.beginPath();
        g.moveTo(10, -5);
        g.lineTo(6, 0);
        g.lineTo(9, 5);
        g.strokePath();
        // 眼睛
        g.fillStyle(0xFFFFFF);
        g.fillCircle(-7, -3, 4);
        g.fillCircle(7, -3, 4);
        g.fillStyle(0x000000);
        g.fillCircle(-7, -3, 2);
        g.fillCircle(7, -3, 2);
        // 嘴
        g.lineStyle(2, 0x3A2500);
        g.beginPath();
        g.arc(0, 7, 5, 0.2, Math.PI - 0.2);
        g.strokePath();
    }

    drawSnowpea(g) {
        // 茎
        g.fillStyle(0x2A6A8C);
        g.fillRect(-4, 15, 8, 20);
        // 叶子
        g.fillStyle(0x1A5A7C);
        g.fillEllipse(-15, 25, 20, 8);
        g.fillEllipse(15, 28, 20, 8);
        // 头
        g.fillStyle(0x4AA8D8);
        g.fillCircle(0, 0, 22);
        // 深色凹槽
        g.fillStyle(0x1A5A7C, 0.4);
        g.fillEllipse(14, 2, 16, 14);
        // 眼白
        g.fillStyle(0xFFFFFF);
        g.fillEllipse(-6, -6, 12, 14);
        // 瞳孔
        g.fillStyle(0x000000);
        g.fillCircle(-4, -6, 4);
        // 嘴
        g.fillStyle(0x1A4A6C);
        g.fillEllipse(12, 2, 12, 6);
        // 冰晶效果
        g.fillStyle(0xB8E8FF, 0.6);
        g.fillCircle(-10, -8, 2);
        g.fillCircle(12, -6, 2);
        g.fillCircle(-14, 4, 1.5);
    }

    drawCherryBomb(g) {
        // 茎
        g.lineStyle(3, 0x4A8C2A);
        g.beginPath();
        g.moveTo(0, -20);
        g.lineTo(5, -30);
        g.strokePath();
        // 叶子
        g.fillStyle(0x3D7A1F);
        g.fillEllipse(8, -28, 14, 6);
        // 连接线
        g.lineStyle(2, 0x4A8C2A);
        g.beginPath();
        g.moveTo(-10, -10);
        g.lineTo(0, -25);
        g.lineTo(10, -10);
        g.strokePath();
        // 左樱桃
        g.fillStyle(0xCC2200);
        g.fillCircle(-10, 5, 18);
        g.fillStyle(0xFF6644, 0.4);
        g.fillCircle(-16, -2, 5);
        // 左眼
        g.fillStyle(0xFFFFFF);
        g.fillCircle(-14, 2, 3);
        g.fillCircle(-6, 2, 3);
        g.fillStyle(0x000000);
        g.fillCircle(-13, 2, 1.5);
        g.fillCircle(-5, 2, 1.5);
        // 右樱桃
        g.fillStyle(0xCC2200);
        g.fillCircle(10, 5, 18);
        g.fillStyle(0xFF6644, 0.4);
        g.fillCircle(4, -2, 5);
        // 右眼
        g.fillStyle(0xFFFFFF);
        g.fillCircle(6, 2, 3);
        g.fillCircle(14, 2, 3);
        g.fillStyle(0x000000);
        g.fillCircle(7, 2, 1.5);
        g.fillCircle(15, 2, 1.5);
    }

    drawChomper(g) {
        // 茎
        g.fillStyle(0x4A5A2A);
        g.fillRect(-4, 15, 8, 20);
        // 叶子
        g.fillStyle(0x3A4A2A);
        g.fillEllipse(-12, 28, 16, 6);
        // 上颚
        g.fillStyle(0x6A4A8A);
        g.fillEllipse(0, -5, 44, 32);
        // 眼睛
        g.fillStyle(0xFFFFFF);
        g.fillCircle(-10, -10, 5);
        g.fillCircle(10, -10, 5);
        g.fillStyle(0xFFFF00);
        g.fillCircle(-9, -10, 3);
        g.fillCircle(11, -10, 3);
        // 上牙
        g.fillStyle(0xFFFFFF);
        g.fillTriangle(-15, 8, -12, 16, -9, 8);
        g.fillTriangle(-5, 8, -2, 16, 1, 8);
        g.fillTriangle(5, 8, 8, 16, 11, 8);
        g.fillTriangle(15, 8, 18, 16, 21, 8);
        // 下颚
        g.fillStyle(0x5A3A7A);
        g.fillEllipse(0, 12, 38, 20);
        // 下牙
        g.fillStyle(0xFFFFFF);
        g.fillTriangle(-10, 8, -7, 2, -4, 8);
        g.fillTriangle(0, 8, 3, 2, 6, 8);
        g.fillTriangle(10, 8, 13, 2, 16, 8);
    }

    drawRepeater(g) {
        // 茎
        g.fillStyle(0x4A8C2A);
        g.fillRect(-4, 15, 8, 20);
        // 叶子
        g.fillStyle(0x3D7A1F);
        g.fillEllipse(-15, 25, 20, 8);
        g.fillEllipse(15, 28, 20, 8);
        // 后头
        g.fillStyle(0x6ABF3A);
        g.fillCircle(-6, 2, 18);
        // 前头
        g.fillStyle(0x6ABF3A);
        g.fillCircle(6, 0, 20);
        // 后眼
        g.fillStyle(0xFFFFFF);
        g.fillEllipse(-10, -2, 10, 12);
        g.fillStyle(0x000000);
        g.fillCircle(-9, -2, 3);
        // 前眼
        g.fillStyle(0xFFFFFF);
        g.fillEllipse(2, -5, 12, 14);
        g.fillStyle(0x000000);
        g.fillCircle(3, -5, 4);
        // 嘴
        g.fillStyle(0x2D5A1B);
        g.fillEllipse(18, 0, 12, 6);
    }

    drawPotatoMine(g) {
        // 土堆
        g.fillStyle(0x5A4020);
        g.fillEllipse(0, 15, 50, 16);
        // 身体
        g.fillStyle(0x8B6914);
        g.fillEllipse(0, 0, 38, 48);
        g.fillStyle(0x6B4F10, 0.2);
        g.fillEllipse(0, 0, 30, 38);
        // 纹理
        g.fillStyle(0x6B4F10, 0.3);
        g.fillCircle(-8, -8, 3);
        g.fillCircle(8, -3, 2);
        g.fillCircle(-3, 10, 2.5);
        // 眼睛
        g.fillStyle(0xFFFFFF);
        g.fillCircle(-7, -5, 4);
        g.fillCircle(7, -5, 4);
        g.fillStyle(0x000000);
        g.fillCircle(-6, -5, 2);
        g.fillCircle(8, -5, 2);
        // 生气的嘴
        g.lineStyle(2, 0x3A2500);
        g.beginPath();
        g.arc(0, 4, 5, 0.2, Math.PI - 0.2);
        g.strokePath();
        // 引线和火焰
        g.lineStyle(2, 0x4A8C2A);
        g.beginPath();
        g.moveTo(0, -22);
        g.lineTo(3, -30);
        g.lineTo(8, -32);
        g.strokePath();
        g.fillStyle(0xFF6600);
        g.fillCircle(8, -32, 3);
    }

    takeDamage(amount) {
        if (!this.alive) return;
        this.hp -= amount;

        // 闪烁效果
        this.scene.tweens.add({
            targets: this,
            alpha: 0.5,
            duration: 50,
            yoyo: true
        });

        if (this.hp <= 0) {
            this.die();
        }
    }

    die() {
        this.alive = false;
        gridManager.removePlant(this.row, this.col);

        // 死亡动画
        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            scaleX: 0,
            scaleY: 0,
            duration: 300,
            onComplete: () => {
                this.destroy();
            }
        });
    }

    update(time, delta) {
        // 子类覆盖
    }
}
