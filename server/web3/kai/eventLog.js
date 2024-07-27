import { web3 } from './index';

export const TransferLogStructure = [
  {
    indexed: false,
    name: 'from',
    type: 'address'
  },
  {
    indexed: false,
    name: 'to',
    type: 'address'
  },
  {
    indexed: false,
    name: 'tokenId',
    type: 'uint256'
  }
];

export const TransferSignature = web3.eth.abi.encodeEventSignature({
  anonymous: false,
  inputs: [
    {
      indexed: false,
      name: 'from',
      type: 'address'
    },
    {
      indexed: false,
      name: 'to',
      type: 'address'
    },
    {
      indexed: false,
      name: 'tokenId',
      type: 'uint256'
    }
  ],
  name: 'Transfer',
  type: 'event'
});

export const BirthLogStructure = [
  {
    indexed: false,
    name: 'owner',
    type: 'address'
  },
  {
    indexed: false,
    name: 'dragonId',
    type: 'uint256'
  },
  {
    indexed: false,
    name: 'matronId',
    type: 'uint256'
  },
  {
    indexed: false,
    name: 'sireId',
    type: 'uint256'
  },
  {
    indexed: false,
    name: 'genes',
    type: 'uint256'
  }
];
export const BirthSignature = web3.eth.abi.encodeEventSignature({
  anonymous: false,
  inputs: [
    {
      indexed: false,
      name: 'owner',
      type: 'address'
    },
    {
      indexed: false,
      name: 'dragonId',
      type: 'uint256'
    },
    {
      indexed: false,
      name: 'matronId',
      type: 'uint256'
    },
    {
      indexed: false,
      name: 'sireId',
      type: 'uint256'
    },
    {
      indexed: false,
      name: 'genes',
      type: 'uint256'
    }
  ],
  name: 'Birth',
  type: 'event'
});


export const PregnantLogStructure = [
  {
    indexed: false,
    name: 'owner',
    type: 'address'
  },
  {
    indexed: false,
    name: 'matronId',
    type: 'uint256'
  },
  {
    indexed: false,
    name: 'sireId',
    type: 'uint256'
  },
  {
    indexed: false,
    name: 'cooldownEndBlock',
    type: 'uint256'
  }
];

export const TrainingLogStructure = [
  {
    indexed: false,
    name: 'dragonID',
    type: 'uint256'
  },
  {
    indexed: false,
    name: 'xp',
    type: 'uint256'
  },
  {
    indexed: false,
    name: 'level',
    type: 'uint256'
  },
  {
    indexed: false,
    name: 'price',
    type: 'uint256'
  },
  {
    indexed: false,
    name: 'startLock',
    type: 'uint256'
  }
];


export const ExpBoostedExtendStructure = [
  {
    indexed: false,
    internalType: 'address',
    name: 'owner',
    type: 'address'
  },
  {
    indexed: false,
    internalType: 'uint256',
    name: 'dragonId',
    type: 'uint256'
  },
  {
    indexed: false,
    internalType: 'uint256',
    name: 'currentExp',
    type: 'uint256'
  },
  {
    indexed: false,
    internalType: 'uint256',
    name: 'price',
    type: 'uint256'
  }
];

export const PregnantSignature = web3.eth.abi.encodeEventSignature({
  anonymous: false,
  inputs: [
    {
      indexed: false,
      name: 'owner',
      type: 'address'
    },
    {
      indexed: false,
      name: 'matronId',
      type: 'uint256'
    },
    {
      indexed: false,
      name: 'sireId',
      type: 'uint256'
    },
    {
      indexed: false,
      name: 'cooldownEndBlock',
      type: 'uint256'
    }
  ],
  name: 'Pregnant',
  type: 'event'
});
export const TrainingSignature = web3.eth.abi.encodeEventSignature({
  anonymous: false,
  inputs: [
    {
      indexed: false,
      name: 'dragonID',
      type: 'uint256'
    },
    {
      indexed: false,
      name: 'xp',
      type: 'uint256'
    },
    {
      indexed: false,
      name: 'level',
      type: 'uint256'
    },
    {
      indexed: false,
      name: 'price',
      type: 'uint256'
    },
    {
      indexed: false,
      name: 'startLock',
      type: 'uint256'
    }
  ],
  name: 'UpdateDragon',
  type: 'event'
});

