import { purchase } from '../../../store/reducers/purchaseReducer';
import LayoutWrapper from '../../LayoutWrapper.jsx/LayoutWrapper';
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import config from '../../../config.json'
import { Input, Select, Form, Button } from 'antd'
import { loadExchangeBalances } from '../../../store/reducers/exchangeBalanceReducers';
import styles from "./PurchaseContainer.module.css"

const PurchaseContainer = () => {
  const dispatch = useDispatch()
  const [price, setPrice] = useState(10)
  const [amount, setAmount] = useState(0)
  const [coinPurchaseAddress, setCoinPurchaseAddress] = useState("")
  const [coinSellAddress, setCoinSellAddress] = useState("")
  const provider = useSelector(state => state.connectionReducers.ethersConnection)
  const exchange = useSelector(state => state.exchangeReducers.exchange)
  const token1 = useSelector(state => state.tokenReducers.entities.ETH.token)
  const token2 = useSelector(state => state.tokenReducers.entities.BTC.token)
  const token1Symbol = useSelector(state => state.tokenReducers.entities.ETH.symbol)
  const token2Symbol = useSelector(state => state.tokenReducers.entities.BTC.symbol)
  const tokens = [token1, token2]
  const order = { amount, price }
  const chainId = useSelector(state => state.connectionReducers.network)
  const account = useSelector(state => state.connectionReducers.account)

  useEffect(() => {
    if (!!exchange && token1 && token2 && account && token1Symbol && token2Symbol) {
      const tokens = [token1, token2]
      dispatch(loadExchangeBalances({ exchange, tokens, account, symbols: [token1Symbol, token2Symbol] }))
    }
  }, [dispatch, exchange, token1, token2, account, token1Symbol, token2Symbol])

  const dropdownItems = []
  if (config[chainId]) {
    dropdownItems.push({
      value: `${config[chainId].btc.address}`,
      label: "Bitcoin",
    })
    dropdownItems.push({
      value: `${config[chainId].eth.address}`,
      label: "Ethereum",
    })
    dropdownItems.push({
      value: `${config[chainId].bnb.address}`,
      label: "Binanace Coin",
    })
    dropdownItems.push({
      value: `${config[chainId].xrp.address}`,
      label: "Ripple",
    })
    dropdownItems.push({
      value: `${config[chainId].ltc.address}`,
      label: "Litecoin",
    })
    dropdownItems.push({
      value: `${config[chainId].ada.address}`,
      label: "Cardano",
    })
  }

  const buyHandler = (e) => {
    e.preventDefault()
    dispatch(purchase({ provider, exchange, tokens, order }))
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
                onChange={(value) => setCoinPurchaseAddress(value)}
                options={dropdownItems}
                value={coinPurchaseAddress}
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
                onChange={(value) => setCoinSellAddress(value)}
                options={dropdownItems}
                value={coinSellAddress}
              />
            ) : (
              <p>Not deployed to network</p>
            )}
          </Form.Item>
          <Form.Item>
            <span>Auto-fill correct amount of purchase coins</span>
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
