const { ethers } = require('hardhat')
const { expect } = require('chai')

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe('Token', () => {
    let token, deployer, receiver, exchange

    beforeEach(async () => {
        const Token = await ethers.getContractFactory('Token');
        token = await Token.deploy('Ethereum', 'ETH', 1000000);

        [deployer, receiver, exchange] = await ethers.getSigners()
    })

    describe('Deployment', () => {
        it('checks for correct name', async () => {
            expect(await token.name()).to.equal('Ethereum')
        })

        it('checks for correct symbol', async () => {
            expect(await token.symbol()).to.equal('ETH')
        })

        it('checks the balance of the deployer', async () => {
            expect(await token.balanceOf(deployer.address)).to.equal(tokens(1000000))
        })
    })

    describe('Transfering Tokens', () => {
        
        describe('Success', () => {
            let transaction, result
            const amount = tokens(10)

            beforeEach(async () => {
                transaction = await token.connect(deployer).transfer(receiver.address, amount)
                result = await transaction.wait()
            })

            it('checks the balance of the receiver and deployer', async () => {
                expect(await token.balanceOf(receiver.address)).to.equal(amount)
                expect(await token.balanceOf(deployer.address)).to.equal(tokens(999990))
            })

            it('emits a Transaction event', async () => {
                const event = await result.events[0]
                expect(event.event).to.equal('Transfer')

                const args = event.args
                expect(args.from).to.equal(deployer.address)
                expect(args.to).to.equal(receiver.address)
                expect(args.amount).to.equal(amount)
            })
        })

        describe('Failure', () => {
            it('rejects attempted transactions with insufficient funds', async () => {
                await expect(token.connect(deployer).transfer(receiver.address, tokens(1000000000))).to.be.rejected
            })

            it('rejects invalid recipients', async () => {
                await expect(token.connect(deployer).transfer('0x0000000000000000000000000000000000000000', tokens(10))).to.be.rejected
            })
        })
    })

    describe('Approving Tokens', () => {

        describe('Success', () => {
            let transaction, result
            const amount = tokens(10)

            beforeEach(async () => {
                transaction = await token.connect(deployer).approve(receiver.address, amount)
                result = await transaction.wait()
            })

            it('checks the allowance of the receiver', async () => {
                expect(await token.allowance(deployer.address, receiver.address)).to.equal(amount)
            })

            it('emit an Approval event', async () => {
                const event = await result.events[0]
                expect(event.event).to.equal('Approval')

                const args = event.args
                expect(args.from).to.equal(deployer.address)
                expect(args.to).to.equal(receiver.address)
                expect(args.amount).to.equal(amount)
            })
        })

        describe('Failure', () => {
            it('rejects invalid recipients', async () => {
                await expect(token.connect(deployer).approve('0x0000000000000000000000000000000000000000', tokens(10))).to.be.rejected
            })
        })
    })

    describe('Transfering from Exchange', () => {

        describe('Success', () => {
            let transaction, result
            const amount = tokens(10)

            beforeEach(async () => {
                await token.connect(deployer).approve(exchange.address, amount)
                transaction = await token.connect(exchange).transferFrom(deployer.address, receiver.address, amount)
                result = await transaction.wait()
            })

            it('checks the balance and allowance of deployer and receiver', async () => {
                expect(await token.balanceOf(receiver.address)).to.equal(amount)
                expect(await token.balanceOf(deployer.address)).to.equal(tokens(999990))
                expect(await token.allowance(deployer.address, exchange.address)).to.equal(0)
            })

            it('emits a Transfer event', async () => {
                const event = await result.events[0]
                expect(event.event).to.equal('Transfer')

                const args = event.args
                expect(args.from).to.equal(deployer.address)
                expect(args.to).to.equal(receiver.address)
                expect(args.amount).to.equal(amount)
            })
        })

        describe('Failure', () => {

            it('rejects attempted transactions with insufficient funds', async () => {
                let transaction = await token.connect(deployer).approve(exchange.address, tokens(10000000))
                await transaction.wait()
                await expect(token.connect(exchange).transferFrom(deployer.address, receiver.address, tokens(10000000))).to.be.rejected
            })

            it('rejects attempted transfers without enough allowance', async () => {
                await expect(token.connect(exchange).transferFrom(deployer.address, receiver.address, tokens(10))).to.be.rejected
            })
        })
    })
})