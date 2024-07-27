import Web3 from 'web3';
import path from 'path';
export const MORGAN_FORMAT = ':remote-addr - :remote-user [:date[iso]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" - :response-time ms';
export const DEFAULT_GAS = '1000000';
export const DEFAULT_GAS_PRICE = Web3.utils.toWei('1', 'gwei').toString();
export const ROOT_PATH = path.resolve(__dirname, '../');
export const UPLOADS_DESTINATION = 'uploads';
export const MEGABYTE = 1024 * 1024;
export const MAX_USER_AVATAR_UPLOAD_FILE_SIZE_MB = 2;
export const IMAGE_DIMENSION = [768, 500, 250];
export const DEFAULT_PAGE_LIMIT = 20;
export const MAX_PAGE_LIMIT = 200;
export const MAX_ROW_PER_PAGE = 200;
export const COOLDOWNS = ['1 minute', '5 minutes', '30 minutes', '1 hour', '2 hours', '4 hours', '8 hours', '1 day', '2 days', '3 days', '4 days', '6 days', '7 days'];
export const BIRTHCOST = [200, 300, 500, 800, 1300, 2100, 3400, 5500, 8900, 14400, 23300, 37700, 37700];
export const MIN_BATTLE_COMPLETE_MISSION_PVE = 6;
export const INITIAL_PVE_TIMES = 5;
export const INITIAL_PVP_TIMES = 5;
export const DEAD_ADDRESS = '0x0000000000000000000000000000000000000000';
export const DRAGON_TYPE = {
    EGG: 'EGG',
    DRAGON: 'DRAGON'
};
export const USER_STATUS = {
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE',
    BANNED: 'BANNED'
};
export const USER_ROLE = {
    USER: 'USER',
    ADMIN: 'ADMIN'
};
export const ITEM_STATUS = {
    PENDING: 'PENDING',
    ACTIVE: 'ACTIVE',
    USED: 'USED',
    BURNED: 'BURNED',
    SELLING: 'SELLING'
};
export const ITEM_LOG_STATUS = {
    PENDING: 'PENDING',
    SUCCESS: 'SUCCESS',
    FAILED: 'FAILED'
};

export const EQUIPMENT_RARITY = {
    A: 'A',
    B: 'B'
};

export const SKILL_RARITY = {
    COMMON: 'Common',
    UNCOMMON: 'Uncommon',
    RARITY: 'Rarity'
};

export const NFT_POSITIONS = {
    ARMOR: 1,
    FINS: 2,
    HEAD: 3,
    TAIL: 4,
    BODY: 5,
    WINGS: 6,
    HORNS: 7,
    MIDDLEHORNS: 8,
};

export const NFT_POSITIONS_REVERSE = {
    1: 'Armor',
    2: 'Fins',
    3: 'Head',
    4: 'Tail',
    5: 'Body',
    6: 'Wings',
    7: 'Horns',
    8: 'MiddleHorns',
};

export const PART_REPLACE_QUERY_ITEMS = {
    body: 'Body',
    fins: 'Fins',
    armor: 'Armor',
    wings: 'Wings',
    tail: 'Tail',
    eyes: 'eyes',
    middlehorns: 'MiddleHorns',
    head: 'Head',
    horns: 'Horns'
};

// export const ITEM_INCREASE_BY_LEVEL = {
//     0: 0,
//     1: 10,
//     2: 20,
//     3: 30,
//     4: 50,
//     5: 80,
//     6: 130,
//     7: 210,
//     8: 340,
//     9: 550,
//     10: 890
// };

export const ITEM_LOG_TYPES = {
    TRANSFER: 'TRANSFER',
    USED: 'USED',
    UNWEAR: 'UNWEAR',
    UPGRADED: 'UPGRADED',
    UPGRADE_FAILED: 'UPGRADE_FAILED',
    BURNED: 'BURNED',
    SELLING: 'SELLING',
    CANCEL_SELL: 'CANCEL_SELL',
    SOLD: 'SOLD'
};
export const ITEM_TYPES = {
    SKILL_CARD: 'SKILL_CARD',
    EXP_CARD: 'EXP_CARD',
    EQUIPMENT: 'EQUIPMENT'
};
export const TEAM_STATUS = {
    ACTIVE: 'ACTIVE',
    DELETED: 'DELETED'
};

