// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

interface IWallet {
    function deposit() external payable;

    function withdraw(uint amount) external;

    function balanceOf(address account) external view returns (uint);

    receive() external payable;

    fallback() external payable;
}
