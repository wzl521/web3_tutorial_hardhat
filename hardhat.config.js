require("@nomicfoundation/hardhat-toolbox");
require("@chainlink/env-enc").config();
//require("dotenv").config();使用.env文件，不安全
require("./tasks");// 默认找tasks文件夹下的index.js文件

const SEPOLIA_URL = process.env.SEPOLIA_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const PRIVATE_KEY_1 = process.env.PRIVATE_KEY_1;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.27",
  networks: {
    sepolia: {
      url: SEPOLIA_URL,
      accounts: [PRIVATE_KEY, PRIVATE_KEY_1],
      chainId: 11155111
    }
  },
  etherscan: {
    apiKey: {
      sepolia: ETHERSCAN_API_KEY
    }
  },
  // set timeout to 100000 seconds
  mocha: {
    timeout: 100000000 // or any time value that suits your project
  },
};
