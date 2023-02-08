import { Table } from 'antd';
import React from 'react'
import { useLoaderData } from 'react-router'
import { cryptoSelectors } from '../../../store/reducers/cryptoReducers';
import LayoutWrapper from '../../LayoutWrapper.jsx/LayoutWrapper';
import { useSelector } from 'react-redux'

const HomeContainer = () => {
  const { pageKey } = useLoaderData();
  const cryptoList = useSelector(state => state.cryptoReducers.entities)

  const columns = [
    {
      title: "Crypto Name",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "Price",
      dataIndex: "current_price",
      key: "current_price"
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
    }
  ]// high_24h low_24h price_change_24h total_supply market_cap

  return (
    <LayoutWrapper currentRoute={pageKey}>
      <div>
        <section>

        </section>
        <section>
          <h3>Markets</h3>
          <Table contents={cryptoList} columns={columns} />
        </section>
      </div>
    </LayoutWrapper>
  )
}

export default HomeContainer
