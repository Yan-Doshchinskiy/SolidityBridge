//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";


contract ERC20ForBridge is ERC20, AccessControl {
    // roles
    bytes32 private BRIDGE_ROLE = keccak256("BRIDGE_ROLE");

    // variables
    address bridgeAddress;

    // constructor
    constructor(string memory name, string memory symbol, address _bridgeAddress) ERC20(name, symbol) {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(BRIDGE_ROLE, _bridgeAddress);
        bridgeAddress = _bridgeAddress;
    }

    // modifier
    modifier _onlyOwnerOrBridge() {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender) || hasRole(BRIDGE_ROLE, msg.sender), "AccessControl: you don't have access to call this function");
        _;
    }

    // view functions
    function getBridgeAddress() external view returns (address) {
        return bridgeAddress;
    }


    // balance changing functions
    function mint(address _account, uint256 _amount) external _onlyOwnerOrBridge {
        _mint(_account, _amount);
    }

    function burn(address _account, uint256 _amount) external _onlyOwnerOrBridge {
        _burn(_account, _amount);
    }

    // change role
    function changeBridgeRole(address _newBridgeaddress)
    external
    onlyRole(DEFAULT_ADMIN_ROLE)
    {
        _revokeRole(BRIDGE_ROLE, bridgeAddress);
        _grantRole(BRIDGE_ROLE, _newBridgeaddress);
        bridgeAddress = _newBridgeaddress;
    }
}