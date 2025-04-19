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

  const accounts = await web3.eth.getAccounts();
  const caller = accounts[2]; //获取一个账户地址作为调用者地址
  try{
    const receipt = await contract.methods.withdraw().send({ from: caller }); //用不是合约拥有者的地址调用withdraw方法
    const event = receipt.events;
    console.log('交易成功，交易事件详情:', event);
    console.log('交易哈希:', receipt.transactionHash);
  } catch (error) {
    console.error('交易失败:', error.message);
  }
};

interact();