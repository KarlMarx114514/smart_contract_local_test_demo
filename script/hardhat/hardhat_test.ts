import { time } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { Signer } from "ethers";
import { Lock } from "../../typechain-types/Lock";
  
describe("智能合约测试用例", function () {
    const LOCK_TIME = 1 * 60; // 1分钟转成秒
    let lock: Lock;
    let owner: Signer;
    let otherAccount: Signer;
    before(async function () {
        const unlockTime = (await time.latest()) + LOCK_TIME; // 当前时间加上1分钟
        [owner, otherAccount] = await hre.ethers.getSigners();
        const Lock = await hre.ethers.getContractFactory("Lock");
        lock = await Lock.deploy(unlockTime);
        console.log("合约地址: ", await lock.getAddress());
        console.log("合约部署者: ", await owner.getAddress());
        console.log("---------------------------------");
    });
    it("存款功能测试", async function () {
        console.log("-----------------开始测试存款功能-----------------");
        const contractBalance = await hre.ethers.provider.getBalance(await lock.getAddress());
        console.log("获取存款前合约余额: ", hre.ethers.formatEther(contractBalance), "ETH");
        const ownerBalance = await hre.ethers.provider.getBalance(await owner.getAddress());
        console.log("获取存款前部署者余额: ", hre.ethers.formatEther(ownerBalance), "ETH");

        const depositAmount = hre.ethers.parseEther("100"); // 存款
        const tx = await lock.deposit({ value: depositAmount });
        await tx.wait();

        const contractBalanceAfter = await hre.ethers.provider.getBalance(await lock.getAddress());
        console.log("获取存款后合约余额: ", hre.ethers.formatEther(contractBalanceAfter), "ETH");

        const ownerBalanceAfter = await hre.ethers.provider.getBalance(await owner.getAddress());
        console.log("获取存款后部署者余额: ", hre.ethers.formatEther(ownerBalanceAfter), "ETH");

        expect(contractBalanceAfter).to.equal(depositAmount); // 断言，合约余额等于存款金额
        // expect(ownerBalanceAfter).to.equal(ownerBalance - depositAmount);
    });
    it("取款功能测试（锁定时间内）", async function () {
        console.log("-----------------开始测试取款功能（应拒绝取款）-----------------");
        const tx = lock.withdraw();
        await expect(tx).to.be.revertedWith("You can't withdraw yet");
        console.log("取款失败，锁定时间未到");
    });
    it("取款功能测试（锁定时间后）（部署者）", async function () {
        console.log("-----------------开始测试取款功能（应准许取款）-----------------");
        await time.increase(LOCK_TIME); // 设置时间为锁定时间后
        const tx = await lock.withdraw();
        await tx.wait();

        const contractBalanceAfter = await hre.ethers.provider.getBalance(await lock.getAddress());
        console.log("获取取款后合约余额: ", hre.ethers.formatEther(contractBalanceAfter), "ETH");

        const ownerBalanceAfter = await hre.ethers.provider.getBalance(await owner.getAddress());
        console.log("获取取款后部署者余额: ", hre.ethers.formatEther(ownerBalanceAfter), "ETH");
    });
    it("取款功能测试（锁定时间后）（其他账户）", async function () {
        console.log("-----------------开始测试取款功能（应拒绝取款）-----------------");
        const tx = lock.connect(otherAccount).withdraw();
        await expect(tx).to.be.revertedWith("You aren't the owner");
        console.log("其他账户取款失败，因为不是部署者");
    });
});