export const TICKET_TYPES = {
    PVE_TICKET: 'PVE_TICKET',
    PVP_TICKET: 'PVP_TICKET'
};

export const AMOUNT_INCREASE_TIMES_VIA_TICKET = 5;

export const AUTH_ERRORS = {
    PERMISSION_DENIED: 'PermissionDenied',
    UNAUTHORIZED: 'Unauthorized',
    SESSION_EXPIRED: 'Session expired'
};
export const DEFAULT_LIMIT_QUERY = 12;
export const LEVEL_EFFECT = {
    A: 'A',
    S: 'S',
    SS: 'SS'
};
export const BALANCE_FLUCTUATION_TYPES = {
    WIN_BATTLE: 'WIN_BATTLE',
    CLAIM: 'CLAIM',
    DAILY_CHECKIN: 'DAILY_CHECKIN',
    COMPLETE_MISSION_PVE: 'COMPLETE_MISSION_PVE',
    COMPLETE_DAILY_MISSION: 'COMPLETE_DAILY_MISSION'
};

export const EFFECT_LEVEL_VALUES = {
    A: 5,
    S: 10,
    SS: 15
};

export const EFFECT_LETHAL_LEVEL_VALUES = {
    A: 10,
    S: 20,
    SS: 40
};

export const EFFECT_KEYS = {
    ATTACK_UP: 'AttackUp',
    SPEED_UP: 'SpeedUp',
    MORALE_UP: 'MoraleUp',
    HEALTH_UP: 'HealthUp',
    DEFEND_UP: 'DefendUp',
    MANA_UP: 'ManaUp',
    ATTACK_DOWN: 'AttackDown',
    MORALE_DOWN: 'MoraleDown',
    SPEED_DOWN: 'SpeedDown',
    HEALTH_DOWN: 'HealthDown',
    DEFEND_DOWN: 'DefendDown',
    MANA_DOWN: 'ManaDown',
    CHILD: 'Child',
    FEAR: 'Fear',
    FRAGILE: 'Fragile',
    LETHAL: 'Lethal',
    SLEEP: 'Sleep',
    STENCH: 'Stench',
    STUN: 'Stun'
};

export const BALANCE_FLUCTUATION_STATUS = {
    // reward
    LOCKED: 'LOCKED',
    UNLOCKED: 'UNLOCKED',
    // withdraw
    PENDING_WITHDRAWAL: 'PENDING_WITHDRAWAL',
    SUCCESS_WITHDRAWAL: 'SUCCESS_WITHDRAWAL',
    FAILED_WITHDRAWAL: 'FAILED_WITHDRAWAL'
};
export const SKILLS_RESOURCE_PART = {
    HORNS: 'horn',
    MIDDLEHORNS: 'middleh',
    ARMOR: 'armor',
    HEAD: 'head',
    TAIL: 'tail',
    WINGS: 'wing',
    FINS: 'fin'
};

export const SKILL_RESOURCE_CLASS = {
    EARTH: 'earth',
    FIRE: 'fire',
    WATER: 'water',
    WOOD: 'wood',
    METAL: 'metal',
    YINYANG: 'yin',
    LEGEND: 'le'
};

export const REPLACE_SKILL_SAME_ANIMATE = {
    99: 'horn_le_1',
    100: 'fin_earth_2',
    101: 'wing_earth_1',
    102: 'horn_metal_1',
    103: 'head_metal_2',
    104: 'fin_metal_1',
    105: 'middleh_wood_1',
    106: 'armor_wood_2',
    107: 'tail_wood_1',
    108: 'wing_wood_1',
    109: 'head_fire_1',
    110: 'horn_water_1',
    111: 'head_water_1',
    112: 'head_water_2',
    113: 'middleh_earth_2',
    114: 'head_earth_1',
    115: 'armor_yin_1',
    116: 'head_metal_1',
    117: 'wing_metal_2',
    118: 'find_wood_2',
    119: 'head_yin_2',
    120: 'wing_yin_1',
    121: 'wing_yin_2',
    122: 'fin_earth_1',
    123: 'armor_earth_2',
    124: 'tail_water_1',
    125: 'wing_le_2',
    126: 'fin_le_1'
};

