import { Table, Button, Space } from 'antd';
import { useState } from 'react'
import { cryptoSelectors, cryptoSelect, cryptoUnselect, fetchCryptoDataWithInterval } from '../../../store/reducers/cryptoReducers';
import LayoutWrapper from '../../LayoutWrapper.jsx/LayoutWrapper';
import { useSelector, useDispatch } from 'react-redux'
import styles from './HomeContainer.module.css'
import CryptoGraph from './CryptoGraph';
import { persistor } from '../../../core/redux';

const HomeContainer = () => {
  const dispatch = useDispatch();
  const cryptoList = useSelector(cryptoSelectors.selectAll)
  const selectedCryptoObject = useSelector(state => state.cryptoReducers.selectedCrypto)
  const [isGraph, setIsGraph] = useState(false)
  const selectHandler = (crypto) => {
    dispatch(cryptoSelect(crypto))
    dispatch(fetchCryptoDataWithInterval({
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
    },
    {
      title: "Price",
      dataIndex: "current_price",
      key: "current_price",
      sorter: {
        compare: (a, b) => b.current_price - a.current_price
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
      render: (notsure, record) => {
        return (
          <Space size="middle">
            <Button onClick={() => selectHandler(record)} >Select Market</Button>
            <Button onClick={() => unselectHandler()} >Unselect Market</Button>
          </Space>
        )
      }
    }
  ]

  return (
    <LayoutWrapper>
      <div>
        <section className={styles.upper_half}>
          {isGraph ? (
            <>
              <CryptoGraph />
            </>
          ) : (
            <h1>Select a Market</h1>
          )}
        </section>
        <section style={{ display: 'flex', justifyContent: 'flex-end', marginRight: "50px" }}>
          <Button
            onClick={() => {
              persistor.purge();
              window.location.reload();
            }}
          >
            Clear Cache
          </Button>
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
