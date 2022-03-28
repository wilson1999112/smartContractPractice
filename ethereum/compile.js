const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);

const MiniDAOPath = path.resolve(__dirname, 'contracts', 'MiniDAO.sol');
const source = fs.readFileSync(MiniDAOPath, 'utf8');
const input = {
    language: 'Solidity',
    sources: {
      'MiniDAO.sol': {
        content: source,
      },
    },
    settings: {
      outputSelection: {
        '*': {
          '*': ['*'],
        },
      },
    },
  };
   
  const output = JSON.parse(solc.compile(JSON.stringify(input))).contracts[
    'MiniDAO.sol'
  ].MiniDAO;

fs.ensureDirSync(buildPath);
fs.outputJsonSync(
    path.resolve(buildPath, 'MiniDAO.json'),
    output
);