export const MISSION_TYPES = {
    CHECKBOX: 'CHECKBOX',
    PROGRESS: 'PROGRESS'
}

export const NFT_TYPES = {
    DRAGON: 'DRAGON',
    SKILL_CARD: 'SKILL_CARD',
    EXP_CARD: 'EXP_CARD',
    EQUIPMENT: 'EQUIPMENT'
};

export const NFT_TYPE_NAMES = {
    DRAGON: 'dragon',
    SKILL_CARD: 'skill',
    EXP_CARD: 'EXP',
    EQUIPMENT: 'equipment'
};

export const HISTORY_TYPE = {
    BIRTHDAY: 'BIRTHDAY',
    TRANSFER: 'TRANSFER',
    AUCTION: 'AUCTION',
    SUCCESSAUCTION: 'SUCCESSAUCTION',
    CANCELAUCTION: 'CANCELAUCTION',
    SIRING: 'SIRING',
    SUCCESSSIRING: 'SUCCESSSIRING',
    CANCELSIRING: 'CANCELSIRING',
    PREGNANTMATRON: 'PREGNANTMATRON',
    PREGNANTSIRE: 'PREGNANTSIRE',
    TRAINING: 'TRAINING',
};
export const HISTORY_TYPE_NAME = {
    BIRTHDAY: 'Give birth',
    TRANSFER: 'Transfer',
    AUCTION: 'Selling',
    SUCCESSAUCTION: 'Sold',
    CANCELAUCTION: 'Cancel selling',
    SIRING: 'Siring',
    SUCCESSSIRING: 'Sold siring',
    CANCELSIRING: 'Cancel siring',
    PREGNANTMATRON: 'Pregnant',
    PREGNANTSIRE: 'Mating',
    TRAINING: 'Training',
    BOOTS: 'Boots',
};
export const PART_TYPE = {
    HORNS: 'HORNS',
    MIDDLEHORNS: 'MIDDLEHORNS',
    TAIL: 'TAIL',
    EYES: 'EYES',
    WINGS: 'WINGS',
    BACKCALES: 'BACKCALES',
    BODY: 'BODY',
    FOOT: 'FOOT',
    CHEST: 'CHEST'

};


export const BATTLE_TYPES = {
    ARENA: 'ARENA',
    ADVENTURE: 'ADVENTURE'
};

export const ROOM_NAMES = {
    ADVENTURE: 'battle_pve',
    ARENA: 'battle_pvp'
};


export const PARTS = {
    EYES: 'Eyes',
    EARS: 'Ears',
    BACK: 'Back',
    MOUTH: 'Mouth',
    WINGS: 'Wings',
    HORN: 'Horn',
    TAIL: 'Tail'
};

export const DRAGON_CLASS = {
    METAL: 'METAL',
    WOOD: 'WOOD',
    WATER: 'WATER',
    FIRE: 'FIRE',
    EARTH: 'EARTH',
    YINYANG: 'YINYANG',
    LEGEND: 'LEGEND'
};

export const DRAGON_CLASSIC_CLASS = {
    METAL: 'METAL',
    WOOD: 'WOOD',
    WATER: 'WATER',
    FIRE: 'FIRE',
    EARTH: 'EARTH',
};

export const CHANGE_TEAM_LOCK_DURATION_DAYS = 1; // DAYS

