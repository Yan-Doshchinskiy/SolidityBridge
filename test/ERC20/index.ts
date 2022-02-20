// eslint-disable-next-line node/no-missing-import
import { ethers, artifacts, waffle } from "hardhat";
import { Artifact } from "hardhat/types";
import ethTokenArguments from "../../arguments/EthToken";
import viewFunctions from "./ERC20viewFunctions";
import bridgeFunctions from "./ERC20bridgeFunctions";
import supplyFunctions from "./ERC20supplyFunctions";

export default describe("ERC20 contract testing", async function () {
  before(async function () {
    this.ethers = ethers;
    [this.owner, this.brridgeAccount, this.randomUser] =
      await ethers.getSigners();
    this.ethTokenArguments = [
      ...ethTokenArguments.slice(0, ethTokenArguments.length - 1),
      this.brridgeAccount.address,
    ];
    this.testMintAmount = "20000000000000000000000000";
    this.testBurnAmount = "5000000000000000000000000";
  });
  beforeEach(async function () {
    const artifactEthToken: Artifact = await artifacts.readArtifact(
      "ERC20ForBridge"
    );
    this.instanceEthToken = await waffle.deployContract(
      this.owner,
      artifactEthToken,
      this.ethTokenArguments
    );
  });
  viewFunctions();
  bridgeFunctions();
  supplyFunctions();
});