export const ExpBoostedExtendSignature = web3.eth.abi.encodeEventSignature({
  anonymous: false,
  inputs: [
    {
      indexed: false,
      internalType: 'address',
      name: 'owner',
      type: 'address'
    },
    {
      indexed: false,
      internalType: 'uint256',
      name: 'dragonId',
      type: 'uint256'
    },
    {
      indexed: false,
      internalType: 'uint256',
      name: 'currentExp',
      type: 'uint256'
    },
    {
      indexed: false,
      internalType: 'uint256',
      name: 'price',
      type: 'uint256'
    }
  ],
  name: 'ExpBoosted',
  type: 'event'
});

export const AuctionSuccessfulStructure = [
  {
    indexed: false,
    name: 'tokenId',
    type: 'uint256'
  },
  {
    indexed: false,
    name: 'totalPrice',
    type: 'uint256'
  },
  {
    indexed: false,
    name: 'winner',
    type: 'address'
  }
];
export const AuctionSuccessfulSignature = web3.eth.abi.encodeEventSignature({
  anonymous: false,
  inputs: [
    {
      indexed: false,
      name: 'tokenId',
      type: 'uint256'
    },
    {
      indexed: false,
      name: 'totalPrice',
      type: 'uint256'
    },
    {
      indexed: false,
      name: 'winner',
      type: 'address'
    }
  ],
  name: 'AuctionSuccessful',
  type: 'event'
});


export const AuctionCreatedStructure = [
  {
    indexed: false,
    name: 'tokenId',
    type: 'uint256'
  }
];
export const AuctionCreated = web3.eth.abi.encodeEventSignature({
  anonymous: false,
  inputs: [
    {
      indexed: false,
      name: 'tokenId',
      type: 'uint256'
    }
  ],
  name: 'AuctionCreated',
  type: 'event'
});

export const TicketBought = web3.eth.abi.encodeEventSignature({
  anonymous: false,
  inputs: [
    {
      indexed: false,
      internalType: 'uint256',
      name: 'teamId',
      type: 'uint256'
    },
    {
      indexed: false,
      internalType: 'uint256',
      name: 'price',
      type: 'uint256'
    },
    {
      indexed: false,
      internalType: 'uint256',
      name: 'time',
      type: 'uint256'
    },
    {
      indexed: false,
      internalType: 'uint256',
      name: 'count',
      type: 'uint256'
    }
  ],
  name: 'TicketBought',
  type: 'event'
});


export const UseExperienceToDragon = web3.eth.abi.encodeEventSignature({
  anonymous: false,
  inputs: [
    {
      indexed: false,
      internalType: 'address',
      name: 'owner',
      type: 'address'
    },
    {
      indexed: false,
      internalType: 'uint256',
      name: 'dragonId',
      type: 'uint256'
    },
    {
      indexed: false,
      internalType: 'uint256',
      name: 'itemId',
      type: 'uint256'
    },
    {
      indexed: false,
      internalType: 'uint256',
      name: 'expBoosted',
      type: 'uint256'
    },
    {
      indexed: false,
      internalType: 'uint256',
      name: 'currentExp',
      type: 'uint256'
    }
  ],
  name: 'ExpUsed',
  type: 'event'
});

export const TransferNFTItem = web3.eth.abi.encodeEventSignature({
  anonymous: false,
  inputs: [
    {
      indexed: true,
      internalType: 'address',
      name: 'from',
      type: 'address'
    },
    {
      indexed: true,
      internalType: 'address',
      name: 'to',
      type: 'address'
    },
    {
      indexed: true,
      internalType: 'uint256',
      name: 'tokenId',
      type: 'uint256'
    }
  ],
  name: 'Transfer',
  type: 'event'
});

