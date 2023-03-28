const config = require('../config.json') 
const { ethers } = require('hardhat')

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether')
}

const wait = (seconds) => {
	const milliseconds = seconds * 1000
	return new Promise(resolve => setTimeout(resolve, milliseconds))
}

async function main() {
    const accounts = await ethers.getSigners()

	const { chainId } = await ethers.provider.getNetwork()
	console.log("Using chainId", chainId)

	const eth = await ethers.getContractAt('Token', config[chainId].eth.address)
	console.log(`Ethereum Token fetched: ${eth.address}\n`)

	const btc = await ethers.getContractAt('Token', config[chainId].btc.address)
	console.log(`Bitcoin Token fetched: ${btc.address}\n`)

	const ltc = await ethers.getContractAt('Token', config[chainId].ltc.address)
	console.log(`Litecoin Token fetched: ${ltc.address}\n`)

	const xrp = await ethers.getContractAt('Token', config[chainId].xrp.address)
	console.log(`Ripple Token fetched: ${xrp.address}\n`)

	const bnb = await ethers.getContractAt('Token', config[chainId].bnb.address)
	console.log(`Binance Coin fetched: ${bnb.address}\n`)

	const ada = await ethers.getContractAt('Token', config[chainId].ada.address)
	console.log(`Cardano Token fetched: ${ada.address}\n`)

	const exchange = await ethers.getContractAt('Exchange', config[chainId].exchange.address)
	console.log(`Exchange Token fetched: ${exchange.address}\n`)

	const sender = accounts[0]
	const receiver = accounts[1]
	let amount = tokens(10000)

	let transaction = await btc.connect(sender).transfer(receiver.address, amount)
	await transaction.wait()
	console.log(`Transferred ${amount} tokens from ${sender.address} to ${receiver.address}\n`)

	const user1 = accounts[0]
	const user2 = accounts[1]
	amount = tokens(10000)

	transaction = await eth.connect(user1).approve(exchange.address, amount)
	await transaction.wait()
	console.log(`Approved ${amount} tokens from ${user1.address}\n`)

	transaction = await exchange.connect(user1).depositTokens(eth.address, amount)
	await transaction.wait()
	console.log(`Deposited ${amount} Ether from ${user1.address}\n`)

	transaction = await btc.connect(user2).approve(exchange.address, amount)
	await transaction.wait()
	console.log(`Approved ${amount} tokens from ${user2.address}\n`)

	transaction = await exchange.connect(user2).depositTokens(btc.address, amount)
	await transaction.wait()
	console.log(`Deposited ${amount} Fake Ether from ${user2.address}\n`)

	//Order 1
	let result
	transaction = await exchange.connect(user1).makeOrder(btc.address, tokens(100), eth.address, tokens(5))
	result = await transaction.wait()
	console.log(`Order made from ${user1.address}\n`)

	let orderId
	orderId = await result.events[0].args.id
	transaction = await exchange.connect(user1).cancelOrder(orderId)
	result = await transaction.wait()
	console.log(`Order cancelled from ${user1.address}\n`)

	await wait(1)

	//Order 2
	transaction = await exchange.connect(user1).makeOrder(btc.address, tokens(100), eth.address, tokens(10))
	result = await transaction.wait()
	console.log(`Order made from ${user1.address}\n`)

	orderId = await result.events[0].args.id
	transaction = await exchange.connect(user2).fillOrder(orderId)
	await transaction.wait()
	console.log(`Order filled by ${user2.address}\n`)

	await wait(1)

	//Order 3
	transaction = await exchange.connect(user1).makeOrder(btc.address, tokens(50), eth.address, tokens(15))
	result = await transaction.wait()
	console.log(`Order made by ${user1.address}`)

	orderId = await result.events[0].args.id
	transaction = await exchange.connect(user2).fillOrder(orderId)
	result = await transaction.wait()
	console.log(`Order filled by ${user2.address}`)

	await wait(1)

	//Final Order
	transaction = await exchange.connect(user1).makeOrder(btc.address, tokens(200), eth.address, tokens(20))
	result = await transaction.wait()
	console.log(`Order made by ${user1.address}`)

	orderId = result.events[0].args.id
	transaction = await exchange.connect(user2).fillOrder(orderId)
	result = await transaction.wait()
	console.log(`Order filled by ${user2.address}`)

	for(let i = 1; i <= 10; i++) {
		transaction = await exchange.connect(user1).makeOrder(btc.address, tokens(10 * i), eth.address, tokens(10))
		result = await transaction.wait()
		console.log(`Made order from ${user1.address}`)

		await wait(1)
	}

	for(let i = 1; i <= 10; i++) {
		transaction = await exchange.connect(user2).makeOrder(eth.address, tokens(10), btc.address, tokens(10 * i))
		result = await transaction.wait()
		console.log(`Order made from ${user2.address}`)

		await wait(1)
	}
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
