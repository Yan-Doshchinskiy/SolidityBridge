import { expect } from "chai";
import { BigNumber } from "ethers";

export default (): void => {
  it(`BRIDGE-SWAP: swap function works correctly`, async function (): Promise<void> {
    const oldBalance = await this.instanceEthToken.balanceOf(
      this.user1.address
    );
    await this.instanceEthBridge.connect(this.user1).swap(this.testSwapAmount);
    const newBalance = await this.instanceEthToken.balanceOf(
      this.user1.address
    );
    const resultBalance = BigNumber.from(oldBalance).sub(newBalance);
    expect(resultBalance).to.equal(this.testSwapAmount);
  });
  it(`BRIDGE-SWAP: swap function reverts if amount exceeds the balance`, async function (): Promise<void> {
    await expect(
      this.instanceEthBridge.connect(this.user1).swap(this.testSwapAmountRevert)
    ).to.be.revertedWith("ERC20: burn amount exceeds balance");
  });
  it(`BRIDGE-REDEEM: redeem function works correctly (from ETH to BSC)`, async function (): Promise<void> {
    await this.instanceEthBridge.connect(this.user1).swap(this.testSwapAmount);
    const oldBalance = await this.instanceBscToken.balanceOf(
      this.user1.address
    );
    const payload = [this.user1.address, this.testSwapAmount, this.nonce];
    const payloadHash = this.ethers.utils.solidityKeccak256(
      ["address", "uint256", "uint256"],
      payload
    );
    const payloadBytesArray = this.ethers.utils.arrayify(payloadHash);
    const user1Signature = await this.user1.signMessage(payloadBytesArray);
    const { v, r, s } = this.ethers.utils.splitSignature(user1Signature);
    await this.instanceBscBridge
      .connect(this.gateway)
      .redeem(...payload, v, r, s);
    this.nonce += 1;
    const newBalance = await this.instanceBscToken.balanceOf(
      this.user1.address
    );
    const resultBalance = BigNumber.from(oldBalance).add(this.testSwapAmount);
    expect(newBalance).to.be.equal(resultBalance);
  });
  it(`BRIDGE-REDEEM: redeem function works correctly (from BSC to ETH)`, async function (): Promise<void> {
    await this.instanceBscBridge.connect(this.user1).swap(this.testSwapAmount);
    const oldBalance = await this.instanceEthToken.balanceOf(
      this.user1.address
    );
    const payload = [this.user1.address, this.testSwapAmount, this.nonce];
    const payloadHash = this.ethers.utils.solidityKeccak256(
      ["address", "uint256", "uint256"],
      payload
    );
    const payloadBytesArray = this.ethers.utils.arrayify(payloadHash);
    const user1Signature = await this.user1.signMessage(payloadBytesArray);
    const { v, r, s } = this.ethers.utils.splitSignature(user1Signature);
    await this.instanceEthBridge
      .connect(this.gateway)
      .redeem(...payload, v, r, s);
    this.nonce += 1;
    const newBalance = await this.instanceEthToken.balanceOf(
      this.user1.address
    );
    const resultBalance = BigNumber.from(oldBalance).add(this.testSwapAmount);
    expect(newBalance).to.be.equal(resultBalance);
    const payload2 = [this.user1.address, this.testSwapAmount, this.nonce];
    const payloadHash2 = this.ethers.utils.solidityKeccak256(
      ["address", "uint256", "uint256"],
      payload2
    );
    const payloadBytesArray2 = this.ethers.utils.arrayify(payloadHash2);
    const user1Signature2 = await this.user1.signMessage(payloadBytesArray2);
    const {
      v: v2,
      r: r2,
      s: s2,
    } = this.ethers.utils.splitSignature(user1Signature2);
    await expect(
      this.instanceEthBridge
        .connect(this.gateway)
        .redeem(...payload2, v2, r2, s2)
    ).to.be.ok;
  });
  it(`BRIDGE-REDEEM: redeem function works correctly (Reverted: signature invalid)`, async function (): Promise<void> {
    await this.instanceBscBridge.connect(this.user1).swap(this.testSwapAmount);
    const payload = [this.user1.address, this.testSwapAmount, this.nonce];
    const payloadHash = this.ethers.utils.solidityKeccak256(
      ["address", "uint256", "uint256"],
      payload
    );
    const payloadBytesArray = this.ethers.utils.arrayify(payloadHash);
    const user1Signature = await this.user1.signMessage(payloadBytesArray);
    const { v, r, s } = this.ethers.utils.splitSignature(user1Signature);
    await expect(
      this.instanceEthBridge
        .connect(this.gateway)
        .redeem(this.user2.address, this.testSwapAmount, this.nonce, v, r, s)
    ).to.be.revertedWith("Bridge: signature is invalid");
    this.nonce += 1;
  });
  it(`BRIDGE-REDEEM: redeem function works correctly (Reverted: already reddemed)`, async function (): Promise<void> {
    await this.instanceBscBridge.connect(this.user1).swap(this.testSwapAmount);
    const payload = [this.user1.address, this.testSwapAmount, this.nonce];
    const payloadHash = this.ethers.utils.solidityKeccak256(
      ["address", "uint256", "uint256"],
      payload
    );
    const payloadBytesArray = this.ethers.utils.arrayify(payloadHash);
    const user1Signature = await this.user1.signMessage(payloadBytesArray);
    const { v, r, s } = this.ethers.utils.splitSignature(user1Signature);
    await expect(
      this.instanceEthBridge.connect(this.gateway).redeem(...payload, v, r, s)
    ).to.be.ok;
    await expect(
      this.instanceEthBridge.connect(this.gateway).redeem(...payload, v, r, s)
    ).to.be.revertedWith("Bridge: already redeemed");
  });
};
