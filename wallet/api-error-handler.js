function handleError(err) {
  if (err.indexOf('Unexpected token < in JSON at position 0')) {
    return {
      text1: 'Error 360. Please retry later or write to our ',
      text2: ' and we will figure it out. ',
      hyperLink: 'https://support.velas.com/',
      textLink: 'support',
    };
  }
  return err;
}

module.exports = { handleError };
