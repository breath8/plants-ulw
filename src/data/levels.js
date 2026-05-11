// levels.js - 10关关卡数据
const LEVELS = [
  // Level 1-1: 教程关 - 只有普通僵尸
  {
    id: '1-1',
    name: '1-1',
    description: '学习种下第一棵植物！',
    plants: ['peashooter'],
    waves: [
      { delay: 20000, zombies: [{ type: 'basic', row: 2 }] },
      { delay: 25000, zombies: [{ type: 'basic', row: 1 }, { type: 'basic', row: 3 }] },
      { delay: 20000, zombies: [
        { type: 'basic', row: 0 }, { type: 'basic', row: 2 }, { type: 'basic', row: 4 },
        { type: 'flag', row: 2 }
      ]}
    ]
  },
  // Level 1-2: 引入向日葵
  {
    id: '1-2',
    name: '1-2',
    description: '种向日葵获取更多阳光！',
    plants: ['peashooter', 'sunflower'],
    waves: [
      { delay: 25000, zombies: [{ type: 'basic', row: 2 }] },
      { delay: 20000, zombies: [{ type: 'basic', row: 1 }, { type: 'basic', row: 3 }] },
      { delay: 20000, zombies: [{ type: 'basic', row: 0 }, { type: 'basic', row: 2 }, { type: 'basic', row: 4 }] },
      { delay: 20000, zombies: [
        { type: 'basic', row: 0 }, { type: 'basic', row: 1 }, { type: 'basic', row: 2 },
        { type: 'basic', row: 3 }, { type: 'basic', row: 4 }, { type: 'flag', row: 2 }
      ]}
    ]
  },
  // Level 1-3: 引入坚果墙和路障僵尸
  {
    id: '1-3',
    name: '1-3',
    description: '用坚果墙挡住僵尸！',
    plants: ['peashooter', 'sunflower', 'wallnut'],
    waves: [
      { delay: 25000, zombies: [{ type: 'basic', row: 2 }] },
      { delay: 20000, zombies: [{ type: 'basic', row: 1 }, { type: 'conehead', row: 3 }] },
      { delay: 20000, zombies: [{ type: 'basic', row: 0 }, { type: 'conehead', row: 2 }, { type: 'basic', row: 4 }] },
      { delay: 20000, zombies: [
        { type: 'basic', row: 0 }, { type: 'conehead', row: 1 }, { type: 'basic', row: 2 },
        { type: 'basic', row: 3 }, { type: 'conehead', row: 4 }, { type: 'flag', row: 2 }
      ]}
    ]
  },
  // Level 1-4: 引入寒冰射手和撑杆僵尸
  {
    id: '1-4',
    name: '1-4',
    description: '寒冰射手可以减速僵尸！',
    plants: ['peashooter', 'sunflower', 'wallnut', 'snowpea'],
    waves: [
      { delay: 25000, zombies: [{ type: 'basic', row: 2 }] },
      { delay: 20000, zombies: [{ type: 'basic', row: 1 }, { type: 'polevault', row: 3 }] },
      { delay: 20000, zombies: [
        { type: 'basic', row: 0 }, { type: 'conehead', row: 2 }, { type: 'polevault', row: 4 }
      ]},
      { delay: 20000, zombies: [
        { type: 'basic', row: 0 }, { type: 'polevault', row: 1 }, { type: 'conehead', row: 2 },
        { type: 'basic', row: 3 }, { type: 'basic', row: 4 }
      ]},
      { delay: 20000, zombies: [
        { type: 'basic', row: 0 }, { type: 'conehead', row: 1 }, { type: 'basic', row: 2 },
        { type: 'polevault', row: 3 }, { type: 'basic', row: 4 }, { type: 'flag', row: 2 }
      ]}
    ]
  },
  // Level 1-5: 引入樱桃炸弹和铁桶僵尸
  {
    id: '1-5',
    name: '1-5',
    description: '用樱桃炸弹消灭成群僵尸！',
    plants: ['peashooter', 'sunflower', 'wallnut', 'snowpea', 'cherrybomb'],
    waves: [
      { delay: 25000, zombies: [{ type: 'basic', row: 2 }] },
      { delay: 20000, zombies: [{ type: 'conehead', row: 1 }, { type: 'conehead', row: 3 }] },
      { delay: 20000, zombies: [
        { type: 'basic', row: 0 }, { type: 'buckethead', row: 2 }, { type: 'basic', row: 4 }
      ]},
      { delay: 20000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'basic', row: 1 }, { type: 'buckethead', row: 2 },
        { type: 'basic', row: 3 }, { type: 'conehead', row: 4 }
      ]},
      { delay: 20000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'buckethead', row: 1 }, { type: 'basic', row: 2 },
        { type: 'polevault', row: 3 }, { type: 'conehead', row: 4 },
        { type: 'flag', row: 2 }, { type: 'basic', row: 0 }, { type: 'basic', row: 4 }
      ]}
    ]
  },
  // Level 1-6: 引入大嘴花
  {
    id: '1-6',
    name: '1-6',
    description: '大嘴花一口吞掉僵尸！',
    plants: ['peashooter', 'sunflower', 'wallnut', 'snowpea', 'cherrybomb', 'chomper'],
    waves: [
      { delay: 25000, zombies: [{ type: 'basic', row: 2 }] },
      { delay: 18000, zombies: [{ type: 'conehead', row: 1 }, { type: 'basic', row: 3 }] },
      { delay: 18000, zombies: [
        { type: 'basic', row: 0 }, { type: 'conehead', row: 2 }, { type: 'polevault', row: 4 }
      ]},
      { delay: 18000, zombies: [
        { type: 'buckethead', row: 0 }, { type: 'conehead', row: 1 }, { type: 'basic', row: 2 },
        { type: 'conehead', row: 3 }, { type: 'buckethead', row: 4 }
      ]},
      { delay: 18000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'polevault', row: 1 }, { type: 'buckethead', row: 2 },
        { type: 'basic', row: 3 }, { type: 'conehead', row: 4 }
      ]},
      { delay: 18000, zombies: [
        { type: 'buckethead', row: 0 }, { type: 'conehead', row: 1 }, { type: 'conehead', row: 2 },
        { type: 'polevault', row: 3 }, { type: 'buckethead', row: 4 },
        { type: 'flag', row: 2 }, { type: 'basic', row: 0 }, { type: 'basic', row: 4 }
      ]}
    ]
  },
  // Level 1-7: 引入双发射手
  {
    id: '1-7',
    name: '1-7',
    description: '双发射手双倍火力！',
    plants: ['peashooter', 'sunflower', 'wallnut', 'snowpea', 'cherrybomb', 'chomper', 'repeater'],
    waves: [
      { delay: 25000, zombies: [{ type: 'basic', row: 2 }] },
      { delay: 18000, zombies: [{ type: 'conehead', row: 1 }, { type: 'conehead', row: 3 }] },
      { delay: 18000, zombies: [
        { type: 'basic', row: 0 }, { type: 'buckethead', row: 2 }, { type: 'basic', row: 4 }
      ]},
      { delay: 15000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'basic', row: 1 }, { type: 'buckethead', row: 2 },
        { type: 'basic', row: 3 }, { type: 'conehead', row: 4 }
      ]},
      { delay: 15000, zombies: [
        { type: 'polevault', row: 0 }, { type: 'conehead', row: 1 }, { type: 'buckethead', row: 2 },
        { type: 'polevault', row: 3 }, { type: 'conehead', row: 4 }
      ]},
      { delay: 15000, zombies: [
        { type: 'buckethead', row: 0 }, { type: 'conehead', row: 1 }, { type: 'buckethead', row: 2 },
        { type: 'conehead', row: 3 }, { type: 'buckethead', row: 4 }
      ]},
      { delay: 15000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'buckethead', row: 1 }, { type: 'basic', row: 2 },
        { type: 'polevault', row: 3 }, { type: 'conehead', row: 4 },
        { type: 'flag', row: 2 }, { type: 'buckethead', row: 0 }, { type: 'buckethead', row: 4 }
      ]}
    ]
  },
  // Level 1-8: 引入土豆地雷
  {
    id: '1-8',
    name: '1-8',
    description: '土豆地雷在土里等待僵尸！',
    plants: ['peashooter', 'sunflower', 'wallnut', 'snowpea', 'cherrybomb', 'chomper', 'repeater', 'potatomine'],
    waves: [
      { delay: 25000, zombies: [{ type: 'basic', row: 2 }] },
      { delay: 18000, zombies: [{ type: 'conehead', row: 1 }, { type: 'basic', row: 3 }] },
      { delay: 15000, zombies: [
        { type: 'basic', row: 0 }, { type: 'buckethead', row: 2 }, { type: 'polevault', row: 4 }
      ]},
      { delay: 15000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'conehead', row: 1 }, { type: 'buckethead', row: 2 },
        { type: 'basic', row: 3 }, { type: 'conehead', row: 4 }
      ]},
      { delay: 15000, zombies: [
        { type: 'buckethead', row: 0 }, { type: 'polevault', row: 1 }, { type: 'conehead', row: 2 },
        { type: 'buckethead', row: 3 }, { type: 'basic', row: 4 }
      ]},
      { delay: 12000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'buckethead', row: 1 }, { type: 'buckethead', row: 2 },
        { type: 'polevault', row: 3 }, { type: 'conehead', row: 4 }
      ]},
      { delay: 12000, zombies: [
        { type: 'buckethead', row: 0 }, { type: 'conehead', row: 1 }, { type: 'basic', row: 2 },
        { type: 'buckethead', row: 3 }, { type: 'conehead', row: 4 },
        { type: 'flag', row: 2 }, { type: 'polevault', row: 0 }, { type: 'polevault', row: 4 }
      ]}
    ]
  },
  // Level 1-9: 引入大喷菇（白天版，这里用豌豆+减速代替）
  {
    id: '1-9',
    name: '1-9',
    description: '大量僵尸来袭！',
    plants: ['peashooter', 'sunflower', 'wallnut', 'snowpea', 'cherrybomb', 'chomper', 'repeater', 'potatomine'],
    waves: [
      { delay: 20000, zombies: [{ type: 'conehead', row: 2 }] },
      { delay: 15000, zombies: [
        { type: 'basic', row: 0 }, { type: 'conehead', row: 2 }, { type: 'basic', row: 4 }
      ]},
      { delay: 15000, zombies: [
        { type: 'polevault', row: 0 }, { type: 'buckethead', row: 2 }, { type: 'polevault', row: 4 }
      ]},
      { delay: 12000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'conehead', row: 1 }, { type: 'buckethead', row: 2 },
        { type: 'conehead', row: 3 }, { type: 'conehead', row: 4 }
      ]},
      { delay: 12000, zombies: [
        { type: 'buckethead', row: 0 }, { type: 'polevault', row: 1 }, { type: 'buckethead', row: 2 },
        { type: 'polevault', row: 3 }, { type: 'buckethead', row: 4 }
      ]},
      { delay: 10000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'buckethead', row: 1 }, { type: 'buckethead', row: 2 },
        { type: 'buckethead', row: 3 }, { type: 'conehead', row: 4 }
      ]},
      { delay: 10000, zombies: [
        { type: 'buckethead', row: 0 }, { type: 'conehead', row: 1 }, { type: 'polevault', row: 2 },
        { type: 'conehead', row: 3 }, { type: 'buckethead', row: 4 }
      ]},
      { delay: 10000, zombies: [
        { type: 'buckethead', row: 0 }, { type: 'buckethead', row: 1 }, { type: 'basic', row: 2 },
        { type: 'buckethead', row: 3 }, { type: 'buckethead', row: 4 },
        { type: 'flag', row: 2 }, { type: 'polevault', row: 1 }, { type: 'polevault', row: 3 }
      ]}
    ]
  },
  // Level 1-10: 最终挑战 - 全类型大波僵尸
  {
    id: '1-10',
    name: '1-10',
    description: '最后一波！坚持住！',
    plants: ['peashooter', 'sunflower', 'wallnut', 'snowpea', 'cherrybomb', 'chomper', 'repeater', 'potatomine'],
    waves: [
      { delay: 20000, zombies: [{ type: 'conehead', row: 2 }] },
      { delay: 15000, zombies: [
        { type: 'basic', row: 0 }, { type: 'conehead', row: 2 }, { type: 'basic', row: 4 }
      ]},
      { delay: 12000, zombies: [
        { type: 'polevault', row: 0 }, { type: 'buckethead', row: 2 }, { type: 'polevault', row: 4 }
      ]},
      { delay: 10000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'buckethead', row: 1 }, { type: 'conehead', row: 2 },
        { type: 'buckethead', row: 3 }, { type: 'conehead', row: 4 }
      ]},
      { delay: 10000, zombies: [
        { type: 'buckethead', row: 0 }, { type: 'polevault', row: 1 }, { type: 'buckethead', row: 2 },
        { type: 'polevault', row: 3 }, { type: 'buckethead', row: 4 }
      ]},
      { delay: 8000, zombies: [
        { type: 'buckethead', row: 0 }, { type: 'buckethead', row: 1 }, { type: 'conehead', row: 2 },
        { type: 'buckethead', row: 3 }, { type: 'buckethead', row: 4 }
      ]},
      { delay: 8000, zombies: [
        { type: 'polevault', row: 0 }, { type: 'buckethead', row: 1 }, { type: 'polevault', row: 2 },
        { type: 'buckethead', row: 3 }, { type: 'polevault', row: 4 }
      ]},
      { delay: 8000, zombies: [
        { type: 'buckethead', row: 0 }, { type: 'buckethead', row: 1 }, { type: 'buckethead', row: 2 },
        { type: 'buckethead', row: 3 }, { type: 'buckethead', row: 4 }
      ]},
      { delay: 5000, zombies: [
        { type: 'buckethead', row: 0 }, { type: 'buckethead', row: 1 }, { type: 'buckethead', row: 2 },
        { type: 'buckethead', row: 3 }, { type: 'buckethead', row: 4 },
        { type: 'flag', row: 2 },
        { type: 'polevault', row: 0 }, { type: 'polevault', row: 1 }, { type: 'polevault', row: 3 },
        { type: 'polevault', row: 4 },
        { type: 'conehead', row: 0 }, { type: 'conehead', row: 4 },
        { type: 'basic', row: 1 }, { type: 'basic', row: 3 }
      ]}
    ]
  }
];
