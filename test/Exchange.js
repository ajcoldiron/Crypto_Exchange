const { expect } = require('chai')
const { ethers } = require('hardhat')

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe('Exchange', () => {
    let deployer, user1, user2, feeAccount, exchange, token1, token2
    const feePercent = 10
    beforeEach(async () => {
        const Exchange = await ethers.getContractFactory('Exchange');
        const Token = await ethers.getContractFactory('Token');

        [deployer, user1, user2, feeAccount] = await ethers.getSigners();

        exchange = await Exchange.deploy(feeAccount.address, feePercent);
        token1 = await Token.deploy('Ethereum', 'ETH', 1000000)
        token2 = await Token.deploy('Bitcoin', 'BTC', 1000000)

        let transaction = await token1.connect(deployer).transfer(user1.address, tokens(100))
        await transaction.wait()
    })

    describe('Deployment', () => {
        it('checks for the correct fee account', async () => {
            expect(await exchange.feeAccount()).to.equal(feeAccount.address)
        })

        it('checks for the fee percent', async () => {
            expect(await exchange.feePercent()).to.equal(feePercent)
        })
    })

    describe('Depositing Tokens', () => {
        
        describe('Success', () => {
            let transaction, result
            const amount = tokens(10)

            beforeEach(async () => {
                await token1.connect(user1).approve(exchange.address, amount)
                transaction = await exchange.connect(user1).depositTokens(token1.address, amount)
                result = await transaction.wait()
            })

            it('checks the balance of user1', async () => {
                expect(await exchange.tokens(token1.address, user1.address)).to.equal(amount)
                expect(await token1.balanceOf(user1.address)).to.equal(tokens(90))
            })

            it('emits a Deposit event', async () => {
                const event = await result.events[1]
                expect(event.event).to.equal('Deposit')

                const args = event.args
                expect(args.user).to.equal(user1.address)
                expect(args.token).to.equal(token1.address)
                expect(args.amount).to.equal(amount)
                expect(args.balance).to.equal(amount)
            })
        })

        describe('Failure', () => {
            it('rejects attempted transfers without an approval', async () => {
                await expect(exchange.connect(user1).depositTokens(token1.address, tokens(10)))
            })
        })
    })

    describe('Withdrawing Tokens', () => {

        describe('Success', () => {
            let transaction, result
            const amount = tokens(10)
            
            beforeEach(async () => {
                await token1.connect(user1).approve(exchange.address, amount)
                await exchange.connect(user1).depositTokens(token1.address, amount)
                transaction = await exchange.connect(user1).withdrawTokens(token1.address, amount)
                result = await transaction.wait()
            })

            it('checks the balance of user1', async () => {
                expect(await exchange.tokens(token1.address, user1.address)).to.equal(0)
                expect(await token1.balanceOf(user1.address)).to.equal(tokens(100))
            })

            it('emits a Withdraw event', async () => {
                const event = await result.events[1]
                expect(event.event).to.equal('Withdraw')

                const args = event.args
                expect(args.user).to.equal(user1.address)
                expect(args.token).to.equal(token1.address)
                expect(args.amount).to.equal(amount)
                expect(args.balance).to.equal(0)
            })

        })

        describe('Failure', () => {
            it('rejects withdraw requests without sufficient funds', async () => {
                await expect(exchange.connect(user1).withdrawTokens(token1.address, tokens(10))).to.be.rejected
            })
        })
    })

    describe('Making Orders', () => {

        describe('Success', () => {
            let transaction, result
            const amount = tokens(10)

            beforeEach(async () => {
                await token1.connect(user1).approve(exchange.address, amount)
                await exchange.connect(user1).depositTokens(token1.address, amount)
                await token2.connect(deployer).transfer(user2.address, tokens(100))
                await token2.connect(user2).approve(exchange.address, amount)
                await exchange.connect(user2).depositTokens(token2.address, amount)
                transaction = await exchange.connect(user1).makeOrder(token2.address, tokens(9), token1.address, tokens(9))
                result = await transaction.wait()
            })

            it('checks the order count', async () => {
                expect(await exchange.orderCount()).to.equal(1)
            })

            it('emits an Order event', async () => {
                const event = await result.events[0]
                expect(event.event).to.equal('Order')

                const args = event.args
                expect(args.id).to.equal(1)
                expect(args.user).to.equal(user1.address)
                expect(args.tokenGet).to.equal(token2.address)
                expect(args.amountGet).to.equal(tokens(9))
                expect(args.tokenGive).to.equal(token1.address)
                expect(args.amountGive).to.equal(tokens(9))
                expect(args.timestamp).at.least(1)
            })

        })

        describe('Failure', () => {
            it('rejects order requests with insufficient funds', async () => {
                await expect(exchange.connect(user1).makeOrder(token2.address, tokens(10), token1.address, tokens(10))).to.be.rejected
            })
        })
    })

    describe('Canceling Orders', () => {
        describe('Success', () => {
            let transaction, result
            const amount = tokens(10)

            beforeEach(async () => {
                await token1.connect(user1).approve(exchange.address, amount)
                await exchange.connect(user1).depositTokens(token1.address, amount)
                await token2.connect(deployer).transfer(user2.address, tokens(100))
                await token2.connect(user2).approve(exchange.address, amount)
                await exchange.connect(user2).depositTokens(token2.address, amount)
                await exchange.connect(user1).makeOrder(token2.address, tokens(9), token1.address, tokens(9))
                transaction = await exchange.connect(user1).cancelOrder(1)
                result = await transaction.wait()
            })

            it('tracks the cancelled order', async () => {
                expect(await exchange.cancelledOrders(1)).to.equal(true)
            })

            it('emits a Cancel event', async () => {
                const event = await result.events[0]
                expect(event.event).to.equal('Cancel')

                const args = event.args
                expect(args.id).to.equal(1)
                expect(args.user).to.equal(user1.address)
                expect(args.tokenGet).to.equal(token2.address)
                expect(args.amountGet).to.equal(tokens(9))
                expect(args.tokenGive).to.equal(token1.address)
                expect(args.amountGive).to.equal(tokens(9))
                expect(args.timestamp).at.least(1)
            })
        })

        describe('Failure', () => {

            beforeEach(async () => {
                const amount = tokens(10)
                await token1.connect(user1).approve(exchange.address, amount)
                await exchange.connect(user1).depositTokens(token1.address, amount)
                await token2.connect(deployer).transfer(user2.address, tokens(100))
                await token2.connect(user2).approve(exchange.address, amount)
                await exchange.connect(user2).depositTokens(token2.address, amount)
                await exchange.connect(user1).makeOrder(token2.address, tokens(9), token1.address, tokens(9))
            })

            it('rejects invalid order ids', async () => {
                await expect(exchange.connect(user1).cancelOrder(0)).to.be.rejected
            })

            it('rejects cancel requests from invalid user', async () => {
                await expect(exchange.connect(user2).cancelOrder(1)).to.be.rejected
            })

            it('rejects already cancelled orders', async () => {
                await exchange.connect(user1).cancelOrder(1)
                await expect(exchange.connect(user1).cancelOrder(1)).to.be.rejected
            })
        })
    })

    describe('Filling Orders', () => {

        describe('Success', () => {
            let transaction, result
            const amount = tokens(10)

            beforeEach(async () => {
                await token1.connect(user1).approve(exchange.address, amount)
                await exchange.connect(user1).depositTokens(token1.address, amount)
                await token2.connect(deployer).transfer(user2.address, tokens(100))
                await token2.connect(user2).approve(exchange.address, amount)
                await exchange.connect(user2).depositTokens(token2.address, amount)
                await exchange.connect(user1).makeOrder(token2.address, tokens(9), token1.address, tokens(9))
                transaction = await exchange.connect(user2).fillOrder(1)
                result = await transaction.wait()
            })

            it('checks for filled order', async () => {
                expect(await exchange.filledOrders(1)).to.equal(true)
            })

            it('emits a Trade event', async () => {
                const event = await result.events[0]
                expect(event.event).to.equal('Trade')

                const args = event.args
                expect(args.id).to.equal(1)
                expect(args.user).to.equal(user2.address)
                expect(args.tokenGet).to.equal(token2.address)
                expect(args.amountGet).to.equal(tokens(9))
                expect(args.tokenGive).to.equal(token1.address)
                expect(args.amountGive).to.equal(tokens(9))
                expect(args.creator).to.equal(user1.address)
                expect(args.timestamp).at.least(1)
            })
        })

        describe('Failure', () => {
            beforeEach(async () => {
                const amount = tokens(10)
                await token1.connect(user1).approve(exchange.address, amount)
                await exchange.connect(user1).depositTokens(token1.address, amount)
                await token2.connect(deployer).transfer(user2.address, tokens(100))
                await token2.connect(user2).approve(exchange.address, amount)
                await exchange.connect(user2).depositTokens(token2.address, amount)
                await exchange.connect(user1).makeOrder(token2.address, tokens(9), token1.address, tokens(9))
            })

            it('rejects invalid order ids', async () => {
                await expect(exchange.connect(user2).fillOrder(0)).to.be.rejected
            })

            it('rejects invalid order ids', async () => {
                await expect(exchange.connect(user2).fillOrder(2)).to.be.rejected
            })

            it('rejects fill requests on cancled orders', async () => {
                await exchange.connect(user1).cancelOrder(1)
                await expect(exchange.connect(user2).fillOrder(1)).to.be.rejected
            })

            it('rejects already filled orders', async () => {
                await exchange.connect(user2).fillOrder(1)
                await expect(exchange.connect(user2).fillOrder(1)).to.be.rejected
            })
        })
    })
})