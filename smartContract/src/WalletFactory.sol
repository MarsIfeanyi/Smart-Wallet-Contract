// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "./Wallet.sol";

contract WalletFactory {
    Wallet wallet;

    mapping(address => Wallet) public wallets;

    event WalletCreated(address indexed wallet, address indexed owner);

    function createWallet() public returns (address) {
        Wallet newWallet = new Wallet();
        wallets[msg.sender] = newWallet;

        emit WalletCreated(address(newWallet), msg.sender);

        return address(newWallet);
    }

    function getWallet() external view returns (Wallet) {
        return wallets[msg.sender];
    }

    function getWalletAddress() external view returns (address) {
        return address(wallets[msg.sender]);
    }
}
