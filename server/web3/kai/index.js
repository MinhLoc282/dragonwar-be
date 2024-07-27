import Web3 from 'web3';
import {
  KAI_RPC_ENDPOINT,
  KAI_WS_ENDPOINT,
  KAI_CONTRACT_DRAGON,
  KAI_CONTRACT_SALECA,
  KAI_CONTRACT_SIRING,
  KAI_CONTRACT_EVENT,
} from '../../config';
import {
  TokenCore,
  TokenSCA,
  TokenEvent,
  TokenSiring,
  ExperienceAbi,
  Marketplace_NFT_Abi, EquipmentAbi, WearableAbi
} from './contractDefine';

const options = {
  // Enable auto reconnection
  reconnect: {
    auto: true,
    delay: 5000, // ms
    maxAttempts: 1000,
    onTimeout: false
  }
};
export const web3WS = new Web3(new Web3.providers.WebsocketProvider(KAI_WS_ENDPOINT, options));
export const web3 = new Web3(new Web3.providers.HttpProvider(KAI_RPC_ENDPOINT));

export function getContract(abi, address) {
  return new web3.eth.Contract(abi, address);
}

export const ContractToken = getContract(TokenCore, KAI_CONTRACT_DRAGON);
export const ContractSCA = getContract(TokenSCA, KAI_CONTRACT_SALECA);
export const ContractSiring = getContract(TokenSiring, KAI_CONTRACT_SIRING);
export const ContractEvent = getContract(TokenEvent, KAI_CONTRACT_EVENT);
export const ContractExperience = getContract(ExperienceAbi);
export const ContractEquipment = getContract(EquipmentAbi);
export const ContractWearable = getContract(WearableAbi);
export const ContractMarketplaceNFT = getContract(Marketplace_NFT_Abi);


export const sendTransaction = async (txData, toAddress, publicKey, privateKey) => {
  try {
    const nonce = await web3.eth.getTransactionCount(publicKey, 'pending');
    const gasPrice = await web3.eth.getGasPrice();
    const gasLimit = 1000000;

    const txObject = {
      nonce: web3.utils.toHex(nonce),
      to: toAddress,
      data: txData,
      gasPrice: web3.utils.toHex(gasPrice),
      gas: web3.utils.toHex(gasLimit),
    };

    const signedTx = await web3.eth.accounts.signTransaction(txObject, privateKey);

    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

    if (receipt.status) {
      console.log('Transaction successful:', receipt.transactionHash);
      return receipt;
    }
      console.log('Transaction failed:', receipt.transactionHash);
      return receipt;
  } catch (error) {
    console.error('Error sending transaction:', error);
    throw error;
  }
};