export const DRAGON_CLASS_NUMBER = {
    0: 'METAL',
    1: 'WOOD',
    2: 'WATER',
    3: 'FIRE',
    4: 'EARTH',
    5: 'METAL',
    6: 'WOOD',
    7: 'WATER',
    8: 'FIRE',
    9: 'EARTH',
    a: 'YINYANG',
    b: 'YINYANG',
    c: 'YINYANG',
    d: 'YINYANG',
    e: 'YINYANG',
    f: 'LEGEND',
};
export const DRAGON_ORDER_FIELDS = {
    id: 'id',
    generation: 'generation',
    price: 'price',
    potential: 'potential',
    updatedAt: 'updatedAt',
    cooldownIndex: 'cooldownIndex',
    nextActionAt: 'nextActionAt',
    level: 'level',
    dateListed: 'dateListed',
    'totalStats.total': 'totalStats.total',
};
export const ITEMS_ORDER_FIELDS = {
    nftId: 'nftId',
    price: 'price',
    dateListed: 'listingId'
};
export const ORDER_BY = {
    desc: -1,
    asc: 1,
};
export const CRON_TIME = '0 0 * * *';
// Every hour
export const CRON_TIME_CREATE_SESSION = '0 * * * *';
// Every day
export const CRON_TIME_RESET_TIMES_BATTLE_PVE = '0 0 * * *';
// Every minute
export const CRON_TIME_UPDATE_POOL_REWARD_PVE = '* * * * *';
// At every 15th minute
export const CRON_TIME_UNLOCK_REWARD = '*/15 * * * *';
// At 00:00 on day-of-month 1.
export const CRON_TIME_LOG_RANKING_REWARD = '0 0 1 * *';
export const DEFAULT_SESSION_KEY = 'e566y';
export const AUCTION_TYPE = { AUCTION: 'AUCTION', SIRING: 'SIRING' };
export const BCRYPT_SALT_ROUNDS = 12;
export const WORKER_NAME = {
    RESIZE_IMAGE: 'RESIZE_IMAGE',
    HANDLE_EVENT_KAI: 'HANDLE_EVENT_KAI',
    MINT_NFT: 'MINT_NFT'
};
export const HISTORY_MONSTER = {
    XX: 'XX',
    YY: 'YY',
};
export const HISTORY_MONSTER_TYPE = {
    FIGHTBOSS: 'Fight',
    FIGHTLOST: 'Lost',
    FIGHTWIN: 'Win',
    KILLBOSS: 'Kill',
    CLAIM: 'Claim',
};

export const GIFT_TYPES = {
    PVE_SILVER: 'PVE_SILVER',
    PVE_GOLD: 'PVE_GOLD',
    DAILY_QUEST: 'DAILY_QUEST',
    EXP_WHITE: 'EXP_WHITE',
    EXP_BLUE: 'EXP_BLUE',
    EXP_VIOLET: 'EXP_VIOLET'
};

export const EXPORT_TYPES = {
    PVE_RANKING_REWARD: 'PVE_RANKING_REWARD',
    PVP_RANKING_REWARD: 'PVP_RANKING_REWARD',
};

export const GIFT_STATUS = {
    UNOPENED: 'UNOPENED',
    OPENED: 'OPENED'
}

export const DRAGON_LEVELS = [
    {
        level: 1,
        exp: 0
    },
    {
        level: 2,
        exp: 100
    },
    {
        level: 3,
        exp: 200
    },
    {
        level: 4,
        exp: 300
    },
    {
        level: 5,
        exp: 500
    },
    {
        level: 6,
        exp: 800
    },
    {
        level: 7,
        exp: 1300
    },
    {
        level: 8,
        exp: 2100
    },
    {
        level: 9,
        exp: 3400
    },
    {
        level: 10,
        exp: 5500
    },
    {
        level: 11,
        exp: 8900
    },
    {
        level: 12,
        exp: 14400
    },
    {
        level: 13,
        exp: 23300
    },
    {
        level: 14,
        exp: 37700
    },
    {
        level: 15,
        exp: 61000
    },
    {
        level: 16,
        exp: 98700
    },
    {
        level: 17,
        exp: 159700
    },
    {
        level: 18,
        exp: 258400
    },
    {
        level: 19,
        exp: 418100
    },
    {
        level: 20,
        exp: 676500
    },
    {
        level: 21,
        exp: 1094600
    },
    {
        level: 22,
        exp: 1771100
    },
    {
        level: 23,
        exp: 2865700
    },
    {
        level: 24,
        exp: 4636800
    },
    {
        level: 25,
        exp: 7502500
    },
    {
        level: 26,
        exp: 12139300
    },
    {
        level: 27,
        exp: 19641800
    },
    {
        level: 28,
        exp: 31781100
    },
    {
        level: 29,
        exp: 51422900
    },
    {
        level: 30,
        exp: 83204000
    },
    {
        level: 31,
        exp: 134626900
    },
    {
        level: 32,
        exp: 217830900
    },
    {
        level: 33,
        exp: 352457800
    },
    {
        level: 34,
        exp: 570288700
    },
    {
        level: 35,
        exp: 922746500
    },
    {
        level: 36,
        exp: 1493035200
    },
    {
        level: 37,
        exp: 2415781700
    },
    {
        level: 38,
        exp: 3908816900
    },
    {
        level: 39,
        exp: 6324598600
    },
    {
        level: 40,
        exp: 10233415500
    }
];

