export default class Spinner {
  constructor(store, description, options = {}) {
    this.description = description;
    this.store = store;
    store.current.loadingSpinners.push(this);
    this.isDescriptionPushed = false;

    if (options.displayDescription === "auto") {
      this.shouldDisplayDescriptionTimeout = setTimeout(() => {
        this.isDescriptionPushed = true;
        store.current.loadingDescriptions.push(description);
      }, 500);
    } else if (options.displayDescription){
      this.isDescriptionPushed = true;
      store.current.loadingDescriptions.push(description);
    }
    this.finishTimeout = setTimeout(() => {
      console.error("Spinner not finished in 60 seconds", description);
    }, 60000);
  }

  finish() {
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
