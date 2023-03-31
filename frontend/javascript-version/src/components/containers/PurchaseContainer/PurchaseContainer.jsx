import { purchase } from '../../../store/reducers/purchaseReducer';
import LayoutWrapper from '../../LayoutWrapper.jsx/LayoutWrapper';
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import config from '../../../config.json'
import { Input, Select, Form, Button, Typography } from 'antd'
import { loadExchangeBalances } from '../../../store/reducers/exchangeBalanceReducers';
import styles from "./PurchaseContainer.module.css"

const PurchaseContainer = () => {
  const dispatch = useDispatch()
  const [amount, setAmount] = useState(0)
  const [purchaseCryptoSymbol, setPurchaseCryptoSymbol] = useState("")
  const [sellCryptoSymbol, setSellCryptoSymbol] = useState("")
  const provider = useSelector(state => state.connectionReducers.ethersConnection)
  const exchange = useSelector(state => state.exchangeReducers.exchange)
  const eth = useSelector(state => state.tokenReducers.entities?.ETH?.token)
  const btc = useSelector(state => state.tokenReducers.entities?.BTC?.token)
  const ltc = useSelector(state => state.tokenReducers.entities?.LTC?.token)
  const xrp = useSelector(state => state.tokenReducers.entities?.XRP?.token)
  const bnb = useSelector(state => state.tokenReducers.entities?.BNB?.token)
  const ada = useSelector(state => state.tokenReducers.entities?.ADA?.token)
  const ethSymbol = useSelector(state => state.tokenReducers.entities?.ETH?.symbol)
  const btcSymbol = useSelector(state => state.tokenReducers.entities?.BTC?.symbol)
  const ltcSymbol = useSelector(state => state.tokenReducers.entities?.LTC?.symbol)
  const xrpSymbol = useSelector(state => state.tokenReducers.entities?.XRP?.symbol)
  const bnbSymbol = useSelector(state => state.tokenReducers.entities?.BNB?.symbol)
  const adaSymbol = useSelector(state => state.tokenReducers.entities?.ADA?.symbol)
  const chainId = useSelector(state => state.connectionReducers.network)
  const account = useSelector(state => state.connectionReducers.account)
  const tokens = [eth, btc, ltc, xrp, bnb, ada]
  const symbols = [ethSymbol, btcSymbol, ltcSymbol, xrpSymbol, bnbSymbol, adaSymbol]
  const allCrypto = useSelector(state => state.cryptoReducers.entities)
  const allCryptoValues = Object.values(allCrypto)
  useEffect(() => {
    if (!!exchange && eth && btc && ltc && xrp && bnb && ada && ethSymbol && btcSymbol && ltcSymbol && xrpSymbol && bnbSymbol && adaSymbol && account) {
      dispatch(loadExchangeBalances({ exchange, tokens, account, symbols }))
    }
  }, [dispatch, exchange, eth, btc, ltc, xrp, bnb, ada, account, ethSymbol, btcSymbol, ltcSymbol, xrpSymbol, bnbSymbol, adaSymbol])

  
  const purchaseItems = []
  if (eth && btc && ltc && xrp && bnb && ada) {
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
  if (eth && btc && ltc && xrp && bnb && ada) {
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

  let purchaseCrypto
  const purchaseCoin = (e) => {
    if (e === 'BTC') {
      purchaseCrypto = btc
      setPurchaseCryptoSymbol(e)
    } else if (e === 'ETH') {
      purchaseCrypto = eth
      setPurchaseCryptoSymbol(e)
    } else if (e === 'BNB') {
      purchaseCrypto = bnb
      setPurchaseCryptoSymbol(e)
    } else if (e === 'XRP') {
      purchaseCrypto = xrp
      setPurchaseCryptoSymbol(e)
    } else if (e === 'LTC') {
      purchaseCrypto = ltc
      setPurchaseCryptoSymbol(e)
    } else {
      purchaseCrypto = ada
      setPurchaseCryptoSymbol(e)
    }
  }

  let sellCrypto
  const sellCoin = (e) => {
    if (e === 'BTC') {
      sellCrypto = btc
      setSellCryptoSymbol(e)
    } else if (e === 'ETH') {
      sellCrypto = eth
      setSellCryptoSymbol(e)
    } else if (e === 'BNB') {
      sellCrypto = bnb
      setSellCryptoSymbol(e)
    } else if (e === 'XRP') {
      sellCrypto = xrp
      setSellCryptoSymbol(e)
    } else if (e === 'LTC') {
      sellCrypto = ltc
      setSellCryptoSymbol(e)
    } else {
      sellCrypto = ada
      setSellCryptoSymbol(e)
    }
  }

  let purchaseCryptoPrice, sellCryptoPrice
  if(allCrypto && !!purchaseCryptoSymbol && !!sellCryptoSymbol) {
    let newPurchaseCryptoSymbol = purchaseCryptoSymbol.toLowerCase()
    let newSellCryptoSymbol = sellCryptoSymbol.toLowerCase()

    const purchaseSymbolLength = newPurchaseCryptoSymbol.length
    const sellSymbolLength = newSellCryptoSymbol.length

    allCryptoValues.forEach(cryptoValue => {
      const cryptoValueArray = Object.values(cryptoValue)
      const cryptoValueArraySymbol = cryptoValueArray[1]

      if(cryptoValueArraySymbol.includes(newPurchaseCryptoSymbol) && cryptoValueArraySymbol.length === purchaseSymbolLength) {
        purchaseCryptoPrice = cryptoValueArray[4]
      }
      if(cryptoValueArraySymbol.includes(newSellCryptoSymbol) && cryptoValueArraySymbol.length === sellSymbolLength) {
        sellCryptoPrice = cryptoValueArray[4]
      }
    })
  }
  let totalPrice
  if(!!purchaseCryptoPrice && !!sellCryptoPrice) {
    const conversionRate = (purchaseCryptoPrice / sellCryptoPrice)
    totalPrice = (amount * conversionRate)
  }
  const [price, setPrice] = useState(totalPrice)
  const order = { amount, price }
  
  const buyHandler = (e) => {
    e.preventDefault()
    dispatch(purchase({ provider, exchange, tokens: [purchaseCrypto, sellCrypto], order }))
    setAmount(0)
    setPrice(0)
  }
  return (
    <LayoutWrapper>
      <div className={styles.wrapper}>
        <div>
          <h1>Graph of Crypto</h1>
        </div>
        <Form className={styles.purchaseInformations}>
          <Form.Item label="Select a Currency">
            {chainId && config[chainId] ? (
              <Select
                style={{ width: 120 }}
                onChange={(value) => purchaseCoin(value)}
                options={purchaseItems}
                value={purchaseCrypto}
              />
            ) : (
              <p>Not deployed to network</p>
            )}
          </Form.Item>
          <Form.Item label="Purchase Amount">
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
                style={{ width: 120 }}
                onChange={(value) => sellCoin(value)}
                options={sellItems}
                value={sellCrypto}
              />
            ) : (
              <p>Not deployed to network</p>
            )}
          </Form.Item>
          <Form.Item>
            <Typography label="Price">
              {totalPrice ? (
                <pre>{Math.round(totalPrice * 100) / 100} {sellCryptoSymbol}</pre>
              ) : (
                <span>Select Crypto Currencies</span>
              )}
            </Typography>
          </Form.Item>
          <Form.Item>
            <Button onClick={buyHandler}>Purchase</Button>
          </Form.Item>
        </Form>
      </div>
    </LayoutWrapper>
  )
}

export default PurchaseContainer
