// eslint-disable-next-line node/no-missing-import
import hre, { ethers, artifacts, waffle } from "hardhat";
import { Artifact } from "hardhat/types";
import ethTokenArguments from "../../arguments/EthToken";
import bscTokenArguments from "../../arguments/BscToken";
import bridgeRolesFunctions from "./BridgeRolesFunctions";
import bridgeSwapFunctions from "./BridgeSwapFunctions";
import bridgeDeployFunctions from "./BridgeDeployFunctions";

export default describe("ERC20 contract testing", async function () {
  before(async function () {
    this.ethers = ethers;
    this.hre = hre;
    [
      this.ownerETH,
      this.ownerBSC,
      this.ownerBridgeETH,
      this.ownerBridgeBSC,
      this.user1,
      this.user2,
      this.gateway,
    ] = await ethers.getSigners();
    this.testSwapAmount = "200000000000000000000";
    this.testSwapAmountRevert = "9000000000000000000000";
    this.testMintAmount = "1000000000000000000000";
  });
  beforeEach(async function () {
    // initial nonce
    this.nonce = 0;
    // deploy Ethereum ERC20 Token
    const artifactEthToken: Artifact = await artifacts.readArtifact(
      "ERC20ForBridge"
    );
    this.ethTokenArguments = ethTokenArguments;
    this.instanceEthToken = await waffle.deployContract(
      this.ownerETH,
      artifactEthToken,
      this.ethTokenArguments
    );

    // deploy Ethereum Bridge Contract
    const artifactEthBridge: Artifact = await artifacts.readArtifact("Bridge");
    this.ethBridgeArguments = [
      this.instanceEthToken.address,
      this.gateway.address,
    ];
    this.instanceEthBridge = await waffle.deployContract(
      this.ownerBridgeETH,
      artifactEthBridge,
      this.ethBridgeArguments
    );

    // change Token bridge address
    await this.instanceEthToken.changeBridgeRole(
      this.instanceEthBridge.address
    );
    await this.instanceEthToken.mint(this.user1.address, this.testMintAmount);
    await this.instanceEthToken.mint(this.user2.address, this.testMintAmount);
  });
  beforeEach(async function () {
    // initial nonce
    this.nonce = 0;
    // deploy BSC ERC20 Token
    const artifactBscToken: Artifact = await artifacts.readArtifact(
      "ERC20ForBridge"
    );
    this.bscTokenArguments = bscTokenArguments;
    this.instanceBscToken = await waffle.deployContract(
      this.ownerBSC,
      artifactBscToken,
      this.bscTokenArguments
    );

    // deploy BSC Bridge Contract
    const artifactBscBridge: Artifact = await artifacts.readArtifact("Bridge");
    this.bscBridgeArguments = [
      this.instanceBscToken.address,
      this.gateway.address,
    ];
    this.instanceBscBridge = await waffle.deployContract(
      this.ownerBridgeBSC,
      artifactBscBridge,
      this.bscBridgeArguments
    );

    // change Token bridge address
    await this.instanceBscToken.changeBridgeRole(
      this.instanceBscBridge.address
    );
    await this.instanceBscToken.mint(this.user1.address, this.testMintAmount);
    await this.instanceBscToken.mint(this.user2.address, this.testMintAmount);
  });
  bridgeDeployFunctions();
  bridgeRolesFunctions();
  bridgeSwapFunctions();
});
