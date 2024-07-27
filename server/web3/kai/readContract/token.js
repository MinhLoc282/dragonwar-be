import logger from '../../../api/logger';
import { ContractToken } from '../index';

export function balanceOf(tokenAddress, address) {
  try {
    const invoke = ContractToken.invokeContract('balanceOf', [address]);
    return invoke.call(tokenAddress, {}, 'latest');
  } catch (error) {
    logger.error('ContractToken call tokenBalanceOf error:', error);
    throw error;
  }
}
