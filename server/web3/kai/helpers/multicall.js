import { ethers } from 'ethers';

import { Multical_Abi } from '../contractDefine';
import { KAI_RPC_ENDPOINT, MULTICALL_ADDRESS } from '../../../config';

const multicall = async (abi, calls) => {
  try {
    const provider = new ethers.providers.JsonRpcProvider(KAI_RPC_ENDPOINT);
    const multi = new ethers.Contract(MULTICALL_ADDRESS, Multical_Abi, provider);
    const itf = new ethers.utils.Interface(abi);
    const calldata = calls.map(call => [call.address.toLowerCase(), itf.encodeFunctionData(call.name, call.params)]);
    const { returnData } = await multi.aggregate(calldata);

    const res = returnData.map((call, i) => itf.decodeFunctionResult(calls[i].name, call));

    return res;
  } catch (e) {
    console.log('calls');
    console.log(calls);
    console.log('multicall');
    console.log(e);
  }
};

export default multicall;
