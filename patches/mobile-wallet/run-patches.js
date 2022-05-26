const { execSync } = require('child_process');
const { readdirSync } = require('fs');

if (!process.env.PATCHING_ENABLED) {
  console.log('Patching is disabled');
  return;
}

console.log('Patching mobile-wallet...');

const DIR_NAME = './patches/mobile-wallet/';

readdirSync(DIR_NAME, { withFileTypes: true })
  .filter((item) => !item.isDirectory())
  .map((item) => item.name)
  .filter((fileName) => fileName.endsWith('.patch'))
  .forEach((fileName) => {
    const command = `git apply --whitespace=fix ${DIR_NAME}${fileName}`;
    console.log(command);
    try {
      const patchStdOutBuffer = execSync(command);
      console.log(patchStdOutBuffer.toString('utf8'));
    } catch (err) {
      console.error(`Failed to patch ${fileName}`, err);
    }
  });

console.log('Patching is finished');
