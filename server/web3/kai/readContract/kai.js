import { KardiaAccount } from 'kardia-js-sdk';
import BigNumber from 'bignumber.js';
import {
  web3WS,
  web3,
  ContractToken,
  ContractSCA,
  ContractSiring, ContractMarketplaceNFT, ContractWearable
} from '../index';
import {
  TransferSignature,
  AuctionSuccessfulSignature,
  AuctionSuccessfulStructure,
  AuctionCreated,
  AuctionCreatedStructure,
  AuctionCancelled,
  AuctionCancelledStructure,
  TransferLogStructure,
  BirthSignature,
  BirthLogStructure,
  PregnantSignature,
  PregnantLogStructure,
  TrainingSignature,
  TrainingLogStructure,
  FightLostLogStructure,
  FightLostSignature,
  FightWinSignature,
  FightWinLogStructure,
  KillBossSignature,
  KillBossLogStructure,
  FightBossSignature,
  FightBossLogStructure,
  RewardXXClaimedLogStructure,
  RewardXXClaimedSignature,
  RewardYYClaimedLogStructure,
  RewardYYClaimedSignature,
  TicketBought,
  TicketBoughtStructure,
  TransferNFTItem,
  TransferNFTItemStructure,
  UseExperienceToDragon,
  UseExperienceToDragonStructure,
  ExpBoostedExtendSignature,
  ExpBoostedExtendStructure,
  ListNFTMarketplaceSignature,
  SaleNFTMarketplaceSignature,
  CancelNFTMarketplaceSignature,
  ListNFTMarketplaceStructure,
  SaleNFTMarketplaceStructure,
  CancelNFTMarketplaceStructure,
  UpgradeNFTItem,
  UpgradeNFTItemStructure,
  WearableNFTItem,
  WearableNFTItemStructure,
  UnWearNFTItem,
  UnWearNFTItemStructure,
  UpgradeNFTItemFailed, UpgradeNFTItemFailedStructure
} from '../eventLog';
import logger from '../../../api/logger';
import {
  DRAGON_TICKET,
  DRAGON_TICKET_PVP,
  EQUIPMENT_ADDRESS,
  EXPERIENCE_ADDRESS,
  KAI_CONTRACT_DRAGON,
  KAI_CONTRACT_EVENT,
  KAI_CONTRACT_SALECA,
  KAI_CONTRACT_SIRING,
  KAI_CONTRACT_TRAINING,
  MARKETPLACE_NFT_ADDRESS,
  SKILLS_ADDRESS,
  WEARABLE_EQUIPMENT_ADDRESS, WEARABLE_SKILL_ADDRESS
} from '../../../config';
import { callHelpers } from '../helpers';
import {
  updateDragon,
  createDragonHistory, getDragon, getLevelDragonViaExp, trainingDragon
} from '../../../components/dragon/dragon.service';
import { createEventHistory } from '../../../components/event/event.service';
import { createAuction, cancelAuction } from '../../../components/auction/auction.service';
import {
  AUCTION_TYPE,
  HISTORY_MONSTER,
  HISTORY_MONSTER_TYPE,
  HISTORY_TYPE, ITEM_TYPES,
  TICKET_TYPES,
  WORKER_NAME
} from '../../../constants';
import AMPQ from '../../../../rabbitmq/ampq';
import { createTicket } from '../../../components/ticket/ticket.service';
import {
  cancelNFTMarketplace,
  listNFTMarketplace, soldNFTMarketplace,
  transferNFTItem, unUseItemToDragon, upgradeNFTItem, upgradeNFTItemFailed,
  useExperienceNFTToDragon, useItemToDragon
} from '../../../components/item/item.service';
import { EquipmentAbi, ExperienceAbi, Marketplace_NFT_Abi } from '../contractDefine';
import multicall from '../helpers/multicall';
import { sleep } from '../../../helpers';

export async function getBlockNumber() {
  try {
    return await web3.eth.getBlockNumber();
  } catch (error) {
    logger.error('Kroma Sepolia getBlockNumber error:', error);
    throw error;
  }
}

export async function getBlock(blockNumber) {
  try {
    return await web3.eth.getBlock(blockNumber);
  } catch (error) {
    logger.error('Kroma Sepolia getBlock error:', error);
    throw error;
  }
}

export function toChecksumAddress(address) {
  try {
    return KardiaAccount.toChecksumAddress(address);
  } catch (error) {
    logger.error('KAI toChecksumAddress error:', error);
    throw error;
  }
}


export async function subscribeTransferEvent(contractAddress, callback) {
  try {
    const subscription = await web3WS.eth.subscribe('logs', {
      address: contractAddress,
      topics: [TransferSignature],
      fromBlock: 'latest',
    });
    subscription.on('data', callback);
    subscription.on('connected', (subscriptionId) => {
      console.log('subscribeTransferEvent connected:', subscriptionId);
    });
    subscription.on('error', async (error) => {
      console.log('subscribeTransferEvent error:');
      console.log(error);
      // Todo: reconnect the connection and subscription
    });
    return subscription;
  } catch (error) {
    logger.error('KAI subscribeTransferEvent error:', error);
    throw error;
  }
}
export async function subscribeAuctionSignatureEvent(contractAddress, callback) {
  try {
    const subscription = await web3WS.eth.subscribe('logs', {
      address: contractAddress,
      topics: [AuctionSuccessfulSignature],
      fromBlock: 'latest',
    });
    subscription.on('data', callback);
    subscription.on('connected', (subscriptionId) => {
      console.log('subscribeAuctionSignatureEvent connected:', subscriptionId);
    });
    subscription.on('error', async (error) => {
      console.log('subscribeAuctionSignatureEvent error:');
      console.log(error);
      // Todo: reconnect the connection and subscription
    });
    return subscription;
  } catch (error) {
    logger.error('KAI subscribeAuctionSignatureEvent error:', error);
    throw error;
  }
}
export async function subscribeSiringSignatureEvent(contractAddress, callback) {
  try {
    const subscription = await web3WS.eth.subscribe('logs', {
      address: contractAddress,
      topics: [AuctionSuccessfulSignature],
      fromBlock: 'latest',
    });
    subscription.on('data', callback);
    subscription.on('connected', (subscriptionId) => {
      console.log('subscribeSiringSignatureEvent connected:', subscriptionId);
    });
    subscription.on('error', async (error) => {
      console.log('subscribeSiringSignatureEvent error:');
      console.log(error);
      // Todo: reconnect the connection and subscription
    });
    return subscription;
  } catch (error) {
    logger.error('KAI subscribeSiringSignatureEvent error:', error);
    throw error;
  }
}
export async function subscribeAuctionCreateSignatureEvent(contractAddress, callback) {
  try {
    const subscription = await web3WS.eth.subscribe('logs', {
      address: contractAddress,
      topics: [AuctionCreated],
      fromBlock: 'latest',
    });
    subscription.on('data', callback);
    subscription.on('connected', (subscriptionId) => {
      console.log('subscribeAuctionCreateSignatureEvent connected:', subscriptionId);
    });
    subscription.on('error', async (error) => {
      console.log('subscribeAuctionCreateSignatureEvent error:');
      console.log(error);
      // Todo: reconnect the connection and subscription
    });
    return subscription;
  } catch (error) {
    logger.error('KAI subscribeAuctionCreateSignatureEvent error:', error);
    throw error;
  }
}

