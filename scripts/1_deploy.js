const { ethers } = require('hardhat')

async function main() {
    let deployer, feeAccount, user1, user2

    const Token = await ethers.getContractFactory('Token');
    const Exchange = await ethers.getContractFactory('Exchange');

    [deployer, feeAccount, user1, user2] = await ethers.getSigners();

    const eth = await Token.deploy('Ethereum', 'ETH', 1000000);
    await eth.deployed();
    console.log(`Ethereum deployed to ${eth.address}`)

    const btc = await Token.deploy('Bitcoin', 'BTC', 1000000);
    await btc.deployed();
    console.log(`Bitcoin deployed to ${btc.address}`)

    const ltc = await Token.deploy('Litecoin', 'LTC', 1000000);
    await ltc.deployed();
    console.log(`Litecoin deployed to ${ltc.address}`)

    const exchange = await Exchange.deploy(feeAccount.address, 10)
    await exchange.deployed();
    console.log(`Exchange deployed to ${exchange.address}`)

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });