const formatBalance = (n) => {
    if (n < 1e3) return n;
  if (n >= 1e3 && n < 1e9) return n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  if (n >= 1e9 && n < 1e12) return '≈' + (n / 1e9).toFixed(1) + 'B';
};

export { formatBalance };
