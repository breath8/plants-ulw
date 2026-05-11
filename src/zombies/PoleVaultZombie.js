// PoleVaultZombie.js - 撑杆僵尸
class PoleVaultZombie extends Zombie {
    constructor(scene, x, y, row) {
        super(scene, x, y, row, 'polevault');
        this.hasVaulted = false;
        this.vaulting = false;
        this.vaultRange = 100;
    }

    checkForPlant() {
        if (this.hasVaulted || this.vaulting) {
            if (this.hasVaulted) {
                super.checkForPlant();
            }
            return;
        }

        // 检测前方植物
        const cell = gridManager.getCellFromPosition(this.x - 25, this.y);
        if (cell && cell.row === this.row) {
            const plant = gridManager.getPlant(cell.row, cell.col);
            if (plant && plant.alive && plant.type !== 'cherrybomb' && plant.type !== 'potatomine') {
                this.vault();
            }
        }
    }

    vault() {
        this.vaulting = true;
        const originalY = this.y;

        // 停止物理移动
        this.body.setVelocityX(0);

        // 跳跃动画 - 抛物线
        this.scene.tweens.add({
            targets: this,
            y: originalY - 60,
            x: this.x - this.vaultRange / 2,
            duration: 250,
            ease: 'Quad.easeOut',
            onComplete: () => {
                this.scene.tweens.add({
                    targets: this,
                    y: originalY,
                    x: this.x - this.vaultRange / 2,
                    duration: 250,
                    ease: 'Quad.easeIn',
                    onComplete: () => {
                        this.hasVaulted = true;
                        this.vaulting = false;
                        this.speed = this.baseSpeed * 0.75;
                        this.body.setVelocityX(-this.speed);
                    }
                });
            }
        });
    }
}
