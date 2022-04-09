import eth from '../web3t/providers/eth';
import eth_legacy from '../web3t/providers/eth_legacy';
import insight from '../web3t/providers/insight';
import bitcore from '../web3t/providers/bitcore';
import erc20 from '../web3t/providers/erc20';
import vlxerc20 from '../web3t/providers/vlxerc20';
import omni from '../web3t/providers/omni';
import velas_evm from '../web3t/providers/velas_evm';
import velas2 from '../web3t/providers/velas2';
import solana from '../web3t/providers/solana';
import velas_erc20 from '../web3t/providers/velas_erc20';
import bnb from '../web3t/providers/bnb';
import velas_busd from '../web3t/providers/velas_busd';
import busd from '../web3t/providers/busd';
import huobi from '../web3t/providers/huobi';
import velas_huobi from '../web3t/providers/velas_huobi';
import velas_usdt from '../web3t/providers/velas_usdt';
import velas_eth from '../web3t/providers/velas_eth';
import usdt_erc20_legacy from '../web3t/providers/usdt_erc20_legacy';
import usdc from '../web3t/providers/usdc';
import vlx_usdc from '../web3t/providers/vlx_usdc';
import bsc_vlx from '../web3t/providers/bsc_vlx';
import vlx_evm_legacy from '../web3t/providers/vlx_evm_legacy';

module.exports = {
  eth,
  eth_legacy,
  insight,
  bitcore,
  erc20,
  omni,
  velas2,
  vlxerc20,
  vlx_native: solana,
  velas_erc20,
  velas_evm,
  bnb,
  velas_busd,
  busd,
  huobi,
  velas_huobi,
  velas_usdt,
  velas_eth,
  usdt_erc20_legacy,
  usdc,
  vlx_usdc,
  bsc_vlx,
  vlx_evm_legacy,
};
