import Web3 from 'web3';
import envConfig from "../config/env";
import { numberToHex } from "../utils/helpers";

export function trade(srcTokenAddress, srcTokenAmount, destTokenAddress, destAddress, maxDestAmount, minConversionRate) {
  const networkProxyContract = getNetworkProxyContract();

  return networkProxyContract.methods.trade(
    srcTokenAddress,
    srcTokenAmount,
    destTokenAddress,
    destAddress,
    maxDestAmount,
    minConversionRate,
    envConfig.WALLET_ID
  ).call();
}

export function transfer(srcTokenAddress, destAddress, srcAmount) {
  const tokenContract = getTokenContract(srcTokenAddress);

  return tokenContract.methods.transfer(destAddress, srcAmount).call();
}

export function approve(srcTokenAddress, srcAmount) {
  const tokenContract = getTokenContract(srcTokenAddress);
  return tokenContract.methods.approve(envConfig.NETWORK_PROXY_ADDRESS, srcAmount).call();
}

export function getRate(srcAddress, srcDecimals, destAddress, srcAmount) {
  const networkProxyContract = getNetworkProxyContract();

  srcAmount = numberToHex(srcAmount, srcDecimals);

  return networkProxyContract.methods.getExpectedRate(srcAddress, destAddress, srcAmount).call().then((result) => {
    let expectedRate = result.expectedRate;
    let slippageRate = result.slippageRate;

    return { expectedRate, slippageRate };
  });
}

export async function getAllRates(srcAddresses, srcDecimals, destAddresses, srcAmounts) {
  let rates = [];

  for (let i = 0; i < srcAddresses.length; i++) {
    const { expectedRate } = await getRate(srcAddresses[i], srcDecimals[i], destAddresses[i], srcAmounts[i]);

    rates.push(expectedRate);
  }

  return rates;
}

export async function getTokenBalances(tokens, address) {
  const tokenContract = getNetworkProxyContract();
  let balances = [];

  for (let i = 0; i < tokens.length; i++) {
    const balance = await getTokenBalance(tokenContract, tokens[i].address, address);
    balances.push(balance);
  }

  return balances;
}

function getTokenBalance(tokenContract, tokenAddress, address) {
  return tokenContract.methods.getBalance(tokenAddress, address).call();
}

function getWeb3Instance() {
  return new Web3(new Web3.providers.HttpProvider(envConfig.RPC_ENDPOINT));
}

function getNetworkProxyContract() {
  const web3 = getWeb3Instance();

  return web3.eth.Contract(envConfig.NETWORK_PROXY_ABI, envConfig.NETWORK_PROXY_ADDRESS);
}

function getTokenContract(srcTokenAddress) {
  const web3 = getWeb3Instance();

  return web3.eth.Contract(envConfig.TOKEN_ABI, srcTokenAddress);
}
