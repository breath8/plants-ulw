// levels.js - 50关关卡数据
const LEVELS = [
  // =====================================================
  // WORLD 0 - DAY (levels 0-9, IDs 1-1 to 1-10)
  // =====================================================

  // Level 1-1: 教程关 - 只有普通僵尸
  {
    id: '1-1',
    name: '1-1',
    description: '学习种下第一棵植物！',
    plants: ['peashooter'],
    waves: [
      { delay: 8000, zombies: [{ type: 'basic', row: 2 }] },
      { delay: 12000, zombies: [{ type: 'basic', row: 1 }, { type: 'basic', row: 3 }] },
      { delay: 10000, zombies: [
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
      { delay: 10000, zombies: [{ type: 'basic', row: 2 }] },
      { delay: 12000, zombies: [{ type: 'basic', row: 1 }, { type: 'basic', row: 3 }] },
      { delay: 10000, zombies: [{ type: 'basic', row: 0 }, { type: 'basic', row: 2 }, { type: 'basic', row: 4 }] },
      { delay: 10000, zombies: [
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
      { delay: 8000, zombies: [{ type: 'basic', row: 2 }] },
      { delay: 10000, zombies: [{ type: 'basic', row: 1 }, { type: 'conehead', row: 3 }] },
      { delay: 10000, zombies: [{ type: 'basic', row: 0 }, { type: 'conehead', row: 2 }, { type: 'basic', row: 4 }] },
      { delay: 10000, zombies: [
        { type: 'basic', row: 0 }, { type: 'conehead', row: 1 }, { type: 'basic', row: 2 },
        { type: 'basic', row: 3 }, { type: 'conehead', row: 4 }, { type: 'flag', row: 2 }
      ]}
    ]
  },
  // Level 1-4: 引入撑杆僵尸
  {
    id: '1-4',
    name: '1-4',
    description: '小心撑杆僵尸！',
    plants: ['peashooter', 'sunflower', 'wallnut'],
    waves: [
      { delay: 8000, zombies: [{ type: 'basic', row: 2 }] },
      { delay: 10000, zombies: [{ type: 'basic', row: 1 }, { type: 'polevault', row: 3 }] },
      { delay: 10000, zombies: [
        { type: 'basic', row: 0 }, { type: 'conehead', row: 2 }, { type: 'polevault', row: 4 }
      ]},
      { delay: 10000, zombies: [
        { type: 'basic', row: 0 }, { type: 'polevault', row: 1 }, { type: 'conehead', row: 2 },
        { type: 'basic', row: 3 }, { type: 'basic', row: 4 }
      ]},
      { delay: 10000, zombies: [
        { type: 'basic', row: 0 }, { type: 'conehead', row: 1 }, { type: 'basic', row: 2 },
        { type: 'polevault', row: 3 }, { type: 'basic', row: 4 }, { type: 'flag', row: 2 }
      ]}
    ]
  },
  // Level 1-5: 引入土豆地雷和铁桶僵尸
  {
    id: '1-5',
    name: '1-5',
    description: '用土豆地雷消灭僵尸！',
    plants: ['peashooter', 'sunflower', 'wallnut', 'potatomine'],
    waves: [
      { delay: 8000, zombies: [{ type: 'basic', row: 2 }] },
      { delay: 10000, zombies: [{ type: 'conehead', row: 1 }, { type: 'conehead', row: 3 }] },
      { delay: 10000, zombies: [
        { type: 'basic', row: 0 }, { type: 'buckethead', row: 2 }, { type: 'basic', row: 4 }
      ]},
      { delay: 10000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'basic', row: 1 }, { type: 'buckethead', row: 2 },
        { type: 'basic', row: 3 }, { type: 'conehead', row: 4 }
      ]},
      { delay: 8000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'buckethead', row: 1 }, { type: 'basic', row: 2 },
        { type: 'polevault', row: 3 }, { type: 'conehead', row: 4 },
        { type: 'flag', row: 2 }, { type: 'basic', row: 0 }, { type: 'basic', row: 4 }
      ]}
    ]
  },
  // Level 1-6: 引入寒冰射手
  {
    id: '1-6',
    name: '1-6',
    description: '寒冰射手可以减速僵尸！',
    plants: ['peashooter', 'sunflower', 'wallnut', 'potatomine', 'snowpea'],
    waves: [
      { delay: 8000, zombies: [{ type: 'basic', row: 2 }] },
      { delay: 10000, zombies: [{ type: 'conehead', row: 1 }, { type: 'basic', row: 3 }] },
      { delay: 10000, zombies: [
        { type: 'basic', row: 0 }, { type: 'conehead', row: 2 }, { type: 'polevault', row: 4 }
      ]},
      { delay: 8000, zombies: [
        { type: 'buckethead', row: 0 }, { type: 'conehead', row: 1 }, { type: 'basic', row: 2 },
        { type: 'conehead', row: 3 }, { type: 'buckethead', row: 4 }
      ]},
      { delay: 8000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'polevault', row: 1 }, { type: 'buckethead', row: 2 },
        { type: 'basic', row: 3 }, { type: 'conehead', row: 4 }
      ]},
      { delay: 8000, zombies: [
        { type: 'buckethead', row: 0 }, { type: 'conehead', row: 1 }, { type: 'conehead', row: 2 },
        { type: 'polevault', row: 3 }, { type: 'buckethead', row: 4 },
        { type: 'flag', row: 2 }, { type: 'basic', row: 0 }, { type: 'basic', row: 4 }
      ]}
    ]
  },
  // Level 1-7: 引入大嘴花
  {
    id: '1-7',
    name: '1-7',
    description: '大嘴花一口吞掉僵尸！',
    plants: ['peashooter', 'sunflower', 'wallnut', 'potatomine', 'snowpea', 'chomper'],
    waves: [
      { delay: 8000, zombies: [{ type: 'basic', row: 2 }] },
      { delay: 10000, zombies: [{ type: 'conehead', row: 1 }, { type: 'basic', row: 3 }] },
      { delay: 10000, zombies: [
        { type: 'basic', row: 0 }, { type: 'conehead', row: 2 }, { type: 'polevault', row: 4 }
      ]},
      { delay: 8000, zombies: [
        { type: 'buckethead', row: 0 }, { type: 'conehead', row: 1 }, { type: 'basic', row: 2 },
        { type: 'conehead', row: 3 }, { type: 'buckethead', row: 4 }
      ]},
      { delay: 8000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'polevault', row: 1 }, { type: 'buckethead', row: 2 },
        { type: 'basic', row: 3 }, { type: 'conehead', row: 4 }
      ]},
      { delay: 8000, zombies: [
        { type: 'buckethead', row: 0 }, { type: 'conehead', row: 1 }, { type: 'conehead', row: 2 },
        { type: 'polevault', row: 3 }, { type: 'buckethead', row: 4 },
        { type: 'flag', row: 2 }, { type: 'basic', row: 0 }, { type: 'basic', row: 4 }
      ]}
    ]
  },
  // Level 1-8: 引入双发射手
  {
    id: '1-8',
    name: '1-8',
    description: '双发射手双倍火力！',
    plants: ['peashooter', 'sunflower', 'wallnut', 'potatomine', 'snowpea', 'chomper', 'cherrybomb', 'repeater'],
    waves: [
      { delay: 8000, zombies: [{ type: 'basic', row: 2 }] },
      { delay: 10000, zombies: [{ type: 'conehead', row: 1 }, { type: 'basic', row: 3 }] },
      { delay: 10000, zombies: [
        { type: 'basic', row: 0 }, { type: 'buckethead', row: 2 }, { type: 'polevault', row: 4 }
      ]},
      { delay: 8000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'conehead', row: 1 }, { type: 'buckethead', row: 2 },
        { type: 'basic', row: 3 }, { type: 'conehead', row: 4 }
      ]},
      { delay: 8000, zombies: [
        { type: 'buckethead', row: 0 }, { type: 'polevault', row: 1 }, { type: 'conehead', row: 2 },
        { type: 'buckethead', row: 3 }, { type: 'basic', row: 4 }
      ]},
      { delay: 6000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'buckethead', row: 1 }, { type: 'buckethead', row: 2 },
        { type: 'polevault', row: 3 }, { type: 'conehead', row: 4 }
      ]},
      { delay: 6000, zombies: [
        { type: 'buckethead', row: 0 }, { type: 'conehead', row: 1 }, { type: 'basic', row: 2 },
        { type: 'buckethead', row: 3 }, { type: 'conehead', row: 4 },
        { type: 'flag', row: 2 }, { type: 'polevault', row: 0 }, { type: 'polevault', row: 4 }
      ]}
    ]
  },
  // Level 1-9: 引入樱桃炸弹
  {
    id: '1-9',
    name: '1-9',
    description: '用樱桃炸弹消灭成群僵尸！',
    plants: ['peashooter', 'sunflower', 'wallnut', 'potatomine', 'snowpea', 'chomper', 'repeater', 'cherrybomb'],
    waves: [
      { delay: 8000, zombies: [{ type: 'conehead', row: 2 }] },
      { delay: 10000, zombies: [
        { type: 'basic', row: 0 }, { type: 'conehead', row: 2 }, { type: 'basic', row: 4 }
      ]},
      { delay: 8000, zombies: [
        { type: 'polevault', row: 0 }, { type: 'buckethead', row: 2 }, { type: 'polevault', row: 4 }
      ]},
      { delay: 8000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'conehead', row: 1 }, { type: 'buckethead', row: 2 },
        { type: 'conehead', row: 3 }, { type: 'conehead', row: 4 }
      ]},
      { delay: 6000, zombies: [
        { type: 'buckethead', row: 0 }, { type: 'polevault', row: 1 }, { type: 'buckethead', row: 2 },
        { type: 'polevault', row: 3 }, { type: 'buckethead', row: 4 }
      ]},
      { delay: 6000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'buckethead', row: 1 }, { type: 'buckethead', row: 2 },
        { type: 'buckethead', row: 3 }, { type: 'conehead', row: 4 }
      ]},
      { delay: 5000, zombies: [
        { type: 'buckethead', row: 0 }, { type: 'conehead', row: 1 }, { type: 'polevault', row: 2 },
        { type: 'conehead', row: 3 }, { type: 'buckethead', row: 4 }
      ]},
      { delay: 5000, zombies: [
        { type: 'buckethead', row: 0 }, { type: 'buckethead', row: 1 }, { type: 'basic', row: 2 },
        { type: 'buckethead', row: 3 }, { type: 'buckethead', row: 4 },
        { type: 'flag', row: 2 }, { type: 'polevault', row: 1 }, { type: 'polevault', row: 3 }
      ]}
    ]
  },
  // Level 1-10: 传送带关卡
  {
    id: '1-10',
    name: '1-10',
    description: '传送带关卡！坚持住！',
    plants: [],
    isConveyor: true,
    conveyorPlants: ['peashooter', 'sunflower', 'wallnut', 'snowpea', 'cherrybomb', 'repeater', 'potatomine', 'chomper'],
    waves: [
      { delay: 6000, zombies: [{ type: 'conehead', row: 2 }] },
      { delay: 8000, zombies: [
        { type: 'basic', row: 0 }, { type: 'conehead', row: 2 }, { type: 'basic', row: 4 }
      ]},
      { delay: 8000, zombies: [
        { type: 'polevault', row: 0 }, { type: 'buckethead', row: 2 }, { type: 'polevault', row: 4 }
      ]},
      { delay: 6000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'buckethead', row: 1 }, { type: 'conehead', row: 2 },
        { type: 'buckethead', row: 3 }, { type: 'conehead', row: 4 }
      ]},
      { delay: 6000, zombies: [
        { type: 'buckethead', row: 0 }, { type: 'polevault', row: 1 }, { type: 'buckethead', row: 2 },
        { type: 'polevault', row: 3 }, { type: 'buckethead', row: 4 }
      ]},
      { delay: 5000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'buckethead', row: 1 }, { type: 'conehead', row: 2 },
        { type: 'polevault', row: 3 }, { type: 'buckethead', row: 4 },
        { type: 'buckethead', row: 0 }, { type: 'buckethead', row: 4 }
      ]},
      { delay: 5000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'buckethead', row: 1 }, { type: 'polevault', row: 2 },
        { type: 'conehead', row: 3 }, { type: 'buckethead', row: 4 }
      ]},
      { delay: 4000, zombies: [
        { type: 'buckethead', row: 0 }, { type: 'buckethead', row: 1 }, { type: 'conehead', row: 2 },
        { type: 'buckethead', row: 3 }, { type: 'buckethead', row: 4 }
      ]},
      { delay: 4000, zombies: [
        { type: 'buckethead', row: 0 }, { type: 'polevault', row: 1 }, { type: 'basic', row: 2 },
        { type: 'polevault', row: 3 }, { type: 'buckethead', row: 4 },
        { type: 'flag', row: 2 }, { type: 'conehead', row: 1 }, { type: 'conehead', row: 3 }
      ]}
    ]
  },

  // =====================================================
  // WORLD 1 - NIGHT (levels 10-19, IDs 2-1 to 2-10)
  // =====================================================

  // Level 2-1: 夜晚第一关 - 引入阳光蘑菇
  {
    id: '2-1',
    name: '2-1',
    description: '夜晚没有自然阳光，用阳光蘑菇！',
    world: 1,
    hasGraves: true,
    plants: ['puffshroom', 'sunshroom', 'peashooter', 'wallnut', 'snowpea'],
    waves: [
      { delay: 10000, zombies: [{ type: 'basic', row: 2 }] },
      { delay: 12000, zombies: [{ type: 'basic', row: 1 }, { type: 'basic', row: 3 }] },
      { delay: 10000, zombies: [{ type: 'conehead', row: 0 }, { type: 'conehead', row: 2 }, { type: 'conehead', row: 4 }] },
      { delay: 10000, zombies: [
        { type: 'basic', row: 0 }, { type: 'conehead', row: 1 }, { type: 'basic', row: 2 },
        { type: 'basic', row: 3 }, { type: 'conehead', row: 4 }, { type: 'flag', row: 2 }
      ]}
    ]
  },
  // Level 2-2: 引入大喷菇
  {
    id: '2-2',
    name: '2-2',
    description: '大喷菇可以穿透多个僵尸！',
    world: 1,
    hasGraves: true,
    plants: ['puffshroom', 'sunshroom', 'fumeshroom', 'peashooter', 'wallnut', 'snowpea'],
    waves: [
      { delay: 8000, zombies: [{ type: 'basic', row: 2 }] },
      { delay: 10000, zombies: [{ type: 'conehead', row: 1 }, { type: 'basic', row: 3 }] },
      { delay: 10000, zombies: [
        { type: 'basic', row: 0 }, { type: 'conehead', row: 2 }, { type: 'polevault', row: 4 }
      ]},
      { delay: 10000, zombies: [
        { type: 'basic', row: 0 }, { type: 'conehead', row: 1 }, { type: 'basic', row: 2 },
        { type: 'basic', row: 3 }, { type: 'conehead', row: 4 }
      ]},
      { delay: 8000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'basic', row: 1 }, { type: 'conehead', row: 2 },
        { type: 'basic', row: 3 }, { type: 'conehead', row: 4 }, { type: 'flag', row: 2 }
      ]}
    ]
  },
  // Level 2-3: 引入坟墓吞噬者和报纸僵尸
  {
    id: '2-3',
    name: '2-3',
    description: '用坟墓吞噬者清除墓碑！',
    world: 1,
    hasGraves: true,
    plants: ['puffshroom', 'sunshroom', 'fumeshroom', 'gravebuster', 'peashooter', 'wallnut', 'snowpea'],
    waves: [
      { delay: 8000, zombies: [{ type: 'basic', row: 2 }] },
      { delay: 10000, zombies: [{ type: 'newspaper', row: 1 }, { type: 'basic', row: 3 }] },
      { delay: 10000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'conehead', row: 2 }, { type: 'polevault', row: 4 }
      ]},
      { delay: 10000, zombies: [
        { type: 'basic', row: 0 }, { type: 'newspaper', row: 1 }, { type: 'basic', row: 2 },
        { type: 'basic', row: 3 }, { type: 'conehead', row: 4 }
      ]},
      { delay: 8000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'conehead', row: 1 }, { type: 'polevault', row: 2 },
        { type: 'newspaper', row: 3 }, { type: 'conehead', row: 4 }, { type: 'flag', row: 2 }
      ]}
    ]
  },
  // Level 2-4: 引入铁栅门僵尸
  {
    id: '2-4',
    name: '2-4',
    description: '铁栅门僵尸挡住了豌豆！',
    world: 1,
    hasGraves: true,
    plants: ['puffshroom', 'sunshroom', 'fumeshroom', 'gravebuster', 'peashooter', 'wallnut', 'snowpea', 'cherrybomb'],
    waves: [
      { delay: 8000, zombies: [{ type: 'basic', row: 2 }] },
      { delay: 10000, zombies: [{ type: 'screendoor', row: 1 }, { type: 'basic', row: 3 }] },
      { delay: 10000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'conehead', row: 2 }, { type: 'polevault', row: 4 }
      ]},
      { delay: 10000, zombies: [
        { type: 'basic', row: 0 }, { type: 'screendoor', row: 1 }, { type: 'basic', row: 2 },
        { type: 'basic', row: 3 }, { type: 'conehead', row: 4 }
      ]},
      { delay: 8000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'screendoor', row: 1 }, { type: 'polevault', row: 2 },
        { type: 'basic', row: 3 }, { type: 'conehead', row: 4 }, { type: 'flag', row: 2 }
      ]}
    ]
  },
  // Level 2-5: 引入催眠蘑菇
  {
    id: '2-5',
    name: '2-5',
    description: '催眠蘑菇让僵尸互相攻击！',
    world: 1,
    hasGraves: true,
    plants: ['puffshroom', 'sunshroom', 'fumeshroom', 'gravebuster', 'hypnoshroom', 'peashooter', 'wallnut', 'snowpea'],
    waves: [
      { delay: 8000, zombies: [{ type: 'basic', row: 2 }] },
      { delay: 10000, zombies: [{ type: 'conehead', row: 1 }, { type: 'conehead', row: 3 }] },
      { delay: 10000, zombies: [
        { type: 'basic', row: 0 }, { type: 'screendoor', row: 2 }, { type: 'polevault', row: 4 }
      ]},
      { delay: 10000, zombies: [
        { type: 'newspaper', row: 0 }, { type: 'conehead', row: 1 }, { type: 'basic', row: 2 },
        { type: 'conehead', row: 3 }, { type: 'newspaper', row: 4 }
      ]},
      { delay: 8000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'screendoor', row: 1 }, { type: 'buckethead', row: 2 },
        { type: 'basic', row: 3 }, { type: 'conehead', row: 4 }
      ]},
      { delay: 6000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'conehead', row: 1 }, { type: 'polevault', row: 2 },
        { type: 'screendoor', row: 3 }, { type: 'conehead', row: 4 },
        { type: 'flag', row: 2 }, { type: 'basic', row: 0 }, { type: 'basic', row: 4 }
      ]}
    ]
  },
  // Level 2-6: 引入胆小蘑菇和橄榄球僵尸
  {
    id: '2-6',
    name: '2-6',
    description: '橄榄球僵尸速度很快！',
    world: 1,
    hasGraves: true,
    plants: ['puffshroom', 'sunshroom', 'fumeshroom', 'gravebuster', 'hypnoshroom', 'scaredyshroom', 'peashooter', 'wallnut', 'snowpea'],
    waves: [
      { delay: 8000, zombies: [{ type: 'basic', row: 2 }] },
      { delay: 10000, zombies: [{ type: 'football', row: 1 }, { type: 'basic', row: 3 }] },
      { delay: 10000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'conehead', row: 2 }, { type: 'polevault', row: 4 }
      ]},
      { delay: 8000, zombies: [
        { type: 'basic', row: 0 }, { type: 'football', row: 1 }, { type: 'basic', row: 2 },
        { type: 'basic', row: 3 }, { type: 'conehead', row: 4 }
      ]},
      { delay: 8000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'conehead', row: 1 }, { type: 'polevault', row: 2 },
        { type: 'basic', row: 3 }, { type: 'conehead', row: 4 }
      ]},
      { delay: 6000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'football', row: 1 }, { type: 'conehead', row: 2 },
        { type: 'polevault', row: 3 }, { type: 'conehead', row: 4 }, { type: 'flag', row: 2 }
      ]}
    ]
  },
  // Level 2-7: 引入冰冻蘑菇
  {
    id: '2-7',
    name: '2-7',
    description: '冰冻蘑菇可以冻结全屏僵尸！',
    world: 1,
    hasGraves: true,
    plants: ['puffshroom', 'sunshroom', 'fumeshroom', 'gravebuster', 'hypnoshroom', 'scaredyshroom', 'iceshroom', 'peashooter', 'wallnut', 'snowpea'],
    waves: [
      { delay: 8000, zombies: [{ type: 'basic', row: 2 }] },
      { delay: 10000, zombies: [{ type: 'newspaper', row: 1 }, { type: 'conehead', row: 3 }] },
      { delay: 10000, zombies: [
        { type: 'basic', row: 0 }, { type: 'screendoor', row: 2 }, { type: 'polevault', row: 4 }
      ]},
      { delay: 8000, zombies: [
        { type: 'football', row: 0 }, { type: 'conehead', row: 1 }, { type: 'basic', row: 2 },
        { type: 'conehead', row: 3 }, { type: 'football', row: 4 }
      ]},
      { delay: 8000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'screendoor', row: 1 }, { type: 'buckethead', row: 2 },
        { type: 'basic', row: 3 }, { type: 'conehead', row: 4 }
      ]},
      { delay: 6000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'football', row: 1 }, { type: 'conehead', row: 2 },
        { type: 'screendoor', row: 3 }, { type: 'conehead', row: 4 },
        { type: 'flag', row: 2 }, { type: 'basic', row: 0 }, { type: 'basic', row: 4 }
      ]}
    ]
  },
  // Level 2-8: 引入毁灭蘑菇和舞蹈僵尸
  {
    id: '2-8',
    name: '2-8',
    description: '舞蹈僵尸会召唤伴舞！',
    world: 1,
    hasGraves: true,
    plants: ['puffshroom', 'sunshroom', 'fumeshroom', 'gravebuster', 'hypnoshroom', 'scaredyshroom', 'iceshroom', 'doomshroom', 'peashooter', 'wallnut', 'snowpea'],
    waves: [
      { delay: 8000, zombies: [{ type: 'basic', row: 2 }] },
      { delay: 10000, zombies: [{ type: 'dancing', row: 2 }, { type: 'backupdancer', row: 1 }] },
      { delay: 10000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'conehead', row: 2 }, { type: 'polevault', row: 4 }
      ]},
      { delay: 8000, zombies: [
        { type: 'basic', row: 0 }, { type: 'dancing', row: 1 }, { type: 'basic', row: 2 },
        { type: 'backupdancer', row: 3 }, { type: 'conehead', row: 4 }
      ]},
      { delay: 8000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'screendoor', row: 1 }, { type: 'buckethead', row: 2 },
        { type: 'basic', row: 3 }, { type: 'conehead', row: 4 }
      ]},
      { delay: 6000, zombies: [
        { type: 'football', row: 0 }, { type: 'dancing', row: 1 }, { type: 'conehead', row: 2 },
        { type: 'screendoor', row: 3 }, { type: 'football', row: 4 }
      ]},
      { delay: 6000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'screendoor', row: 1 }, { type: 'conehead', row: 2 },
        { type: 'backupdancer', row: 3 }, { type: 'conehead', row: 4 },
        { type: 'flag', row: 2 }, { type: 'dancing', row: 0 }, { type: 'backupdancer', row: 4 }
      ]}
    ]
  },
  // Level 2-9: 夜晚激战
  {
    id: '2-9',
    name: '2-9',
    description: '夜晚激战！大量僵尸来袭！',
    world: 1,
    hasGraves: true,
    plants: ['puffshroom', 'sunshroom', 'fumeshroom', 'gravebuster', 'hypnoshroom', 'scaredyshroom', 'iceshroom', 'doomshroom', 'peashooter', 'wallnut', 'snowpea', 'cherrybomb'],
    waves: [
      { delay: 8000, zombies: [{ type: 'conehead', row: 2 }] },
      { delay: 10000, zombies: [{ type: 'dancing', row: 1 }, { type: 'backupdancer', row: 3 }] },
      { delay: 10000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'football', row: 2 }, { type: 'conehead', row: 4 }
      ]},
      { delay: 8000, zombies: [
        { type: 'basic', row: 0 }, { type: 'screendoor', row: 1 }, { type: 'basic', row: 2 },
        { type: 'screendoor', row: 3 }, { type: 'basic', row: 4 }
      ]},
      { delay: 8000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'conehead', row: 1 }, { type: 'polevault', row: 2 },
        { type: 'backupdancer', row: 3 }, { type: 'conehead', row: 4 }
      ]},
      { delay: 6000, zombies: [
        { type: 'football', row: 0 }, { type: 'dancing', row: 1 }, { type: 'buckethead', row: 2 },
        { type: 'screendoor', row: 3 }, { type: 'football', row: 4 }
      ]},
      { delay: 6000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'buckethead', row: 1 }, { type: 'conehead', row: 2 },
        { type: 'screendoor', row: 3 }, { type: 'conehead', row: 4 }
      ]},
      { delay: 5000, zombies: [
        { type: 'buckethead', row: 0 }, { type: 'football', row: 1 }, { type: 'conehead', row: 2 },
        { type: 'football', row: 3 }, { type: 'buckethead', row: 4 },
        { type: 'flag', row: 2 }, { type: 'dancing', row: 0 }, { type: 'backupdancer', row: 4 }
      ]}
    ]
  },
  // Level 2-10: 传送带关卡 - 夜晚最终
  {
    id: '2-10',
    name: '2-10',
    description: '夜晚最终关卡！传送带挑战！',
    world: 1,
    hasGraves: true,
    isConveyor: true,
    conveyorPlants: ['puffshroom', 'sunshroom', 'fumeshroom', 'gravebuster', 'hypnoshroom', 'iceshroom', 'doomshroom', 'scaredyshroom'],
    waves: [
      { delay: 6000, zombies: [{ type: 'basic', row: 2 }] },
      { delay: 8000, zombies: [{ type: 'conehead', row: 1 }, { type: 'basic', row: 3 }] },
      { delay: 8000, zombies: [{ type: 'newspaper', row: 0 }, { type: 'newspaper', row: 4 }] },
      { delay: 6000, zombies: [{ type: 'screendoor', row: 2 }] },
      { delay: 6000, zombies: [{ type: 'football', row: 1 }, { type: 'football', row: 3 }] },
      { delay: 5000, zombies: [{ type: 'dancing', row: 2 }, { type: 'backupdancer', row: 1 }] },
      { delay: 5000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'screendoor', row: 1 }, { type: 'buckethead', row: 2 },
        { type: 'screendoor', row: 3 }, { type: 'conehead', row: 4 }
      ]},
      { delay: 4000, zombies: [
        { type: 'buckethead', row: 0 }, { type: 'football', row: 1 }, { type: 'conehead', row: 2 },
        { type: 'football', row: 3 }, { type: 'buckethead', row: 4 },
        { type: 'flag', row: 2 }, { type: 'dancing', row: 0 }, { type: 'backupdancer', row: 4 }
      ]}
    ]
  },

  // =====================================================
  // WORLD 2 - POOL (levels 20-29, IDs 3-1 to 3-10)
  // =====================================================

  // Level 3-1: 引入荷叶和窝瓜
  {
    id: '3-1',
    name: '3-1',
    description: '泳池关卡需要荷叶保护植物！',
    world: 2,
    plants: ['lilypad', 'squash', 'peashooter', 'snowpea', 'wallnut', 'potatomine'],
    waves: [
      { delay: 8000, zombies: [{ type: 'basic', row: 2 }] },
      { delay: 10000, zombies: [{ type: 'duckytube', row: 2 }] },
      { delay: 10000, zombies: [{ type: 'conehead', row: 1 }, { type: 'conehead', row: 3 }] },
      { delay: 10000, zombies: [
        { type: 'basic', row: 0 }, { type: 'conehead', row: 2 }, { type: 'basic', row: 4 },
        { type: 'duckytube', row: 1 }, { type: 'duckytube', row: 3 }
      ]},
      { delay: 8000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'polevault', row: 1 }, { type: 'conehead', row: 2 },
        { type: 'basic', row: 3 }, { type: 'conehead', row: 4 }, { type: 'flag', row: 2 }
      ]}
    ]
  },
  // Level 3-2: 引入三发射手
  {
    id: '3-2',
    name: '3-2',
    description: '三发射手可以攻击多行！',
    world: 2,
    plants: ['lilypad', 'squash', 'threepeater', 'peashooter', 'snowpea', 'wallnut', 'potatomine'],
    waves: [
      { delay: 8000, zombies: [{ type: 'basic', row: 2 }] },
      { delay: 10000, zombies: [{ type: 'duckytube', row: 1 }, { type: 'duckytube', row: 3 }] },
      { delay: 10000, zombies: [{ type: 'conehead', row: 0 }, { type: 'conehead', row: 4 }] },
      { delay: 10000, zombies: [
        { type: 'basic', row: 0 }, { type: 'conehead', row: 1 }, { type: 'basic', row: 2 },
        { type: 'conehead', row: 3 }, { type: 'basic', row: 4 },
        { type: 'duckytube', row: 0 }, { type: 'duckytube', row: 4 }
      ]},
      { delay: 8000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'polevault', row: 1 }, { type: 'conehead', row: 2 },
        { type: 'basic', row: 3 }, { type: 'conehead', row: 4 }, { type: 'flag', row: 2 }
      ]}
    ]
  },
  // Level 3-3: 引入缠绕水草和潜水僵尸
  {
    id: '3-3',
    name: '3-3',
    description: '缠绕水草可以拉起水中的僵尸！',
    world: 2,
    plants: ['lilypad', 'squash', 'threepeater', 'tanglekelp', 'peashooter', 'snowpea', 'wallnut'],
    waves: [
      { delay: 8000, zombies: [{ type: 'basic', row: 2 }] },
      { delay: 10000, zombies: [{ type: 'snorkel', row: 2 }] },
      { delay: 10000, zombies: [{ type: 'conehead', row: 1 }, { type: 'conehead', row: 3 }] },
      { delay: 10000, zombies: [
        { type: 'basic', row: 0 }, { type: 'conehead', row: 2 }, { type: 'basic', row: 4 },
        { type: 'snorkel', row: 1 }, { type: 'snorkel', row: 3 }
      ]},
      { delay: 8000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'polevault', row: 1 }, { type: 'conehead', row: 2 },
        { type: 'duckytube', row: 3 }, { type: 'conehead', row: 4 }, { type: 'flag', row: 2 }
      ]}
    ]
  },
  // Level 3-4: 引入火爆辣椒
  {
    id: '3-4',
    name: '3-4',
    description: '火爆辣椒可以烧一整行！',
    world: 2,
    plants: ['lilypad', 'squash', 'threepeater', 'tanglekelp', 'jalapeno', 'peashooter', 'snowpea', 'wallnut'],
    waves: [
      { delay: 8000, zombies: [{ type: 'basic', row: 2 }] },
      { delay: 10000, zombies: [{ type: 'snorkel', row: 0 }, { type: 'snorkel', row: 4 }] },
      { delay: 10000, zombies: [{ type: 'conehead', row: 1 }, { type: 'conehead', row: 3 }] },
      { delay: 10000, zombies: [
        { type: 'basic', row: 0 }, { type: 'conehead', row: 2 }, { type: 'basic', row: 4 },
        { type: 'duckytube', row: 1 }, { type: 'duckytube', row: 3 }
      ]},
      { delay: 8000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'polevault', row: 1 }, { type: 'conehead', row: 2 },
        { type: 'snorkel', row: 3 }, { type: 'conehead', row: 4 }
      ]},
      { delay: 8000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'buckethead', row: 1 }, { type: 'conehead', row: 2 },
        { type: 'basic', row: 3 }, { type: 'conehead', row: 4 }, { type: 'flag', row: 2 }
      ]}
    ]
  },
  // Level 3-5: 小游戏 - 节奏关
  {
    id: '3-5',
    name: '3-5',
    description: '泳池小游戏！节奏挑战！',
    world: 2,
    isConveyor: true,
    conveyorPlants: ['spikeweed', 'squash', 'potatomine', 'jalapeno', 'peashooter', 'wallnut'],
    waves: [
      { delay: 6000, zombies: [{ type: 'basic', row: 2 }] },
      { delay: 8000, zombies: [{ type: 'basic', row: 1 }, { type: 'basic', row: 3 }] },
      { delay: 6000, zombies: [{ type: 'conehead', row: 0 }, { type: 'conehead', row: 4 }] },
      { delay: 6000, zombies: [{ type: 'polevault', row: 1 }, { type: 'polevault', row: 3 }] },
      { delay: 5000, zombies: [{ type: 'buckethead', row: 2 }] },
      { delay: 5000, zombies: [{ type: 'flag', row: 2 }, { type: 'conehead', row: 0 }, { type: 'conehead', row: 4 }] }
    ]
  },
  // Level 3-6: 引入地刺和冰车僵尸
  {
    id: '3-6',
    name: '3-6',
    description: '地刺可以扎破冰车轮胎！',
    world: 2,
    plants: ['lilypad', 'squash', 'threepeater', 'tanglekelp', 'jalapeno', 'spikeweed', 'peashooter', 'snowpea', 'wallnut'],
    waves: [
      { delay: 8000, zombies: [{ type: 'basic', row: 2 }] },
      { delay: 10000, zombies: [{ type: 'zomboni', row: 2 }] },
      { delay: 10000, zombies: [{ type: 'conehead', row: 1 }, { type: 'conehead', row: 3 }] },
      { delay: 10000, zombies: [
        { type: 'basic', row: 0 }, { type: 'conehead', row: 2 }, { type: 'basic', row: 4 },
        { type: 'duckytube', row: 1 }, { type: 'duckytube', row: 3 }
      ]},
      { delay: 8000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'polevault', row: 1 }, { type: 'conehead', row: 2 },
        { type: 'snorkel', row: 3 }, { type: 'conehead', row: 4 }
      ]},
      { delay: 8000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'buckethead', row: 1 }, { type: 'conehead', row: 2 },
        { type: 'basic', row: 3 }, { type: 'conehead', row: 4 }, { type: 'flag', row: 2 }
      ]}
    ]
  },
  // Level 3-7: 引入火炬树桩
  {
    id: '3-7',
    name: '3-7',
    description: '火炬树桩让豌豆变成火豌豆！',
    world: 2,
    plants: ['lilypad', 'squash', 'threepeater', 'tanglekelp', 'jalapeno', 'spikeweed', 'torchwood', 'peashooter', 'snowpea', 'wallnut'],
    waves: [
      { delay: 8000, zombies: [{ type: 'basic', row: 2 }] },
      { delay: 10000, zombies: [{ type: 'zomboni', row: 1 }, { type: 'zomboni', row: 3 }] },
      { delay: 10000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'conehead', row: 2 }, { type: 'conehead', row: 4 }
      ]},
      { delay: 10000, zombies: [
        { type: 'basic', row: 0 }, { type: 'snorkel', row: 1 }, { type: 'basic', row: 2 },
        { type: 'snorkel', row: 3 }, { type: 'basic', row: 4 }
      ]},
      { delay: 8000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'polevault', row: 1 }, { type: 'conehead', row: 2 },
        { type: 'polevault', row: 3 }, { type: 'conehead', row: 4 }
      ]},
      { delay: 8000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'buckethead', row: 1 }, { type: 'zomboni', row: 2 },
        { type: 'buckethead', row: 3 }, { type: 'conehead', row: 4 }, { type: 'flag', row: 2 }
      ]}
    ]
  },
  // Level 3-8: 引入高坚果和海豚骑士僵尸
  {
    id: '3-8',
    name: '3-8',
    description: '高坚果可以挡住海豚骑士！',
    world: 2,
    plants: ['lilypad', 'squash', 'threepeater', 'tanglekelp', 'jalapeno', 'spikeweed', 'torchwood', 'tallnut', 'peashooter', 'snowpea'],
    waves: [
      { delay: 8000, zombies: [{ type: 'basic', row: 2 }] },
      { delay: 10000, zombies: [{ type: 'dolphinrider', row: 2 }] },
      { delay: 10000, zombies: [{ type: 'conehead', row: 1 }, { type: 'conehead', row: 3 }] },
      { delay: 10000, zombies: [
        { type: 'basic', row: 0 }, { type: 'snorkel', row: 1 }, { type: 'basic', row: 2 },
        { type: 'snorkel', row: 3 }, { type: 'basic', row: 4 }
      ]},
      { delay: 8000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'dolphinrider', row: 1 }, { type: 'conehead', row: 2 },
        { type: 'dolphinrider', row: 3 }, { type: 'conehead', row: 4 }
      ]},
      { delay: 8000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'buckethead', row: 1 }, { type: 'zomboni', row: 2 },
        { type: 'buckethead', row: 3 }, { type: 'conehead', row: 4 }
      ]},
      { delay: 6000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'polevault', row: 1 }, { type: 'conehead', row: 2 },
        { type: 'polevault', row: 3 }, { type: 'conehead', row: 4 }
      ]},
      { delay: 6000, zombies: [
        { type: 'buckethead', row: 0 }, { type: 'dolphinrider', row: 1 }, { type: 'buckethead', row: 2 },
        { type: 'dolphinrider', row: 3 }, { type: 'buckethead', row: 4 },
        { type: 'flag', row: 2 }, { type: 'conehead', row: 0 }, { type: 'conehead', row: 4 }
      ]}
    ]
  },
  // Level 3-9: 泳池激战
  {
    id: '3-9',
    name: '3-9',
    description: '泳池激战！最终考验！',
    world: 2,
    plants: ['lilypad', 'squash', 'threepeater', 'tanglekelp', 'jalapeno', 'spikeweed', 'torchwood', 'tallnut', 'peashooter', 'snowpea', 'cherrybomb'],
    waves: [
      { delay: 8000, zombies: [{ type: 'conehead', row: 2 }] },
      { delay: 10000, zombies: [{ type: 'dolphinrider', row: 1 }, { type: 'dolphinrider', row: 3 }] },
      { delay: 10000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'zomboni', row: 2 }, { type: 'conehead', row: 4 }
      ]},
      { delay: 10000, zombies: [
        { type: 'basic', row: 0 }, { type: 'snorkel', row: 1 }, { type: 'basic', row: 2 },
        { type: 'snorkel', row: 3 }, { type: 'basic', row: 4 }
      ]},
      { delay: 8000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'buckethead', row: 1 }, { type: 'conehead', row: 2 },
        { type: 'buckethead', row: 3 }, { type: 'conehead', row: 4 }
      ]},
      { delay: 8000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'polevault', row: 1 }, { type: 'conehead', row: 2 },
        { type: 'polevault', row: 3 }, { type: 'conehead', row: 4 }
      ]},
      { delay: 6000, zombies: [
        { type: 'buckethead', row: 0 }, { type: 'dolphinrider', row: 1 }, { type: 'buckethead', row: 2 },
        { type: 'dolphinrider', row: 3 }, { type: 'buckethead', row: 4 }
      ]},
      { delay: 6000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'buckethead', row: 1 }, { type: 'zomboni', row: 2 },
        { type: 'buckethead', row: 3 }, { type: 'conehead', row: 4 },
        { type: 'flag', row: 2 }, { type: 'conehead', row: 1 }, { type: 'conehead', row: 3 }
      ]}
    ]
  },
  // Level 3-10: 传送带关卡 - 泳池最终
  {
    id: '3-10',
    name: '3-10',
    description: '泳池最终关卡！传送带挑战！',
    world: 2,
    isConveyor: true,
    conveyorPlants: ['lilypad', 'squash', 'threepeater', 'tanglekelp', 'jalapeno', 'spikeweed', 'torchwood', 'tallnut'],
    waves: [
      { delay: 6000, zombies: [{ type: 'basic', row: 2 }] },
      { delay: 8000, zombies: [{ type: 'duckytube', row: 1 }, { type: 'duckytube', row: 3 }] },
      { delay: 8000, zombies: [{ type: 'conehead', row: 0 }, { type: 'conehead', row: 4 }] },
      { delay: 6000, zombies: [{ type: 'snorkel', row: 2 }] },
      { delay: 6000, zombies: [{ type: 'dolphinrider', row: 1 }, { type: 'dolphinrider', row: 3 }] },
      { delay: 5000, zombies: [{ type: 'zomboni', row: 0 }, { type: 'zomboni', row: 4 }] },
      { delay: 5000, zombies: [{ type: 'buckethead', row: 1 }, { type: 'buckethead', row: 3 }] },
      { delay: 4000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'dolphinrider', row: 1 }, { type: 'buckethead', row: 2 },
        { type: 'dolphinrider', row: 3 }, { type: 'conehead', row: 4 },
        { type: 'flag', row: 2 }
      ]}
    ]
  },

  // =====================================================
  // WORLD 3 - FOG (levels 30-39, IDs 4-1 to 4-10)
  // =====================================================

  // Level 4-1: 引入海蘑菇和路灯花
  {
    id: '4-1',
    name: '4-1',
    description: '迷雾中用路灯花照亮前方！',
    world: 3,
    hasFog: true,
    plants: ['seashroom', 'plantern', 'puffshroom', 'sunshroom', 'fumeshroom', 'hypnoshroom', 'iceshroom', 'lilypad', 'squash', 'peashooter', 'snowpea', 'wallnut'],
    waves: [
      { delay: 10000, zombies: [{ type: 'basic', row: 2 }] },
      { delay: 12000, zombies: [{ type: 'conehead', row: 1 }, { type: 'basic', row: 3 }] },
      { delay: 10000, zombies: [{ type: 'polevault', row: 0 }, { type: 'polevault', row: 4 }] },
      { delay: 10000, zombies: [
        { type: 'basic', row: 0 }, { type: 'conehead', row: 1 }, { type: 'basic', row: 2 },
        { type: 'basic', row: 3 }, { type: 'conehead', row: 4 }, { type: 'flag', row: 2 }
      ]}
    ]
  },
  // Level 4-2: 引入仙人掌和气球僵尸
  {
    id: '4-2',
    name: '4-2',
    description: '仙人掌可以击落气球僵尸！',
    world: 3,
    hasFog: true,
    plants: ['seashroom', 'plantern', 'puffshroom', 'sunshroom', 'fumeshroom', 'cactus', 'peashooter', 'snowpea', 'wallnut', 'lilypad'],
    waves: [
      { delay: 8000, zombies: [{ type: 'basic', row: 2 }] },
      { delay: 10000, zombies: [{ type: 'balloon', row: 2 }] },
      { delay: 10000, zombies: [{ type: 'conehead', row: 1 }, { type: 'conehead', row: 3 }] },
      { delay: 10000, zombies: [
        { type: 'basic', row: 0 }, { type: 'balloon', row: 1 }, { type: 'basic', row: 2 },
        { type: 'basic', row: 3 }, { type: 'balloon', row: 4 }
      ]},
      { delay: 8000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'conehead', row: 1 }, { type: 'jackbox', row: 2 },
        { type: 'basic', row: 3 }, { type: 'conehead', row: 4 }, { type: 'flag', row: 2 }
      ]}
    ]
  },
  // Level 4-3: 引入三叶草和礼盒僵尸
  {
    id: '4-3',
    name: '4-3',
    description: '三叶草可以吹走飘浮僵尸！',
    world: 3,
    hasFog: true,
    plants: ['seashroom', 'plantern', 'puffshroom', 'sunshroom', 'fumeshroom', 'cactus', 'blover', 'peashooter', 'snowpea', 'wallnut', 'lilypad'],
    waves: [
      { delay: 8000, zombies: [{ type: 'basic', row: 2 }] },
      { delay: 10000, zombies: [{ type: 'balloon', row: 1 }, { type: 'balloon', row: 3 }] },
      { delay: 10000, zombies: [{ type: 'conehead', row: 0 }, { type: 'conehead', row: 4 }] },
      { delay: 10000, zombies: [
        { type: 'basic', row: 0 }, { type: 'jackbox', row: 2 }, { type: 'basic', row: 4 },
        { type: 'snorkel', row: 1 }, { type: 'snorkel', row: 3 }
      ]},
      { delay: 8000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'conehead', row: 1 }, { type: 'conehead', row: 2 },
        { type: 'basic', row: 3 }, { type: 'conehead', row: 4 }
      ]},
      { delay: 8000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'buckethead', row: 1 }, { type: 'conehead', row: 2 },
        { type: 'balloon', row: 3 }, { type: 'conehead', row: 4 }, { type: 'flag', row: 2 }
      ]}
    ]
  },
  // Level 4-4: 引入裂荚射手
  {
    id: '4-4',
    name: '4-4',
    description: '裂荚射手可以前后双射！',
    world: 3,
    hasFog: true,
    plants: ['seashroom', 'plantern', 'puffshroom', 'sunshroom', 'fumeshroom', 'cactus', 'blover', 'splitpea', 'peashooter', 'snowpea', 'wallnut', 'lilypad'],
    waves: [
      { delay: 8000, zombies: [{ type: 'basic', row: 2 }] },
      { delay: 10000, zombies: [{ type: 'jackbox', row: 2 }] },
      { delay: 10000, zombies: [{ type: 'conehead', row: 1 }, { type: 'conehead', row: 3 }] },
      { delay: 10000, zombies: [
        { type: 'basic', row: 0 }, { type: 'balloon', row: 1 }, { type: 'basic', row: 2 },
        { type: 'basic', row: 3 }, { type: 'balloon', row: 4 }
      ]},
      { delay: 8000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'conehead', row: 1 }, { type: 'conehead', row: 2 },
        { type: 'basic', row: 3 }, { type: 'conehead', row: 4 }
      ]},
      { delay: 8000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'buckethead', row: 1 }, { type: 'jackbox', row: 2 },
        { type: 'basic', row: 3 }, { type: 'conehead', row: 4 }, { type: 'flag', row: 2 }
      ]}
    ]
  },
  // Level 4-5: 花瓶破击者关
  {
    id: '4-5',
    name: '4-5',
    description: '迷雾中的花瓶破击者！',
    world: 3,
    isConveyor: true,
    conveyorPlants: ['seashroom', 'plantern', 'blover', 'cactus', 'splitpea', 'fumeshroom', 'iceshroom'],
    hasFog: true,
    waves: [
      { delay: 6000, zombies: [{ type: 'basic', row: 2 }] },
      { delay: 8000, zombies: [{ type: 'conehead', row: 1 }, { type: 'basic', row: 3 }] },
      { delay: 6000, zombies: [{ type: 'polevault', row: 0 }, { type: 'polevault', row: 4 }] },
      { delay: 6000, zombies: [{ type: 'jackbox', row: 2 }] },
      { delay: 5000, zombies: [{ type: 'balloon', row: 1 }, { type: 'balloon', row: 3 }] },
      { delay: 4000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'buckethead', row: 1 }, { type: 'conehead', row: 2 },
        { type: 'buckethead', row: 3 }, { type: 'conehead', row: 4 }, { type: 'flag', row: 2 }
      ]}
    ]
  },
  // Level 4-6: 引入杨桃
  {
    id: '4-6',
    name: '4-6',
    description: '杨桃可以攻击五个方向！',
    world: 3,
    hasFog: true,
    plants: ['seashroom', 'plantern', 'puffshroom', 'sunshroom', 'fumeshroom', 'cactus', 'blover', 'splitpea', 'starfruit', 'peashooter', 'snowpea', 'wallnut', 'lilypad'],
    waves: [
      { delay: 8000, zombies: [{ type: 'basic', row: 2 }] },
      { delay: 10000, zombies: [{ type: 'balloon', row: 1 }, { type: 'balloon', row: 3 }] },
      { delay: 10000, zombies: [{ type: 'conehead', row: 0 }, { type: 'conehead', row: 4 }] },
      { delay: 10000, zombies: [
        { type: 'basic', row: 0 }, { type: 'jackbox', row: 1 }, { type: 'basic', row: 2 },
        { type: 'jackbox', row: 3 }, { type: 'basic', row: 4 }
      ]},
      { delay: 8000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'conehead', row: 1 }, { type: 'conehead', row: 2 },
        { type: 'basic', row: 3 }, { type: 'conehead', row: 4 }
      ]},
      { delay: 8000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'buckethead', row: 1 }, { type: 'conehead', row: 2 },
        { type: 'balloon', row: 3 }, { type: 'conehead', row: 4 }, { type: 'flag', row: 2 }
      ]}
    ]
  },
  // Level 4-7: 引入南瓜壳
  {
    id: '4-7',
    name: '4-7',
    description: '南瓜壳可以保护植物！',
    world: 3,
    hasFog: true,
    plants: ['seashroom', 'plantern', 'puffshroom', 'sunshroom', 'fumeshroom', 'cactus', 'blover', 'splitpea', 'starfruit', 'pumpkin', 'peashooter', 'snowpea', 'wallnut', 'lilypad'],
    waves: [
      { delay: 8000, zombies: [{ type: 'basic', row: 2 }] },
      { delay: 10000, zombies: [{ type: 'jackbox', row: 2 }] },
      { delay: 10000, zombies: [{ type: 'conehead', row: 1 }, { type: 'conehead', row: 3 }] },
      { delay: 10000, zombies: [
        { type: 'basic', row: 0 }, { type: 'balloon', row: 1 }, { type: 'basic', row: 2 },
        { type: 'balloon', row: 3 }, { type: 'basic', row: 4 }
      ]},
      { delay: 8000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'conehead', row: 1 }, { type: 'jackbox', row: 2 },
        { type: 'basic', row: 3 }, { type: 'conehead', row: 4 }
      ]},
      { delay: 8000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'buckethead', row: 1 }, { type: 'conehead', row: 2 },
        { type: 'basic', row: 3 }, { type: 'conehead', row: 4 }, { type: 'flag', row: 2 }
      ]}
    ]
  },
  // Level 4-8: 引入磁力菇
  {
    id: '4-8',
    name: '4-8',
    description: '磁力菇可以偷走金属物品！',
    world: 3,
    hasFog: true,
    plants: ['seashroom', 'plantern', 'puffshroom', 'sunshroom', 'fumeshroom', 'cactus', 'blover', 'splitpea', 'starfruit', 'pumpkin', 'magnetshroom', 'peashooter', 'snowpea', 'wallnut', 'lilypad'],
    waves: [
      { delay: 8000, zombies: [{ type: 'basic', row: 2 }] },
      { delay: 10000, zombies: [{ type: 'football', row: 2 }] },
      { delay: 10000, zombies: [{ type: 'conehead', row: 1 }, { type: 'conehead', row: 3 }] },
      { delay: 10000, zombies: [
        { type: 'basic', row: 0 }, { type: 'balloon', row: 1 }, { type: 'jackbox', row: 2 },
        { type: 'balloon', row: 3 }, { type: 'basic', row: 4 }
      ]},
      { delay: 8000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'conehead', row: 1 }, { type: 'conehead', row: 2 },
        { type: 'basic', row: 3 }, { type: 'conehead', row: 4 }
      ]},
      { delay: 8000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'buckethead', row: 1 }, { type: 'football', row: 2 },
        { type: 'basic', row: 3 }, { type: 'conehead', row: 4 }
      ]},
      { delay: 6000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'buckethead', row: 1 }, { type: 'conehead', row: 2 },
        { type: 'buckethead', row: 3 }, { type: 'conehead', row: 4 },
        { type: 'flag', row: 2 }, { type: 'balloon', row: 1 }, { type: 'balloon', row: 3 }
      ]}
    ]
  },
  // Level 4-9: 迷雾激战
  {
    id: '4-9',
    name: '4-9',
    description: '迷雾激战！最终考验！',
    world: 3,
    hasFog: true,
    plants: ['seashroom', 'plantern', 'puffshroom', 'sunshroom', 'fumeshroom', 'cactus', 'blover', 'splitpea', 'starfruit', 'pumpkin', 'magnetshroom', 'peashooter', 'snowpea', 'wallnut', 'lilypad', 'cherrybomb'],
    waves: [
      { delay: 8000, zombies: [{ type: 'conehead', row: 2 }] },
      { delay: 10000, zombies: [{ type: 'jackbox', row: 1 }, { type: 'jackbox', row: 3 }] },
      { delay: 10000, zombies: [{ type: 'conehead', row: 0 }, { type: 'conehead', row: 4 }] },
      { delay: 10000, zombies: [
        { type: 'basic', row: 0 }, { type: 'balloon', row: 1 }, { type: 'conehead', row: 2 },
        { type: 'balloon', row: 3 }, { type: 'basic', row: 4 }
      ]},
      { delay: 8000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'conehead', row: 1 }, { type: 'conehead', row: 2 },
        { type: 'basic', row: 3 }, { type: 'conehead', row: 4 }
      ]},
      { delay: 8000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'buckethead', row: 1 }, { type: 'football', row: 2 },
        { type: 'buckethead', row: 3 }, { type: 'conehead', row: 4 }
      ]},
      { delay: 6000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'buckethead', row: 1 }, { type: 'conehead', row: 2 },
        { type: 'buckethead', row: 3 }, { type: 'conehead', row: 4 }
      ]},
      { delay: 6000, zombies: [
        { type: 'buckethead', row: 0 }, { type: 'football', row: 1 }, { type: 'conehead', row: 2 },
        { type: 'football', row: 3 }, { type: 'buckethead', row: 4 },
        { type: 'flag', row: 2 }, { type: 'balloon', row: 0 }, { type: 'balloon', row: 4 }
      ]}
    ]
  },
  // Level 4-10: 传送带关卡 - 迷雾最终
  {
    id: '4-10',
    name: '4-10',
    description: '迷雾最终关卡！传送带挑战！',
    world: 3,
    hasFog: true,
    isConveyor: true,
    conveyorPlants: ['seashroom', 'plantern', 'blover', 'cactus', 'splitpea', 'starfruit', 'pumpkin', 'magnetshroom'],
    waves: [
      { delay: 6000, zombies: [{ type: 'basic', row: 2 }] },
      { delay: 8000, zombies: [{ type: 'balloon', row: 2 }] },
      { delay: 8000, zombies: [{ type: 'conehead', row: 1 }, { type: 'conehead', row: 3 }] },
      { delay: 6000, zombies: [{ type: 'jackbox', row: 0 }, { type: 'jackbox', row: 4 }] },
      { delay: 6000, zombies: [{ type: 'football', row: 2 }] },
      { delay: 5000, zombies: [{ type: 'balloon', row: 1 }, { type: 'balloon', row: 3 }] },
      { delay: 5000, zombies: [{ type: 'buckethead', row: 0 }, { type: 'buckethead', row: 4 }] },
      { delay: 4000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'football', row: 1 }, { type: 'buckethead', row: 2 },
        { type: 'football', row: 3 }, { type: 'conehead', row: 4 },
        { type: 'flag', row: 2 }, { type: 'balloon', row: 0 }, { type: 'balloon', row: 4 }
      ]}
    ]
  },

  // =====================================================
  // WORLD 4 - ROOF (levels 40-49, IDs 5-1 to 5-10)
  // =====================================================

  // Level 5-1: 引入花盆和卷心菜投手
  {
    id: '5-1',
    name: '5-1',
    description: '屋顶关卡需要花盆才能种植物！',
    world: 4,
    plants: ['flowerpot', 'cabbagepult', 'peashooter', 'snowpea', 'wallnut', 'potatomine'],
    waves: [
      { delay: 8000, zombies: [{ type: 'basic', row: 2 }] },
      { delay: 10000, zombies: [{ type: 'conehead', row: 1 }, { type: 'basic', row: 3 }] },
      { delay: 10000, zombies: [{ type: 'polevault', row: 0 }, { type: 'polevault', row: 4 }] },
      { delay: 10000, zombies: [
        { type: 'basic', row: 0 }, { type: 'conehead', row: 1 }, { type: 'basic', row: 2 },
        { type: 'basic', row: 3 }, { type: 'conehead', row: 4 }, { type: 'flag', row: 2 }
      ]}
    ]
  },
  // Level 5-2: 引入玉米投手和蹦极僵尸
  {
    id: '5-2',
    name: '5-2',
    description: '小心蹦极僵尸偷走你的植物！',
    world: 4,
    plants: ['flowerpot', 'cabbagepult', 'kernelpult', 'peashooter', 'snowpea', 'wallnut', 'potatomine'],
    waves: [
      { delay: 8000, zombies: [{ type: 'basic', row: 2 }] },
      { delay: 10000, zombies: [{ type: 'bungee', row: 2 }] },
      { delay: 10000, zombies: [{ type: 'conehead', row: 1 }, { type: 'conehead', row: 3 }] },
      { delay: 10000, zombies: [
        { type: 'basic', row: 0 }, { type: 'conehead', row: 2 }, { type: 'basic', row: 4 },
        { type: 'polevault', row: 1 }, { type: 'polevault', row: 3 }
      ]},
      { delay: 8000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'conehead', row: 1 }, { type: 'conehead', row: 2 },
        { type: 'basic', row: 3 }, { type: 'conehead', row: 4 }, { type: 'flag', row: 2 }
      ]}
    ]
  },
  // Level 5-3: 引入咖啡豆和扶梯僵尸
  {
    id: '5-3',
    name: '5-3',
    description: '咖啡豆可以唤醒沉睡的蘑菇！',
    world: 4,
    plants: ['flowerpot', 'cabbagepult', 'kernelpult', 'coffeebean', 'peashooter', 'snowpea', 'wallnut', 'potatomine', 'iceshroom', 'doomshroom'],
    waves: [
      { delay: 8000, zombies: [{ type: 'basic', row: 2 }] },
      { delay: 10000, zombies: [{ type: 'ladder', row: 2 }] },
      { delay: 10000, zombies: [{ type: 'conehead', row: 1 }, { type: 'conehead', row: 3 }] },
      { delay: 10000, zombies: [
        { type: 'basic', row: 0 }, { type: 'conehead', row: 2 }, { type: 'basic', row: 4 },
        { type: 'bungee', row: 1 }, { type: 'bungee', row: 3 }
      ]},
      { delay: 8000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'ladder', row: 1 }, { type: 'conehead', row: 2 },
        { type: 'basic', row: 3 }, { type: 'conehead', row: 4 }, { type: 'flag', row: 2 }
      ]}
    ]
  },
  // Level 5-4: 引入大蒜
  {
    id: '5-4',
    name: '5-4',
    description: '大蒜可以改变僵尸的行进路线！',
    world: 4,
    plants: ['flowerpot', 'cabbagepult', 'kernelpult', 'coffeebean', 'garlic', 'peashooter', 'snowpea', 'wallnut', 'potatomine'],
    waves: [
      { delay: 8000, zombies: [{ type: 'basic', row: 2 }] },
      { delay: 10000, zombies: [{ type: 'ladder', row: 1 }, { type: 'ladder', row: 3 }] },
      { delay: 10000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'conehead', row: 2 }, { type: 'conehead', row: 4 }
      ]},
      { delay: 10000, zombies: [
        { type: 'basic', row: 0 }, { type: 'bungee', row: 1 }, { type: 'basic', row: 2 },
        { type: 'bungee', row: 3 }, { type: 'basic', row: 4 }
      ]},
      { delay: 8000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'polevault', row: 1 }, { type: 'conehead', row: 2 },
        { type: 'polevault', row: 3 }, { type: 'conehead', row: 4 }
      ]},
      { delay: 8000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'buckethead', row: 1 }, { type: 'conehead', row: 2 },
        { type: 'ladder', row: 3 }, { type: 'conehead', row: 4 }, { type: 'flag', row: 2 }
      ]}
    ]
  },
  // Level 5-5: 蹦极小关 (传送带)
  {
    id: '5-5',
    name: '5-5',
    description: '蹦极僵尸小关！保护你的植物！',
    world: 4,
    isConveyor: true,
    conveyorPlants: ['cabbagepult', 'kernelpult', 'garlic', 'flowerpot', 'peashooter', 'wallnut', 'cherrybomb'],
    waves: [
      { delay: 6000, zombies: [{ type: 'basic', row: 2 }] },
      { delay: 8000, zombies: [{ type: 'bungee', row: 2 }] },
      { delay: 6000, zombies: [{ type: 'bungee', row: 1 }, { type: 'bungee', row: 3 }] },
      { delay: 6000, zombies: [{ type: 'conehead', row: 0 }, { type: 'conehead', row: 4 }] },
      { delay: 5000, zombies: [{ type: 'bungee', row: 0 }, { type: 'bungee', row: 2 }, { type: 'bungee', row: 4 }] },
      { delay: 4000, zombies: [
        { type: 'flag', row: 2 }, { type: 'bungee', row: 1 }, { type: 'bungee', row: 3 }
      ]}
    ]
  },
  // Level 5-6: 引入叶伞和投石车僵尸
  {
    id: '5-6',
    name: '5-6',
    description: '叶伞可以保护植物不被偷走！',
    world: 4,
    plants: ['flowerpot', 'cabbagepult', 'kernelpult', 'coffeebean', 'garlic', 'umbrellaleaf', 'peashooter', 'snowpea', 'wallnut', 'potatomine'],
    waves: [
      { delay: 8000, zombies: [{ type: 'basic', row: 2 }] },
      { delay: 10000, zombies: [{ type: 'catapult', row: 2 }] },
      { delay: 10000, zombies: [{ type: 'conehead', row: 1 }, { type: 'conehead', row: 3 }] },
      { delay: 10000, zombies: [
        { type: 'basic', row: 0 }, { type: 'bungee', row: 1 }, { type: 'conehead', row: 2 },
        { type: 'bungee', row: 3 }, { type: 'basic', row: 4 }
      ]},
      { delay: 8000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'ladder', row: 1 }, { type: 'conehead', row: 2 },
        { type: 'basic', row: 3 }, { type: 'conehead', row: 4 }
      ]},
      { delay: 8000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'buckethead', row: 1 }, { type: 'catapult', row: 2 },
        { type: 'ladder', row: 3 }, { type: 'conehead', row: 4 }, { type: 'flag', row: 2 }
      ]}
    ]
  },
  // Level 5-7: 引入金盏花
  {
    id: '5-7',
    name: '5-7',
    description: '金盏花可以产出金币！',
    world: 4,
    plants: ['flowerpot', 'cabbagepult', 'kernelpult', 'coffeebean', 'garlic', 'umbrellaleaf', 'marigold', 'peashooter', 'snowpea', 'wallnut', 'potatomine'],
    waves: [
      { delay: 8000, zombies: [{ type: 'basic', row: 2 }] },
      { delay: 10000, zombies: [{ type: 'bungee', row: 1 }, { type: 'bungee', row: 3 }] },
      { delay: 10000, zombies: [{ type: 'conehead', row: 0 }, { type: 'conehead', row: 4 }] },
      { delay: 10000, zombies: [
        { type: 'basic', row: 0 }, { type: 'ladder', row: 2 }, { type: 'basic', row: 4 }
      ]},
      { delay: 8000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'conehead', row: 1 }, { type: 'catapult', row: 2 },
        { type: 'basic', row: 3 }, { type: 'conehead', row: 4 }
      ]},
      { delay: 8000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'buckethead', row: 1 }, { type: 'conehead', row: 2 },
        { type: 'buckethead', row: 3 }, { type: 'conehead', row: 4 }, { type: 'flag', row: 2 }
      ]}
    ]
  },
  // Level 5-8: 引入冰瓜投手和巨人僵尸
  {
    id: '5-8',
    name: '5-8',
    description: '冰瓜投手可以造成范围伤害！',
    world: 4,
    plants: ['flowerpot', 'cabbagepult', 'kernelpult', 'coffeebean', 'garlic', 'umbrellaleaf', 'marigold', 'melonpult', 'peashooter', 'snowpea', 'wallnut', 'potatomine'],
    waves: [
      { delay: 8000, zombies: [{ type: 'basic', row: 2 }] },
      { delay: 10000, zombies: [{ type: 'gargantuar', row: 2 }, { type: 'imp', row: 2 }] },
      { delay: 10000, zombies: [{ type: 'conehead', row: 1 }, { type: 'conehead', row: 3 }] },
      { delay: 10000, zombies: [
        { type: 'basic', row: 0 }, { type: 'ladder', row: 1 }, { type: 'conehead', row: 2 },
        { type: 'catapult', row: 3 }, { type: 'basic', row: 4 }
      ]},
      { delay: 8000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'conehead', row: 1 }, { type: 'conehead', row: 2 },
        { type: 'basic', row: 3 }, { type: 'conehead', row: 4 }
      ]},
      { delay: 8000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'buckethead', row: 1 }, { type: 'conehead', row: 2 },
        { type: 'buckethead', row: 3 }, { type: 'conehead', row: 4 }
      ]},
      { delay: 6000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'football', row: 1 }, { type: 'conehead', row: 2 },
        { type: 'football', row: 3 }, { type: 'conehead', row: 4 }
      ]},
      { delay: 6000, zombies: [
        { type: 'buckethead', row: 0 }, { type: 'gargantuar', row: 1 }, { type: 'conehead', row: 2 },
        { type: 'imp', row: 3 }, { type: 'buckethead', row: 4 },
        { type: 'flag', row: 2 }, { type: 'imp', row: 1 }, { type: 'bungee', row: 3 }
      ]}
    ]
  },
  // Level 5-9: 屋顶最终挑战
  {
    id: '5-9',
    name: '5-9',
    description: '屋顶最终挑战！为决战做准备！',
    world: 4,
    plants: ['flowerpot', 'cabbagepult', 'kernelpult', 'coffeebean', 'garlic', 'umbrellaleaf', 'marigold', 'melonpult', 'peashooter', 'snowpea', 'wallnut', 'potatomine', 'cherrybomb'],
    waves: [
      { delay: 8000, zombies: [{ type: 'conehead', row: 2 }] },
      { delay: 10000, zombies: [{ type: 'bungee', row: 1 }, { type: 'bungee', row: 3 }] },
      { delay: 10000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'catapult', row: 2 }, { type: 'conehead', row: 4 }
      ]},
      { delay: 10000, zombies: [
        { type: 'basic', row: 0 }, { type: 'ladder', row: 1 }, { type: 'basic', row: 2 },
        { type: 'ladder', row: 3 }, { type: 'basic', row: 4 }
      ]},
      { delay: 8000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'conehead', row: 1 }, { type: 'conehead', row: 2 },
        { type: 'basic', row: 3 }, { type: 'conehead', row: 4 }
      ]},
      { delay: 8000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'buckethead', row: 1 }, { type: 'conehead', row: 2 },
        { type: 'buckethead', row: 3 }, { type: 'conehead', row: 4 }
      ]},
      { delay: 6000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'football', row: 1 }, { type: 'conehead', row: 2 },
        { type: 'football', row: 3 }, { type: 'conehead', row: 4 }
      ]},
      { delay: 6000, zombies: [
        { type: 'buckethead', row: 0 }, { type: 'gargantuar', row: 1 }, { type: 'conehead', row: 2 },
        { type: 'imp', row: 3 }, { type: 'buckethead', row: 4 }
      ]},
      { delay: 5000, zombies: [
        { type: 'conehead', row: 0 }, { type: 'football', row: 1 }, { type: 'buckethead', row: 2 },
        { type: 'football', row: 3 }, { type: 'conehead', row: 4 },
        { type: 'flag', row: 2 }, { type: 'bungee', row: 0 }, { type: 'bungee', row: 4 }
      ]}
    ]
  },
  // Level 5-10: Dr. Zomboss 最终Boss
  {
    id: '5-10',
    name: '5-10',
    description: '最终决战！打败Dr. Zomboss！',
    world: 4,
    isBoss: true,
    plants: ['flowerpot', 'cabbagepult', 'kernelpult', 'coffeebean', 'garlic', 'umbrellaleaf', 'marigold', 'melonpult', 'peashooter', 'snowpea', 'wallnut', 'potatomine', 'cherrybomb', 'jalapeno'],
    waves: [
      { delay: 10000, zombies: [{ type: 'zomboss', row: 2 }] }
    ]
  }
];
