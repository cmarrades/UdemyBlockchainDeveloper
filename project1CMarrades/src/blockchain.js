/**
 *                          Blockchain Class
 *  The Blockchain class contain the basics functions to create your own private blockchain
 *  It uses libraries like `crypto-js` to create the hashes for each block and `bitcoinjs-message` 
 *  to verify a message signature. The chain is stored in the array
 *  `this.chain = [];`. Of course each time you run the application the chain will be empty because and array
 *  isn't a persisten storage method.
 *  
 */

const SHA256 = require('crypto-js/sha256');
const BlockClass = require('./block.js');
const bitcoinMessage = require('bitcoinjs-message');

class Blockchain {

    /**
     * Constructor of the class, you will need to setup your chain array and the height
     * of your chain (the length of your chain array).
     * Also everytime you create a Blockchain class you will need to initialized the chain creating
     * the Genesis Block.
     * The methods in this class will always return a Promise to allow client applications or
     * other backends to call asynchronous functions.
     */
    constructor() {
        this.chain = [];
        this.height = -1;
        this.initializeChain();
    }

    /**
     * This method will check for the height of the chain and if there isn't a Genesis Block it will create it.
     * You should use the `addBlock(block)` to create the Genesis Block
     * Passing as a data `{data: 'Genesis Block'}`
     */
    async initializeChain() {
        if (this.height === -1)        
        {
            let genesysBlock = new BlockClass.Block({data:'Genesis Block'});
            await this._addBlock(genesysBlock);
            console.log('Genesys Block initialized');

        }
    }

    /**
     * Utility method that return a Promise that will resolve with the height of the chain
     */
    getChainHeight() {
        let self = this;
        return new Promise((resolve, reject) => {
            resolve(self.chain.length);
        });
    }

    /**
     * _addBlock(block) will store a block in the chain
     * @param {*} block 
     * The method will return a Promise that will resolve with the block added
     * or reject if an error happen during the execution.
     * You will need to check for the height to assign the `previousBlockHash`,
     * assign the `timestamp` and the correct `height`...At the end you need to 
     * create the `block hash` and push the block into the chain array. Don't for get 
     * to update the `this.height`
     * Note: the symbol `_` in the method name indicates in the javascript convention 
     * that this method is a private method. 
     */
    _addBlock(block) {
        let self = this;
        return new Promise(async (resolve, reject) => {
            let height = self.chain.length;
            //CMarrades: This is not threadsafe? getChannelHeight could return same height on 2 requests at same time,
            if (self.chain.length > 0){
                let isValid = await self.validateChain();
                if (!isValid) {reject(new Error('BlockChain not valid'))}
                block.previousBlockHash = self.chain[self.chain.length -1].hash;
            }


            block.time =  new Date().getTime().toString().slice(0,-3);
            block.height = height;

            console.log(`Current Height ${self.chain.length} `);

            block.hash = SHA256(JSON.stringify(block)).toString();
            
            self.chain.push(block);
            self.height = height + 1;

            console.log(`Block added. current Height ${height +1} `);
            resolve(block);
            //self.validateChain.then(isValid ? resolve("block added") : reject("Blockchain data has been tampered"));
        }).catch(error => console.log('[ERROR] ', error)) ;
    }

    /**
     * The requestMessageOwnershipVerification(address) method
     * will allow you  to request a message that you will use to
     * sign it with your Bitcoin Wallet (Electrum or Bitcoin Core)
     * This is the first step before submit your Block.
     * The method return a Promise that will resolve with the message to be signed
     * @param {*} address 
     */
    requestMessageOwnershipVerification(address) {
        return new Promise((resolve) => {
            var unsignedMessage = `${address}:${new Date().getTime().toString().slice(0,-3)}:starRegistry`;
            resolve(unsignedMessage)
        });
    }

