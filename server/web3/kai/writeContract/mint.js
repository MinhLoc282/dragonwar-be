import logger from '../../../api/logger';
import { ContractEquipment, ContractExperience, sendTransaction, web3 } from '../index';
import {
  EQUIPMENT_ADDRESS,
  EXPERIENCE_ADDRESS,
  PRIVATE_KEY_OWNER_NFT,
  PUBLIC_KEY_OWNER_NFT,
  SKILLS_ADDRESS
} from '../../../config';
import { sleep } from '../../../helpers';
import {
  createItemExperience,
  updateItemNFT,
  updateItemLog,
  updateReportItems
} from '../../../components/item/item.service';
import { NFT_POSITIONS, ITEM_LOG_STATUS } from '../../../constants';
import {
  EquipmentMintAndTransferStructure,
  ExperienceMintAndTransferStructure,
  SkillMintAndTransferStructure
} from '../eventLog';
import Web3 from 'web3';
import Report from '../../../components/report/report.model';

/**
 * @param value
 * @param recipient
 * @returns {Promise<*>}
 */
export async function mintExperienceNFT(data) {
  try {
    console.log(`${data.itemUid} Mint Experience....`);
    const { exp, recipient } = data;
    const txData = ContractExperience.invokeContract('mintAndTransferToken', [exp, recipient]).txData();
    const response = await sendTransaction(txData, EXPERIENCE_ADDRESS, PUBLIC_KEY_OWNER_NFT, PRIVATE_KEY_OWNER_NFT);
    if (response?.status !== 0 && response?.logs?.[1]) {
      const log = response?.logs?.[1];
      const dataContract = web3.eth.abi.decodeLog(ExperienceMintAndTransferStructure, log.data, log.topics.slice(1));
      await Promise.all([
        updateItemNFT(data.item, dataContract),
        updateItemLog(data?.itemLog, {
          status: ITEM_LOG_STATUS.SUCCESS,
          txHash: response?.transactionHash,
          item: data.item,
          from: EXPERIENCE_ADDRESS,
          to: Web3.utils.toChecksumAddress(dataContract.owner),
        }),
        updateReportItems('totalItems.exp_card')
      ]);
    }
    await sleep(2000);
    return response?.transactionHash;
  } catch (error) {
    logger.error('mintExperienceNFT error:', error);
  }
}


export async function mintEquipmentNFT(data) {
  try {
    console.log(`${data.itemUid} Mint Equipment....`);
    const { equipment, recipient } = data;
    const txData = ContractEquipment.invokeContract('mintAndTransferToken', [NFT_POSITIONS[equipment.part?.toUpperCase()], equipment.point, equipment.id, recipient]).txData();
    const response = await sendTransaction(txData, EQUIPMENT_ADDRESS, PUBLIC_KEY_OWNER_NFT, PRIVATE_KEY_OWNER_NFT);
    if (response?.status !== 0 && response?.logs?.[1]) {
      const log = response?.logs?.[1];
      const dataContract = web3.eth.abi.decodeLog(EquipmentMintAndTransferStructure, log.data, log.topics.slice(1));
      await Promise.all([
        updateItemNFT(data.item, dataContract),
        updateItemLog(data?.itemLog, {
          status: ITEM_LOG_STATUS.SUCCESS,
          txHash: response?.transactionHash,
          item: data.item,
          from: EQUIPMENT_ADDRESS,
          to: Web3.utils.toChecksumAddress(dataContract.owner),
        }),
        updateReportItems('totalItems.equipment')
      ]);
    }
    await sleep(2000);
    return response?.transactionHash;
  } catch (error) {
    logger.error('mintEquipmentNFT error:', error);
  }
}

export async function mintSkillNFT(data) {
  try {
    console.log(`${data.itemUid} Mint Skill....`);
    const { skill, recipient } = data;
    const txData = ContractEquipment.invokeContract('mintAndTransferToken', [NFT_POSITIONS[skill.part?.toUpperCase()], Math.round(skill.attack), skill.id, recipient]).txData();
    const response = await sendTransaction(txData, SKILLS_ADDRESS, PUBLIC_KEY_OWNER_NFT, PRIVATE_KEY_OWNER_NFT);
    if (response?.status !== 0 && response?.logs?.[1]) {
      const log = response?.logs?.[1];
      const dataContract = web3.eth.abi.decodeLog(SkillMintAndTransferStructure, log.data, log.topics.slice(1));
      await Promise.all([
        updateItemNFT(data.item, dataContract),
        updateItemLog(data?.itemLog, {
          status: ITEM_LOG_STATUS.SUCCESS,
          txHash: response?.transactionHash,
          item: data.item,
          from: SKILLS_ADDRESS,
          to: Web3.utils.toChecksumAddress(dataContract.owner),
        }),
        updateReportItems('totalItems.skill_card')
      ]);
    }
    await sleep(2000);
    return response?.transactionHash;
  } catch (error) {
    logger.error('mintSkillNFT error:', error);
  }
}