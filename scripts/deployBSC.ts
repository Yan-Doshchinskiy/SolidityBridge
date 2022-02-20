import hre, { ethers } from "hardhat";
import { Chains } from "../interfaces/enums";
import bscTokenArguments from "../arguments/BscToken";
import bscBridgeArguments from "../arguments/BscBridge";

// hardhat run --network bscTestnet scripts/deployBSC.ts
// hardhat verify --network bscTestnet --constructor-args ./arguments/BscToken.ts 0x70D3B2DaF5e75aA8e51c6ad282427E1CB115FE6A
// hardhat verify --network bscTestnet --constructor-args ./arguments/BscBridge.ts 0xf1aDfcA7aA424B2402cc523a87ef39e753df6EFC

async function main(): Promise<void> {
  const net = hre.network.name;
  if (net !== Chains.BSC_TEST) {
    throw new Error(`Invalid chain. Expected chain: ${Chains.BSC_TEST}`);
  }
  const TokenContractName = "ERC20ForBridge";
  const [deployer] = await ethers.getSigners();
  console.log(
    `Deploying ${TokenContractName} contract with the account:`,
    deployer.address
  );
  console.log("Account balance:", (await deployer.getBalance()).toString());
  // deploy BSC ERC20 Token
  const TokenFactory = await ethers.getContractFactory(TokenContractName);
  const TokenContract = await TokenFactory.deploy(...bscTokenArguments);
  await TokenContract.deployed();
  console.log("BSC Token Contract deployed to:", TokenContract.address);
  const BridgeContractName = "Bridge";
  console.log(
    `Deploying ${BridgeContractName} contract with the account:`,
    deployer.address
  );
  console.log("Account balance:", (await deployer.getBalance()).toString());
  // deploy BSC Bridge Token
  const BridgeFactory = await ethers.getContractFactory(BridgeContractName);
  const bridgePayload = [TokenContract.address, bscBridgeArguments[1]];
  // @ts-ignore
  const BridgeContract = await BridgeFactory.deploy(...bridgePayload);
  await BridgeContract.deployed();
  console.log("BSC Bridge Contract deployed to:", BridgeContract.address);
  // changin bridge address for BscToken contract
  const DeployedToken = await hre.ethers.getContractAt(
    TokenContractName,
    TokenContract.address
  );
  await DeployedToken.changeBridgeRole(BridgeContract.address);
  console.log("Bridge address was changed");
  console.log("deploy completed");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
