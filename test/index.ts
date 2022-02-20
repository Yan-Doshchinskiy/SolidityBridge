// // eslint-disable-next-line node/no-missing-import
// import hre, { ethers, artifacts, waffle } from "hardhat";
// import { Artifact } from "hardhat/types";
// import ethTokenArguments from "../arguments/EthToken";
// import bscTokenArguments from "../arguments/BscToken";
//
// describe("contract testing", async function () {
//   before(async function () {
//     this.hre = hre;
//     this.zeroAddress = "0x0000000000000000000000000000000000000000";
//     [this.owner, this.alice, this.bob, this.sharedWallet] =
//       await ethers.getSigners();
//   });
//   before(async function () {
//     this.hre = hre;
//     this.zeroAddress = "0x0000000000000000000000000000000000000000";
//     [this.owner, this.alice, this.bob, this.sharedWallet] =
//       await ethers.getSigners();
//   });
//   beforeEach(async function () {
//     const artifactEthToken: Artifact = await artifacts.readArtifact(
//       "ERC20ForBridge"
//     );
//     this.instanceEthToken = await waffle.deployContract(
//       this.owner,
//       artifactEthToken,
//       ethTokenArguments
//     );
//   });
//   beforeEach(async function () {
//     const artifactBscToken: Artifact = await artifacts.readArtifact(
//       "ERC20ForBridge"
//     );
//     this.instanceBscToken = await waffle.deployContract(
//       this.owner,
//       artifactBscToken,
//       bscTokenArguments
//     );
//   });
// });