export const UpgradeNFTItem = web3.eth.abi.encodeEventSignature({
  anonymous: false,
  inputs: [
    {
      indexed: true,
      internalType: 'uint256',
      name: '_id',
      type: 'uint256'
    },
    {
      indexed: false,
      internalType: 'uint256',
      name: 'level',
      type: 'uint256'
    },
    {
      indexed: false,
      internalType: 'address',
      name: 'upgradeAddress',
      type: 'address'
    },
    {
      indexed: false,
      internalType: 'uint256',
      name: 'burned',
      type: 'uint256'
    },
    {
      indexed: false,
      internalType: 'uint256',
      name: 'rand',
      type: 'uint256'
    },
    {
      indexed: false,
      internalType: 'uint256',
      name: 'pos',
      type: 'uint256'
    }
  ],
  name: 'itemUpgraded',
  type: 'event'
});

export const UpgradeNFTItemFailed = web3.eth.abi.encodeEventSignature({
  anonymous: false,
  inputs: [
    {
      indexed: true,
      internalType: 'uint256',
      name: '_id',
      type: 'uint256'
    },
    {
      indexed: false,
      internalType: 'uint256',
      name: 'level',
      type: 'uint256'
    },
    {
      indexed: false,
      internalType: 'address',
      name: 'upgradeAddress',
      type: 'address'
    },
    {
      indexed: false,
      internalType: 'uint256',
      name: 'burned',
      type: 'uint256'
    },
    {
      indexed: false,
      internalType: 'uint256',
      name: 'rand',
      type: 'uint256'
    },
    {
      indexed: false,
      internalType: 'uint256',
      name: 'pos',
      type: 'uint256'
    }
  ],
  name: 'itemFailed',
  type: 'event'
});

export const WearableNFTItem = web3.eth.abi.encodeEventSignature({
  anonymous: false,
  inputs: [
    {
      indexed: false,
      internalType: 'uint256',
      name: 'itemId',
      type: 'uint256'
    },
    {
      indexed: false,
      internalType: 'uint256',
      name: 'dragonId',
      type: 'uint256'
    },
    {
      indexed: false,
      internalType: 'uint256',
      name: 'itemPosition',
      type: 'uint256'
    },
    {
      indexed: false,
      internalType: 'uint256',
      name: 'itemStat',
      type: 'uint256'
    },
    {
      indexed: false,
      internalType: 'uint256',
      name: 'itemLevel',
      type: 'uint256'
    },
    {
      indexed: false,
      internalType: 'uint256',
      name: 'itemsType',
      type: 'uint256'
    }
  ],
  name: 'itemWear',
  type: 'event'
});

export const UnWearNFTItem = web3.eth.abi.encodeEventSignature({
  anonymous: false,
  inputs: [
    {
      indexed: false,
      internalType: 'uint256',
      name: 'itemPosition',
      type: 'uint256'
    },
    {
      indexed: false,
      internalType: 'uint256',
      name: 'dragonId',
      type: 'uint256'
    },
    {
      indexed: false,
      internalType: 'uint256',
      name: 'itemId',
      type: 'uint256'
    }
  ],
  name: 'itemUnwear',
  type: 'event'
});


export const TicketBoughtStructure = [
  {
    indexed: false,
    internalType: 'uint256',
    name: 'teamId',
    type: 'uint256'
  },
  {
    indexed: false,
    internalType: 'uint256',
    name: 'price',
    type: 'uint256'
  },
  {
    indexed: false,
    internalType: 'uint256',
    name: 'time',
    type: 'uint256'
  },
  {
    indexed: false,
    internalType: 'uint256',
    name: 'count',
    type: 'uint256'
  }
];


export const ExperienceMintAndTransferStructure = [
  {
    indexed: true,
    internalType: 'uint256',
    name: '_id',
    type: 'uint256'
  },
  {
    indexed: false,
    internalType: 'address',
    name: 'owner',
    type: 'address'
  },
  {
    indexed: false,
    internalType: 'uint256',
    name: 'exp',
    type: 'uint256'
  }
];

export const EquipmentMintAndTransferStructure = [
  {
    indexed: true,
    internalType: 'uint256',
    name: '_id',
    type: 'uint256'
  },
  {
    indexed: false,
    internalType: 'address',
    name: 'owner',
    type: 'address'
  },
  {
    indexed: false,
    internalType: 'uint256',
    name: 'position',
    type: 'uint256'
  },
  {
    indexed: false,
    internalType: 'uint256',
    name: 'stat',
    type: 'uint256'
  },
  {
    indexed: false,
    internalType: 'uint256',
    name: 'itemType',
    type: 'uint256'
  }
];


