import { task } from "hardhat/config";
import { Chains } from "../interfaces/enums";

// npx hardhat mintETH --address {ADDRESS} --amount {AMOUNT} --network rinkeby
task("mintETH", "mint ERC20 tokens")
  .addParam("address", "address for mint")
  .addParam("amount", "tokens amount")
  .setAction(
    async ({ address, amount }: { address: string; amount: string }, hre) => {
      const net = await hre.network.name;
      if (net !== Chains.RINKEBY) {
        throw new Error(`Invalid chain. Expected chain: ${Chains.RINKEBY}`);
      }
      const Token = await hre.ethers.getContractAt(
        "ERC20ForBridge",
        process.env.ETH_TOKEN_ADDRESS as string
      );
      await Token.mint(address, amount);
      console.log("tokens minted");
      const balance = await Token.balanceOf(address);
      console.log("New balance:", balance.toString());
    }
  );
