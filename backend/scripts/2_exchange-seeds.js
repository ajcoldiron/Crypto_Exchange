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
	console.log(`Transferred ${amount} Bitcoin from ${sender.address} to ${receiver.address}\n`)

	transaction = await ltc.connect(sender).transfer(receiver.address, amount)
	await transaction.wait()
	console.log(`Transferred ${amount} Litecoin from ${sender.address} to ${receiver.address}\n`)

	transaction = await xrp.connect(sender).transfer(receiver.address, amount)
	await transaction.wait()
	console.log(`Transferred ${amount} Ripple from ${sender.address} to ${receiver.address}\n`)

	transaction = await bnb.connect(sender).transfer(receiver.address, amount)
	await transaction.wait()
	console.log(`Transferred ${amount} BNB from ${sender.address} to ${receiver.address}\n`)

	transaction = await ada.connect(sender).transfer(receiver.address, amount)
	await transaction.wait()
	console.log(`Transferred ${amount} Cardano from ${sender.address} to ${receiver.address}\n`)

	const user1 = accounts[0]
	const user2 = accounts[1]
	amount = tokens(10000)

	transaction = await eth.connect(user1).approve(exchange.address, amount)
	await transaction.wait()
	console.log(`Approved ${amount} Ethereum from ${user1.address}\n`)

	transaction = await exchange.connect(user1).depositTokens(eth.address, amount)
	await transaction.wait()
	console.log(`Deposited ${amount} Ethereum from ${user1.address}\n`)

	transaction = await btc.connect(user1).approve(exchange.address, tokens(100))
	await transaction.wait()
	console.log(`Approved 100 Bitcoin from ${user1.address} to the exchange\n`)

	transaction = await exchange.connect(user1).depositTokens(btc.address, tokens(100))
	await transaction.wait()
	console.log(`Deposited 100 Bitcoin from ${user1.address} to the exchange\n`)

	transaction = await ltc.connect(user1).approve(exchange.address, tokens(100))
	await transaction.wait()
	console.log(`Approved 100 Litecoin from ${user1.address} to the exchange\n`)

	transaction = await exchange.connect(user1).depositTokens(ltc.address, tokens(100))
	await transaction.wait()
	console.log(`Deposited 100 Litecoin from ${user1.address} to the exchange\n`)
	
	transaction = await xrp.connect(user1).approve(exchange.address, tokens(100))
	await transaction.wait()
	console.log(`Approved 100 Ripple from ${user1.address} to the exchange\n`)

	transaction = await exchange.connect(user1).depositTokens(xrp.address, tokens(100))
	await transaction.wait()
	console.log(`Deposited 100 Ripple from ${user1.address} to the exchange\n`)
	
	transaction = await bnb.connect(user1).approve(exchange.address, tokens(100))
	await transaction.wait()
	console.log(`Approved 100 BNB from ${user1.address} to the exchange\n`)

	transaction = await exchange.connect(user1).depositTokens(bnb.address, tokens(100))
	await transaction.wait()
	console.log(`Deposited 100 BNB from ${user1.address} to the exchange\n`)
	
	transaction = await ada.connect(user1).approve(exchange.address, tokens(100))
	await transaction.wait()
	console.log(`Approved 100 Cardano from ${user1.address} to the exchange\n`)

	transaction = await exchange.connect(user1).depositTokens(ada.address, tokens(100))
	await transaction.wait()
	console.log(`Deposited 100 Cardano from ${user1.address} to the exchange\n`)



	transaction = await btc.connect(user2).approve(exchange.address, tokens(10000))
	await transaction.wait()
	console.log(`Approved ${amount} Bitcoin from ${user2.address} to the exchange\n`)

	transaction = await exchange.connect(user2).depositTokens(btc.address, tokens(100))
	await transaction.wait()
	console.log(`Deposited ${amount} Bitcoin from ${user2.address} to the exchange\n`)

	transaction = await ltc.connect(user2).approve(exchange.address, tokens(100))
	await transaction.wait()
	console.log(`Approved 100 Litecoin from ${user2.address} to the exchange\n`)

	transaction = await exchange.connect(user2).depositTokens(ltc.address, tokens(100))
	await transaction.wait()
	console.log(`Deposited 100 Litecoin from ${user2.address} to the exchange\n`)
	
	transaction = await xrp.connect(user2).approve(exchange.address, tokens(100))
	await transaction.wait()
	console.log(`Approved 100 Ripple from ${user2.address} to the exchange\n`)

	transaction = await exchange.connect(user2).depositTokens(xrp.address, tokens(100))
	await transaction.wait()
	console.log(`Deposited 100 Ripple from ${user2.address} to the exchange\n`)
	
	transaction = await bnb.connect(user2).approve(exchange.address, tokens(100))
	await transaction.wait()
	console.log(`Approved 100 BNB from ${user2.address} to the exchange\n`)

	transaction = await exchange.connect(user2).depositTokens(bnb.address, tokens(100))
	await transaction.wait()
	console.log(`Deposited 100 BNB from ${user2.address} to the exchange\n`)
	
	transaction = await ada.connect(user2).approve(exchange.address, tokens(100))
	await transaction.wait()
	console.log(`Approved 100 Cardano from ${user2.address} to the exchange\n`)

	transaction = await exchange.connect(user2).depositTokens(ada.address, tokens(100))
	await transaction.wait()
	console.log(`Deposited 100 Cardano from ${user2.address} to the exchange\n`)

	//Order 1
	let result
	transaction = await exchange.connect(user1).makeOrder(btc.address, tokens(10), eth.address, tokens(5))
	result = await transaction.wait()
	console.log(`Order made from ${user1.address}\n`)

	let orderId
	orderId = await result.events[0].args.id
	transaction = await exchange.connect(user1).cancelOrder(orderId)
	result = await transaction.wait()
	console.log(`Order cancelled from ${user1.address}\n`)

	await wait(1)

	//Order 2
	transaction = await exchange.connect(user1).makeOrder(btc.address, tokens(10), eth.address, tokens(10))
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
	transaction = await exchange.connect(user1).makeOrder(btc.address, tokens(20), eth.address, tokens(20))
	result = await transaction.wait()
	console.log(`Order made by ${user1.address}`)
	
	orderId = result.events[0].args.id
	transaction = await exchange.connect(user2).fillOrder(orderId)
	result = await transaction.wait()
	console.log(`Order filled by ${user2.address}`)

	for(let i = 1; i <= 5; i++) {
		transaction = await exchange.connect(user1).makeOrder(btc.address, tokens(10 * i), eth.address, tokens(10))
		result = await transaction.wait()
		console.log(`Made order from ${user1.address}`)

		await wait(1)
	}

	for(let i = 1; i <= 5; i++) {
		transaction = await exchange.connect(user2).makeOrder(eth.address, tokens(1), btc.address, tokens(i))
		result = await transaction.wait()
		console.log(`Order made from ${user2.address}`)

		await wait(1)
	}
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
