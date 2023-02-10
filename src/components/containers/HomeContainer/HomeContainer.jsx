import { Table, Button, Space } from 'antd';
import React, { useState } from 'react'
import { useLoaderData } from 'react-router'
import { cryptoSelectors, cryptoSelect, cryptoUnselect } from '../../../store/reducers/cryptoReducers';
import LayoutWrapper from '../../LayoutWrapper.jsx/LayoutWrapper';
import { useSelector, useDispatch } from 'react-redux'
import styles from './HomeContainer.module.css'

const HomeContainer = () => { 
  const [isGraph, setIsGraph] = useState(false);
  const { pageKey } = useLoaderData();
  const dispatch = useDispatch();
  const cryptoList = useSelector(cryptoSelectors.selectAll)
  const selectedCryptos = useSelector(state => state.cryptoReducers.cryptoSelect)

  const selectHandler = (crypto) => {
    dispatch(cryptoSelect(crypto))
      setIsGraph(true);
  }

  const unselectHandler = (crypto) => {
    dispatch(cryptoUnselect(crypto))
      setIsGraph(false);
  }

  const columns = [
    {
      title: "Crypto Name",
      dataIndex: "name",
      key: "name",
      sorter: {
        compare : (a,b) => b.name - a.name
      }
    },
    {
      title: "Price",
      dataIndex: "current_price",
      key: "current_price",
      sorter: {
        compare : (a,b) => b.current_price - a.current_price
      }
    },
    {
      title: "24hr High",
      dataIndex: "high_24h",
      key: "high_24h"
    },
    {
      title: "24hr Low",
      dataIndex: "low_24h",
      key: "low_24h"
    },
    {
      title: "Total Supply",
      dataIndex: "total_supply",
      key: "total_supply"
    },
    {
      title: "View Market",
      dataIndex: "market",
      key: "market",
      render : (record) => (
        <Space size="middle">
          <Button onClick={() => selectHandler(record)} >Select Market</Button>
          <Button onClick={() => unselectHandler(record)} >Unselect Market</Button>
        </Space>
      )
    }
  ]// high_24h low_24h price_change_24h total_supply market_cap

  return (
    <LayoutWrapper currentRoute={pageKey}>
      <div>
        <section className={styles.upper_half}>
          {isGraph === true ? (
            <h1>`Show Graph of ${selectedCryptos}`</h1>
          ) : (
            <h1>Select a Market</h1>
          )}
        </section>
        <section className={styles.lower_half}>
          <h3>Markets</h3>
          <Table dataSource={cryptoList} columns={columns}  />
        </section>
      </div>
    </LayoutWrapper>
  )
}

export default HomeContainer
