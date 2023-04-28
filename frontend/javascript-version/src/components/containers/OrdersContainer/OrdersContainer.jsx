import { useDispatch, useSelector } from 'react-redux'
import LayoutWrapper from '../../LayoutWrapper.jsx/LayoutWrapper'
import { loadAllOrders, loadFilledOrders, loadCancelledOrders } from '../../../store/reducers/ordersReducer'
import { useEffect } from 'react'
import { Table, Button, Space } from 'antd'
import { ethers } from 'ethers'
import styles from './Orders.modules.css'
import { fillOrder, cancelOrder } from '../../../store/reducers/ordersReducer'


const OrdersContainer = () => {
  const dispatch = useDispatch()
  const exchange = useSelector(state => state.exchangeReducers.exchange)
  const provider = useSelector(state => state.connectionReducers.ethersConnection)
  const openOrders = useSelector(state => state.ordersReducer?.entities?.allOrders)
  const filledOrders = useSelector(state => state.ordersReducer?.entities?.filledOrders)
  const cancelledOrders = useSelector(state => state.ordersReducer?.entities?.cancelledOrders)

  useEffect(() => {
    if (!!exchange && !!provider) {
      dispatch(loadAllOrders({ exchange, provider }))
      dispatch(loadFilledOrders({ exchange, provider }))
      dispatch(loadCancelledOrders({ exchange, provider }))
    }
  }, [dispatch, exchange, provider])

  const fillHandler = (order) => {
    dispatch(fillOrder({ provider, exchange, order}))
  }

  const cancelHandler = (order) => {
    dispatch(cancelOrder({ provider, exchange, order}))
  }

  let openOrdersData = []
  let filledOrdersData = []
  let cancelledOrdersData = []

  if(!!openOrders) {
    openOrders.forEach(order => {

      let formattedTime = ethers.utils.formatUnits(order.timestamp) * 10**18
      let orderTime = new Date(formattedTime)
      let dateTime = orderTime.toLocaleDateString()
  
      const orderId = ethers.utils.formatUnits(order.id) * 10**18
      const formattedAmountGet = ethers.utils.formatUnits(order.amountGet)
      const formattedAmountGive = ethers.utils.formatUnits(order.amountGive)
  
      const table = {
        number: orderId,
        buy_address: order.tokenGet,
        buy_amount: formattedAmountGet,
        sell_address: order.tokenGive,
        sell_amount: formattedAmountGive,
        date: dateTime,
        id: order.id,
        user: order.user,
        tokenGet: order.tokenGet,
        amountGet: order.amountGet,
        tokenGive: order.tokenGive,
        amountGive: order.amountGive,
        timestamp: order.timestamp
      }
  
      openOrdersData.push(table)
    })
  }

  if(!!filledOrders) {
    filledOrders.forEach(order => {

      let formattedTime = ethers.utils.formatUnits(order.timestamp) * 10**18
      let orderTime = new Date(formattedTime)
      let dateTime = orderTime.toLocaleDateString()
  
      const orderId = ethers.utils.formatUnits(order.id) * 10**18
      const formattedAmountGet = ethers.utils.formatUnits(order.amountGet)
      const formattedAmountGive = ethers.utils.formatUnits(order.amountGive)
  
      const table = {
        number: orderId,
        buy_address: order.tokenGet,
        buy_amount: formattedAmountGet,
        sell_address: order.tokenGive,
        sell_amount: formattedAmountGive,
        date: dateTime
      }
  
      filledOrdersData.push(table)
    })
  }

  if(cancelledOrders) {
    cancelledOrders.forEach(order => {

      let formattedTime = ethers.utils.formatUnits(order.timestamp) * 10**18
      let orderTime = new Date(formattedTime)
      let dateTime = orderTime.toLocaleDateString()
  
      const orderId = ethers.utils.formatUnits(order.id) * 10**18
      const formattedAmountGet = ethers.utils.formatUnits(order.amountGet)
      const formattedAmountGive = ethers.utils.formatUnits(order.amountGive)
  
      const table = {
        number: orderId,
        buy_address: order.tokenGet,
        buy_amount: formattedAmountGet,
        sell_address: order.tokenGive,
        sell_amount: formattedAmountGive,
        date: dateTime
      }
  
      cancelledOrdersData.push(table)
    })
  }  

  const openOrdersTable = [
    {
      title: "Order Number",
      dataIndex: "number",
      key: "number",
    },
    {
      title: "Buy Address",
      dataIndex: "buy_address",
      key: "buy_address"
    },
    {
      title: "Buy Amount",
      dataIndex: "buy_amount",
      key: "buy_amount"
    },
    {
      title: "Sell Address",
      dataIndex: "sell_address",
      key: "sell_address"
    },
    {
      title: "Sell Amount",
      dataIndex: "sell_amount",
      key: "sell_amount"
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date"
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (notsure, record) => {
        return (
          <Space size="middle">
            <Button onClick={() => fillHandler(record)} >Fill Order</Button>
            <Button onClick={() => cancelHandler(record)} >Cancel Order</Button>
          </Space>
        )
      }
    }
  ]

  const otherOrdersTable = [
    {
      title: "Order Number",
      dataIndex: "number",
      key: "number",
    },
    {
      title: "Buy Address",
      dataIndex: "buy_address",
      key: "buy_address"
    },
    {
      title: "Buy Amount",
      dataIndex: "buy_amount",
      key: "buy_amount"
    },
    {
      title: "Sell Address",
      dataIndex: "sell_address",
      key: "sell_address"
    },
    {
      title: "Sell Amount",
      dataIndex: "sell_amount",
      key: "sell_amount"
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date"
    }
  ]
  
  return (
    <LayoutWrapper>
      <div>
        <div className={styles.openOrders}>
          <h1>Open Orders</h1>
          <span>
            {openOrders ? (
              <Table dataSource={openOrdersData} columns={openOrdersTable} rowKey="number" />
            ) : (
              <p>No Open Orders Available</p>
            )}
          </span>
        </div>
        <div className={styles.bottomHalf}>
          <div className={styles.filledOrders}>
            <h1>Filled Orders</h1>
            <span>
              {filledOrders ? (
                <Table dataSource={filledOrdersData} columns={otherOrdersTable} rowKey="number" />
              ) : (
                <p>No Filled Orders Available</p>
              )}
            </span>
          </div>
          <div className={styles.cancelledOrders}>
            <h1>Cancelled Orders</h1>
            <span>
              {cancelledOrders ? (
                <Table dataSource={cancelledOrdersData} columns={otherOrdersTable} rowKey="number" />
              ) : (
                <p>No Cancelled Orders Available</p>
              )}
            </span>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  )
}

export default OrdersContainer
