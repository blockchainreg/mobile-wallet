import Spinner from "./spinner.js";

export default function (store, description, func, options) {
  return (...funcArgs) => {
    const cb = funcArgs[funcArgs.length - 1];
    if (funcArgs.length) {
      funcArgs.splice(funcArgs.length - 1, 1);
    }

    const spinner = (
      options
      ? new Spinner(store, description, options)
      : new Spinner(store, description)
    );
    setTimeout(() => {
      if (!cb) {
        func();
        spinner.finish();
        return;
      }
      func(...funcArgs, (...cbArgs) => {
        spinner.finish();
        return cb(...cbArgs);
      });
    }, 1);
  };
}