export const RESIZE_IMAGE_AFTER_FAILED = 120000; // 2 minutes
export const HANDLE_EVENT_KAI_AFTER_FAILED = 30000; // 30 seconds
export const MINT_NFT_AFTER_FAILED = 180000; // 10 minutes
export const COLOR = {
    0: 'Smoky',
    1: 'Mossy',
    2: 'Topaz',
    3: 'Flake',
    4: 'Bronzel',
    5: 'Smoky',
    6: 'Mossy',
    7: 'Topaz',
    8: 'Flake',
    9: 'Bronzel',
    a: 'Smoky',
    b: 'Mossy',
    c: 'Topaz',
    d: 'Flake',
    e: 'Bronzel',
};
export const PARTS_NAME = {
    horns: {
        1: 'Razor',
        2: 'Rifle',
        3: 'Narrow',
        4: 'Crown',
        5: 'Harts',
        6: 'Dorio',
        7: 'Membrane',
        8: 'Lusty',
        9: 'Giaru',
        a: 'Mossy (Mutation)',
        b: 'Obi (Mutation)',
        c: 'Bul (Mutation)',
        d: 'Horos (Mutation)',
        e: 'Caesi (Mutation)',
        f: 'Berg'
    },
    middlehorns: {
        1: 'Blade',
        2: 'Drift',
        3: 'Bove',
        4: 'Cob',
        5: 'Solrock',
        6: 'Nano',
        7: 'Jade',
        8: 'Warp',
        9: 'Marble',
        a: 'Axe (Mutation)',
        b: 'Genis (Mutation)',
        c: 'Bagon (Mutation)',
        d: 'Seminal (Mutation)',
        e: 'Divi (Mutation)',
        f: 'Dego'
    },
    backcales: {
        0: 'Valance',
        1: 'Tassels',
        2: 'Reptilian',
        3: 'Scaly',
        4: 'Shayde',
        5: 'Mane',
        6: 'Zap',
        7: 'Spiky',
        8: 'Spine',
        9: 'Glide',
        a: 'Camou (Mutation)',
        b: 'Firmis (Mutation)',
        c: 'Omb (Mutation)',
        d: 'Firmis (Mutation)',
        e: 'Molga (Mutation)',
        f: 'Tinder'
    },
    tail: {
        0: 'Gut',
        1: 'Steel',
        2: 'Castai',
        3: 'Crust',
        4: 'Stowne',
        5: 'Conne',
        6: 'Star',
        7: 'Thorny',
        8: 'Bilbo',
        9: 'Diggy',
        a: 'Buld (Mutation)',
        b: 'Lambo (Mutation)',
        c: 'Lash (Mutation)',
        d: 'Sizzle (Mutation)',
        e: 'Blitz (Mutation)',
        f: 'Onnon'
    },
    head: {
        0: 'Hatchet',
        1: 'Skull',
        2: 'Captain',
        3: 'Crystal',
        4: 'Umbris',
        5: 'Exo',
        6: 'Rizard',
        7: 'Fierce',
        8: 'Hook',
        9: 'Omega',
        a: 'Browny (Mutation)',
        b: 'Ultra (Mutation)',
        c: 'Alakonic (Mutation)',
        d: 'Balegi (Mutation)',
        e: 'Crustor (Mutation)',
        f: 'Fantom'
    },
    eyes: {
        0: 'Circlet',
        1: 'Pop',
        2: 'Tiny',
        3: 'Villain',
        4: 'Restless',
        5: 'Hypo',
        6: 'Oh',
        7: 'Pura',
        8: 'Sanity',
        9: 'Vivid',
        a: 'Bub (Mutation)',
        b: 'Daft (Mutation)',
        c: 'Lumina (Mutation)',
        d: 'Coco (Mutation)',
        e: 'Buzz (Mutation)',
        f: 'Oga'
    },
    wings: {
        0: 'Tectonic',
        1: 'Slicer',
        2: 'Ethereal',
        3: 'Skyrim',
        4: 'Coarse wings',
        5: 'Volta',
        6: 'Draggy',
        7: 'Victiny',
        8: 'Osany',
        9: 'Ebony',
        a: 'Stonic (Mutation)',
        b: 'Fany (Mutation)',
        c: 'Fumus (Mutation)',
        d: 'Scaldis (Mutation)',
        e: 'Auris (Mutation)',
        f: 'Hella'
    },
    chest: {
        0: 'Armor',
        1: 'Iron',
        2: 'Layer',
        3: 'Leather',
        4: 'Luminance',
        5: 'Nexus',
        6: 'Fleesh',
        7: 'Groove',
        8: 'Metral',
        9: 'Pine',
        a: 'Boldo (Mutation)',
        b: 'Nex (Mutation)',
        c: 'Phaton (Mutation)',
        d: 'Sasana (Mutation)',
        e: 'Thunderous (Mutation)',
        f: 'Achor'
    },
};
export const PARTS_NAME_FILTER = {
    horns: {
        1: 'Razor',
        2: 'Rifle',
        3: 'Narrow',
        4: 'Crown',
        5: 'Harts',
        6: 'Dorio',
        7: 'Membrane',
        8: 'Lusty',
        9: 'Giaru',
        a: 'Mossy',
        b: 'Obi',
        c: 'Bul',
        d: 'Horos',
        e: 'Caesi',
        f: 'Berg'
    },
    middlehorns: {
        1: 'Blade',
        2: 'Drift',
        3: 'Bove',
        4: 'Cob',
        5: 'Solrock',
        6: 'Nano',
        7: 'Jade',
        8: 'Warp',
        9: 'Marble',
        a: 'Axe',
        b: 'Genis',
        c: 'Bagon',
        d: 'Seminal',
        e: 'Divi',
        f: 'Dego'
    },
    backcales: {
        0: 'Valance',
        1: 'Tassels',
        2: 'Reptilian',
        3: 'Scaly',
        4: 'Shayde',
        5: 'Mane',
        6: 'Zap',
        7: 'Spiky',
        8: 'Spine',
        9: 'Glide',
        a: 'Camou',
        b: 'Firmis',
        c: 'Omb',
        d: 'Firmis',
        e: 'Molga',
        f: 'Tinder'
    },
    tail: {
        0: 'Gut',
        1: 'Steel',
        2: 'Castai',
        3: 'Crust',
        4: 'Stowne',
        5: 'Conne',
        6: 'Star',
        7: 'Thorny',
        8: 'Bilbo',
        9: 'Diggy',
        a: 'Buld',
        b: 'Lambo',
        c: 'Lash',
        d: 'Sizzle',
        e: 'Blitz',
        f: 'Onnon'
    },
    head: {
        0: 'Hatchet',
        1: 'Skull',
        2: 'Captain',
        3: 'Crystal',
        4: 'Umbris',
        5: 'Exo',
        6: 'Rizard',
        7: 'Fierce',
        8: 'Hook',
        9: 'Omega',
        a: 'Browny',
        b: 'Ultra',
        c: 'Alakonic',
        d: 'Balegi',
        e: 'Crustor',
        f: 'Fantom'
    },
    eyes: {
        0: 'Circlet',
        1: 'Pop',
        2: 'Tiny',
        3: 'Villain',
        4: 'Restless',
        5: 'Hypo',
        6: 'Oh',
        7: 'Pura',
        8: 'Sanity',
        9: 'Vivid',
        a: 'Bub',
        b: 'Daft',
        c: 'Lumina',
        d: 'Coco',
        e: 'Buzz',
        f: 'Oga'
    },
    wings: {
        0: 'Tectonic',
        1: 'Slicer',
        2: 'Ethereal',
        3: 'Skyrim',
        4: 'Coarse wings',
        5: 'Volta',
        6: 'Draggy',
        7: 'Victiny',
        8: 'Osany',
        9: 'Ebony',
        a: 'Stonic',
        b: 'Fany',
        c: 'Fumus',
        d: 'Scaldis',
        e: 'Auris',
        f: 'Hella'
    },
    chest: {
        0: 'Armor',
        1: 'Iron',
        2: 'Layer',
        3: 'Leather',
        4: 'Luminance',
        5: 'Nexus',
        6: 'Fleesh',
        7: 'Groove',
        8: 'Metral',
        9: 'Pine',
        a: 'Boldo',
        b: 'Nex',
        c: 'Phaton',
        d: 'Sasana',
        e: 'Thunderous',
        f: 'Achor'
    },
};


