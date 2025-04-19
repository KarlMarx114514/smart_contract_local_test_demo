# Dependency
- npm install
# ganache_demo
- change "type": "commonjs" in package.json to "type": "module"
- node script/ganache_compile.js
- npx ganache
- node script/ganache/deploy.js
- node script/ganache/deposit.js
- node script/ganache/withdraw_not_owner.js
- node script/ganache/withdraw_owner.js
# ~~hardhat init~~
- ~~change "type": "module" in package.json to "type": "commonjs"~~
- ~~npx hardhat init~~
- ~~choose Create a TypeScript project, if hardhat asks to install dependency, choose yes~~
- ~~append following in package.json~~
  ~~"scripts": {~~
    ~~"hardhat_test":"npx hardhat test script/hardhat/hardhat_test.ts"~~
  ~~},~~
# hardhat_demo
- change "type": "module" in package.json to "type": "commonjs"
- npm run hardhat_test
