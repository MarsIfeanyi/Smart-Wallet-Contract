// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.7.0 <0.9.0;

import "forge-std/Script.sol";
import "../src/WalletFactory.sol";

contract WalletFactoryScript is Script {
    WalletFactory walletFactory;

    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        walletFactory = new WalletFactory();

        walletFactory.createWallet();

        vm.stopBroadcast();
    }
}