export const metalConfig = require('../resource/images/dragon-part-spine/METAL/config').IMAGE_CONFIG_METAL
export const woodConfig = require('../resource/images/dragon-part-spine/WOOD/config').IMAGE_CONFIG_WOOD
export const waterConfig = require('../resource/images/dragon-part-spine/WATER/config').IMAGE_CONFIG_WATER
export const fireConfig = require('../resource/images/dragon-part-spine/FIRE/config').IMAGE_CONFIG_FIRE
export const earthConfig = require('../resource/images/dragon-part-spine/EARTH/config').IMAGE_CONFIG_EARTH
export const aConfig = require('../resource/images/dragon-part-spine/a/config').IMAGE_CONFIG_A
export const bConfig = require('../resource/images/dragon-part-spine/b/config').IMAGE_CONFIG_B
export const cConfig = require('../resource/images/dragon-part-spine/c/config').IMAGE_CONFIG_C
export const dConfig = require('../resource/images/dragon-part-spine/d/config').IMAGE_CONFIG_D
export const eConfig = require('../resource/images/dragon-part-spine/e/config').IMAGE_CONFIG_E

const skeleton_1 = require('../resource/images/json-spine/1/1.json');
const skeleton_2 = require('../resource/images/json-spine/2/2.json');
const skeleton_3 = require('../resource/images/json-spine/3/3.json');
const skeleton_4 = require('../resource/images/json-spine/4/4.json');
const skeleton_5 = require('../resource/images/json-spine/5/5.json');
const skeleton_6 = require('../resource/images/json-spine/6/6.json');
const skeleton_7 = require('../resource/images/json-spine/7/7.json');
const skeleton_8 = require('../resource/images/json-spine/8/8.json');
const skeleton_9 = require('../resource/images/json-spine/9/9.json');
const skeleton_10 = require('../resource/images/json-spine/10/10.json');
const skeleton_11 = require('../resource/images/json-spine/11/11.json');
const skeleton_12 = require('../resource/images/json-spine/12/12.json');
const skeleton_13 = require('../resource/images/json-spine/13/13.json');
const skeleton_14 = require('../resource/images/json-spine/14/14.json');
const skeleton_15 = require('../resource/images/json-spine/15/15.json');

