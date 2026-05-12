// Lilypad.js - 睡莲叶
// 池塘基础植物，其他植物可以放在睡莲叶上面
class Lilypad extends Plant {
    constructor(scene, x, y, row, col) {
        super(scene, x, y, row, col, 'lilypad');
    }

    createVisual(type) {
        const g = this.scene.add.graphics();

        // 水面涟漪
        g.fillStyle(0x4A90D9, 0.3);
        g.fillEllipse(0, 2, 56, 18);

        // 睡莲叶主体 - 扁平椭圆
        g.fillStyle(0x3D9B2F);
        g.fillEllipse(0, 0, 52, 16);

        // 叶片纹理
        g.fillStyle(0x2D7A1F, 0.4);
        g.fillEllipse(-8, -2, 14, 10);

        // 叶脉
        g.lineStyle(1, 0x2D7A1F, 0.6);
        g.beginPath();
        g.moveTo(-20, 0);
        g.lineTo(20, 0);
        g.strokePath();
        g.beginPath();
        g.moveTo(-10, 0);
        g.lineTo(-5, -6);
        g.strokePath();
        g.beginPath();
        g.moveTo(10, 0);
        g.lineTo(5, -6);
        g.strokePath();
        g.beginPath();
        g.moveTo(0, 0);
        g.lineTo(-8, 5);
        g.strokePath();
        g.beginPath();
        g.moveTo(0, 0);
        g.lineTo(8, 5);
        g.strokePath();

        // V型缺口
        g.fillStyle(0x4A90D9);
        g.fillTriangle(20, 0, 26, -4, 26, 4);

        // 高光
        g.fillStyle(0x5DBF4F, 0.5);
        g.fillEllipse(-6, -3, 10, 4);

        this.add(g);
        this.graphics = g;
    }
}
