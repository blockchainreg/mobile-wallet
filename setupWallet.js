module.exports = (store, web3t) => {
	
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