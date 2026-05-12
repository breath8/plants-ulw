// FootballZombie.js - 橄榄球僵尸
// 特性：高HP、高移速、快速啃食
class FootballZombie extends Zombie {
    constructor(scene, x, y, row) {
        super(scene, x, y, row, 'football');
    }

    createVisual(type) {
        const g = this.scene.add.graphics();
        this.drawBaseZombie(g, type);
        this.drawAccessory(g);
        this.add(g);
        this.graphics = g;
    }

    drawAccessory(g) {
        // 橄榄球头盔
        const helmetColor = 0x2E5E2E;
        const stripeColor = 0xFFD700;

        // 头盔主体
        g.fillStyle(helmetColor);
        g.fillEllipse(0, -18, 32, 24);

        // 头盔面罩区域
        g.fillStyle(0x222222);
        g.fillRoundedRect(-12, -22, 24, 8, 2);

        // 头盔中央条纹
        g.fillStyle(stripeColor);
        g.fillRect(-2, -30, 4, 18);

        // 头盔顶部
        g.fillStyle(helmetColor, 0.5);
        g.fillEllipse(0, -26, 16, 10);

        // 橄榄球服编号（胸前）
        g.fillStyle(0xFFFFFF);
        g.fillRect(-4, -8, 8, 10);
        g.fillStyle(0x2E5E2E);
        g.fillRect(-2, -6, 4, 6);
    }
}