export const DragonSkeletons = [
    skeleton_1,
    skeleton_2,
    skeleton_3,
    skeleton_4,
    skeleton_5,
    skeleton_6,
    skeleton_7,
    skeleton_8,
    skeleton_9,
    skeleton_10,
    skeleton_11,
    skeleton_12,
    skeleton_13,
    skeleton_14,
    skeleton_15
];

export const PART_IDS = {
    BACK_SCALE: 'BACK_SCALE',
    BODY: 'BODY',
    CHEST: 'CHEST',
    EYES: 'EYES',
    HEAD: 'HEAD',
    RIGHT_HORN: 'RIGHT_HORN',
    LEFT_HORN: 'LEFT_HORN',
    MIDDLE_HORN: 'MIDDLE_HORN',
    TAIL: 'TAIL',
    WING_LEFT: 'WING_LEFT',
    WING_RIGHT: 'WING_RIGHT',
    FRONT_LEFT_FOOT: 'FRONT_LEFT_FOOT',
    BEHIND_LEFT_FOOT: 'BEHIND_LEFT_FOOT',
    BEHIND_RIGHT_FOOT: 'BEHIND_RIGHT_FOOT',
    FRONT_RIGHT_FOOT: 'FRONT_RIGHT_FOOT',
};
export const BODY_PART_DIR = {
    BACK_SCALE: 'backscales',
    BODY: 'body',
    CHEST: 'chest',
    EYES: 'eyes',
    HEAD: 'head',
    HEAD2: 'head',
    TONGUE: 'head',
    RIGHT_HORN: 'horns',
    LEFT_HORN: 'horns',
    MIDDLE_HORN: 'middlehorns',
    TAIL: 'tail',
    WING_LEFT: 'wings',
    WING_RIGHT: 'wings',
    FRONT_LEFT_FOOT: 'body',
    BEHIND_LEFT_FOOT: 'body',
    BEHIND_RIGHT_FOOT: 'body',
    FRONT_RIGHT_FOOT: 'body',
    FRONT_RIGHT_FOOT2: 'body',
};

