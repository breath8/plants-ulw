// extraLevels.js - 额外模式关卡数据（小游戏/解谜/生存）

// ============================================================
// 小游戏模式关卡 (Mini-games)
// ============================================================
const MINI_GAMES = [
  {
    id: 'mg_1',
    name: '僵尸保龄球',
    description: '大量僵尸排成行，用植物击倒它们！',
    plants: ['peashooter', 'repeater', 'snowpea', 'wallnut'],
    waves: [
      { delay: 3000, zombies: [
        { type: 'basic', row: 0 }, { type: 'basic', row: 1 }, { type: 'basic', row: 2 },
        { type: 'basic', row: 3 }, { type: 'basic', row: 4 }
      ]},
      { delay: 8000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'basic', row: 1 }, { type: 'conehead', row: 2 },
        { type: 'basic', row: 3 }, { type: 'conehead', row: 4 }
      ]},
      { delay: 10000, zombies: [
        { type: 'buckethead', row: 0 }, { type: 'conehead', row: 1 }, { type: 'buckethead', row: 2 },
        { type: 'conehead', row: 3 }, { type: 'flag', row: 2 }
      ]},
      { delay: 12000, zombies: [
        { type: 'basic', row: 0 }, { type: 'buckethead', row: 1 }, { type: 'basic', row: 2 },
        { type: 'conehead', row: 3 }, { type: 'polevault', row: 4 },
        { type: 'flag', row: 2 }
      ]}
    ]
  },
  {
    id: 'mg_2',
    name: '坚果保龄球',
    description: '用坚果墙滚向僵尸！',
    plants: ['wallnut', 'tallnut', 'peashooter'],
    waves: [
      { delay: 2000, zombies: [
        { type: 'basic', row: 0 }, { type: 'basic', row: 4 },
        { type: 'basic', row: 1 }, { type: 'basic', row: 3 }
      ]},
      { delay: 6000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'conehead', row: 1 },
        { type: 'conehead', row: 2 }, { type: 'conehead', row: 3 }, { type: 'conehead', row: 4 }
      ]},
      { delay: 8000, zombies: [
        { type: 'buckethead', row: 0 }, { type: 'polevault', row: 1 },
        { type: 'conehead', row: 2 }, { type: 'polevault', row: 3 }, { type: 'buckethead', row: 4 }
      ]},
      { delay: 10000, zombies: [
        { type: 'football', row: 0 }, { type: 'buckethead', row: 1 },
        { type: 'conehead', row: 2 }, { type: 'buckethead', row: 3 }, { type: 'football', row: 4 }
      ]}
    ]
  },
  {
    id: 'mg_3',
    name: '植物快攻',
    description: '阳光掉落加快，快速种下植物防守！',
    plants: ['peashooter', 'sunflower', 'snowpea', 'wallnut', 'chomper'],
    waves: [
      { delay: 2000, zombies: [
        { type: 'basic', row: 1 }, { type: 'basic', row: 3 }
      ]},
      { delay: 5000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'basic', row: 2 }, { type: 'conehead', row: 4 }
      ]},
      { delay: 6000, zombies: [
        { type: 'polevault', row: 1 }, { type: 'conehead', row: 2 }, { type: 'polevault', row: 3 }
      ]},
      { delay: 7000, zombies: [
        { type: 'buckethead', row: 0 }, { type: 'polevault', row: 1 },
        { type: 'conehead', row: 2 }, { type: 'polevault', row: 3 }, { type: 'buckethead', row: 4 }
      ]},
      { delay: 8000, zombies: [
        { type: 'buckethead', row: 0 }, { type: 'buckethead', row: 1 },
        { type: 'flag', row: 2 },
        { type: 'buckethead', row: 3 }, { type: 'buckethead', row: 4 }
      ]}
    ]
  },
  {
    id: 'mg_4',
    name: '僵尸海啸',
    description: '大量僵尸同时来袭，准备好迎接挑战！',
    plants: ['peashooter', 'sunflower', 'wallnut', 'repeater', 'cherrybomb', 'snowpea', 'potatomine'],
    waves: [
      { delay: 1000, zombies: [
        { type: 'basic', row: 0 }, { type: 'basic', row: 1 }, { type: 'basic', row: 2 },
        { type: 'basic', row: 3 }, { type: 'basic', row: 4 },
        { type: 'basic', row: 0 }, { type: 'basic', row: 1 }, { type: 'basic', row: 3 }
      ]},
      { delay: 5000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'conehead', row: 1 }, { type: 'conehead', row: 2 },
        { type: 'conehead', row: 3 }, { type: 'conehead', row: 4 }
      ]},
      { delay: 7000, zombies: [
        { type: 'polevault', row: 0 }, { type: 'buckethead', row: 1 },
        { type: 'polevault', row: 2 }, { type: 'buckethead', row: 3 },
        { type: 'polevault', row: 4 }, { type: 'conehead', row: 2 }
      ]},
      { delay: 8000, zombies: [
        { type: 'buckethead', row: 0 }, { type: 'buckethead', row: 1 },
        { type: 'buckethead', row: 2 }, { type: 'buckethead', row: 3 }, { type: 'buckethead', row: 4 }
      ]}
    ]
  }
];

