import React from 'react'
import { useSelector } from 'react-redux'
import { Divider, Table } from 'antd';
import styles from "./TokenBalances.module.css"

const highlightedTokens = ["ETH", "BTC", "LTC", "XRP", "BNB"]

export default function ExchangeBalances() {
  const allCryptosBalances = useSelector(state => state.tokenBalanceReducer.entities)

  const balances = highlightedTokens.reduce((acc, symbol) => {
    let balance = 0
    if (symbol in allCryptosBalances) {
      balance = allCryptosBalances[symbol]      
    }
    return { ...acc, [symbol]: balance }
  }, {})
  
  const balanceSymbols = Object.keys(balances)
  const balance = Object.values(balances)
  
  const columns = [
  {
    title: 'Cryptocurrency',
    dataIndex: 'name',
  },
  {
    title: 'Balance',
    dataIndex: 'balance',
  },
];

const data = [
  {
    key: '1',
    name: `${balanceSymbols[0]}`,
    balance: balance[0],
  },
  {
    key: '2',
    name: `${balanceSymbols[1]}`,
    balance: balance[1],
  },
  {
    key: '3',
    name: `${balanceSymbols[2]}`,
    balance: balance[2],
  },
  {
    key: '4',
    name: `${balanceSymbols[3]}`,
    balance: balance[3],
  },
  {
    key: '5',
    name: `${balanceSymbols[4]}`,
    balance: balance[4],
  },
];

  return (
    <div className={styles.balance}>
      <Divider><b>User's Token Balances</b></Divider>
      <Table columns={columns} dataSource={data} size="small" />
    </div>
  )
}
