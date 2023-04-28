import { Table, Button, Space } from 'antd';
import React, { useState } from 'react'
import { useLoaderData } from 'react-router'
import { cryptoSelectors, cryptoSelect, cryptoUnselect, fetchCryptoDataWithInterval } from '../../../store/reducers/cryptoReducers';
import LayoutWrapper from '../../LayoutWrapper/LayoutWrapper';
import { useSelector, useDispatch } from 'react-redux'
import styles from './HomeContainer.module.css'
import CryptoGraph from './CryptoGraph';
import { RootState, store } from '../../../core/redux';
import { ICrypto } from '../../../typings/crypto';

const HomeContainer = () => {
  const dispatch = useDispatch();
  const cryptoList = useSelector(cryptoSelectors.selectAll)
  const selectedCryptos = useSelector((state: RootState) => state.cryptoReducers.selectedCryptos)
  const selectedCryptoObject = useSelector((state: RootState) => state.cryptoReducers.selectedCrypto)
  const [isGraph, setIsGraph] = useState(false)
  // console.log(selectedCryptos)
  const selectHandler = (crypto: ICrypto) => {
    dispatch(cryptoSelect(crypto))
    store.dispatch(fetchCryptoDataWithInterval({
      cryptoId: crypto.id
    }))
    setIsGraph(true)
  }

  const unselectHandler = () => {
    dispatch(cryptoUnselect())
    setIsGraph(false)
  }

  const columns = [
    {
      title: "Crypto Name",
      dataIndex: "name",
      key: "name",
      // sorter: {
      //   compare: (a: ICrypto, b: ICrypto) => b.name - a.name
      // }
    },
    {
      title: "Price",
      dataIndex: "current_price",
      key: "current_price",
      sorter: {
        compare: (a: ICrypto, b: ICrypto) => b.current_price - a.current_price
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
      dataIndex: "",
      key: "",
      render: (notsure: any, record: ICrypto) => {
        return (
          <Space size="middle">
            <Button onClick={() => selectHandler(record)} >Select Market</Button>
            <Button onClick={() => unselectHandler()} >Unselect Market</Button>
          </Space>
        )
      }
    }
  ]// high_24h low_24h price_change_24h total_supply market_cap

  return (
    <LayoutWrapper>
      <div>
        <section className={styles.upper_half}>
          {isGraph ? (
            <>
            <CryptoGraph />
            <div style={{display:"flex"}}>
            {selectedCryptoObject ? (
                <div key={selectedCryptoObject.id}>
                  <div>{selectedCryptoObject.id}</div>
                  <img src={selectedCryptoObject.image} width={100} />
                </div>
              )
             : null}
            </div>
            </>
          ) : (
            <h1>Select a Market</h1>
          )}
        </section>
        <section className={styles.lower_half}>
          <h3>Markets</h3>
          <Table dataSource={cryptoList} columns={columns} rowKey="name" />
        </section>
      </div>
    </LayoutWrapper>
  )
}

export default HomeContainer
