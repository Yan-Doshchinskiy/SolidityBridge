import { task } from "hardhat/config";
import { Chains } from "../interfaces/enums";

// npx hardhat mintBSC --address {ADDRESS} --amount {AMOUNT} --network bscTestnet
task("mintBSC", "mint ERC20 tokens")
  .addParam("address", "address for mint")
  .addParam("amount", "tokens amount")
  .setAction(
    async ({ address, amount }: { address: string; amount: string }, hre) => {
      const net = await hre.network.name;
      if (net !== Chains.BSC_TEST) {
        throw new Error(`Invalid chain. Expected chain: ${Chains.BSC_TEST}`);
      }
      const Token = await hre.ethers.getContractAt(
        "ERC20ForBridge",
        process.env.BSC_TOKEN_ADDRESS as string
      );
      await Token.mint(address, amount);
      console.log("tokens minted");
      const balance = await Token.balanceOf(address);
      console.log("New balance:", balance.toString());
    }
  );
