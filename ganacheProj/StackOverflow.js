//https://stackoverflow.com/questions/63262079/how-to-rectify-this-error-typeerror-ethereumtransaction-is-not-a-constructor


const EthereumTx = require('ethereumjs-tx').Transaction

var Web3 = require('web3')

var web3 = new Web3('http://127.0.0.1:7545')

//Setting Receiving and Sending Address

var sendingAddress = '0xa6834FB5f9687045634b23F0BfB6e915813D370d' 
var receivingAddress = '0xa6834FB5f9687045634b23F0BfB6e915813D370d'

//Checking the balance of each account in ether

web3.eth.getBalance(sendingAddress).then(console.log(web3.utils.fromWei('1', 'ether')))

web3.eth.getBalance(receivingAddress).then(console.log(web3.utils.fromWei('1', 'ether')))

//Creating a transaction

var rawTransaction ={
    nonce: web3.utils.toHex(1),
    to: receivingAddress,
    gasPrice: web3.utils.toHex(20000000),
    gasLimit: web3.utils.toHex(30000),
    value: web3.utils.toHex(3),
    data: web3.utils.toHex("")
}

//Sign the Transaction

privateKey = '8f43435aeff548dbdc167d6748c0f2bdb0f93b63a5655f0aa4214f504b01d9d3' 

var senderPrivateKeyHex = new Buffer.from(privateKey,'hex')

var transaction = new EthereumTx(rawTransaction)

transaction.sign(senderPrivateKeyHex)

//Send transaction to the network

var serializedTransaction = transaction.serialize()

web3.eth.sendSignedTransaction(serializedTransaction)