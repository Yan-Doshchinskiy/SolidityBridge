//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "./ERC20ForBridge.sol";


contract Bridge is AccessControl {
    using ECDSA for bytes32;

    // roles
    bytes32 private GATEWAY_ROLE = keccak256("GATEWAY_ROLE");

    // tokens
    ERC20ForBridge private tokenERC20; // ERC20 token contract

    // events
    event SwapInitialized(
        address indexed _from,
        uint256 indexed _amount,
        uint256 _timestamp
    );
    event SwapRedeemed(
        address indexed _from,
        uint256 indexed _amount,
        uint256 indexed _nonce,
        uint256 _timestamp
    );

    // variables
    address public gateway; // Address of backend(gateway)

    // mappings
    mapping(bytes32 => bool) redeemedSwaps;

    // constructor
    constructor(address _tokenAddress, address _gateway) {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(GATEWAY_ROLE, _gateway);
        tokenERC20 = ERC20ForBridge(_tokenAddress);
        gateway = _gateway;
    }

    // view
    function getGatewayAddress() external view returns (address) {
        return gateway;
    }

    function getTokenAddress() external view returns (address) {
        return address(tokenERC20);
    }

    // change role
    function changeGatewayRole(address _newAddress)
    external
    onlyRole(DEFAULT_ADMIN_ROLE)
    {
        _revokeRole(GATEWAY_ROLE, gateway);
        _grantRole(GATEWAY_ROLE, _newAddress);
        gateway = _newAddress;
    }

    // initialize swap
    function swap(uint256 _amount) external {
        tokenERC20.burn(msg.sender, _amount);
        emit SwapInitialized(
            msg.sender,
            _amount,
            block.timestamp
        );
    }

    // redeem swap
    function redeem(
        address _from,
        uint256 _amount,
        uint256 _nonce,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external onlyRole(GATEWAY_ROLE) {
        bytes32 signedDataHash = keccak256(
            abi.encodePacked(_from, _amount, _nonce)
        );
        bytes32 messageHash = signedDataHash.toEthSignedMessageHash();
        address messageSender = messageHash.recover(v, r, s);
        require(
            messageSender == _from,
            "Bridge: signature is invalid"
        );
        require(
            !redeemedSwaps[signedDataHash],
            "Bridge: already redeemed"
        );
        tokenERC20.mint(_from, _amount);
        redeemedSwaps[signedDataHash] = true;
        emit SwapRedeemed(msg.sender, _amount, _nonce, block.timestamp);
    }
}