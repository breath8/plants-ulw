// Grid.js - 网格管理工具类
class GridManager {
    constructor() {
        this.grid = Array.from({ length: GRID.rows }, () => Array(GRID.cols).fill(null));
    }

    // 获取网格坐标（像素）
    getCellPosition(row, col) {
        return {
            x: GRID.startX + col * GRID.cellWidth + GRID.cellWidth / 2,
            y: GRID.startY + row * GRID.cellHeight + GRID.cellHeight / 2
        };
    }

    // 从像素坐标获取网格索引
    getCellFromPosition(x, y) {
        const col = Math.floor((x - GRID.startX) / GRID.cellWidth);
        const row = Math.floor((y - GRID.startY) / GRID.cellHeight);
        if (row >= 0 && row < GRID.rows && col >= 0 && col < GRID.cols) {
            return { row, col };
        }
        return null;
    }

    // 检查格子是否被占用
    isOccupied(row, col) {
        return this.grid[row][col] !== null;
    }

    // 放置植物
    placePlant(row, col, plant) {
        if (!this.isOccupied(row, col)) {
            this.grid[row][col] = plant;
            return true;
        }
        return false;
    }

    // 移除植物
    removePlant(row, col) {
        const plant = this.grid[row][col];
        this.grid[row][col] = null;
        return plant;
    }

    // 获取植物
    getPlant(row, col) {
        return this.grid[row][col];
    }

    // 获取整行植物（用于僵尸检测）
    getPlantsInRow(row) {
        return this.grid[row].filter(plant => plant !== null);
    }

    // 重置网格
    reset() {
        this.grid = Array.from({ length: GRID.rows }, () => Array(GRID.cols).fill(null));
    }
}

// 全局网格管理器
const gridManager = new GridManager();