export async function subscribeTicketBoughtSignatureEvent(contractAddress, callback) {
  try {
    const subscription = await web3WS.eth.subscribe('logs', {
      address: contractAddress,
      topics: [TicketBought],
      fromBlock: 'latest',
    });
    subscription.on('data', callback);
    subscription.on('connected', (subscriptionId) => {
      console.log('subscribeTicketBoughtSignatureEvent connected:', subscriptionId);
    });
    subscription.on('error', async (error) => {
      console.log('subscribeTicketBoughtSignatureEvent error:');
      console.log(error);
      // Todo: reconnect the connection and subscription
    });
    return subscription;
  } catch (error) {
    logger.error('KAI subscribeTicketBoughtSignatureEvent error:', error);
    throw error;
  }
}

export async function subscribeUseExperienceToDragonSignatureEvent(contractAddress, callback) {
  try {
    const subscription = await web3WS.eth.subscribe('logs', {
      address: contractAddress,
      topics: [UseExperienceToDragon],
      fromBlock: 'latest',
    });
    subscription.on('data', callback);
    subscription.on('connected', (subscriptionId) => {
      console.log('subscribeUseExperienceToDragonSignatureEvent connected:', subscriptionId);
    });
    subscription.on('error', async (error) => {
      console.log('subscribeUseExperienceToDragonSignatureEvent error:');
      console.log(error);
      // Todo: reconnect the connection and subscription
    });
    return subscription;
  } catch (error) {
    logger.error('KAI subscribeUseExperienceToDragonSignatureEvent error:', error);
    throw error;
  }
}
export async function subscribeTransferNFTItemSignatureEvent(contractAddress, callback) {
  try {
    const subscription = await web3WS.eth.subscribe('logs', {
      address: contractAddress,
      topics: [TransferNFTItem],
      fromBlock: 'latest',
    });
    subscription.on('data', callback);
    subscription.on('connected', (subscriptionId) => {
      console.log('subscribeTransferNFTItemSignatureEvent connected:', subscriptionId);
    });
    subscription.on('error', async (error) => {
      console.log('subscribeTransferNFTItemSignatureEvent error:');
      console.log(error);
      // Todo: reconnect the connection and subscription
    });
    return subscription;
  } catch (error) {
    logger.error('KAI subscribeTransferNFTItemSignatureEvent error:', error);
    throw error;
  }
}

export async function subscribeUpgradeNFTItemSignatureEvent(contractAddress, callback) {
  try {
    const subscription = await web3WS.eth.subscribe('logs', {
      address: contractAddress,
      topics: [UpgradeNFTItem],
      fromBlock: 'latest',
    });
    subscription.on('data', callback);
    subscription.on('connected', (subscriptionId) => {
      console.log('subscribeUpgradeNFTItemSignatureEvent connected:', subscriptionId);
    });
    subscription.on('error', async (error) => {
      console.log('subscribeUpgradeNFTItemSignatureEvent error:');
      console.log(error);
      // Todo: reconnect the connection and subscription
    });
    return subscription;
  } catch (error) {
    logger.error('KAI subscribeUpgradeNFTItemSignatureEvent error:', error);
    throw error;
  }
}

export async function subscribeUpgradeNFTItemFailedSignatureEvent(contractAddress, callback) {
  try {
    const subscription = await web3WS.eth.subscribe('logs', {
      address: contractAddress,
      topics: [UpgradeNFTItemFailed],
      fromBlock: 'latest',
    });
    subscription.on('data', callback);
    subscription.on('connected', (subscriptionId) => {
      console.log('subscribeUpgradeNFTItemFailedSignatureEvent connected:', subscriptionId);
    });
    subscription.on('error', async (error) => {
      console.log('subscribeUpgradeNFTItemFailedSignatureEvent error:');
      console.log(error);
      // Todo: reconnect the connection and subscription
    });
    return subscription;
  } catch (error) {
    logger.error('KAI subscribeUpgradeNFTItemFailedSignatureEvent error:', error);
    throw error;
  }
}

export async function subscribeWearableNFTItemSignatureEvent(contractAddress, callback) {
  try {
    const subscription = await web3WS.eth.subscribe('logs', {
      address: contractAddress,
      topics: [WearableNFTItem],
      fromBlock: 'latest',
    });
    subscription.on('data', callback);
    subscription.on('connected', (subscriptionId) => {
      console.log('subscribeWearableNFTItemSignatureEvent connected:', subscriptionId);
    });
    subscription.on('error', async (error) => {
      console.log('subscribeWearableNFTItemSignatureEvent error:');
      console.log(error);
      // Todo: reconnect the connection and subscription
    });
    return subscription;
  } catch (error) {
    logger.error('KAI subscribeWearableNFTItemSignatureEvent error:', error);
    throw error;
  }
}

export async function subscribeUnWearNFTItemSignatureEvent(contractAddress, callback) {
  try {
    const subscription = await web3WS.eth.subscribe('logs', {
      address: contractAddress,
      topics: [UnWearNFTItem],
      fromBlock: 'latest',
    });
    subscription.on('data', callback);
    subscription.on('connected', (subscriptionId) => {
      console.log('subscribeUnWearNFTItemSignatureEvent connected:', subscriptionId);
    });
    subscription.on('error', async (error) => {
      console.log('subscribeUnWearNFTItemSignatureEvent error:');
      console.log(error);
      // Todo: reconnect the connection and subscription
    });
    return subscription;
  } catch (error) {
    logger.error('KAI subscribeUnWearNFTItemSignatureEvent error:', error);
    throw error;
  }
}

