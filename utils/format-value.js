import BN from 'bn.js';

const formatBalance = (n) => {
  if (n < 1e3) return n;
  if (n >= 1e3 && n < 1e9) return n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  if (n >= 1e9 && n < 1e12) return '≈' + (n / 1e9).toFixed(1) + 'B';
};
const formatValue = (n) => {
  if (n < 1e3) return n;
if (n >= 1e3 && n < 1e9) return n.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
if (n >= 1e9 && n < 1e12) return '≈' + (n / 1e9).toFixed(1) + 'B';
};
const wrapNumber = (n) => {
  return n.replace(",", ".").replace(/[^0-9\.]/g, "");
};

const formatStakeAmount = (n) => {
   n = n.div(new BN('10000000', 10)).toNumber()/100;
   return n.toFixed(2);
}

export { formatBalance, formatValue, wrapNumber, formatStakeAmount};
