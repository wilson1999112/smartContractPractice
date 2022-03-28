const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const { abi, evm } = require('../ethereum/build/MiniDAO.json');

const provider = new HDWalletProvider(
    'access clutch chuckle guide blame torch length senior curtain all manage priority',
    'https://rinkeby.infura.io/v3/523b5e56c4e043b7a203b1a5021b9925'
);

const web3 = new Web3(provider);
const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    console.log('Attempting to deploy from account', accounts[0])
    const result = await new web3.eth.Contract(abi)
        .deploy({ data: evm.bytecode.object })
        .send({ gas: '20000000', from: accounts[0]});
    
    // console.log(JSON.stringify(abi));
    console.log('Contract deployed to', result.options.address);
    provider.engine.stop();
};
deploy();