export async function subscribeSiringCreateSignatureEvent(contractAddress, callback) {
  try {
    const subscription = await web3WS.eth.subscribe('logs', {
      address: contractAddress,
      topics: [AuctionCreated],
      fromBlock: 'latest',
    });
    subscription.on('data', callback);
    subscription.on('connected', (subscriptionId) => {
      console.log('subscribeSiringCreateSignatureEvent connected:', subscriptionId);
    });
    subscription.on('error', async (error) => {
      console.log('subscribeSiringCreateSignatureEvent error:');
      console.log(error);
      // Todo: reconnect the connection and subscription
    });
    return subscription;
  } catch (error) {
    logger.error('KAI subscribeSiringCreateSignatureEvent error:', error);
    throw error;
  }
}
export async function subscribeSiringCancelledSignatureEvent(contractAddress, callback) {
  try {
    const subscription = await web3WS.eth.subscribe('logs', {
      address: contractAddress,
      topics: [AuctionCancelled],
      fromBlock: 'latest',
    });
    subscription.on('data', callback);
    subscription.on('connected', (subscriptionId) => {
      console.log('subscribeSiringCancelledSignatureEvent connected:', subscriptionId);
    });
    subscription.on('error', async (error) => {
      console.log('subscribeSiringCancelledSignatureEvent error:');
      console.log(error);
      // Todo: reconnect the connection and subscription
    });
    return subscription;
  } catch (error) {
    logger.error('KAI subscribeSiringCancelledSignatureEvent error:', error);
    throw error;
  }
}
export async function subscribeAuctionCancelledSignatureEvent(contractAddress, callback) {
  try {
    const subscription = await web3WS.eth.subscribe('logs', {
      address: contractAddress,
      topics: [AuctionCancelled],
      fromBlock: 'latest',
    });
    subscription.on('data', callback);
    subscription.on('connected', (subscriptionId) => {
      console.log('subscribeAuctionCancelledSignatureEvent connected:', subscriptionId);
    });
    subscription.on('error', async (error) => {
      console.log('subscribeAuctionCancelledSignatureEvent error:');
      console.log(error);
      // Todo: reconnect the connection and subscription
    });
    return subscription;
  } catch (error) {
    logger.error('KAI subscribeAuctionCancelledSignatureEvent error:', error);
    throw error;
  }
}
export async function subscribeBirthSignatureEvent(contractAddress, callback) {
  try {
    const subscription = await web3WS.eth.subscribe('logs', {
      address: contractAddress,
      topics: [BirthSignature],
      fromBlock: 'latest',
    });
    subscription.on('data', callback);
    subscription.on('connected', (subscriptionId) => {
      console.log('subscribeBirthSignatureEvent connected:', subscriptionId);
    });
    subscription.on('error', async (error) => {
      console.log('subscribeBirthSignatureEvent error:');
      console.log(error);
      // Todo: reconnect the connection and subscription
    });
    return subscription;
  } catch (error) {
    logger.error('KAI subscribeBirthSignatureEvent error:', error);
    throw error;
  }
}
export async function subscribePregnantSignatureEvent(contractAddress, callback) {
  try {
    const subscription = await web3WS.eth.subscribe('logs', {
      address: contractAddress,
      topics: [PregnantSignature],
      fromBlock: 'latest',
    });
    subscription.on('data', callback);
    subscription.on('connected', (subscriptionId) => {
      console.log('subscribePregnantSignatureEvent connected:', subscriptionId);
    });
    subscription.on('error', async (error) => {
      console.log('subscribePregnantSignatureEvent error:');
      console.log(error);
      // Todo: reconnect the connection and subscription
    });
    return subscription;
  } catch (error) {
    logger.error('KAI subscribePregnantSignatureEvent error:', error);
    throw error;
  }
}
export async function subscribeTrainingSignatureEvent(contractAddress, callback) {
  try {
    const subscription = await web3WS.eth.subscribe('logs', {
      address: contractAddress,
      topics: [TrainingSignature],
      fromBlock: 'latest',
    });
    console.log('contractAddress: ', contractAddress);
    subscription.on('data', callback);
    subscription.on('connected', (subscriptionId) => {
      console.log('subscribeTrainingSignatureEvent connected:', subscriptionId);
    });
    subscription.on('error', async (error) => {
      console.log('subscribeTrainingSignatureEvent error:');
      console.log(error);
      // Todo: reconnect the connection and subscription
    });
    return subscription;
  } catch (error) {
    logger.error('KAI subscribePregnantSignatureEvent error:', error);
    throw error;
  }
}
export async function subscribeExpBoostedExtendSignatureEvent(contractAddress, callback) {
  try {
    const subscription = await web3WS.eth.subscribe('logs', {
      address: contractAddress,
      topics: [ExpBoostedExtendSignature],
      fromBlock: 'latest',
    });
    console.log('contractAddress: ', contractAddress);
    subscription.on('data', callback);
    subscription.on('connected', (subscriptionId) => {
      console.log('subscribeExpBoostedExtendSignatureEvent connected:', subscriptionId);
    });
    subscription.on('error', async (error) => {
      console.log('subscribeExpBoostedExtendSignatureEvent error:');
      console.log(error);
      // Todo: reconnect the connection and subscription
    });
    return subscription;
  } catch (error) {
    logger.error('KAI subscribeExpBoostedExtendSignatureEvent error:', error);
    throw error;
  }
}
export async function subscribeFightLostSignatureEvent(contractAddress, callback) {
  try {
    const subscription = await web3WS.eth.subscribe('logs', {
      address: contractAddress,
      topics: [FightLostSignature],
      fromBlock: 'latest',
    });
    subscription.on('data', callback);
    subscription.on('connected', (subscriptionId) => {
      console.log('subscribeFightLostSignatureEvent connected:', subscriptionId);
    });
    subscription.on('error', async (error) => {
      console.log('subscribeFightLostSignatureEvent error:');
      console.log(error);
      // Todo: reconnect the connection and subscription
    });
    return subscription;
  } catch (error) {
    logger.error('KAI subscribeFightLostSignatureEvent error:', error);
    throw error;
  }
}
export async function subscribeFightWinSignatureEvent(contractAddress, callback) {
  try {
    const subscription = await web3WS.eth.subscribe('logs', {
      address: contractAddress,
      topics: [FightWinSignature],
      fromBlock: 'latest',
    });
    subscription.on('data', callback);
    subscription.on('connected', (subscriptionId) => {
      console.log('subscribeFightWinSignatureEvent connected:', subscriptionId);
    });
    subscription.on('error', async (error) => {
      console.log('subscribeFightWinSignatureEvent error:');
      console.log(error);
      // Todo: reconnect the connection and subscription
    });
    return subscription;
  } catch (error) {
    logger.error('KAI subscribeFightWinSignatureEvent error:', error);
    throw error;
  }
}

