import Web3 from 'web3';
import EnvConfig from "../config/env";

export function trade(srcTokenAddress, srcAmount, destTokenAddress, destAddress, maxDestAmount, minConversionRate) {
  const networkProxyContract = getNetworkProxyContract();

  return networkProxyContract.methods.trade(
    srcTokenAddress,
    srcAmount,
    destTokenAddress,
    destAddress,
    maxDestAmount,
    minConversionRate,
    EnvConfig.WALLET_ID
  ).call();
}

export function transfer(srcTokenAddress, destAddress, srcAmount) {
  const tokenContract = getTokenContract(srcTokenAddress);

  return tokenContract.methods.transfer(destAddress, srcAmount).call();
}

export function approve(srcTokenAddress, srcAmount) {
  const tokenContract = getTokenContract(srcTokenAddress);

  return tokenContract.methods.approve(EnvConfig.NETWORK_PROXY_ADDRESS, srcAmount).call();
}

export function getRate(srcTokenAddress, destTokenAddress, srcTokenQty) {
  const networkProxyContract = getNetworkProxyContract();

  return networkProxyContract.methods.getExpectedRate(srcTokenAddress, destTokenAddress, srcTokenQty).call().then((result) => {
    let expectedRate = result.expectedRate;
    let slippageRate = result.slippageRate;

    return { expectedRate, slippageRate };
  });
}

export async function getAllRates(srcAddresses, destAddresses, srcAmounts) {
  let rates = [];

  for (let i = 0; i < srcAddresses.length; i++) {
    const { expectedRate } = await getRate(srcAddresses[i], destAddresses[i], srcAmounts[i]);

    rates.push(expectedRate);
  }

  return rates;
}

export function getTokenBalance(tokenAddress, address) {
  const tokenContract = getNetworkProxyContract();

  return tokenContract.methods.getBalance(tokenAddress, address).call();
}

function getWeb3Instance() {
  return new Web3(new Web3.providers.HttpProvider(EnvConfig.RPC_ENDPOINT));
}

function getNetworkProxyContract() {
  const web3 = getWeb3Instance();

  return web3.eth.Contract(EnvConfig.NETWORK_PROXY_ABI, EnvConfig.NETWORK_PROXY_ADDRESS);
}

function getTokenContract(srcTokenAddress) {
  const web3 = getWeb3Instance();

  return web3.eth.Contract(EnvConfig.TOKEN_ABI, srcTokenAddress);
}
