var Web3 = require('web3');

var url = 'https://21vDcfUIUBCsCXiw9vprVPnMNGa:d93a3866a460b1e973dab3d9e7b5ef75@eth2-beacon-mainnet.infura.io'

var web3 = new Web3(url)

web3

var address= '0x4Ddc2D193948926D02f9B1fE9e1daa0718270ED5'

web3.eth.getBalance(address, (err,bal) => {balance = bal})

balance


//contracts lesson

var contractAddress= '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0'
var contract = new web3.eth.Contract(abi, contractAddress)


contract.methods.name()
contract.methods.name().call((err, result) => { console.log(result )})
contract.methods.symbol().call((err, result) => { console.log(result )})
contract.methods.totalSupply().call((err, result) => { console.log(result )})