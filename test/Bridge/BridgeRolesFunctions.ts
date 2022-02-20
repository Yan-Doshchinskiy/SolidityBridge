import { expect } from "chai";

export default (): void => {
  it(`BRIDGE-ROLES: GatewayAddress equal to constructor argument`, async function (): Promise<void> {
    const gatewayAddress = await this.instanceEthBridge.getGatewayAddress();
    expect(gatewayAddress).to.equal(this.gateway.address);
  });
  it(`BRIDGE-ROLES: Only admin can change gateway address (completed)`, async function (): Promise<void> {
    const gatewayAddress = await this.instanceEthBridge.getGatewayAddress();
    expect(gatewayAddress).to.equal(this.gateway.address);
    await this.instanceEthBridge.changeGatewayRole(this.user1.address);
    const newAddress = await this.instanceEthBridge.getGatewayAddress();
    expect(newAddress).to.equal(this.user1.address);
  });
  it(`BRIDGE-ROLES: Only admin can change gateway address (reverted)`, async function (): Promise<void> {
    await expect(
      this.instanceEthBridge
        .connect(this.user2)
        .changeGatewayRole(this.user1.address)
    ).to.be.revertedWith("AccessControl:");
  });
};
