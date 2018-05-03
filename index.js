//javascript implementation of a blockchain

// check out this tutorial for more details: https://www.savjee.be/2017/07/Writing-tiny-blockchain-in-JavaScript/

// A public database that is immutable. Once a block has been added to the chain, 
// it cannot be changed anymore without invalidating the rest of the chain. 
// This is done by combining the hash of all previous blocks to create the hash of the current block


// Why mining? AKA Proof-of-Work
// 1. people can create blocks incredibly fast and spam the blockchain
// 2. people could tamper with 1 block and then recalculate all the hashes for the blocks after it
// 3. by combining the two, an attacker can create a bunch of fake blocks and take control of the blockchain in a short time

//solution Proof-of-Work basically makes it computationally expensive to spam the blockchain

// Miners secure the blockchain by validating transactions, everytime they mine they loop over the whole chain 
// to verify that each transaction is valid.
// For this service the network rewards them with newly minted coins AKA mining rewards. This also works as 
// an inflationary mechanism for the network.

const SHA256 = require("crypto-js/sha256");

//this is the form of a transaction
class Transaction{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

class Block {
    constructor(timestamp, transactions, previousHash = '') {
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
    }

    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log("BLOCK MINED: " + this.hash);
    }
}


class Blockchain{
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    createGenesisBlock() {
        return new Block(Date.parse("2017-01-01"), [], "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    minePendingTransactions(miningRewardAddress){
        let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
        block.mineBlock(this.difficulty);

        console.log('Block successfully mined!');
        this.chain.push(block);

        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];
    }

    createTransaction(transaction){
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address){
        let balance = 0;

        for(const block of this.chain){
            for(const trans of block.transactions){
                if(trans.fromAddress === address){
                    balance -= trans.amount;
                }

                if(trans.toAddress === address){
                    balance += trans.amount;
                }
            }
        }

        return balance;
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }

        return true;
    }
}

let topeCoin = new Blockchain();

//first create some transactions
//and push them into the array of pending transactions
topeCoin.createTransaction(new Transaction('address1', 'address2', 100));
topeCoin.createTransaction(new Transaction('address2', 'address1', 50));

// the mining process never stops, as soon as a block is mined, miners grab the next batch of pending transactions
console.log('\n Starting the miner...');
topeCoin.minePendingTransactions('olus-address');

//once mining is complete all balances get settles
console.log('\nBalance of olu is', topeCoin.getBalanceOfAddress('olus-address'));

//and the process begins again
console.log('\n Starting the miner again...');
topeCoin.minePendingTransactions('olus-address');

console.log('\nBalance of olu is', topeCoin.getBalanceOfAddress('olus-address'));