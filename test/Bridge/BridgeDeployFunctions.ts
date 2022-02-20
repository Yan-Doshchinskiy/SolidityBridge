import { expect } from "chai";

export default (): void => {
  it(`BRIDGE-DEPLOY: tokens ERC20 deployed correctly`, async function (): Promise<void> {
    expect(await this.instanceEthToken.getBridgeAddress()).to.be.equal(
      this.instanceEthBridge.address
    );
    expect(await this.instanceBscToken.getBridgeAddress()).to.be.equal(
      this.instanceBscBridge.address
    );
    expect(await this.instanceEthToken.name()).to.be.equal(
      this.ethTokenArguments[0]
    );
    expect(await this.instanceBscToken.name()).to.be.equal(
      this.bscTokenArguments[0]
    );
    expect(await this.instanceEthToken.symbol()).to.be.equal(
      this.ethTokenArguments[1]
    );
    expect(await this.instanceBscToken.symbol()).to.be.equal(
      this.bscTokenArguments[1]
    );
  });
  it(`BRIDGE-DEPLOY: Bridge contracts deployed correctly`, async function (): Promise<void> {
    expect(await this.instanceEthBridge.getTokenAddress()).to.be.equal(
      this.ethBridgeArguments[0]
    );
    expect(await this.instanceBscBridge.getTokenAddress()).to.be.equal(
      this.bscBridgeArguments[0]
    );
    expect(await this.instanceEthBridge.getGatewayAddress()).to.be.equal(
      this.ethBridgeArguments[1]
    );
    expect(await this.instanceBscBridge.getGatewayAddress()).to.be.equal(
      this.bscBridgeArguments[1]
    );
  });
};
