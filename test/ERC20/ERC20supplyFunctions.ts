import { expect } from "chai";
import { BigNumber } from "ethers";

export default (): void => {
  it(`ERC20-SUPPLY: owner can call mint function (completed)`, async function (): Promise<void> {
    const oldBalance = await this.instanceEthToken.balanceOf(
      this.randomUser.address
    );
    await this.instanceEthToken.mint(
      this.randomUser.address,
      this.testMintAmount
    );
    const newBalance = await this.instanceEthToken.balanceOf(
      this.randomUser.address
    );
    await expect(newBalance).to.be.equal(oldBalance + this.testMintAmount);
  });
  it(`ERC20-SUPPLY: bridge account can call mint function (completed)`, async function (): Promise<void> {
    const oldBalance = await this.instanceEthToken.balanceOf(
      this.randomUser.address
    );
    await this.instanceEthToken
      .connect(this.brridgeAccount)
      .mint(this.randomUser.address, this.testMintAmount);
    const newBalance = await this.instanceEthToken.balanceOf(
      this.randomUser.address
    );
    await expect(newBalance).to.be.equal(oldBalance + this.testMintAmount);
  });
  it(`ERC20-SUPPLY: only owner or bridge accounts can call mint function (reverted)`, async function (): Promise<void> {
    await expect(
      this.instanceEthToken
        .connect(this.randomUser)
        .mint(this.randomUser.address, this.testMintAmount)
    ).to.be.revertedWith("AccessControl:");
  });
  it(`ERC20-SUPPLY: owner can call burn function (completed)`, async function (): Promise<void> {
    await this.instanceEthToken.mint(
      this.randomUser.address,
      this.testMintAmount
    );
    const oldBalance = await this.instanceEthToken.balanceOf(
      this.randomUser.address
    );
    await this.instanceEthToken.burn(
      this.randomUser.address,
      this.testBurnAmount
    );
    const newBalance = await this.instanceEthToken.balanceOf(
      this.randomUser.address
    );
    const resultBalance = BigNumber.from(oldBalance).sub(this.testBurnAmount);
    await expect(newBalance).to.be.equal(resultBalance);
  });
  it(`ERC20-SUPPLY: bridge can call burn function (completed)`, async function (): Promise<void> {
    await this.instanceEthToken.mint(
      this.randomUser.address,
      this.testMintAmount
    );
    const oldBalance = await this.instanceEthToken.balanceOf(
      this.randomUser.address
    );
    await this.instanceEthToken
      .connect(this.brridgeAccount)
      .burn(this.randomUser.address, this.testBurnAmount);
    const newBalance = await this.instanceEthToken.balanceOf(
      this.randomUser.address
    );
    const resultBalance = BigNumber.from(oldBalance).sub(this.testBurnAmount);
    await expect(newBalance).to.be.equal(resultBalance);
  });
  it(`ERC20-SUPPLY: only owner or bridge accounts can call burn function (reverted)`, async function (): Promise<void> {
    await this.instanceEthToken.mint(
      this.randomUser.address,
      this.testMintAmount
    );
    await expect(
      this.instanceEthToken
        .connect(this.randomUser.address)
        .burn(this.randomUser.address, this.testBurnAmount)
    ).to.be.revertedWith("AccessControl:");
  });
};