export const DRAGON_RES_DIR = {
    METAL: `${ROOT_PATH}/resource/images/dragon-part-spine/METAL/`,
    WOOD: `${ROOT_PATH}/resource/images/dragon-part-spine/WOOD/`,
    WATER: `${ROOT_PATH}/resource/images/dragon-part-spine/WATER/`,
    FIRE: `${ROOT_PATH}/resource/images/dragon-part-spine/FIRE/`,
    EARTH: `${ROOT_PATH}/resource/images/dragon-part-spine/EARTH/`,
    a: `${ROOT_PATH}/resource/images/dragon-part-spine/a/`,
    b: `${ROOT_PATH}/resource/images/dragon-part-spine/b/`,
    c: `${ROOT_PATH}/resource/images/dragon-part-spine/c/`,
    d: `${ROOT_PATH}/resource/images/dragon-part-spine/d/`,
    e: `${ROOT_PATH}/resource/images/dragon-part-spine/e/`
};

export const INCREASE_ITEM_BY_LEVEL = {
    COMMON: {
        0: 0,
        1: 1,
        2: 2,
        3: 3,
        4: 4,
        5: 5,
        6: 6,
        7: 7,
        8: 8,
        9: 9
    },
    UNCOMMON: {
        0: 0,
        1: 2,
        2: 4,
        3: 6,
        4: 8,
        5: 10,
        6: 12,
        7: 14,
        8: 16,
        9: 18
    },
    RARITY: {
        0: 0,
        1: 4,
        2: 8,
        3: 12,
        4: 16,
        5: 20,
        6: 24,
        7: 28,
        8: 32,
        9: 36
    }
};

export const INCREASE_SKILL_BY_LEVEL = {
    COMMON: {
        0: 0,
        1: 5,
        2: 10,
        3: 15,
        4: 20,
        5: 25,
        6: 30,
        7: 35,
        8: 40,
        9: 45
    },
    UNCOMMON: {
        0: 0,
        1: 10,
        2: 20,
        3: 30,
        4: 40,
        5: 50,
        6: 60,
        7: 70,
        8: 80,
        9: 90
    },
    RARITY: {
        0: 0,
        1: 15,
        2: 30,
        3: 45,
        4: 60,
        5: 75,
        6: 90,
        7: 105,
        8: 120,
        9: 135
    }
}

export const REPLACE_RARITY = {
    A: 'COMMON',
    B: 'UNCOMMON'
};
