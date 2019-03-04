import BigNumber from 'bignumber.js';

export function formatAmount(number, precision = 6) {
  if (number === undefined) return;

  const amountString = number.toString();

  return parseFloat(amountString.slice(0, (amountString.indexOf('.')) + (precision + 1)));
}

export function formatBigNumber(number, precision) {
  let result = new BigNumber(number.toString());

  result = result.div(Math.pow(10, 18));

  if (precision) {
    result = formatAmount(result, precision);
  }

  return result.toNumber();
}

export function numberToHex(number, decimals = 18) {
  let bigNumber = new BigNumber(number).times(Math.pow(10, decimals));

  return "0x" + bigNumber.toString(16);
}
