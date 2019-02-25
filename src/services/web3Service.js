import Web3 from 'web3';
import { NETWORK_PROXY_ADDRESS, NETWORK_PROXY_ABI, TOKEN_ABI, RPC_ENDPOINT, WALLET_ID } from "../config/env";

export function trade(srcTokenAddress, srcAmount, destTokenAddress, destAddress, maxDestAmount, minConversionRate) {
  const networkProxyContract = getNetworkProxyContract();

  return networkProxyContract.methods.trade(
    srcTokenAddress,
    srcAmount,
    destTokenAddress,
    destAddress,
    maxDestAmount,
    minConversionRate,
    WALLET_ID
  ).call();
}

export function transfer(srcTokenAddress, destAddress, srcAmount) {
  const tokenContract = getTokenContract(srcTokenAddress);

  return tokenContract.methods.transfer(destAddress, srcAmount).call();
}

export function approve(srcTokenAddress, srcAmount) {
  const tokenContract = getTokenContract(srcTokenAddress);

  return tokenContract.methods.approve(NETWORK_PROXY_ADDRESS, srcAmount).call();
}

export function getExpectedRate(srcAddress, destAddress, srcQty) {
  const networkProxyContract = getNetworkProxyContract();

  return networkProxyContract.methods.getExpectedRate(srcAddress, destAddress, srcQty).call().then((result) => {
    let expectedRate = result.expectedRate;
    let slippageRate = result.slippageRate;

    return { expectedRate, slippageRate };
  });
}

export function getTokenBalance(tokenAddress, address) {
  const tokenContract = getNetworkProxyContract();

  return tokenContract.methods.getBalance(tokenAddress, address).call();
}

function getWeb3Instance() {
  return new Web3(new Web3.providers.HttpProvider(RPC_ENDPOINT));
}

function getNetworkProxyContract() {
  const web3 = getWeb3Instance();

  return web3.eth.Contract(NETWORK_PROXY_ABI, NETWORK_PROXY_ADDRESS);
}

function getTokenContract(srcTokenAddress) {
  const web3 = getWeb3Instance();

  return web3.eth.Contract(TOKEN_ABI, srcTokenAddress);
}
