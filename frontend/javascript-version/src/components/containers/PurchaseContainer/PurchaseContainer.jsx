import { purchase } from '../../../store/reducers/purchaseReducer';
import LayoutWrapper from '../../LayoutWrapper.jsx/LayoutWrapper';
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import config from '../../../config.json'
import { Input, Select, Form, Button, Typography, Radio } from 'antd'
import { loadExchangeBalances } from '../../../store/reducers/exchangeBalanceReducers';
import styles from "./PurchaseContainer.module.css"
import PurchaseGraph from './PurchaseGraph';
import { selectPurchaseCrypto, selectSellCrypto } from '../../../store/reducers/cryptoReducers';

const highlightedTokens = ["ETH", "BTC", "LTC", "XRP", "BNB", "ADA"]

const PurchaseContainer = () => {
  const dispatch = useDispatch()
  const [graphTime, setGraphTime] = useState({ target: { value: "Year" } })
  const [amount, setAmount] = useState(0)
  const [purchaseCryptoSymbol, setPurchaseCryptoSymbol] = useState("")
  const [sellCryptoSymbol, setSellCryptoSymbol] = useState("")
  const provider = useSelector(state => state.connectionReducers.ethersConnection)
  const exchange = useSelector(state => state.exchangeReducers.exchange)
  const allCryptos = useSelector(state => state.cryptoReducers.entities)
  const allCryptosTokens = useSelector(state => state.tokenReducers.entities)
  const allCryptosBalances = useSelector(state => state.exchangeBalanceReducers.entities)

  const chainId = useSelector(state => state.connectionReducers.network)
  const account = useSelector(state => state.connectionReducers.account)
  const allCryptoValues = Object.values(allCryptos)
  
  useEffect(() => {
    if (!!exchange && account && allCryptosTokens) {
      const tokens = Object.values(allCryptosTokens).filter(cryptoToken => highlightedTokens.includes(cryptoToken.symbol)).map(cryptoToken => cryptoToken.token);
      dispatch(loadExchangeBalances({ exchange, tokens, account, symbols: highlightedTokens }))
    }
  }, [dispatch, allCryptosTokens, account])

  const purchaseItems = []
  if (Object.keys(allCryptos).length) {
    purchaseItems.push({
      value: 'BTC',
      label: "Bitcoin",
      key: 1
    })
    purchaseItems.push({
      value: 'ETH',
      label: "Ethereum",
      key: 2
    })
    purchaseItems.push({
      value: 'BNB',
      label: "Binanace Coin",
      key: 3
    })
    purchaseItems.push({
      value: 'XRP',
      label: "Ripple",
      key: 4
    })
    purchaseItems.push({
      value: 'LTC',
      label: "Litecoin",
      key: 5
    })
    purchaseItems.push({
      value: 'ADA',
      label: "Cardano",
      key: 6
    })
  }
  const sellItems = [] 
  if (Object.keys(allCryptos).length) {
    sellItems.push({
      value: 'BTC',
      label: "Bitcoin",
      key: 7
    })
    sellItems.push({
      value: 'ETH',
      label: "Ethereum",
      key: 8
    })
    sellItems.push({
      value: 'BNB',
      label: "Binanace Coin",
      key: 9
    })
    sellItems.push({
      value: 'XRP',
      label: "Ripple",
      key: 10
    })
    sellItems.push({
      value: 'LTC',
      label: "Litecoin",
      key: 11
    })
    sellItems.push({
      value: 'ADA',
      label: "Cardano",
      key: 12
    })
  }

  const graphTimeHandler = (value) => {
    setGraphTime(value)
  }

  const [purchaseCrypto, setPurchaseCrypto] = useState(null)
  const purchaseCoin = (symbol, option) => {
    const cryptoInfo = allCryptos[symbol.toLowerCase()]
    setPurchaseCrypto(option)
    setPurchaseCryptoSymbol(symbol)
    dispatch(selectPurchaseCrypto(cryptoInfo))
  }


  const [sellCrypto, setSellCrypto] = useState(null)
  const sellCoin = (symbol, option) => {
    const cryptoInfo = allCryptos[symbol.toLowerCase()]
    setSellCrypto(option)
    setSellCryptoSymbol(symbol)
    dispatch(selectSellCrypto(cryptoInfo))
  }


  const getCryptoIdFromSymbol = (symbol) => {
    const symbolKey = symbol.toLowerCase()
    let cryptoId = ""
    if (symbolKey in allCryptos) {
      cryptoId =  allCryptos[symbolKey].id
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

  const buyHandler = (e) => {
    e.preventDefault()
    const purchaseCryptoThing = allCryptosTokens[purchaseCrypto.value].token
    const sellCryptoThing = allCryptosTokens[sellCrypto.value].token
    dispatch(purchase({ provider, exchange, tokens: [purchaseCryptoThing, sellCryptoThing], order }))
    setAmount(0)
    setPrice(0)
  }

  return (
    <>
      <div>
        <section className={styles.columOne}>
          <div className={styles.graphWrapper}>
            {!!sellCryptoSymbol && !!purchaseCryptoSymbol ? (
              <h1>{sellCryptoSymbol}/{purchaseCryptoSymbol}</h1>
            ) : (
              <span>Select Currency for Graph</span>
            )}
            {purchaseCrypto && sellCrypto ? 
              <PurchaseGraph 
                state={graphTime} 
                purchaseCryptoId={getCryptoIdFromSymbol(purchaseCrypto.value)} 
                sellCryptoId={getCryptoIdFromSymbol(sellCrypto.value)} 
              /> 
              : null}
          </div>
          <Form className={styles.purchaseInformation}>
            <Form.Item label="Select a Currency">
              {chainId && config[chainId] ? (
                <Select
                  style={{ width: 200 }}
                  onChange={(value, option) => purchaseCoin(value, option)}
                  options={purchaseItems}
                  value={purchaseCrypto}
                />
              ) : (
                <p>Not deployed to network</p>
              )}
            </Form.Item>
            <Form.Item label="Purchase Amount" className={styles.purchaseInput}>
              <Input
                type="text"
                id='amount'
                placeholder='0'
                value={amount === 0 ? '' : amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </Form.Item>
            <Form.Item label="Purchase With">
              {chainId && config[chainId] ? (
                <Select
                  style={{ width: 200 }}
                  onChange={(value, option) => sellCoin(value, option)}
                  options={sellItems}
                  value={sellCrypto}
                />
              ) : (
                <p>Not deployed to a network</p>
              )}
            </Form.Item>
            <Form.Item>
              <Typography label="Price">
                {!!purchaseCrypto && !!sellCrypto && !!amount ? (
                  <pre style={{ width: 200, marginLeft: "50px" }}>{Math.round(totalPrice * 100) / 100} {sellCryptoSymbol}</pre>
                ) : !!purchaseCrypto && !!sellCrypto ? (
                  <b style={{ marginLeft: "50px" }}>Select Purchase Amount</b>
                ) : !!amount ? (
                  <b style={{ marginLeft: "50px" }}>Select Crypto Currencies</b>
                ) : (
                  <b style={{ marginLeft: "50px" }}>Select Purchase Amount and Crypto Currencies</b>
                )}
              </Typography>
            </Form.Item>
            <Form.Item>
              <Button onClick={buyHandler} style={{ width: 150, marginLeft: "70px" }}>Purchase</Button>
            </Form.Item>
          </Form>
        </section>
        <div className={styles.radioGroupWrapper}>
          <Radio.Group onChange={graphTimeHandler}>
            <Radio.Button value={"Year"} >Year</Radio.Button>
            <Radio.Button value={"Month"} >Month</Radio.Button>
            <Radio.Button value={"Week"} >Week</Radio.Button>
          </Radio.Group>
        </div>
      </div>
      {highlightedTokens.map((symbol) => {
        let balance = 0
        // Verifiy if object have the symbol property (important to avoid crash error)
        if (symbol in allCryptosBalances) {
          balance = allCryptosBalances[symbol]
        }
        return <div key={"crypto-balance-" + symbol}>{symbol} Balance: {balance}</div>
      })}
      </>
  )
}

export default PurchaseContainer
