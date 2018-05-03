# diyblockchain
learn about blockchains by building one
javascript implementation of a blockchain

check out this tutorial for more details: https://www.savjee.be/2017/07/Writing-tiny-blockchain-in-JavaScript/

A public database that is immutable. Once a block has been added to the chain, 
it cannot be changed anymore without invalidating the rest of the chain. 
This is done by combining the hash of all previous blocks to create the hash of the current block


Why mining? AKA Proof-of-Work
1. people can create blocks incredibly fast and spam the blockchain
2. people could tamper with 1 block and then recalculate all the hashes for the blocks after it
3. by combining the two, an attacker can create a bunch of fake blocks and take control of the blockchain in a short time

solution Proof-of-Work basically makes it computationally expensive to spam the blockchain

Miners secure the blockchain by validating transactions, everytime they mine they loop over the whole chain 
to verify that each transaction is valid.
For this service the network rewards them with newly minted coins AKA mining rewards. This also works as 
an inflationary mechanism for the network.
