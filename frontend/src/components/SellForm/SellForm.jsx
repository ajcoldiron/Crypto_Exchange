import React from 'react'
import config from '../../config.json'
import { Input, Select, Form, Button, Typography } from 'antd'
import { useSelector } from 'react-redux'

import styles from "./SellForm.module.css"

export default function PurchaseForm({
  allCryptos,
  sellCrypto,
  purchaseCrypto,
  sellCryptoSymbol,
  totalPrice,
  amount,
  onPurchaseCoin,
  onSellCoin,
  onSell,
  setAmount
}) {
  const chainId = useSelector(state => state.connectionReducers.network)


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

  return (
    <Form className={styles.sellInformation}>
      <Form.Item label="Select a Currency">
        {chainId && config[chainId] ? (
          <Select
            style={{ width: 200 }}
            onChange={(value, option) => onSellCoin(value, option)}
            options={sellItems}
            value={sellCrypto}
          />
        ) : (
          <p>Not deployed to network</p>
        )}
      </Form.Item>
      <Form.Item label="Sell Amount" className={styles.sellInput}>
        <Input
          type="text"
          id='amount'
          placeholder='0'
          value={amount === 0 ? '' : amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </Form.Item>
      <Form.Item label="Sell For">
        {chainId && config[chainId] ? (
          <Select
            style={{ width: 200 }}
            onChange={(value, option) => onPurchaseCoin(value, option)}
            options={purchaseItems}
            value={purchaseCrypto}
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
            <b style={{ marginLeft: "50px" }}>Select Sell Amount</b>
          ) : !!amount ? (
            <b style={{ marginLeft: "50px" }}>Select Crypto Currencies</b>
          ) : (
            <b style={{ marginLeft: "50px" }}>Select Sell Amount and Crypto Currencies</b>
          )}
        </Typography>
      </Form.Item>
      <Form.Item>
        <Button onClick={onSell} style={{ width: 150, marginLeft: "70px" }}>Sell</Button>
      </Form.Item>
    </Form>
  )
}
