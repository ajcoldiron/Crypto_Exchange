import LayoutWrapper from '../../LayoutWrapper.jsx/LayoutWrapper'
import AssetsGraph from './AssetsGraph'
import { Table, Button, Space, Radio, Form, Input } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { transferTokens } from '../../../store/reducers/transferReducers';


const AssetsContainer = () => {
  const dispatch = useDispatch()
  const [transfer, setTransfer] = useState("")
  const [amount, setAmount] = useState(0)

  const eth = useSelector(state => state.tokenReducers.token1)
  const provider = useSelector(state => state.connectionReducers.ethersConnection)
  const exchange = useSelector(state => state.exchangeReducers.exchange)

  // load crypto from api
  const allCryptos = useSelector(state => state.cryptoReducers.entities)
  const allCryptoValues = Object.values(allCryptos)

  // load crypto from my Exchange
  const exchangeCryptos = useSelector(state => state.exchangeBalanceReducers.entities)
  console.log(exchangeCryptos)
  const exchangeCryptoSymbols = Object.keys(exchangeCryptos)

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  });
  const data = [];
  if (allCryptos && exchangeCryptos) {
    allCryptoValues.forEach(cryptoInformation => {
      // retrieve balance and price for what you have in your exchange
      let currentBalance = 0
      const cryptoSymbol = cryptoInformation.symbol.toUpperCase()

      // if my exchange crypto contains the current looped crypto
      if (exchangeCryptoSymbols.includes(cryptoSymbol)) {
        // retrieve exchange crypto using current looped crypto symbol
        const correspondingExchangeCrypto = exchangeCryptos[cryptoSymbol]
        const balance = Number(correspondingExchangeCrypto.balance) * cryptoInformation.current_price
        currentBalance = formatter.format(balance)
      }

      // build a data object for the table using crypto and Exchange information
      const tableDataObject = {
        name: cryptoInformation.id,
        current_price: cryptoInformation.current_price,
        high_24h: cryptoInformation.high_24h,
        low_24h: cryptoInformation.low_24h,
        total_supply: cryptoInformation.total_supply,
        currentBalance: currentBalance
      }

      data.push(tableDataObject)
    })
  }
  const columns = [
    {
      title: "Crypto Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Total Balance",
      dataIndex: "currentBalance",
      key: "currentBalance",
    },
    {
      title: "Price",
      dataIndex: "current_price",
      key: "current_price"
    },
    {
      title: "24 Hour Low",
      dataIndex: "low_24h",
      key: "low_24h"
    },
    {
      title: "24 Hour High",
      dataIndex: "high_24h",
      key: "high_24h"
    }
  ]
  const handleTransfer = (e) => {
    setTransfer(e.target.value)
  }

  const amountHandler = (e) => {
    setAmount(e.target.value)
  }
  
  const transferCrypto = () => {
    if (transfer === "Deposit") {
      dispatch(transferTokens({provider, exchange, transferType: "Deposit", token: eth, amount})) 
      setAmount(0)
    } else {
      dispatch(transferTokens({provider, exchange, transferType: "Withdraw", token: eth, amount}))
      setAmount(0)
    }
  }
  
  return (
    <LayoutWrapper>
      <div>
        <div>
          <section>
            <AssetsGraph />
          </section>
          <section>
            <h1>Transfers</h1>
            <Form>
              <Form.Item label="Transfer Ethereum" name="layout">
                <Radio.Group >
                  <Radio.Button value="Deposit" onChange={(value) => handleTransfer(value)}>Deposit</Radio.Button>
                  <Radio.Button value="Withdraw" onChange={(value) => handleTransfer(value)}>Withdraw</Radio.Button>
                </Radio.Group>
              </Form.Item>
              <Form.Item label="Transfer Amount">
                <Input onChange={(e) => amountHandler(e)} />
              </Form.Item>
              <Form.Item>
                <Space size="middle">
                  <Button onClick={() => transferCrypto()}>Transfer</Button>
                </Space>
              </Form.Item>
            </Form>
          </section>
        </div>
        <section>
          <h3>My Crypto</h3>
          <Table dataSource={data} columns={columns} rowKey="name" />
        </section>
      </div>
    </LayoutWrapper>
  )
}

export default AssetsContainer
