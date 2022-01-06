function handleError(err) {
  if (err.indexOf('Unexpected token < in JSON at position 0')) {
    return {
      text: 'Error 360. Please retry later or write to our support and we will figure it out. ',
      hyperLink: 'https://support.velas.com/',
    };
  }
  return err;
}

module.exports = { handleError };
