export default class Spinner {
  constructor(store, description, options = {}) {
    this.description = (" "+description+"   ").split(" ").join('\u00A0');
    this.store = store;
    store.current.loadingSpinners.push(this);
    this.isDescriptionPushed = false;
    this.startedAt = Date.now();

    if (options.displayDescription === "auto" || options.displayDescription === undefined) {
      this.shouldDisplayDescriptionTimeout = setTimeout(() => {
        this.isDescriptionPushed = true;
        store.current.loadingDescriptions.push(this.description);
      }, 0);
    } else if (options.displayDescription){
      this.isDescriptionPushed = true;
      store.current.loadingDescriptions.push(this.description);
    }
    this.finishTimeout = setTimeout(() => {
      //TODO: cannot use error here, maybe alert
      console.error("Spinner not finished in 60 seconds", description);
    }, 60000);
  }

  finish() {
    console.log(this.description + " took " + (Date.now() - this.startedAt) + "ms");
    if (this.shouldDisplayDescriptionTimeout) {
      clearTimeout(this.shouldDisplayDescriptionTimeout);
      delete this.shouldDisplayDescriptionTimeout;
    }
    if (this.finishTimeout) {
      clearTimeout(this.finishTimeout);
      delete this.finishTimeout;
    }
    const index = this.store.current.loadingSpinners.indexOf(this);
    if (index === -1) {
      console.warn("Spinner not found. It may already be disposed", this.description);
      return;
    }
    this.store.current.loadingSpinners.splice(index, 1);

    if (this.isDescriptionPushed) {
      const index = this.store.current.loadingDescriptions.indexOf(this.description);
      if (index === -1) {
        console.warn("Spinner description not found. Something goes wrong.", this.description);
        return;
      }
      this.store.current.loadingDescriptions.splice(index, 1);
    }
    delete this.isDescriptionPushed;
  }

  getDisplayDescription() {
    if (!this.shouldDisplayDescription) {
      return null;
    }
    return this.description;
  }
}
