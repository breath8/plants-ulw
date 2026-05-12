// Sunshroom.js - 阳光菇（产阳光，从小到大成长）
class Sunshroom extends Plant {
    constructor(scene, x, y, row, col) {
        super(scene, x, y, row, col, 'sunshroom');
        this.sunInterval = SUN.sunflowerInterval;
        this.sunTimer = 8000; // 首次出阳光较快
        this.growthTimer = 0;
        this.stage = 0; // 0=小, 1=中, 2=大
    }

    createVisual(type) {
        this.drawAtStage(0);
    }

    drawAtStage(stage) {
        const scale = [0.6, 0.8, 1.0][stage];

        // 首次创建或清除重绘
        if (!this.graphics) {
            this.graphics = this.scene.add.graphics();
            this.add(this.graphics);
        }
        const g = this.graphics;
        g.clear();

        // 茎
        g.fillStyle(0xD4A847);
        g.fillRect(-3, 15 * scale, 6, 20 * scale);
        // 叶子
        g.fillStyle(0xB8960A);
        g.fillEllipse(-10, 25 * scale, 14 * scale, 5 * scale);
        g.fillEllipse(10, 27 * scale, 14 * scale, 5 * scale);
        // 菌帽
        g.fillStyle(0xF5C842);
        g.fillEllipse(0, 0, 44 * scale, 36 * scale);
        // 菌帽高光
        g.fillStyle(0xFFE066, 0.6);
        g.fillEllipse(-4, -4, 28 * scale, 20 * scale);
        // 笑脸
        g.fillStyle(0xFFFFFF);
        g.fillCircle(-6 * scale, -4 * scale, 3 * scale);
        g.fillCircle(6 * scale, -4 * scale, 3 * scale);
        g.fillStyle(0x000000);
        g.fillCircle(-5 * scale, -4 * scale, 1.5 * scale);
        g.fillCircle(7 * scale, -4 * scale, 1.5 * scale);
        // 嘴
        g.lineStyle(1.5, 0x000000);
        g.beginPath();
        g.arc(0, 4 * scale, 5 * scale, 0.2, Math.PI - 0.2);
        g.strokePath();
    }

    update(time, delta) {
        if (!this.alive) return;

        // 成长阶段
        this.growthTimer += delta;
        if (this.stage < 2) {
            const nextStage = this.growthTimer >= 24000 ? 2 : this.growthTimer >= 12000 ? 1 : 0;
            if (nextStage > this.stage) {
                this.stage = nextStage;
                this.drawAtStage(this.stage);
            }
        }

        // 产阳光
        this.sunTimer += delta;
        if (this.sunTimer >= this.sunInterval) {
            this.sunTimer = 0;
            this.produceSun();
        }
    }

    produceSun() {
        // 小阶段15阳光，中/大阶段25阳光
        const sun = new Sun(this.scene, this.x, this.y - 20, this.y + 30, false);
        if (this.stage === 0) {
            sun.value = 15;
        } else {
            sun.value = SUN.sunValue;
        }
        this.scene.suns.push(sun);

        // 产出动画
        this.scene.tweens.add({
            targets: this,
            scaleX: 1.15,
            scaleY: 0.85,
            duration: 150,
            yoyo: true
        });
    }
}
