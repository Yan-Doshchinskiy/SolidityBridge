import { task } from "hardhat/config";
import { Chains } from "../interfaces/enums";

// npx hardhat swapBSC --amount {AMOUNT} --network bscTestnet
task("swapBSC", "swap Bridge method")
  .addParam("amount", "tokens amount")
  .setAction(async ({ amount }: { amount: string }, hre) => {
    const net = await hre.network.name;
    if (net !== Chains.BSC_TEST) {
      throw new Error(`Invalid chain. Expected chain: ${Chains.BSC_TEST}`);
    }
    const Bridge = await hre.ethers.getContractAt(
      "Bridge",
      process.env.BSC_BRIDGE_ADDRESS as string
    );
    await Bridge.swap(amount);
    console.log("swap completed");
  });