// ============================================================
// 生存模式配置 (Survival)
// ============================================================
const SURVIVAL_CONFIG = {
  initialPlants: ['peashooter', 'sunflower', 'wallnut', 'snowpea', 'cherrybomb', 'potatomine', 'repeater'],
  initialSun: 150,
  sunFallInterval: 8000,
  // 每波僵尸数量递增
  getWave: function(waveNumber) {
    const zombieCount = Math.min(3 + Math.floor(waveNumber * 1.5), 20);
    const types = ['basic', 'conehead', 'buckethead'];
    // 随着波次增加，引入更强僵尸
    if (waveNumber >= 5) types.push('polevault');
    if (waveNumber >= 10) types.push('football');
    if (waveNumber >= 15) types.push('gargantuar');

    const zombies = [];
    for (let i = 0; i < zombieCount; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      const row = Math.floor(Math.random() * 5);
      zombies.push({ type, row });
    }

    // 每5波加入旗帜僵尸
    if (waveNumber % 5 === 0) {
      zombies.push({ type: 'flag', row: 2 });
    }

    return {
      delay: Math.max(3000, 8000 - waveNumber * 200),
      zombies: zombies
    };
  }
};

// ============================================================
// 解谜模式 - 我是僵尸 (I, Zombie) 关卡
// ============================================================
const IZOMBIE_LEVELS = [
  {
    id: 'iz_1',
    name: '我是僵尸 1',
    description: '控制僵尸吃掉所有脑子！',
    rows: 5,
    brains: [
      { row: 0, col: 8 }, { row: 2, col: 8 }, { row: 4, col: 8 }
    ],
    // 玩家可以使用的僵尸
    availableZombies: ['basic', 'conehead', 'polevault'],
    // 初始阳光/资源
    startingBrains: 3,
    // 每个僵尸的消耗
    costs: { basic: 1, conehead: 2, polevault: 3 },
    // 预设植物防御
    plants: [
      { type: 'peashooter', row: 0, col: 3 },
      { type: 'wallnut', row: 2, col: 4 },
      { type: 'peashooter', row: 4, col: 3 },
      { type: 'sunflower', row: 3, col: 2 }
    ]
  },
  {
    id: 'iz_2',
    name: '我是僵尸 2',
    description: '更强的植物防御！',
    rows: 5,
    brains: [
      { row: 0, col: 8 }, { row: 2, col: 8 }, { row: 3, col: 8 }, { row: 4, col: 8 }
    ],
    availableZombies: ['basic', 'conehead', 'buckethead', 'polevault'],
    startingBrains: 5,
    costs: { basic: 1, conehead: 2, buckethead: 3, polevault: 3 },
    plants: [
      { type: 'peashooter', row: 0, col: 3 },
      { type: 'repeater', row: 1, col: 4 },
      { type: 'wallnut', row: 2, col: 5 },
      { type: 'peashooter', row: 3, col: 3 },
      { type: 'snowpea', row: 4, col: 4 },
      { type: 'sunflower', row: 2, col: 2 }
    ]
  }
];

