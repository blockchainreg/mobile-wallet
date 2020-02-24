let isLoading = false;
async function loadTerms(store) {
  if (isLoading) {
    return;
  }
  isLoading = true;
  try {
    const response = await fetch('https://raw.githubusercontent.com/web3space/wallet/master/TERMS.md');
    store.current.termsMarkdown = await response.text();
    store.current.loading = false;
  }catch(e) {
    console.error(e);
    setTimeout(loadTerms.bind(this, store), 1000);
  }
}

module.exports = (store, web3t) => {
	loadTerms(store);
	store.current.loading = true;
    web3t.init(function(err, data) {

      if (err) {
          store.current.page = "error";
          store.current.error = err + "";
          return;
      }

      store.current.page = "terms";
      if (store.current.termsMarkdown) {
        store.current.loading = false;
      }
      web3t.refresh(function(err, data){
        if (store.current.termsMarkdown) {
          store.current.loading = false;
        }

        if (err) {
          store.current.page = "error";
          store.current.error = err + "";
        }
      });
    });

} 