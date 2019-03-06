import appConfig from '../config/app';
import { getWeb3Instance } from './web3Service';

export function sendTx(type, ...params) {
  if (type === appConfig.WALLET_TYPE_METAMASK) {
    return sendTxByMetamask(...params);
  } else if (type === appConfig.WALLET_TYPE_KEYSTORE) {
    return sendTxByKeystore(...params);
  }

  return false;
}

export function trackTx(txHash) {
  const web3 = getWeb3Instance();

  return web3.eth.getTransactionReceipt(txHash);
}

function sendTxByMetamask(txObject) {
  return new Promise((resolve, reject) => {
    window.ethereum.sendAsync({
      method: 'eth_sendTransaction',
      params: [txObject],
      from: txObject.from,
    }, function (data, response) {
      if (response.error) {
        reject(response.error);
      }

      return resolve(response.result);
    });
  });
}

function sendTxByKeystore() {

}
