// DuckyTubeZombie.js - 救生圈僵尸
// 普通僵尸套着鸭子救生圈，出现在池塘水路中
class DuckyTubeZombie extends Zombie {
    constructor(scene, x, y, row) {
        super(scene, x, y, row, 'duckytube');
    }

    createVisual(type) {
        const g = this.scene.add.graphics();
        this.drawBaseZombie(g, type);
        this.drawAccessory(g);
        this.add(g);
        this.graphics = g;
    }

    drawAccessory(g) {
        const skinColor = 0x7B8B6F;

        // 救生圈 - 套在腰部
        g.fillStyle(0xFF4444);
        g.fillEllipse(0, 10, 36, 14);

        // 救生圈高光
        g.fillStyle(0xFF6666, 0.5);
        g.fillEllipse(-6, 8, 10, 6);

        // 救生圈条纹
        g.fillStyle(0xFFFFFF, 0.5);
        g.fillRect(-14, 6, 6, 14);
        g.fillRect(8, 6, 6, 14);

        // 鸭子头（在救生圈前方）
        g.fillStyle(0xFFCC00);
        g.fillEllipse(22, 2, 10, 8);

        // 鸭子嘴
        g.fillStyle(0xFF8800);
        g.fillEllipse(30, 4, 6, 3);

        // 鸭子眼睛
        g.fillStyle(0x000000);
        g.fillCircle(24, 0, 1.5);
    }
}
