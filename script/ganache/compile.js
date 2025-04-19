import fs from 'fs';
import path from 'path';
import solc from 'solc';

const contractPath = path.resolve('contracts', 'testSmartContract.sol');
const source = fs.readFileSync(contractPath, 'utf8');

const input = {
  language: 'Solidity',
  sources: {
    'testSmartContract.sol': {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['abi', 'evm.bytecode'],
      },
    },
  },
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));
const contract = output.contracts['testSmartContract.sol']['Lock'];

const buildPath = path.resolve('build');
if (!fs.existsSync(buildPath)){
    fs.mkdirSync(buildPath);
}

const abiPath = path.resolve(buildPath, 'testSmartContract_abi.json');
const bytecodePath = path.resolve(buildPath, 'testSmartContract_bytecode.json');
fs.writeFileSync(abiPath, JSON.stringify(contract.abi, null, 2)); // 保存abi
fs.writeFileSync(bytecodePath, contract.evm.bytecode.object); // 保存bytecode

console.log('Contract compiled successfully.');