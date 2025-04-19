import Web3 from 'web3';
import fs from 'fs';
import path from 'path';

const buildPath = path.resolve('build');
const abiPath = path.resolve(buildPath, 'testSmartContract_abi.json');
const bytecodePath = path.resolve(buildPath, 'testSmartContract_bytecode.json');
const abi = JSON.parse(fs.readFileSync(abiPath, 'utf8')); // 读取abi
const bytecode = fs.readFileSync(bytecodePath, 'utf8'); // 读取bytecode

const web3 = new Web3('http://127.0.0.1:8545'); // 连接Ganche
/**
 * 将合约部署到Ganache本地网络上
 * @param {number} unlockTime 锁定时间，单位为秒
 */
const deploy = async (unlockTime) => {
  const accounts = await web3.eth.getAccounts();
  const deployerAddress = accounts[0]; // 获取一个账户地址作为部署者(拥有者)地址
  const result = await new web3.eth.Contract(abi)
    .deploy({ data: bytecode, arguments: [unlockTime] })
    .send({ from: deployerAddress, gas: 1500000, gasPrice: '30000000000' });
  console.log('Contract deployed at:', result.options.address);

  const deployedInfo = {
    address: result.options.address,
    abi,
    deployer: deployerAddress,
  };
  fs.writeFileSync('deployedAddress_testSmartContract.json', JSON.stringify(deployedInfo, null, 2));
  console.log('Contract address, ABI, and deployer address saved');
};

const unlockTime = Math.floor(Date.now() / 1000) + 60; // 锁定时间为当前时间加60秒
deploy(unlockTime);