export const SkillMintAndTransferStructure = [
  {
    indexed: true,
    internalType: 'uint256',
    name: '_id',
    type: 'uint256'
  },
  {
    indexed: false,
    internalType: 'address',
    name: 'owner',
    type: 'address'
  },
  {
    indexed: false,
    internalType: 'uint256',
    name: 'position',
    type: 'uint256'
  },
  {
    indexed: false,
    internalType: 'uint256',
    name: 'stat',
    type: 'uint256'
  },
  {
    indexed: false,
    internalType: 'uint256',
    name: 'itemType',
    type: 'uint256'
  }
];

export const TransferNFTItemStructure = [
  {
    indexed: true,
    internalType: 'address',
    name: 'from',
    type: 'address'
  },
  {
    indexed: true,
    internalType: 'address',
    name: 'to',
    type: 'address'
  },
  {
    indexed: true,
    internalType: 'uint256',
    name: 'tokenId',
    type: 'uint256'
  }
];

export const UpgradeNFTItemStructure = [
  {
    indexed: true,
    internalType: 'uint256',
    name: '_id',
    type: 'uint256'
  },
  {
    indexed: false,
    internalType: 'uint256',
    name: 'level',
    type: 'uint256'
  },
  {
    indexed: false,
    internalType: 'address',
    name: 'upgradeAddress',
    type: 'address'
  },
  {
    indexed: false,
    internalType: 'uint256',
    name: 'burned',
    type: 'uint256'
  },
  // {
  //   indexed: false,
  //   internalType: 'uint256',
  //   name: 'rand',
  //   type: 'uint256'
  // },
  // {
  //   indexed: false,
  //   internalType: 'uint256',
  //   name: 'pos',
  //   type: 'uint256'
  // }
];

export const UpgradeNFTItemFailedStructure = [
  {
    indexed: true,
    internalType: 'uint256',
    name: '_id',
    type: 'uint256'
  },
  {
    indexed: false,
    internalType: 'uint256',
    name: 'level',
    type: 'uint256'
  },
  {
    indexed: false,
    internalType: 'address',
    name: 'upgradeAddress',
    type: 'address'
  },
  {
    indexed: false,
    internalType: 'uint256',
    name: 'burned',
    type: 'uint256'
  },
  {
    indexed: false,
    internalType: 'uint256',
    name: 'rand',
    type: 'uint256'
  },
  {
    indexed: false,
    internalType: 'uint256',
    name: 'pos',
    type: 'uint256'
  }
]

export const WearableNFTItemStructure = [
  {
    indexed: false,
    internalType: 'uint256',
    name: 'itemId',
    type: 'uint256'
  },
  {
    indexed: false,
    internalType: 'uint256',
    name: 'dragonId',
    type: 'uint256'
  },
  {
    indexed: false,
    internalType: 'uint256',
    name: 'itemPosition',
    type: 'uint256'
  },
  {
    indexed: false,
    internalType: 'uint256',
    name: 'itemStat',
    type: 'uint256'
  },
  {
    indexed: false,
    internalType: 'uint256',
    name: 'itemLevel',
    type: 'uint256'
  },
  {
    indexed: false,
    internalType: 'uint256',
    name: 'itemsType',
    type: 'uint256'
  }
];

export const UnWearNFTItemStructure = [
  {
    indexed: false,
    internalType: 'uint256',
    name: 'itemPosition',
    type: 'uint256'
  },
  {
    indexed: false,
    internalType: 'uint256',
    name: 'dragonId',
    type: 'uint256'
  },
  {
    indexed: false,
    internalType: 'uint256',
    name: 'itemId',
    type: 'uint256'
  }
];

export const UseExperienceToDragonStructure = [
  {
    indexed: false,
    internalType: 'address',
    name: 'owner',
    type: 'address'
  },
  {
    indexed: false,
    internalType: 'uint256',
    name: 'dragonId',
    type: 'uint256'
  },
  {
    indexed: false,
    internalType: 'uint256',
    name: 'itemId',
    type: 'uint256'
  },
  {
    indexed: false,
    internalType: 'uint256',
    name: 'expBoosted',
    type: 'uint256'
  },
  {
    indexed: false,
    internalType: 'uint256',
    name: 'currentExp',
    type: 'uint256'
  }
];

