import { task } from "hardhat/config";
import { Chains } from "../interfaces/enums";

type redeemPayload = {
  from: string;
  amount: string;
  nonce: number;
  v: number;
  r: string;
  s: string;
};

// npx hardhat redeemETH --from {FROM_ADDRESS} --amount {AMOUNT} --nonce {NONCE} --v {V} --r {R} --s {S} --network rinkeby
task("redeemETH", "redeem Bridge method")
  .addParam("from", "tokens owner address")
  .addParam("amount", "tokens amount")
  .addParam("nonce", "gateway nonce")
  .addParam("v", "v_signature")
  .addParam("r", "r_signature")
  .addParam("s", "s_signature")
  .setAction(async ({ from, amount, nonce, v, r, s }: redeemPayload, hre) => {
    const net = await hre.network.name;
    if (net !== Chains.RINKEBY) {
      throw new Error(`Invalid chain. Expected chain: ${Chains.RINKEBY}`);
    }
    const Bridge = await hre.ethers.getContractAt(
      "Bridge",
      process.env.ETH_BRIDGE_ADDRESS as string
    );
    await Bridge.redeem(from, amount, nonce, v, r, s);
    console.log("swap completed");
  });