export async function subscribeKillBossSignatureEvent(contractAddress, callback) {
  try {
    const subscription = await web3WS.eth.subscribe('logs', {
      address: contractAddress,
      topics: [KillBossSignature],
      fromBlock: 'latest',
    });
    subscription.on('data', callback);
    subscription.on('connected', (subscriptionId) => {
      console.log('subscribeKillBossSignatureEvent connected:', subscriptionId);
    });
    subscription.on('error', async (error) => {
      console.log('subscribeKillBossSignatureEvent error:');
      console.log(error);
      // Todo: reconnect the connection and subscription
    });
    return subscription;
  } catch (error) {
    logger.error('KAI subscribeKillBossSignatureEvent error:', error);
    throw error;
  }
}

export async function subscribeFightBossSignatureEvent(contractAddress, callback) {
  try {
    const subscription = await web3WS.eth.subscribe('logs', {
      address: contractAddress,
      topics: [FightBossSignature],
      fromBlock: 'latest',
    });
    subscription.on('data', callback);
    subscription.on('connected', (subscriptionId) => {
      console.log('subscribeFightBossSignatureEvent connected:', subscriptionId);
    });
    subscription.on('error', async (error) => {
      console.log('subscribeFightBossSignatureEvent error:');
      console.log(error);
      // Todo: reconnect the connection and subscription
    });
    return subscription;
  } catch (error) {
    logger.error('KAI subscribeFightBossSignatureEvent error:', error);
    throw error;
  }
}

export async function subscribeRewardXXClaimedSignatureEvent(contractAddress, callback) {
  try {
    const subscription = await web3WS.eth.subscribe('logs', {
      address: contractAddress,
      topics: [RewardXXClaimedSignature],
      fromBlock: 'latest',
    });
    subscription.on('data', callback);
    subscription.on('connected', (subscriptionId) => {
      console.log('subscribeRewardXXClaimedSignatureEvent connected:', subscriptionId);
    });
    subscription.on('error', async (error) => {
      console.log('subscribeRewardXXClaimedSignatureEvent error:');
      console.log(error);
      // Todo: reconnect the connection and subscription
    });
    return subscription;
  } catch (error) {
    logger.error('KAI subscribeRewardXXClaimedSignatureEvent error:', error);
    throw error;
  }
}
export async function subscribeRewardYYClaimedSignatureEvent(contractAddress, callback) {
  try {
    const subscription = await web3WS.eth.subscribe('logs', {
      address: contractAddress,
      topics: [RewardYYClaimedSignature],
      fromBlock: 'latest',
    });
    subscription.on('data', callback);
    subscription.on('connected', (subscriptionId) => {
      console.log('subscribeRewardYYClaimedSignatureEvent connected:', subscriptionId);
    });
    subscription.on('error', async (error) => {
      console.log('subscribeRewardYYClaimedSignatureEvent error:');
      console.log(error);
      // Todo: reconnect the connection and subscription
    });
    return subscription;
  } catch (error) {
    logger.error('KAI subscribeRewardYYClaimedSignatureEvent error:', error);
    throw error;
  }
}


export async function subscribeListNFTMarketplaceSignatureEvent(contractAddress, callback) {
  try {
    const subscription = await web3WS.eth.subscribe('logs', {
      address: contractAddress,
      topics: [ListNFTMarketplaceSignature],
      fromBlock: 'latest',
    });
    subscription.on('data', callback);
    subscription.on('connected', (subscriptionId) => {
      console.log('subscribeListNFTMarketplaceSignatureEvent connected:', subscriptionId);
    });
    subscription.on('error', async (error) => {
      console.log('subscribeListNFTMarketplaceSignatureEvent error:');
      console.log(error);
      // Todo: reconnect the connection and subscription
    });
    return subscription;
  } catch (error) {
    logger.error('KAI subscribeListNFTMarketplaceSignatureEvent error:', error);
    throw error;
  }
}

export async function subscribeSaleNFTMarketplaceSignatureEvent(contractAddress, callback) {
  try {
    const subscription = await web3WS.eth.subscribe('logs', {
      address: contractAddress,
      topics: [SaleNFTMarketplaceSignature],
      fromBlock: 'latest',
    });
    subscription.on('data', callback);
    subscription.on('connected', (subscriptionId) => {
      console.log('subscribeSaleNFTMarketplaceSignatureEvent connected:', subscriptionId);
    });
    subscription.on('error', async (error) => {
      console.log('subscribeSaleNFTMarketplaceSignatureEvent error:');
      console.log(error);
      // Todo: reconnect the connection and subscription
    });
    return subscription;
  } catch (error) {
    logger.error('KAI subscribeSaleNFTMarketplaceSignatureEvent error:', error);
    throw error;
  }
}

export async function subscribeCancelNFTMarketplaceSignatureEvent(contractAddress, callback) {
  try {
    const subscription = await web3WS.eth.subscribe('logs', {
      address: contractAddress,
      topics: [CancelNFTMarketplaceSignature],
      fromBlock: 'latest',
    });
    subscription.on('data', callback);
    subscription.on('connected', (subscriptionId) => {
      console.log('subscribeCancelNFTMarketplaceSignatureEvent connected:', subscriptionId);
    });
    subscription.on('error', async (error) => {
      console.log('subscribeCancelNFTMarketplaceSignatureEvent error:');
      console.log(error);
      // Todo: reconnect the connection and subscription
    });
    return subscription;
  } catch (error) {
    logger.error('KAI subscribeCancelNFTMarketplaceSignatureEvent error:', error);
    throw error;
  }
}

export async function unsubscribeEvent(subscription) {
  try {
    await subscription?.unsubscribe();
    return true;
  } catch (error) {
    logger.error('KAI unsubscribeEvent error:', error);
    throw error;
  }
}