export const AuctionCancelled = web3.eth.abi.encodeEventSignature({
  anonymous: false,
  inputs: [
    {
      indexed: false,
      name: 'tokenId',
      type: 'uint256'
    }
  ],
  name: 'AuctionCancelled',
  type: 'event'
});

export const AuctionCancelledStructure = [
  {
    indexed: false,
    name: 'tokenId',
    type: 'uint256'
  }
];

//Contract event monster
export const FightLostLogStructure = [
  {
    indexed: false,
    name: 'monsterId',
    type: 'uint256'
  },
  {
    indexed: false,
    name: 'dragonId',
    type: 'uint256'
  },
  {
    indexed: false,
    name: 'unlockTimestamp',
    type: 'uint256'
  }
];

export const FightLostSignature = web3.eth.abi.encodeEventSignature({
  anonymous: false,
  inputs: [
    {
      indexed: false,
      name: 'monsterId',
      type: 'uint256'
    },
    {
      indexed: false,
      name: 'dragonId',
      type: 'uint256'
    },
    {
      indexed: false,
      name: 'unlockTimestamp',
      type: 'uint256'
    }
  ],
  name: 'FightLost',
  type: 'event'
});

export const FightWinLogStructure = [
  {
    indexed: false,
    name: 'monsterId',
    type: 'uint256'
  },
  {
    indexed: false,
    name: 'dragonId',
    type: 'uint256'
  },
  {
    indexed: false,
    name: 'reward',
    type: 'uint256'
  }
];

export const FightWinSignature = web3.eth.abi.encodeEventSignature({
  anonymous: false,
  inputs: [
    {
      indexed: false,
      name: 'monsterId',
      type: 'uint256'
    },
    {
      indexed: false,
      name: 'dragonId',
      type: 'uint256'
    },
    {
      indexed: false,
      name: 'reward',
      type: 'uint256'
    }
  ],
  name: 'FightWin',
  type: 'event'
});

export const FightBossSignature = web3.eth.abi.encodeEventSignature({
  anonymous: false,
  inputs: [
    {
      indexed: false,
      name: 'monsterId',
      type: 'uint256'
    },
    {
      indexed: false,
      name: 'monsterHP',
      type: 'uint256'
    },
    {
      indexed: false,
      name: 'dragonId',
      type: 'uint256'
    },
    {
      indexed: false,
      name: 'dragonStats',
      type: 'uint256'
    },
    {
      indexed: false,
      name: 'unlockTimestamp',
      type: 'uint256'
    }
  ],
  name: 'FightBoss',
  type: 'event'
});

export const FightBossLogStructure = [
  {
    indexed: false,
    name: 'monsterId',
    type: 'uint256'
  },
  {
    indexed: false,
    name: 'monsterHP',
    type: 'uint256'
  },
  {
    indexed: false,
    name: 'dragonId',
    type: 'uint256'
  },
  {
    indexed: false,
    name: 'dragonStats',
    type: 'uint256'
  },
  {
    indexed: false,
    name: 'unlockTimestamp',
    type: 'uint256'
  }
];

export const KillBossLogStructure = [
  {
    indexed: false,
    name: 'monsterId',
    type: 'uint256'
  },
  {
    indexed: false,
    name: 'dragonId',
    type: 'uint256'
  }
];

export const KillBossSignature = web3.eth.abi.encodeEventSignature({
  anonymous: false,
  inputs: [
    {
      indexed: false,
      name: 'monsterId',
      type: 'uint256'
    },
    {
      indexed: false,
      name: 'dragonId',
      type: 'uint256'
    }
  ],
  name: 'KillBoss',
  type: 'event'
});

export const RewardXXClaimedLogStructure = [
  {
    indexed: false,
    name: 'owner',
    type: 'address'
  },
  {
    indexed: false,
    name: 'amount',
    type: 'uint256'
  }
];

export const RewardXXClaimedSignature = web3.eth.abi.encodeEventSignature({
  anonymous: false,
  inputs: [
    {
      indexed: false,
      name: 'owner',
      type: 'address'
    },
    {
      indexed: false,
      name: 'amount',
      type: 'uint256'
    }
  ],
  name: 'RewardXXClaimed',
  type: 'event'
});

