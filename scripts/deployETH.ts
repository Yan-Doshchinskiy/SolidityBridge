import hre, { ethers } from "hardhat";
import { Chains } from "../interfaces/enums";
import ethTokenArguments from "../arguments/EthToken";
import ethBridgeArguments from "../arguments/EthBridge";

// hardhat run --network rinkeby scripts/deployETH.ts
// hardhat verify --network rinkeby --constructor-args ./arguments/EthToken.ts 0xD042A4737F23131344d96de673B1194De2757bfB
// hardhat verify --network rinkeby --constructor-args ./arguments/EthBridge.ts 0x125a58FA49d04a8B843510C7E1d6abf8d0E9c648

async function main(): Promise<void> {
  const net = hre.network.name;
  if (net !== Chains.RINKEBY) {
    throw new Error(`Invalid chain. Expected chain: ${Chains.RINKEBY}`);
  }
  const TokenContractName = "ERC20ForBridge";
  const [deployer] = await ethers.getSigners();
  console.log(
    `Deploying ${TokenContractName} contract with the account:`,
    deployer.address
  );
  console.log("Account balance:", (await deployer.getBalance()).toString());
  // deploy Ethereum ERC20 Token
  const TokenFactory = await ethers.getContractFactory(TokenContractName);
  const TokenContract = await TokenFactory.deploy(...ethTokenArguments);
  await TokenContract.deployed();
  console.log("Eth Token Contract deployed to:", TokenContract.address);
  const BridgeContractName = "Bridge";
  console.log(
    `Deploying ${BridgeContractName} contract with the account:`,
    deployer.address
  );
  console.log("Account balance:", (await deployer.getBalance()).toString());
  // deploy Ethereum Bridge Token
  const BridgeFactory = await ethers.getContractFactory(BridgeContractName);
  const bridgePayload = [TokenContract.address, ethBridgeArguments[1]];
  // @ts-ignore
  const BridgeContract = await BridgeFactory.deploy(...bridgePayload);
  await BridgeContract.deployed();
  console.log("Eth Bridge Contract deployed to:", BridgeContract.address);
  // changin bridge address for EthToken contract
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
