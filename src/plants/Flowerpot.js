// Flowerpot.js - 花盆
// 屋顶关卡基础，所有植物必须放置在花盆上
// 提供平台但自身无攻击能力
class Flowerpot extends Plant {
    constructor(scene, x, y, row, col) {
        super(scene, x, y, row, col, 'flowerpot');
        this.isFoundation = true; // 标记为地基植物
    }

    createVisual(type) {
        const g = this.scene.add.graphics();
        // 花盆形状 - 梯形
        g.fillStyle(0x8B4513);
        g.beginPath();
        g.moveTo(-18, -8);
        g.lineTo(18, -8);
        g.lineTo(14, 18);
        g.lineTo(-14, 18);
        g.closePath();
        g.fillPath();
        // 花盆内侧
        g.fillStyle(0x654321, 0.5);
        g.beginPath();
        g.moveTo(-16, -6);
        g.lineTo(16, -6);
        g.lineTo(13, 16);
        g.lineTo(-13, 16);
        g.closePath();
        g.fillPath();
        // 花盆边缘
        g.fillStyle(0xA0522D);
        g.fillRoundedRect(-20, -12, 40, 6, 2);
        // 土壤
        g.fillStyle(0x3E2723);
        g.fillEllipse(0, -4, 30, 8);
        // 土壤纹理
        g.fillStyle(0x4E342E, 0.4);
        g.fillCircle(-6, -5, 2);
        g.fillCircle(4, -3, 1.5);
        g.fillCircle(8, -6, 1.5);
        // 花盆条纹装饰
        g.lineStyle(1, 0x7A3B10, 0.3);
        g.beginPath();
        g.moveTo(-16, 0);
        g.lineTo(16, 0);
        g.strokePath();
        g.beginPath();
        g.moveTo(-15, 8);
        g.lineTo(15, 8);
        g.strokePath();
        // 底部排水孔
        g.fillStyle(0x3E2723);
        g.fillCircle(0, 16, 3);
        this.add(g);
        this.graphics = g;
    }

    update(time, delta) {
        // 花盆无主动逻辑
    }
}
