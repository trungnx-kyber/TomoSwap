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