export async function theSubscriptionKai() {
  try {
    // Socket event sale auction
    await subscribeAuctionCreateSignatureEvent(KAI_CONTRACT_SALECA, async (log) => {
      try {
        const data = web3.eth.abi.decodeLog(AuctionCreatedStructure, log.data, [AuctionCreated]);
        console.log('subscribeAuctionCreateSignatureEvent data: ', data);
        if (data?.tokenId) {
          await createAuction(parseInt(data.tokenId, 0), AUCTION_TYPE.AUCTION);
        }
      } catch (error) {
        console.error('Error decoding AuctionCreate event:', error);
        console.log('Raw log data:', log);
      }
    });

    // await subscribeTicketBoughtSignatureEvent(DRAGON_TICKET, async (log) => {
    //   const data = web3.eth.abi.decodeLog(TicketBoughtStructure, log.data, [TicketBought]);
    //   console.log('subscribeTicketBoughtSignatureEvent PvE data: ', data);
    //   if (data?.teamId) {
    //     data.txHash = log.transactionHash;
    //     await createTicket({ ...data, type: TICKET_TYPES.PVE_TICKET });
    //   }
    // });

    // await subscribeTicketBoughtSignatureEvent(DRAGON_TICKET_PVP, async (log) => {
    //   const data = web3.eth.abi.decodeLog(TicketBoughtStructure, log.data, [TicketBought]);
    //   console.log('subscribeTicketBoughtSignatureEvent PvP data: ', data);
    //   if (data?.teamId) {
    //     data.txHash = log.transactionHash;
    //     await createTicket({ ...data, type: TICKET_TYPES.PVP_TICKET });
    //   }
    // });

    // await subscribeTransferNFTItemSignatureEvent(EXPERIENCE_ADDRESS, async (log) => {
    //   const data = web3.eth.abi.decodeLog(TransferNFTItemStructure, log.data, log.topics.slice(1));
    //   console.log('subscribeTransferNFTItemSignatureEvent data: ', data);
    //   await transferNFTItem({ ...data, txHash: log.transactionHash, type: ITEM_TYPES.EXP_CARD });
    // });

    // await subscribeTransferNFTItemSignatureEvent(EQUIPMENT_ADDRESS, async (log) => {
    //   const data = web3.eth.abi.decodeLog(TransferNFTItemStructure, log.data, log.topics.slice(1));
    //   console.log('subscribeTransferNFTItemSignatureEvent data: ', data);
    //   await transferNFTItem({ ...data, txHash: log.transactionHash, type: ITEM_TYPES.EQUIPMENT });
    // });

    // await subscribeTransferNFTItemSignatureEvent(SKILLS_ADDRESS, async (log) => {
    //   const data = web3.eth.abi.decodeLog(TransferNFTItemStructure, log.data, log.topics.slice(1));
    //   console.log('subscribeTransferNFTItemSignatureEvent data: ', data);
    //   await transferNFTItem({ ...data, txHash: log.transactionHash, type: ITEM_TYPES.SKILL_CARD });
    // });

    // await subscribeUpgradeNFTItemSignatureEvent(EQUIPMENT_ADDRESS, async (log) => {
    //   const data = web3.eth.abi.decodeLog(UpgradeNFTItemStructure, log.data, log.topics.slice(1));
    //   console.log('subscribeUpgradeNFTItemSignatureEvent Equipment data: ', data);
    //   await upgradeNFTItem({ ...data, txHash: log.transactionHash, type: ITEM_TYPES.EQUIPMENT });
    // });

    // await subscribeUpgradeNFTItemFailedSignatureEvent(EQUIPMENT_ADDRESS, async (log) => {
    //   const data = web3.eth.abi.decodeLog(UpgradeNFTItemFailedStructure, log.data, log.topics.slice(1));
    //   console.log('subscribeUpgradeNFTItemFailedSignatureEvent Equipment data: ', data);
    //   await upgradeNFTItemFailed({ ...data, txHash: log.transactionHash, type: ITEM_TYPES.EQUIPMENT });
    // });

    // await subscribeUpgradeNFTItemSignatureEvent(SKILLS_ADDRESS, async (log) => {
    //   const data = web3.eth.abi.decodeLog(UpgradeNFTItemStructure, log.data, log.topics.slice(1));
    //   console.log('subscribeUpgradeNFTItemSignatureEvent Skill data: ', data);
    //   await upgradeNFTItem({ ...data, txHash: log.transactionHash, type: ITEM_TYPES.SKILL_CARD });
    // });

    // await subscribeUpgradeNFTItemFailedSignatureEvent(SKILLS_ADDRESS, async (log) => {
    //   const data = web3.eth.abi.decodeLog(UpgradeNFTItemFailedStructure, log.data, log.topics.slice(1));
    //   console.log('subscribeUpgradeNFTItemFailedSignatureEvent Skill data: ', data);
    //   await upgradeNFTItemFailed({ ...data, txHash: log.transactionHash, type: ITEM_TYPES.SKILL_CARD });
    // });

    // await subscribeWearableNFTItemSignatureEvent(WEARABLE_EQUIPMENT_ADDRESS, async (log) => {
    //   const data = web3.eth.abi.decodeLog(WearableNFTItemStructure, log.data, log.topics.slice(1));
    //   console.log('subscribeWearableNFTItemSignatureEvent Equipment data: ', data);
    //   await useItemToDragon({
    //     ...data,
    //     to: WEARABLE_EQUIPMENT_ADDRESS,
    //     txHash: log.transactionHash,
    //     type: ITEM_TYPES.EQUIPMENT
    //   });
    // });

    // await subscribeWearableNFTItemSignatureEvent(WEARABLE_SKILL_ADDRESS, async (log) => {
    //   const data = web3.eth.abi.decodeLog(WearableNFTItemStructure, log.data, log.topics.slice(1));
    //   console.log('subscribeWearableNFTItemSignatureEvent Skill data: ', data);
    //   await useItemToDragon({
    //     ...data,
    //     to: WEARABLE_SKILL_ADDRESS,
    //     txHash: log.transactionHash,
    //     type: ITEM_TYPES.SKILL_CARD
    //   });
    // });

    // await subscribeUnWearNFTItemSignatureEvent(WEARABLE_EQUIPMENT_ADDRESS, async (log) => {
    //   const data = web3.eth.abi.decodeLog(UnWearNFTItemStructure, log.data, log.topics.slice(1));
    //   console.log('subscribeUnWearNFTItemSignatureEvent data: ', data);
    //   await unUseItemToDragon({
    //     ...data,
    //     from: WEARABLE_EQUIPMENT_ADDRESS,
    //     txHash: log.transactionHash,
    //     type: ITEM_TYPES.EQUIPMENT
    //   });
    // });

    await subscribeUseExperienceToDragonSignatureEvent(KAI_CONTRACT_TRAINING, async (log) => {
      const data = web3.eth.abi.decodeLog(UseExperienceToDragonStructure, log.data, log.topics.slice(1));
      console.log('subscribeUseExperienceToDragonSignatureEvent data: ', data);
      const xp = parseInt(data?.currentExp, 0);
      const level = getLevelDragonViaExp(xp);
      await updateDragon(data.dragonId, {
        xp,
        level,
      });
      await useExperienceNFTToDragon({ ...data, txHash: log.transactionHash });
    });

    await subscribeAuctionCancelledSignatureEvent(KAI_CONTRACT_SALECA, async (log) => {
      const data = web3.eth.abi.decodeLog(AuctionCancelledStructure, log.data, [AuctionCancelled]);
      console.log('subscribeAuctionCancelledSignatureEvent data: ', data);
      if (data?.tokenId) {
        await cancelAuction(parseInt(data.tokenId, 0), HISTORY_TYPE.CANCELAUCTION);
      }
    });
    await subscribeAuctionSignatureEvent(KAI_CONTRACT_SALECA, async (log) => {
      const data = web3.eth.abi.decodeLog(AuctionSuccessfulStructure, log.data, [AuctionSuccessfulSignature]);
      if (data?.tokenId) {
        const dragon = await getDragon(parseInt(data.tokenId, 0));
        await Promise.all([
          createDragonHistory({
            trxHash: log.transactionHash,
            id: parseInt(data.tokenId, 0),
            from: dragon ? web3.utils.toChecksumAddress(dragon.owner) : '',
            to: data?.winner ? web3.utils.toChecksumAddress(data.winner) : '',
            price: web3.utils.fromWei(data.totalPrice, 'ether'),
            type: HISTORY_TYPE.SUCCESSAUCTION
          }),
          updateDragon(parseInt(data.tokenId, 0), { owner: data.winner }),
          cancelAuction(parseInt(data.tokenId, 0))
        ]);
      }
    });

    // await subscribeListNFTMarketplaceSignatureEvent(MARKETPLACE_NFT_ADDRESS, async (log) => {
    //   const data = web3.eth.abi.decodeLog(ListNFTMarketplaceStructure, log.data, log.topics.slice(1));
    //   console.log('subscribeListNFTMarketplaceSignatureEvent data: ', data);
    //   await listNFTMarketplace({ ...data, txHash: log.transactionHash });
    // });
    // await subscribeSaleNFTMarketplaceSignatureEvent(MARKETPLACE_NFT_ADDRESS, async (log) => {
    //   const data = web3.eth.abi.decodeLog(SaleNFTMarketplaceStructure, log.data, log.topics.slice(1));
    //   console.log('subscribeSaleNFTMarketplaceSignatureEvent data: ', data);
    //   await soldNFTMarketplace({ ...data, txHash: log.transactionHash });
    // });

    // await subscribeCancelNFTMarketplaceSignatureEvent(MARKETPLACE_NFT_ADDRESS, async (log) => {
    //   const data = web3.eth.abi.decodeLog(CancelNFTMarketplaceStructure, log.data, log.topics.slice(1));
    //   console.log('subscribeCancelNFTMarketplaceSignatureEvent data: ', data);
    //   await cancelNFTMarketplace({ ...data, txHash: log.transactionHash });
    // });

    // Socket event siring auction
    await subscribeSiringCreateSignatureEvent(KAI_CONTRACT_SIRING, async (log) => {
      const data = web3.eth.abi.decodeLog(AuctionCreatedStructure, log.data, [AuctionCreated]);
      // console.log('subscribeSiringCreateSignatureEvent data: ', data);
      if (data?.tokenId) {
        await createAuction(parseInt(data.tokenId, 0), AUCTION_TYPE.SIRING);
      }
    });
    await subscribeSiringCancelledSignatureEvent(KAI_CONTRACT_SIRING, async (log) => {
      const data = web3.eth.abi.decodeLog(AuctionCancelledStructure, log.data, [AuctionCancelled]);
      // console.log('subscribeSiringCancelledSignatureEvent data: ', data);
      if (data?.tokenId) {
        await cancelAuction(parseInt(data.tokenId, 0), HISTORY_TYPE.CANCELSIRING);
      }
    });
    await subscribeSiringSignatureEvent(KAI_CONTRACT_SIRING, async (log) => {
      const data = web3.eth.abi.decodeLog(AuctionSuccessfulStructure, log.data, [AuctionSuccessfulSignature]);
      // console.log('subscribeSiringSignatureEvent: data', data);
      if (data?.tokenId) {
        const dragon = await getDragon(parseInt(data.tokenId, 0));
        await Promise.all([
          createDragonHistory({
            trxHash: log.transactionHash,
            id: parseInt(data.tokenId, 0),
            from: dragon ? web3.utils.toChecksumAddress(dragon.owner) : '',
            to: data?.winner ? web3.utils.toChecksumAddress(data.winner) : '',
            price: web3.utils.fromWei(data.totalPrice, 'ether'),
            type: HISTORY_TYPE.SUCCESSSIRING
          }),
          cancelAuction(parseInt(data.tokenId, 0))
        ]);
      }
    });
    // Socket event transfer
    await subscribeTransferEvent(KAI_CONTRACT_DRAGON, async (log) => {
      const data = web3.eth.abi.decodeLog(TransferLogStructure, log.data, [TransferSignature]);
      console.log('subscribeTransferEvent: data', data);
      await createDragonHistory({
        trxHash: log.transactionHash,
        id: parseInt(data.tokenId, 0),
        from: data?.from ? web3.utils.toChecksumAddress(data.from) : '',
        to: data?.from ? web3.utils.toChecksumAddress(data.to) : '',
        type: HISTORY_TYPE.TRANSFER
      });
      if (
        web3.utils.toChecksumAddress(data.to) === web3.utils.toChecksumAddress(KAI_CONTRACT_SALECA)
        || web3.utils.toChecksumAddress(data.to) === web3.utils.toChecksumAddress(KAI_CONTRACT_SIRING)
      ) {
        return;
      }
      if (data.tokenId && data?.from && data?.to) {
        setTimeout(() => {
          AMPQ.sendDataToQueue(WORKER_NAME.HANDLE_EVENT_KAI, {
            type: 'TRANSFER',
            data: {
              tokenId: parseInt(data.tokenId, 0),
              owner: data?.to
            }
          });
        }, 3000);
      }
    });
    await subscribeBirthSignatureEvent(KAI_CONTRACT_DRAGON, async (log) => {
      const data = web3.eth.abi.decodeLog(BirthLogStructure, log.data, [BirthSignature]);
      // console.log('subscribeBirthSignatureEvent: data', data);
      if (data?.dragonId) {
        setTimeout(() => {
          Promise.all([
            createDragonHistory({
              trxHash: log.transactionHash,
              id: parseInt(data.dragonId, 0),
              from: '',
              to: data?.owner ? web3.utils.toChecksumAddress(data.owner) : '',
              type: HISTORY_TYPE.BIRTHDAY
            }),
            AMPQ.sendDataToQueue(WORKER_NAME.HANDLE_EVENT_KAI, {
              type: 'BIRTH',
              data: {
                dragonId: parseInt(data.dragonId, 0),
                matronId: parseInt(data.matronId, 0),
                owner: data.owner
              }
            })
          ]);
          }, 3000);
      }
    });
    await subscribePregnantSignatureEvent(KAI_CONTRACT_DRAGON, async (log) => {
      const data = web3.eth.abi.decodeLog(PregnantLogStructure, log.data, [PregnantSignature]);
      // console.log('subscribePregnantSignatureEvent: data', data);
      if (data?.matronId && data?.sireId) {
        setTimeout(() => {
          Promise.all([
            createDragonHistory({
              trxHash: log.transactionHash,
              id: parseInt(data.matronId, 0),
              from: data?.owner ? web3.utils.toChecksumAddress(data.owner) : '',
              type: HISTORY_TYPE.PREGNANTMATRON
            }),
            createDragonHistory({
              trxHash: log.transactionHash,
              id: parseInt(data.sireId, 0),
              from: data?.owner ? web3.utils.toChecksumAddress(data.owner) : '',
              type: HISTORY_TYPE.PREGNANTSIRE
            }),
            AMPQ.sendDataToQueue(WORKER_NAME.HANDLE_EVENT_KAI, {
              type: 'PREGNANT',
              data: {
                matronId: parseInt(data.matronId, 0),
                sireId: parseInt(data.sireId, 0)
              }
            })
          ]);
        }, 3000);
      }
    });
    await subscribeTrainingSignatureEvent(KAI_CONTRACT_TRAINING, async (log) => {
      const data = web3.eth.abi.decodeLog(TrainingLogStructure, log.data, [TrainingSignature]);
      // console.log('subscribeTrainingSignatureEvent: data', data);
      const xp = parseInt(data?.xp, 0);
      const level = getLevelDragonViaExp(xp);
      if (data?.dragonID) {
        setTimeout(() => {
          Promise.all([
            createDragonHistory({
              trxHash: log.transactionHash,
              id: parseInt(data.dragonID, 0),
              type: HISTORY_TYPE.TRAINING,
              price: web3.utils.fromWei(data.price, 'ether'),
              data: {
                xp,
                level,
              }
            }),
            // AMPQ.sendDataToQueue(WORKER_NAME.HANDLE_EVENT_KAI, {
            //   type: 'TRAINING',
            //   data: {
            //     dragonId: parseInt(data.dragonID, 0),
            //     xp,
            //     level,
            //     startLock: parseInt(data.startLock, 0),
            //     price: web3.utils.fromWei(data.price, 'ether')
            //   }
            // }),
            trainingDragon(
              parseInt(data.dragonID, 0),
              xp,
              level,
              parseInt(data.startLock, 0),
              parseInt(web3.utils.fromWei(data.price, 'ether'), 0)
            )
          ]);
        }, 3000);
      }
    });


    await subscribeExpBoostedExtendSignatureEvent(KAI_CONTRACT_TRAINING, async (log) => {
      const data = web3.eth.abi.decodeLog(ExpBoostedExtendStructure, log.data, log.topics.slice(1));
      console.log('subscribeExpBoostedExtendSignatureEvent: data', data);
      if (data?.dragonId) {
        const xp = parseInt(data?.currentExp, 0);
        const level = getLevelDragonViaExp(xp);
        setTimeout(() => {
          Promise.all([
            createDragonHistory({
              trxHash: log.transactionHash,
              id: parseInt(data.dragonId, 0),
              type: HISTORY_TYPE.TRAINING,
              price: web3.utils.fromWei(data.price, 'ether'),
              data: {
                xp,
                level,
              }
            }),
            // AMPQ.sendDataToQueue(WORKER_NAME.HANDLE_EVENT_KAI, {
            //   type: 'TRAINING',
            //   data: {
            //     dragonId: parseInt(data.dragonId, 0),
            //     xp,
            //     level,
            //     startLock: null,
            //     price: web3.utils.fromWei(data.price, 'ether')
            //   }
            // }),
            trainingDragon(
              parseInt(data.dragonId, 0),
              xp,
              level,
              null,
              parseInt(web3.utils.fromWei(data.price, 'ether'), 0)
            )
          ]);
        }, 3000);
      }
    });

    await subscribeFightLostSignatureEvent(KAI_CONTRACT_EVENT, async (log) => {
      const data = web3.eth.abi.decodeLog(FightLostLogStructure, log.data, [FightLostSignature]);
      await createEventHistory({
        trxHash: log.transactionHash,
        monster: HISTORY_MONSTER.XX,
        type: HISTORY_MONSTER_TYPE.FIGHTLOST,
        data: {
          dragonId: parseInt(data.dragonId, 0),
          monsterId: parseInt(data.monsterId, 0),
          unlockTimestamp: parseInt(data.unlockTimestamp, 0) * 1000,
        }
      });
    });
    await subscribeFightWinSignatureEvent(KAI_CONTRACT_EVENT, async (log) => {
      const data = web3.eth.abi.decodeLog(FightWinLogStructure, log.data, [FightWinSignature]);
      console.log('subscribeFightWinSignatureEvent: data', data);
      await createEventHistory({
        trxHash: log.transactionHash,
        monster: HISTORY_MONSTER.XX,
        type: HISTORY_MONSTER_TYPE.FIGHTWIN,
        data: {
          dragonId: parseInt(data.dragonId, 0),
          monsterId: parseInt(data.monsterId, 0),
          reward: web3.utils.fromWei(data.reward, 'ether'),
        }
      });
    });
    await subscribeKillBossSignatureEvent(KAI_CONTRACT_EVENT, async (log) => {
      const data = web3.eth.abi.decodeLog(KillBossLogStructure, log.data, [KillBossSignature]);
      console.log('subscribeKillBossSignatureEvent: data', data);
      await createEventHistory({
        trxHash: log.transactionHash,
        monster: HISTORY_MONSTER.YY,
        type: HISTORY_MONSTER_TYPE.KILLBOSS,
        data: {
          dragonId: parseInt(data.dragonId, 0),
          monsterId: parseInt(data.monsterId, 0)
        }
      });
    });
    await subscribeFightBossSignatureEvent(KAI_CONTRACT_EVENT, async (log) => {
      const data = web3.eth.abi.decodeLog(FightBossLogStructure, log.data, [FightBossSignature]);
      console.log('subscribeFightBossSignatureEvent: data', data);
      await createEventHistory({
        trxHash: log.transactionHash,
        monster: HISTORY_MONSTER.YY,
        type: HISTORY_MONSTER_TYPE.FIGHTBOSS,
        data: {
          dragonId: parseInt(data.dragonId, 0),
          monsterId: parseInt(data.monsterId, 0),
          monsterHP: parseInt(data.monsterHP, 0),
          dragonStats: parseInt(data.dragonStats, 0),
          unlockTimestamp: parseInt(data.unlockTimestamp, 0) * 1000,
        }
      });
    });
    await subscribeRewardXXClaimedSignatureEvent(KAI_CONTRACT_EVENT, async (log) => {
      const data = web3.eth.abi.decodeLog(RewardXXClaimedLogStructure, log.data, [RewardXXClaimedSignature]);
      console.log('subscribeRewardXXClaimedSignatureEvent: data', data);
      await createEventHistory({
        trxHash: log.transactionHash,
        type: HISTORY_MONSTER_TYPE.CLAIM,
        monster: HISTORY_MONSTER.XX,
        data: {
          owner: web3.utils.toChecksumAddress(data.owner),
          reward: parseInt(data.amount, 0)
        }
      });
    });
    await subscribeRewardYYClaimedSignatureEvent(KAI_CONTRACT_EVENT, async (log) => {
      const data = web3.eth.abi.decodeLog(RewardYYClaimedLogStructure, log.data, [RewardYYClaimedSignature]);
      console.log('subscribeRewardYYClaimedSignatureEvent: data', data);
      await createEventHistory({
        trxHash: log.transactionHash,
        type: HISTORY_MONSTER_TYPE.CLAIM,
        monster: HISTORY_MONSTER.YY,
        data: {
          owner: web3.utils.toChecksumAddress(data.owner),
          reward: parseFloat(web3.utils.fromWei(data.amount, 'ether'), 2),
        }
      });
    });


    return true;
  } catch (error) {
    logger.error('KAI theSubscription error:', error);
    throw error;
  }
}

