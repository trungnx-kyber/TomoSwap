import envConfig from "../config/env";
import { numberToHex } from "../utils/helpers";
import * as Web3Service from "./web3Service";

export function getSwapABI(data) {
  const networkProxyContract = Web3Service.getNetworkProxyContract();

  return networkProxyContract.methods.swap(
    data.srcAddress,
    data.srcAmount,
    data.destAddress,
    data.address,
    data.maxDestAmount,
    data.minConversionRate,
    data.walletId
  ).encodeABI();
}

export function transfer(srcTokenAddress, destAddress, srcAmount) {
  const tokenContract = Web3Service.getTokenContract(srcTokenAddress);

  return tokenContract.methods.transfer(destAddress, srcAmount).call();
}

export function approve(srcTokenAddress, srcAmount) {
  const tokenContract = Web3Service.getTokenContract(srcTokenAddress);
  return tokenContract.methods.approve(envConfig.NETWORK_PROXY_ADDRESS, srcAmount).call();
}

export function getRate(srcAddress, srcDecimals, destAddress, srcAmount) {
  const networkProxyContract = Web3Service.getNetworkProxyContract();

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
  const tokenContract = Web3Service.getNetworkProxyContract();
  let balances = [];

  for (let i = 0; i < tokens.length; i++) {
    const balance = await tokenContract.methods.getBalance(tokens[i].address, address).call();
    balances.push(balance);
  }

  return balances;
}