// ============================================================
// 砸花瓶模式关卡 (Vasebreaker)
// ============================================================
const VASEBREAKER_LEVELS = [
  {
    id: 'vb_1',
    name: '第一关 - 初识砸花瓶',
    vases: (() => {
      const rows = [
        'z:basic p:peashooter z:basic p:peashooter z:basic z:basic p:sunflower',
        'p:sunflower z:basic p:peashooter z:basic p:peashooter z:basic p:wallnut',
        'z:basic p:peashooter z:basic p:wallnut z:basic p:peashooter z:basic',
        'p:peashooter z:basic p:peashooter z:basic p:sunflower z:basic p:peashooter',
        'z:basic p:peashooter z:basic z:basic p:peashooter z:basic p:sunflower',
      ];
      return rows.flatMap((row, ri) =>
        row.split(/\s+/).filter(Boolean).map((cell, ci) => {
          const [type, content] = cell.split(':');
          return { row: ri, col: ci, type, content };
        })
      );
    })()
  },
  {
    id: 'vb_2',
    name: '第二关 - 新敌人登场',
    vases: (() => {
      const rows = [
        'z:basic p:peashooter z:conehead p:peashooter z:basic p:sunflower z:basic',
        'p:sunflower z:basic p:snowpea z:basic p:wallnut z:conehead p:peashooter',
        'z:basic p:wallnut z:basic p:peashooter z:basic p:snowpea z:basic',
        'p:peashooter z:basic p:sunflower z:conehead p:peashooter z:basic p:peashooter',
        'z:conehead p:sunflower z:basic p:peashooter z:basic z:basic p:wallnut',
      ];
      return rows.flatMap((row, ri) =>
        row.split(/\s+/).filter(Boolean).map((cell, ci) => {
          const [type, content] = cell.split(':');
          return { row: ri, col: ci, type, content };
        })
      );
    })()
  },
  {
    id: 'vb_3',
    name: '第三关 - 僵尸围攻',
    vases: (() => {
      const rows = [
        'z:basic p:peashooter z:conehead z:basic p:wallnut z:basic z:conehead',
        'z:basic p:sunflower z:basic p:peashooter z:basic p:snowpea z:conehead',
        'z:conehead p:wallnut z:basic p:repeater z:basic p:sunflower z:basic',
        'p:peashooter z:basic z:conehead p:snowpea z:basic p:peashooter z:basic',
        'z:basic z:conehead p:sunflower z:basic p:peashooter z:basic p:wallnut',
      ];
      return rows.flatMap((row, ri) =>
        row.split(/\s+/).filter(Boolean).map((cell, ci) => {
          const [type, content] = cell.split(':');
          return { row: ri, col: ci, type, content };
        })
      );
    })()
  },
  {
    id: 'vb_4',
    name: '第四关 - 铁桶来袭',
    vases: (() => {
      const rows = [
        'z:buckethead p:peashooter z:conehead z:basic p:wallnut z:basic z:conehead',
        'z:basic p:sunflower z:conehead p:snowpea z:buckethead p:wallnut z:basic',
        'z:conehead p:repeater z:basic p:peashooter z:basic p:sunflower z:buckethead',
        'p:peashooter z:basic z:conehead p:wallnut z:basic p:sunflower z:conehead',
        'z:buckethead z:basic p:peashooter z:conehead z:basic z:conehead z:buckethead',
      ];
      return rows.flatMap((row, ri) =>
        row.split(/\s+/).filter(Boolean).map((cell, ci) => {
          const [type, content] = cell.split(':');
          return { row: ri, col: ci, type, content };
        })
      );
    })()
  },
  {
    id: 'vb_5',
    name: '第五关 - 终极挑战',
    vases: (() => {
      const rows = [
        'z:buckethead p:wallnut z:conehead z:polevault p:peashooter z:basic z:conehead',
        'z:basic p:sunflower z:buckethead z:conehead p:wallnut z:polevault z:basic',
        'z:polevault p:repeater z:basic z:buckethead z:conehead p:peashooter z:basic',
        'z:conehead p:snowpea z:polevault z:basic z:buckethead p:wallnut z:conehead',
        'z:buckethead z:conehead p:peashooter z:polevault z:basic z:buckethead z:conehead',
      ];
      return rows.flatMap((row, ri) =>
        row.split(/\s+/).filter(Boolean).map((cell, ci) => {
          const [type, content] = cell.split(':');
          return { row: ri, col: ci, type, content };
        })
      );
    })()
  }
];

// ============================================================
// 禅境花园配置 (Zen Garden)
// ============================================================
const ZEN_GARDEN_CONFIG = {
  maxSlots: 12,
  plantSpecies: ['sunflower', 'marigold', 'peashooter', 'wallnut', 'snowpea'],
  // 植物生长阶段: 种子 → 幼苗 → 成长 → 成熟
  growTimes: {
    seed: 5000,      // 种下到发芽 5秒
    sprout: 15000,   // 发芽到幼苗 15秒
    growing: 30000,  // 幼苗到成长 30秒
    mature: 45000    // 成长到成熟 45秒
  },
  // 成熟后每多少毫秒产出一枚硬币
  coinInterval: 30000,
  // 浇水后加速倍率
  waterBoost: 2.0,
  // 浇水后持续加速时间(ms)
  waterDuration: 60000
};
