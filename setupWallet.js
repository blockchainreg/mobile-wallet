const terms = require("./terms.js");

async function loadTerms(store) {
  try {
    const response = await fetch('https://raw.githubusercontent.com/velas/JsWallet/master/TERMS.md');
    store.current.termsMarkdown = await response.text();
  }catch(e) {
  }
}

module.exports = (store, web3t) => {
  store.current.termsMarkdown = terms;
	//loadTerms(store);
  store.current.page = "terms";
  web3t.init(function(err, data) {

      if (err) {
          store.current.page = "error";
          store.current.error = err + "";
          return;
      }
      store.current.loading = true;
      
      web3t.refresh(function(err, data){
        store.current.loading = false;
        if (err) {
          store.current.page = "error";
          store.current.error = err + "";
        }
      });
    });

} 