export async function getTokenById(id) {
  try {
    return callHelpers(ContractToken, KAI_CONTRACT_DRAGON, 'getdragon', [id]);
  } catch (error) {
    logger.error('KAI getTokenById error:', error);
    throw error;
  }
}

export async function getSalePriceById(id) {
  try {
    return callHelpers(ContractSCA, KAI_CONTRACT_SALECA, 'getAuction', [id]);
  } catch (error) {
    logger.error('KAI getSalePriceById error:', error);
    throw error;
  }
}

export async function getSirePriceById(id) {
  try {
    return callHelpers(ContractSiring, KAI_CONTRACT_SIRING, 'getAuction', [id]);
  } catch (error) {
    logger.error('KAI getSirePriceById error:', error);
    throw error;
  }
}
export async function getTotal() {
  try {
    return callHelpers(ContractToken, KAI_CONTRACT_DRAGON, 'totalSupply');
  } catch (error) {
    logger.error('KAI getTotal error:', error);
    throw error;
  }
}

export async function getAuctionTokenById(id, type) {
  try {
    await sleep(20000); // hot fix Kai cant update price
    if (type === AUCTION_TYPE.AUCTION) {
      return await callHelpers(ContractSCA, KAI_CONTRACT_SALECA, 'getCurrentPrice', [id]);
    }
    return await callHelpers(ContractSiring, KAI_CONTRACT_SIRING, 'getCurrentPrice', [id]);
  } catch (error) {
    logger.error('KAI getTokenById error:', error);
    throw error;
  }
}
export async function getTokensByOwner(address) {
  try {
    return callHelpers(ContractToken, KAI_CONTRACT_DRAGON, 'tokensOfOwner', [address]);
  } catch (error) {
    logger.error('KAI getTokenById error:', error);
    throw error;
  }
}
export async function getPriceTokenSale(id) {
  try {
    return callHelpers(ContractSCA, KAI_CONTRACT_SALECA, 'getCurrentPrice', [id]);
  } catch (error) {
    logger.error('KAI getTokenById error:', error);
    throw error;
  }
}
export async function getDragonOwner(id) {
  try {
    return callHelpers(ContractToken, KAI_CONTRACT_DRAGON, 'ownerOf', [id]);
  } catch (error) {
    logger.error('KAI getTokenById error:', error);
    throw error;
  }
}


