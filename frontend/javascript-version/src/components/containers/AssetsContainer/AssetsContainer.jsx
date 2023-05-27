import LayoutWrapper from '../../LayoutWrapper.jsx/LayoutWrapper'
import AssetsGraph from './AssetsGraph'
import { Table, Button, Space, Radio, Form, Input, Select } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { transferTokens } from '../../../store/reducers/transferReducers';
import { loadTokensBalances } from '../../../store/reducers/tokenBalanceReducer';


const AssetsContainer = () => {
  const dispatch = useDispatch()
  const [transfer, setTransfer] = useState("")
  const [amount, setAmount] = useState(0)
  const [graphTime, setGraphTime] = useState({ target: { value: "Year" } })
  

  const eth = useSelector(state => state.tokenReducers.entities?.ETH?.token)
  const btc = useSelector(state => state.tokenReducers.entities?.BTC?.token)
  const ltc = useSelector(state => state.tokenReducers.entities?.LTC?.token)
  const ada = useSelector(state => state.tokenReducers.entities?.ADA?.token)
  const xrp = useSelector(state => state.tokenReducers.entities?.XRP?.token)
  const bnb = useSelector(state => state.tokenReducers.entities?.BNB?.token)

  const [transferToken, setTransferToken] = useState({})

  const provider = useSelector(state => state.connectionReducers.ethersConnection)
  const exchange = useSelector(state => state.exchangeReducers.exchange)
  const account = useSelector(state => state.connectionReducers.account)

  const tokenBalances = useSelector(state => state.tokenBalanceReducer.entities)

  // load crypto from api
  const allCryptos = useSelector(state => state.cryptoReducers.entities)
  const allCryptoValues = Object.values(allCryptos)

  // load crypto from my Exchange
  const exchangeCryptos = useSelector(state => state.exchangeBalanceReducers.entities)
  const exchangeCryptoSymbols = Object.keys(exchangeCryptos)

  useEffect(() => {
    if (eth && btc && ltc && ada && xrp && bnb && account) {
      dispatch(loadTokensBalances({ tokens: [eth, btc, ltc, ada, xrp, bnb], account }))
    }
  }, [loadTokensBalances, eth, btc, ltc, ada, xrp, bnb, account])

  const graphTimeHandler = (value) => {
    setGraphTime(value)
  }

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  });
  const data = [];
  if (allCryptos && exchangeCryptos) {
    allCryptoValues.forEach(cryptoInformation => {
      // retrieve balance and price for what you have in your exchange
      let balance = 0
      let currentBalance = 0
      const cryptoSymbol = cryptoInformation.symbol.toUpperCase()

      // if my exchange crypto contains the current looped crypto
      if (exchangeCryptoSymbols.includes(cryptoSymbol)) {
        // retrieve exchange crypto using current looped crypto symbol
        const correspondingExchangeCrypto = exchangeCryptos[cryptoSymbol]
        balance = Number(correspondingExchangeCrypto) * cryptoInformation.current_price
        currentBalance = formatter.format(balance)
      }

      // build a data object for the table using crypto and Exchange information
      const tableDataObject = {
        name: cryptoInformation.id,
        current_price: formatter.format(cryptoInformation.current_price),
        high_24h: formatter.format(cryptoInformation.high_24h),
        low_24h: formatter.format(cryptoInformation.low_24h),
        total_supply: cryptoInformation.total_supply,
        currentBalance: (balance / cryptoInformation.current_price).toFixed(2),
        unformattedBalance: balance,
        balanceInDollars: formatter.format(balance)
      }
      
      if(tableDataObject.unformattedBalance > 0) {
        data.push(tableDataObject)
      }
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
      title: "Balance in Dollars",
      dataIndex: "balanceInDollars",
      key: "balanceInDollars",
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
    },
    {
      title: "Total Supply",
      dataIndex: "total_supply",
      key: "total_supply",
    }
  ]
  const handleTransfer = (e) => {
    setTransfer(e.target.value)
  }

  const amountHandler = (e) => {
    setAmount(e.target.value)
  }

  const transferTokenHandler = (e) => {
    if (e === 'eth') {
      setTransferToken(eth)
    } else if (e === 'btc') {
      setTransferToken(btc)
    } else if (e === 'ltc') {
      setTransferToken(ltc)
    } else if (e === 'ada') {
      setTransferToken(ada)
    } else if (e === 'bnb') {
      setTransferToken(bnb)
    } else if (e === 'xrp') {
      setTransferToken(xrp)
    } else {
      setTransferToken(null)
    }
  }
  
  const transferCrypto = () => {
    if (transfer === "Deposit") {
      dispatch(transferTokens({provider, exchange, transferType: "Deposit", token: transferToken, amount})) 
      setAmount(0)
    } else {
      dispatch(transferTokens({provider, exchange, transferType: "Withdraw", token: transferToken, amount}))
      setAmount(0)
    }
    dispatch(loadTokensBalances({ tokens: [eth, btc, ltc, ada, xrp, bnb], account }));
  }

  return (
    <>
      <div>
        <div>
          <section>
            <AssetsGraph state={graphTime}  />
          </section>
          <div >
            <Radio.Group onChange={graphTimeHandler}>
              <Radio.Button value={"Year"} >Year</Radio.Button>
              <Radio.Button value={"Month"} >Month</Radio.Button>
              <Radio.Button value={"Week"} >Week</Radio.Button>
            </Radio.Group>
          </div>
          <section>
            <h1>Transfers</h1>
            <Form>
              <Form.Item label="Select">
                <Select style={{ width: 200 }} onChange={(value) => transferTokenHandler(value)}>
                  <Select.Option value="eth">Ethereum</Select.Option>
                  <Select.Option value="btc">Bitcoin</Select.Option>
                  <Select.Option value="xrp">Ripple</Select.Option>
                  <Select.Option value="ltc">Litecoin</Select.Option>
                  <Select.Option value="ada">Cardano</Select.Option>
                  <Select.Option value="bnb">Binance Coin</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="Transfer Type" name="layout">
                <Radio.Group >
                  <Radio.Button value="Deposit" onChange={(value) => handleTransfer(value)}>Deposit</Radio.Button>
                  <Radio.Button value="Withdraw" onChange={(value) => handleTransfer(value)}>Withdraw</Radio.Button>
                </Radio.Group>
              </Form.Item>
              <Form.Item label="Transfer Amount">
                <Input
                  type="text"
                  id='amount'
                  placeholder='0'
                  value={amount === 0 ? '' : amount} 
                  onChange={(e) => amountHandler(e)} 
                  style={{ width: 200 }}
                />
              </Form.Item>
              <Form.Item>
                <Space size="middle">
                  <Button onClick={() => transferCrypto()}>Transfer</Button>
                </Space>
              </Form.Item>
            </Form>
          </section>
        </div>
        <div>
        <h3>Token Balances</h3>
        <ul>
          {Object.entries(tokenBalances).map(([key, value]) => (
            <li key={key}>
              {key}: {value}
            </li>
          ))}
        </ul>
        </div>
        <section>
          <h3>My Crypto</h3>
          <Table dataSource={data} columns={columns} rowKey="name" />
        </section>
      </div>
    </>
  )
}

export default AssetsContainer