export const RewardYYClaimedLogStructure = [
  {
    indexed: false,
    name: 'owner',
    type: 'address'
  },
  {
    indexed: false,
    name: 'amount',
    type: 'uint256'
  }
];

export const RewardYYClaimedSignature = web3.eth.abi.encodeEventSignature({
  anonymous: false,
  inputs: [
    {
      indexed: false,
      name: 'owner',
      type: 'address'
    },
    {
      indexed: false,
      name: 'amount',
      type: 'uint256'
    }
  ],
  name: 'RewardYYClaimed',
  type: 'event'
});

export const ListNFTMarketplaceSignature = web3.eth.abi.encodeEventSignature({
  anonymous: false,
  inputs: [
    {
      indexed: false,
      internalType: 'uint256',
      name: 'listingId',
      type: 'uint256'
    },
    {
      indexed: false,
      internalType: 'address',
      name: 'seller',
      type: 'address'
    },
    {
      indexed: false,
      internalType: 'address',
      name: 'token',
      type: 'address'
    },
    {
      indexed: false,
      internalType: 'uint256',
      name: 'tokenId',
      type: 'uint256'
    },
    {
      indexed: false,
      internalType: 'uint256',
      name: 'price',
      type: 'uint256'
    }
  ],
  name: 'Listed',
  type: 'event'
});

export const ListNFTMarketplaceStructure = [
  {
    indexed: false,
    internalType: 'uint256',
    name: 'listingId',
    type: 'uint256'
  },
  {
    indexed: false,
    internalType: 'address',
    name: 'seller',
    type: 'address'
  },
  {
    indexed: false,
    internalType: 'address',
    name: 'token',
    type: 'address'
  },
  {
    indexed: false,
    internalType: 'uint256',
    name: 'tokenId',
    type: 'uint256'
  },
  {
    indexed: false,
    internalType: 'uint256',
    name: 'price',
    type: 'uint256'
  }
];

export const SaleNFTMarketplaceSignature = web3.eth.abi.encodeEventSignature({
  anonymous: false,
  inputs: [
    {
      indexed: false,
      internalType: 'uint256',
      name: 'listingId',
      type: 'uint256'
    },
    {
      indexed: false,
      internalType: 'address',
      name: 'buyer',
      type: 'address'
    },
    {
      indexed: false,
      internalType: 'address',
      name: 'token',
      type: 'address'
    },
    {
      indexed: false,
      internalType: 'uint256',
      name: 'tokenId',
      type: 'uint256'
    },
    {
      indexed: false,
      internalType: 'uint256',
      name: 'price',
      type: 'uint256'
    },
    {
      indexed: false,
      internalType: 'uint256',
      name: 'actualPrice',
      type: 'uint256'
    }
  ],
  name: 'Sale',
  type: 'event'
});

export const SaleNFTMarketplaceStructure = [
  {
    indexed: false,
    internalType: 'uint256',
    name: 'listingId',
    type: 'uint256'
  },
  {
    indexed: false,
    internalType: 'address',
    name: 'buyer',
    type: 'address'
  },
  {
    indexed: false,
    internalType: 'address',
    name: 'token',
    type: 'address'
  },
  {
    indexed: false,
    internalType: 'uint256',
    name: 'tokenId',
    type: 'uint256'
  },
  {
    indexed: false,
    internalType: 'uint256',
    name: 'price',
    type: 'uint256'
  },
  {
    indexed: false,
    internalType: 'uint256',
    name: 'actualPrice',
    type: 'uint256'
  }
];

export const CancelNFTMarketplaceSignature = web3.eth.abi.encodeEventSignature({
  anonymous: false,
  inputs: [
    {
      indexed: false,
      internalType: 'uint256',
      name: 'listingId',
      type: 'uint256'
    },
    {
      indexed: false,
      internalType: 'address',
      name: 'seller',
      type: 'address'
    }
  ],
  name: 'Cancel',
  type: 'event'
});

export const CancelNFTMarketplaceStructure = [
  {
    indexed: false,
    internalType: 'uint256',
    name: 'listingId',
    type: 'uint256'
  },
  {
    indexed: false,
    internalType: 'address',
    name: 'seller',
    type: 'address'
  }
]