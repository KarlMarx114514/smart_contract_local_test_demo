// SPDX-License-Identifier: Unlicense
// 上面这一行是为了避免编辑器警告
pragma solidity ^0.8.9;

contract Lock {
    uint public unlockTime; // 锁定时间
    address payable public owner; // 合约拥有者地址

    event Deposit(uint amount, uint when);
    event Withdrawal(uint amount, uint when);

    constructor(uint _unlockTime) payable {
        // 构造函数，设置锁定时间和合约拥有者地址
        require(
            block.timestamp < _unlockTime, // 锁定时间必须设定在未来
            "Unlock time should be in the future"
        );

        unlockTime = _unlockTime;
        owner = payable(msg.sender);
    }

    function deposit() public payable {
        require(msg.value > 0, "Deposit must be greater than 0"); // 要求存款金额大于0
        emit Deposit(msg.value, block.timestamp); // 触发存款事件
    }

    function withdraw() public {
        require(block.timestamp >= unlockTime, "You can't withdraw yet"); // 要求已经过了锁定时间
        require(msg.sender == owner, "You aren't the owner"); // 要求调用者是合约拥有者
        owner.transfer(address(this).balance); // 将合约余额转给拥有者
        emit Withdrawal(address(this).balance, block.timestamp); // 触发取款事件
    }
}