    /**
     * The submitStar(address, message, signature, star) method
     * will allow users to register a new Block with the star object
     * into the chain. This method will resolve with the Block added or
     * reject with an error.
     * Algorithm steps:
     * 1. Get the time from the message sent as a parameter example: `parseInt(message.split(':')[1])`
     * 2. Get the current time: `let currentTime = parseInt(new Date().getTime().toString().slice(0, -3));`
     * 3. Check if the time elapsed is less than 5 minutes
     * 4. Veify the message with wallet address and signature: `bitcoinMessage.verify(message, address, signature)`
     * 5. Create the block and add it to the chain
     * 6. Resolve with the block added.
     * @param {*} address 
     * @param {*} message 
     * @param {*} signature 
     * @param {*} star 
     */
    submitStar(address, message, signature, star) {
        let self = this;
        return new Promise(async (resolve, reject) => {
            let requestTime = parseInt(message.split(':')[1]);
            let currentTime = parseInt(new Date().getTime().toString().slice(0, -3));
            let  timeDifferenceExpired = (currentTime - requestTime) >= (5 * 60);
            //if (timeDifferenceExpired) reject(new Error('Time difference expired between signatures'));
            if (!bitcoinMessage.verify(message, address, signature)) reject(new Error('Invalid message.'));
            let block = new BlockClass.Block({ star }); 
            block.ownerAdress = address;
            block = await self._addBlock(block)
            console.log("added block");
            resolve(block);     
        });
    }

    /**
     * This method will return a Promise that will resolve with the Block
     *  with the hash passed as a parameter.
     * Search on the chain array for the block that has the hash.
     * @param {*} hash 
     */
    getBlockByHash(hash) {
        let self = this;
        return new Promise((resolve, reject) => {
            resolve(self.chain.filter(block => block.hash === hash)[0]);
        });
    }

    /**
     * This method will return a Promise that will resolve with the Block object 
     * with the height equal to the parameter `height`
     * @param {*} height 
     */
    getBlockByHeight(height) {
        let self = this;
        return new Promise((resolve, reject) => {
            let block = self.chain.filter(p => p.height === height)[0];
            if(block){
                resolve(block);
            } else {
                resolve(null);
            }
        });
    }

    /**
     * This method will return a Promise that will resolve with an array of Stars objects existing in the chain 
     * and are belongs to the owner with the wallet address passed as parameter.
     * Remember the star should be returned decoded.
     * @param {*} address 
     */
    // getStarsByWalletAddress (address) {
    //     let self = this;
    //     let decodedStars = [];
    //     return new Promise((resolve, reject) => {
    //         let filteredBlocks = self.chain.filter(block => block.owner === address);
    //         if (ownedBlocks.length === 0) resolve (decodedStars)
    //         console.log(`${filteredBlocks.count} blocks found for address`);
    //         decodedStars = filteredBlocks.map(block => JSON.parse(hex2ascii(block.body)));
    //         decodedStars ? resolve(decodedStars) : reject(new Error('Error decoding stars.'));
    //     }).catch(error => console.log('[ERROR] ', error)) ;
    // }

    getStarsByWalletAddress (address) {
        let self = this;
        let stars = [];

        return new Promise(async (resolve, reject) => {
            let isValid = await self.validateChain();
            if (!isValid) reject(new Error('BlockChain not valid'))
            
            let ownedBlocks = self.chain.filter(block => block.ownerAdress === address);
            //ownedBlocks = self.chain; 
            if (ownedBlocks.length === 0) reject(new Error('Address not found.'));
            
            //stars = ownedBlocks.map(block => JSON.parse(hex2ascii(block.body)));
            stars = ownedBlocks.map(block => Buffer.from(block.body).toString('ascii'));
            
            stars ? resolve(stars) : reject(new Error('Failed to return stars.'));
        }).catch(error => console.log('[ERROR] *ck ', error));
    }

    /**
     * This method will return a Promise that will resolve with the list of errors when validating the chain.
     * Steps to validate:
     * 1. You should validate each block using `validateBlock`
     * 2. Each Block should check the with the previousBlockHash
     */
    validateChain() {
        let self = this;
        let errorLog = [];
        let isValid;
        return new Promise(async (resolve, reject) => {
            for (let block of self.chain) {
                console.log("Iteration")
                if (await block.validate()) {
                    if (block.height > 0) { // skip Genesys
                        let prevBlock = self.chain.filter(b => b.height === block.height - 1)[0];
                        if (block.previousBlockHash !== prevBlock.hash) {  //commpare BlockN with BlockN-1 hash
                            errorLog.push(new Error(`Invalid hash in block #${block.height}. not matching previous hash  for block #${block.height - 1}.`));
                        }
                    }
                } else {
                    errorLog.push(new Error(`Invalid block #${block.height}: ${block.hash}`))
                }
            }

            isValid = (errorLog.length === 0);
            if (!isValid)
            {
                console.log("Blockchain is not valid. Errors:")
                errorLog.forEach(error => console.log('Validation error:', error));
            }
            
            console.log(`Length: ${errorLog.length}`)
            console.log(`Blockchain valid:${isValid}`)
            resolve(isValid);
        });
    }

}

module.exports.Blockchain = Blockchain;   