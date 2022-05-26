export const sleep = async (time_ms) => {
  if (!time_ms)
    throw new Error('util/functions.js [sleep] err: time_ms is not defined');
  if (typeof time_ms !== 'number')
    throw new Error(
      'util/functions.js [sleep] err: time_ms parameter expects type number'
    );
  await new Promise((resolve) => setTimeout(resolve, time_ms));
};
