// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract Wallet {
    // User Operations Struct
    struct UserOperation {
        bytes signature;
        uint nonce;
        address destination;
        uint value;
        bytes data;
    }

    address public owner;
    mapping(address => uint) public balances;

    constructor() {
        owner = msg.sender;
    }

    mapping(uint => UserOperation) public userOperations;

    // Events
    event Deposit(address indexed from, uint value);
    event Withdraw(address indexed from, uint value);

    function createUserOperation(
        bytes memory signature,
        uint nonce,
        address destination,
        uint value,
        bytes memory data
    ) public {
        UserOperation memory newOperation = UserOperation(
            signature,
            nonce,
            destination,
            value,
            data
        );
        userOperations[nonce] = newOperation;
    }

    function _recoverAddress(
        bytes memory _signature,
        uint _nonce,
        address _destination,
        uint _value,
        bytes memory _data
    ) internal view returns (address) {
        UserOperation memory operation = userOperations[_nonce];

        operation.signature = _signature;
        operation.nonce = _nonce;
        operation.destination = _destination;
        operation.value = _value;
        operation.data = _data;

        return _destination;
    }

    function executeUserOperation(uint nonce) public {
        UserOperation memory operation = userOperations[nonce];
        require(
            msg.sender ==
                _recoverAddress(
                    operation.signature,
                    operation.nonce,
                    operation.destination,
                    operation.value,
                    operation.data
                ),
            "Invalid signature"
        );

        (bool success, ) = operation.destination.call{value: operation.value}(
            operation.data
        );
        require(success, "Operation execution failed");
    }

    function bundleUserOperations(uint[] memory nonces) public {
        for (uint i = 0; i < nonces.length; i++) {
            UserOperation memory operation = userOperations[nonces[i]];
            require(
                msg.sender ==
                    _recoverAddress(
                        operation.signature,
                        operation.nonce,
                        operation.destination,
                        operation.value,
                        operation.data
                    ),
                "Invalid signature"
            );
            (bool success, ) = operation.destination.call{
                value: operation.value
            }(operation.data);
            require(success, "Operation execution failed");
        }
    }

    function deposit() public payable {
        uint balance = balances[msg.sender];
        balances[msg.sender] = balance + msg.value;
        emit Deposit(msg.sender, msg.value);
    }

    function withdraw(uint amount) public {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
        emit Withdraw(msg.sender, amount);
    }

    function transfer(address recipient, uint amount) public {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        balances[recipient] += amount;
    }

    function balanceOf(address account) public view returns (uint) {
        return balances[account];
    }

    receive() external payable {}

    fallback() external payable {}
}
