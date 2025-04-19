import Web3 from 'web3';
import fs from 'fs';

const deployedInfo = JSON.parse(fs.readFileSync('deployedAddress_testSmartContract.json', 'utf-8'));
const { address, abi } = deployedInfo;

const web3 = new Web3('http://127.0.0.1:8545');
/**
 * 调用合约的withdraw方法取出合约中所有的ETH
 * @returns {Promise<void>}
 */
const interact = async () => {
  const contract = new web3.eth.Contract(abi, address);

  const owner = await contract.methods.owner().call();
  console.log('Contract owner address:', owner);

  const ownerBalanceBefore = await web3.eth.getBalance(owner);
  const contractBalanceBefore = await web3.eth.getBalance(address);
  console.log('取款前合约拥有者的余额', web3.utils.fromWei(ownerBalanceBefore, 'ether'));
  console.log('取款前合约的余额:', web3.utils.fromWei(contractBalanceBefore, 'ether'));
  try{
    const receipt = await contract.methods.withdraw().send({ from: owner }); //用合约拥有者的地址调用withdraw方法
    const event = receipt.events;
    console.log('交易成功，交易事件详情:', event);
    console.log('交易哈希:', receipt.transactionHash);
  } catch (error) {
    console.error('交易失败:', error.message);
  }
  const ownerBalanceAfter = await web3.eth.getBalance(owner);
  const contractBalanceAfter = await web3.eth.getBalance(address);
  console.log('取款后合约拥有者的余额:', web3.utils.fromWei(ownerBalanceAfter, 'ether'));
  console.log('取款后合约的余额:', web3.utils.fromWei(contractBalanceAfter, 'ether'));
};

interact();