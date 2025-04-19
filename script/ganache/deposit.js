import Web3 from 'web3';
import fs from 'fs';

const deployedInfo = JSON.parse(fs.readFileSync('deployedAddress_testSmartContract.json', 'utf-8'));
const { address, abi } = deployedInfo;

const web3 = new Web3('http://127.0.0.1:8545');
/**
 * 调用合约的deposit方法向合约地址存入10个以太币
 * @returns {Promise<void>}
 */
const interact = async () => {
  const contract = new web3.eth.Contract(abi, address);

  const owner = await contract.methods.owner().call();
  console.log('Contract owner address:', owner);

  const ownerBalanceBefore = await web3.eth.getBalance(owner);
  const contractBalanceBefore = await web3.eth.getBalance(address);
  console.log('存款前合约拥有者的余额', web3.utils.fromWei(ownerBalanceBefore, 'ether'));
  console.log('存款前合约的余额:', web3.utils.fromWei(contractBalanceBefore, 'ether'));

  const receipt = await contract.methods.deposit().send({from: owner, value: web3.utils.toWei("10", "ether")}); //用合约拥有者的地址调用deposit方法
  console.log('交易成功，交易事件详情:', receipt.events);
  console.log('交易哈希:', receipt.transactionHash);

  const ownerBalanceAfter = await web3.eth.getBalance(owner);
  const contractBalanceAfter = await web3.eth.getBalance(address);
  console.log('存款后合约拥有者的余额:', web3.utils.fromWei(ownerBalanceAfter, 'ether'));
  console.log('存款后合约的余额:', web3.utils.fromWei(contractBalanceAfter, 'ether'));
};

await interact();