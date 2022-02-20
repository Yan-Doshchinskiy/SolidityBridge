import { expect } from "chai";

export default (): void => {
  it(`ERC20-VIEW: Name equal to constructor argument`, async function (): Promise<void> {
    const name = await this.instanceEthToken.name();
    expect(name).to.equal(this.ethTokenArguments[0]);
  });
  it(`ERC20-VIEW: Symbol equal to constructor argument`, async function (): Promise<void> {
    const symbol = await this.instanceEthToken.symbol();
    expect(symbol).to.equal(this.ethTokenArguments[1]);
  });
};
