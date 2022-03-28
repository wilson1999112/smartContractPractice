import web3 from './web3';
const { abi } = require('./build/MiniDAO.json');

const instance = new web3.eth.Contract(
    abi,
    '0x785a9e3F467FEB01388481e228a31984c08ce7fc'
);

export default instance;