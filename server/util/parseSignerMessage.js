import {
 hashPersonalMessage, fromRpcSig, ecrecover, pubToAddress
} from 'ethereumjs-util';

export const getSignerAddressWeb3 = async (session, signedMessage) => {
  try {
    const messageBuffer = Buffer.from(session);
    const messageHash = hashPersonalMessage(messageBuffer);
    const sigDecoded = fromRpcSig(signedMessage);
    const recoveredPub = ecrecover(messageHash, sigDecoded.v, sigDecoded.r, sigDecoded.s);
    const recoveredAddress = pubToAddress(recoveredPub).toString('hex');
    return recoveredAddress ? `0x${recoveredAddress}` : null;
  } catch (error) {
    console.log('Error in getSignerAddressWeb3 =>', error);
  }
};
