// Starfruit.js - 杨桃（5角星，同时向5个方向射击）
// 射击方向：前、上前、下前、上后、下后
class Starfruit extends Plant {
    constructor(scene, x, y, row, col) {
        super(scene, x, y, row, col, 'starfruit');
        this.damage = PLANT_CONFIG.starfruit.damage;
        this.fireRate = PLANT_CONFIG.starfruit.fireRate;
        this.fireTimer = 0;
        // 5个射击角度（相对于正右方的角度，度数）
        this.shootAngles = [0, -55, 55, -125, 125];
    }

    createVisual(type) {
        const g = this.scene.add.graphics();
        // 茎
        g.fillStyle(0x4A8C2A);
        g.fillRect(-3, 15, 6, 18);
        // 叶子
        g.fillStyle(0x3D7A1F);
        g.fillEllipse(-10, 22, 12, 5);
        g.fillEllipse(10, 24, 12, 5);
        // 杨桃本体（五角星形）
        const starColor = 0xFFD700;
        const starDarkColor = 0xDAA520;
        // 画五角星
        g.fillStyle(starColor);
        const points = [];
        for (let i = 0; i < 10; i++) {
            const angle = (i * 36 - 90) * Math.PI / 180;
            const r = i % 2 === 0 ? 20 : 9;
            points.push(Math.cos(angle) * r);
            points.push(Math.sin(angle) * r);
        }
        g.fillPoints(points.map((v, i) => i % 2 === 0 ? { x: v, y: points[i + 1] } : null).filter(Boolean), true);
        // 重新用正确方式画星形
        g.fillStyle(0xFFD700);
        g.fillCircle(0, 0, 20);
        // 星角（用三角形画5个角）
        for (let i = 0; i < 5; i++) {
            const angle = (i * 72 - 90) * Math.PI / 180;
            const tipX = Math.cos(angle) * 22;
            const tipY = Math.sin(angle) * 22;
            const leftAngle = angle - 0.4;
            const rightAngle = angle + 0.4;
            g.fillStyle(starColor);
            g.fillTriangle(
                tipX, tipY,
                Math.cos(leftAngle) * 10, Math.sin(leftAngle) * 10,
                Math.cos(rightAngle) * 10, Math.sin(rightAngle) * 10
            );
        }
        // 高光
        g.fillStyle(0xFFEC8B, 0.5);
        g.fillCircle(-4, -4, 8);
        // 眼睛
        g.fillStyle(0x000000);
        g.fillCircle(-4, -2, 2.5);
        g.fillCircle(4, -2, 2.5);
        // 嘴
        g.fillStyle(0xDAA520);
        g.fillEllipse(0, 4, 5, 3);
        this.add(g);
        this.graphics = g;
    }

    update(time, delta) {
        if (!this.alive) return;

        this.fireTimer += delta;
        if (this.fireTimer >= this.fireRate) {
            this.fireTimer = 0;
            this.shootStars();
        }
    }

    shootStars() {
        // 向5个方向各发射一颗星
        const speed = 200;
        this.shootAngles.forEach(angleDeg => {
            const angleRad = angleDeg * Math.PI / 180;
            const vx = Math.cos(angleRad) * speed;
            const vy = Math.sin(angleRad) * speed;

            // 创建星形投射物
            const star = new Projectile(this.scene, this.x, this.y, this.row, 'pea');
            star.body.setVelocity(vx, vy);
            this.scene.projectiles.push(star);
        });

        // 射击动画
        this.scene.tweens.add({
            targets: this,
            scaleX: 1.15,
            scaleY: 0.85,
            duration: 100,
            yoyo: true
        });
    }
}
