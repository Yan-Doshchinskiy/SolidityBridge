import * as dotenv from "dotenv";

import { HardhatUserConfig } from "hardhat/config";
import { EthGasReporterConfig } from "hardhat-gas-reporter/src/types";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "./tasks/index.ts";
import * as process from "process";

dotenv.config();

interface IConfig extends HardhatUserConfig {
  gasReporter?: EthGasReporterConfig;
}

const url = process.env.CHAIN_URL as string;
const ownerPrivateKey = process.env.OWNER_PRIVATE_KEY as string;
const secondSignerPrivateKey = process.env.SECOND_SIGNER_KEY as string;
const accounts = [ownerPrivateKey, secondSignerPrivateKey].filter(
  (account: string): boolean => !!account
);
const chainId = Number(process.env.CHAIN_ID as string) || 0;
const reportGas = (process.env.REPORT_GAS as string) === "true";
const apiKey = process.env.API_KEY as string;
const ethBridge = process.env.ETH_BRIDGE_ADDRESS as string;
const bscBridge = process.env.BSC_BRIDGE_ADDRESS as string;
const gateway = process.env.GATEWAY_ADDRESS as string;

type IEnvItem = { value: string | number; key: string };

const requiredEnvs: Array<IEnvItem> = [
  { value: url, key: "CHAIN_URL" },
  { value: ownerPrivateKey, key: "PRIVATE_KEY" },
  { value: chainId, key: "CHAIN_ID" },
  { value: apiKey, key: "API_KEY" },
  { value: ethBridge, key: "ETH_BRIDGE_ADDRESS" },
  { value: bscBridge, key: "BSC_BRIDGE_ADDRESS" },
  { value: gateway, key: "GATEWAY_ADDRESS" },
];

requiredEnvs.forEach((item: IEnvItem): void => {
  if (!item.value) {
    throw new Error(
      `Please check that the ${item.key} value exist in the .env file`
    );
  }
});

const config: IConfig = {
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    rinkeby: {
      url,
      accounts: accounts,
      chainId,
    },
  },
  gasReporter: {
    enabled: reportGas,
    currency: "USD",
    src: "./contracts",
  },
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    sources: "./contracts",
    tests: "./test",
  },
  etherscan: {
    apiKey,
  },
  mocha: {
    timeout: 500000,
  },
};

export default config;
