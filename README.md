# Kalos

![Kalos logo](https://i.ibb.co/HGTp4z7/Kalos-logo.png)

An easy way to create CSS artwork NFTs

## Overview

In Ancient Greek, the word **καλός (kalos)** means 'beautiful'. And there is a derived word in English - **'kaleidoscope'**, an optical instrument, by shaking which you could create virtually infinite geometry patterns. Now in Kalos, you could exactly do the same thing, in a more futuristic way! With the top-rated templates and various customization options (e.g. pixel / angle / percentage / color), you could create astonishing CSS artworks with just one click. Furthermore, your CSS artworks will be minted as NFTs and stored in the Ethereum blockchain, FOREVER! 🥳

## Usage

Once you visit our homepage, all active artworks will be listed at a reverse chronological order. We suggest you to connect to your own wallet first, otherwise you will not be able to create artwork and view those owned ones. If you don't have any Ether, you could go to the faucet to get some by clicking on 'Get some ETH' button.

After connecting your wallet to our app, you could create artwork by clicking on 'Create My Artwork' button. We offer you some beautiful CSS templates (they all look extremely charming by default). You could customize the color, angle, pixel or percentage so as to reflect your own aesthetic taste. For those lazy guys, we even provide an 'Randomize' button, where you could customize your artwork with just one click. When you finalize your artwork by clicking on 'Save & Mint', your CSS artwork and its metadata will be first uploaded to IPFS storage network, and then we will mint an unique NFT token on the Ethereum blockchain, which makes a record of your artwork URI.

You could find all of your artworks on the tab 'My Artworks'. When clicking on one of these thumbnails, you will see details of the specific artwork. Typically, there are 4 buttons under the large image:

- Tip: You could send some ETH to any artwork you like, and the owner of it will have the privilege to withdraw your tip. You could even tip on your own artwork. Why not? ;)
- Withdraw: Once your artwork gets tip from someone, you could withdraw it immediately, at a specified amount.
- Transfer: You could transfer your artwork to anyone (except the zero-address or yourself), but remember, you will no longer be able to withdraw the tip since it belongs to the current owner of the artwork.
- Destroy: This is a dangerous & irreversible operation. Your artwork will no longer exist on blockchain once you destroy it. Luckily, all the tip on the artwork will be transferred to you before the destruction.

## Notice

Our WebApp is still in testing phase, so it is only available on **Goerli testnet**, not the Ethereum mainnet. Make sure you connect to Goerli before using our WebApp. A future release on the mainnet will be soon once the testing has passed.

## Code Architecture

For the smart contract, we use Hardhat to make deployment and run unit tests. Thanks to the OpenZeppelin Contracts, we could start our work based on a well-encapsulated template which conforms to ERC-721 standard.
For the user interface, we use create-react-app for bootstrapping our frontend project. Mobx is our first choice when it comes to state management, since it offers a flexible way to trigger reactions when something changes, while write less boilerplate code. For the communication between blockchain and WebApp, Ethers.js, Wagmi and Alchemy SDK help us a lot. We use Joy UI (An React component library, which is still in development) and Emotion to provide a satisfactory visual effect to our users.

## Contribute

Any kinds of contribution will be truly appreciated. Submit your PRs, raise new issues or buy me a coffee :)

## License

Kalos is released under the MIT License.
