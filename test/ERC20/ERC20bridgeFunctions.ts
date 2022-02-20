import { expect } from "chai";

export default (): void => {
  it(`ERC20-BRIDGE: BridgeAddress equal to constructor argument`, async function (): Promise<void> {
    const bridgeAddress = await this.instanceEthToken.getBridgeAddress();
    expect(bridgeAddress).to.equal(this.ethTokenArguments[2]);
  });
  it(`ERC20-BRIDGE: Only owner can change contract BRIDGE_ROLE (completed)`, async function (): Promise<void> {
    const newAddress = this.randomUser.address;
    await this.instanceEthToken.changeBridgeRole(newAddress);
    const bridgeAddress = await this.instanceEthToken.getBridgeAddress();
    expect(bridgeAddress).to.equal(newAddress);
  });
  it(`ERC20-BRIDGE: Only owner can change contract BRIDGE_ROLE (reverted)`, async function (): Promise<void> {
    const newAddress = this.randomUser.address;
    await expect(
      this.instanceEthToken
        .connect(this.randomUser)
        .changeBridgeRole(newAddress)
    ).to.be.revertedWith("AccessControl:");
  });
};