export async function getExperienceById(id) {
  try {
    const calls = [
      {
        address: EXPERIENCE_ADDRESS,
        name: 'ownerOf',
        params: [id],
      }
    ];
    const [owner] = await multicall(ExperienceAbi, calls);
    return {
      owner: owner?.[0]
    };
  } catch (error) {
    logger.error('KAI getExperienceById error:', error);
    throw error;
  }
}

export async function getEquipmentById(id, address) {
  try {
    const calls = [
      {
        address: address,
        name: 'ownerOf',
        params: [id],
      },
      {
        address: address,
        name: 'getItemDetail',
        params: [id]
      }
    ];
    const [owner, item] = await multicall(EquipmentAbi, calls);
    return {
      owner: owner?.[0],
      item: {
        level: new BigNumber(item?.itemLevel?._hex).toNumber()
      }
    };
  } catch (error) {
    logger.error('KAI getEquipmentById error:', error);
  }
}

export async function getItemInDragon(contract, id) {
  try {
    return await callHelpers(ContractWearable, contract, 'getDragonWearItem', [id]);
  } catch (error) {
    logger.error('KAI getItemInDragon error:', error);
    throw error;
  }
}

export async function getItemOnMarketplace(token, id) {
  try {
    const total = await callHelpers(ContractMarketplaceNFT, MARKETPLACE_NFT_ADDRESS, 'getTotal', []);
    let i = total;
    const amountCalls = 15;
    let dataListing = null;
    while (i > 0) {
      let j = 0;
      const calls = [];
      const listingIds = [];
      while (j < amountCalls) {
        if (i > 0) {
          calls.push({
            address: MARKETPLACE_NFT_ADDRESS,
            name: 'getListing',
            params: [i],
          });
          listingIds.push(i);
        }
        j += 1;
        i -= 1;
      }
      const data = await multicall(Marketplace_NFT_Abi, calls);
      const dataFormat = data.map((item, index) => ({
        tokenId: new BigNumber(item?.tokenId?._hex).toNumber(),
        price: web3.utils.fromWei(new BigNumber(item?.price?._hex).toJSON(), 'ether'),
        token: item.token,
        owner: item.owner,
        listingId: listingIds[index]
      }));
      dataFormat.forEach((item) => {
        if (!dataListing && item.token === token && item.tokenId === id) {
          dataListing = item;
        }
      });
      if (dataListing) {
        break;
      }
      await sleep(10000);
    }
    return dataListing;
  } catch (error) {
    logger.error('KAI getItemOnMarketplace error:', error);
    throw error;
  }
}
