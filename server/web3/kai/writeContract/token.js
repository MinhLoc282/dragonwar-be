import logger from '../../../api/logger';
import { account, ContractToken } from '../index';
import { DEFAULT_GAS, DEFAULT_GAS_PRICE } from '../../../constants';

/**
 * @param token
 * @param recipient
 * @param amount
 * @param params Optional
 * @param params.gas
 * @param params.gasPrice
 * @returns {Promise<*>}
 */
export async function transfer(token, recipient, amount, params) {
  try {
    const tx = {
      gas: params?.gas || DEFAULT_GAS,
      gasPrice: params?.gasPrice || DEFAULT_GAS_PRICE,
    };
    return await ContractToken.invokeContract('transfer', [recipient, amount]).send(
      account.privateKey,
      token,
      tx,
      true,
    );
  } catch (error) {
    logger.error('ContractToken call transfer error:', error);
    throw error;
  }
}
