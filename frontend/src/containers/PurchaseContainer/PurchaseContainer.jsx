import { purchase } from '../../store/reducers/purchaseReducer';
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import styles from "./PurchaseContainer.module.css"
import PurchaseGraph from '../../components/PurchaseGraph/PurchaseGraph';
import { selectPurchaseCrypto, selectSellCrypto } from '../../store/reducers/cryptoReducers';
import ExchangeBalances from '../../components/ExchangeBalances/ExchangeBalances';
import PurchaseForm from '../../components/PurchaseForm/PurchaseForm';

const highlightedTokens = ["ETH", "BTC", "LTC", "XRP", "BNB"]

const PurchaseContainer = () => {
  const dispatch = useDispatch()
  const [purchaseCryptoSymbol, setPurchaseCryptoSymbol] = useState("")
  const [sellCryptoSymbol, setSellCryptoSymbol] = useState("")
  const [amount, setAmount] = useState(0)
  const provider = useSelector(state => state.connectionReducers.ethersConnection)
  const exchange = useSelector(state => state.exchangeReducers.exchange)
  const allCryptos = useSelector(state => state.cryptoReducers.entities)
  const allCryptosTokens = useSelector(state => state.tokenReducers.entities)

  const allCryptoValues = Object.values(allCryptos)

  const [purchaseCrypto, setPurchaseCrypto] = useState(null)
  const handlePurchaseCoin = (symbol, option) => {
    const cryptoInfo = allCryptos[symbol.toLowerCase()]
    setPurchaseCrypto(option)
    setPurchaseCryptoSymbol(symbol)
    dispatch(selectPurchaseCrypto(cryptoInfo))
  }


  const [sellCrypto, setSellCrypto] = useState(null)
  const handleSellCoin = (symbol, option) => {
    const cryptoInfo = allCryptos[symbol.toLowerCase()]
    setSellCrypto(option)
    setSellCryptoSymbol(symbol)
    dispatch(selectSellCrypto(cryptoInfo))
  }


  const getCryptoIdFromSymbol = (symbol) => {
    const symbolKey = symbol.toLowerCase()
    let cryptoId = ""
    if (symbolKey in allCryptos) {
      cryptoId = allCryptos[symbolKey].id
    }
    return cryptoId
  }

  let purchaseCryptoPrice, sellCryptoPrice
  if (allCryptos && !!purchaseCryptoSymbol && !!sellCryptoSymbol) {
    let newPurchaseCryptoSymbol = purchaseCryptoSymbol.toLowerCase()
    let newSellCryptoSymbol = sellCryptoSymbol.toLowerCase()

    allCryptoValues.forEach(cryptoValue => {
      const isPurchaseCrypto = newPurchaseCryptoSymbol === cryptoValue?.symbol
      const isSoldCrypto = newSellCryptoSymbol === cryptoValue?.symbol

      if (isPurchaseCrypto) {
        purchaseCryptoPrice = cryptoValue?.current_price
      }
      if (isSoldCrypto) {
        sellCryptoPrice = cryptoValue?.current_price
      }
    })
  }
  let conversionRate
  const [price, setPrice] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)
  useEffect(() => {
    if (!!purchaseCryptoPrice && !!sellCryptoPrice && amount > 0) {
      conversionRate = (purchaseCryptoPrice / sellCryptoPrice)
      setTotalPrice(Number(amount * conversionRate))
      setPrice(conversionRate)
    }
  })
  const order = { amount, price }

  const handleBuy = (e) => {
    e.preventDefault()
    const purchaseCryptoThing = allCryptosTokens[purchaseCrypto.value].token
    const sellCryptoThing = allCryptosTokens[sellCrypto.value].token
    dispatch(purchase({ provider, exchange, tokens: [purchaseCryptoThing, sellCryptoThing], order }))
    setAmount(0)
    setPrice(0)
  }

  return (
    <>
      <section>
        <div className={styles.parentContainer}>
          <div className={styles.graphWrapper}>
            {!!sellCryptoSymbol && !!purchaseCryptoSymbol ? (
              <h1>{sellCryptoSymbol}/{purchaseCryptoSymbol}</h1>
            ) : (
              <span>Select Currencies for the Graph</span>
            )}
            {purchaseCrypto && sellCrypto ?
              <PurchaseGraph
                purchaseCryptoId={getCryptoIdFromSymbol(purchaseCrypto.value)}
                sellCryptoId={getCryptoIdFromSymbol(sellCrypto.value)}
              />
              : null}
          </div>
          <div className={styles.formWrapper}>
            <PurchaseForm
              allCryptos={allCryptos}
              purchaseCrypto={purchaseCrypto}
              sellCrypto={sellCrypto}
              sellCryptoSymbol={sellCryptoSymbol}
              amount={amount}
              onPurchaseCoin={handlePurchaseCoin}
              onSellCoin={handleSellCoin}
              onBuy={handleBuy}
              setAmount={setAmount}
              totalPrice={totalPrice} />
          </div>
          <div className={styles.ExchangeBalances}>
            <ExchangeBalances highlightedTokens={highlightedTokens} />
          </div>
        </div>
      </section>
    </>
  )
}

export default PurchaseContainer
