import { task } from "hardhat/config";
import { Chains } from "../interfaces/enums";

// npx hardhat swapETH --amount {AMOUNT} --network rinkeby
task("swapETH", "swap Bridge method")
  .addParam("amount", "tokens amount")
  .setAction(async ({ amount }: { amount: string }, hre) => {
    const net = await hre.network.name;
    if (net !== Chains.RINKEBY) {
      throw new Error(`Invalid chain. Expected chain: ${Chains.RINKEBY}`);
    }
    const Bridge = await hre.ethers.getContractAt(
      "Bridge",
      process.env.ETH_BRIDGE_ADDRESS as string
    );
    await Bridge.swap(amount);
    console.log("swap completed");
  });
