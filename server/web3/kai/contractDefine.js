

export const TokenCore = process.env.NODE_ENV === 'production'
  ? require('./dragon-abi-production/ABI_Core.json')
  : require('./dragon-abi-development/ABI_Core.json');
export const TokenGeneScience = process.env.NODE_ENV === 'production'
  ? require('./dragon-abi-production/ABI_GeneScience.json')
  : require('./dragon-abi-development/ABI_GeneScience.json');
export const TokenSCA = process.env.NODE_ENV === 'production'
  ? require('./dragon-abi-production/ABI_SCA.json')
  : require('./dragon-abi-development/ABI_SCA.json');
export const TokenSiring = process.env.NODE_ENV === 'production'
  ? require('./dragon-abi-production/Siring_ABI.json')
  : require('./dragon-abi-development/Siring_ABI.json');
export const TokenBiding = process.env.NODE_ENV === 'production'
  ? require('./dragon-abi-production/Bidding_ABI.json')
  : require('./dragon-abi-development/Bidding_ABI.json');
export const TokenTraining = process.env.NODE_ENV === 'production'
  ? require('./dragon-abi-production/ABI_Traing.json')
  : require('./dragon-abi-development/ABI_Traing.json');

export const TokenEvent = process.env.NODE_ENV === 'production'
  ? require('./dragon-abi-production/DragonEvent.json')
  : require('./dragon-abi-development/DragonEvent.json');

export const ExperienceAbi = process.env.NODE_ENV === 'production'
 ? require('./dragon-abi-production/Experience_ABI.json')
  : require('./dragon-abi-development/Experience_ABI.json');

export const EquipmentAbi = process.env.NODE_ENV === 'production'
  ? require('./dragon-abi-production/Equipment_ABI.json')
  : require('./dragon-abi-development/Equipment_ABI.json');

export const SkillsAbi = process.env.NODE_ENV === 'production'
  ? require('./dragon-abi-production/Skill_ABI.json')
  : require('./dragon-abi-development/Skill_ABI.json');

export const WearableAbi = process.env.NODE_ENV === 'production'
  ? require('./dragon-abi-production/Wearable_ABI.json')
  : require('./dragon-abi-development/Wearable_ABI.json');

export const Marketplace_NFT_Abi = process.env.NODE_ENV === 'production'
  ? require('./dragon-abi-production/Marketplace_NFT_ABI.json')
  : require('./dragon-abi-development/Marketplace_NFT_ABI.json');

export const Multical_Abi = process.env.NODE_ENV === 'production'
  ? require('./dragon-abi-production/multicall.json')
  : require('./dragon-abi-development/multicall.json');
