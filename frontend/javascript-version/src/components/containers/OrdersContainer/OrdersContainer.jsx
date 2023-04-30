import { useDispatch, useSelector } from 'react-redux'
import LayoutWrapper from '../../LayoutWrapper.jsx/LayoutWrapper'
import { loadAllOrders, loadFilledOrders, loadCancelledOrders } from '../../../store/reducers/ordersReducer'
import { useEffect } from 'react'
import { Table, Button, Space } from 'antd'
import { ethers } from 'ethers'
import styles from './Orders.modules.css'
import { fillOrder, cancelOrder } from '../../../store/reducers/ordersReducer'
// import moment from "moment";


const OrdersContainer = () => {
  const dispatch = useDispatch()
  const exchange = useSelector(state => state.exchangeReducers.exchange)
  const provider = useSelector(state => state.connectionReducers.ethersConnection)
  const allOrders = useSelector(state => state.ordersReducer?.entities?.allOrders)
  const filledOrders = useSelector(state => state.ordersReducer?.entities?.filledOrders)
  const cancelledOrders = useSelector(state => state.ordersReducer?.entities?.cancelledOrders)

  useEffect(() => {
    if (!!exchange && !!provider) {
      dispatch(loadFilledOrders({ exchange, provider }))
      dispatch(loadCancelledOrders({ exchange, provider }))
      dispatch(loadAllOrders({ exchange, provider }))
    }
  }, [dispatch, exchange, provider])

  const fillHandler = (order) => {
    const orderToFill = allOrders[order.number]
    console.log(orderToFill)
    dispatch(fillOrder({ provider, exchange, order }))
  }

  const cancelHandler = (order) => {
    dispatch(cancelOrder({ provider, exchange, order }))
  }

  let openOrdersData = []
  let filledOrdersData = []
  let cancelledOrdersData = []
  
  if(!!allOrders && !!filledOrders && !!cancelledOrders) {
    const allOrderKeys = Object.keys(allOrders)
    const filledOrderKeys = Object.keys(filledOrders)
    const cancelledOrderKeys = Object.keys(cancelledOrders)

    const openOrderKeys = allOrderKeys.filter(id => !filledOrderKeys.includes(id) && !cancelledOrderKeys.includes(id))

    openOrderKeys.forEach(key => {
      const openOrder = allOrders[key]
      const orderId = ethers.utils.formatUnits(openOrder.id) * 10**18
  
      const table = {
        id: orderId,
        tokenGet: openOrder.tokenGet,
        amountGet: openOrder.amountGet,
        tokenGive: openOrder.tokenGive,
        amountGive:openOrder.amountGive,
        timestamp: openOrder.timestamp
      }
  
      openOrdersData.push(table)
    })
  }

  if(!!filledOrders) {
    const filledOrderKeys = Object.keys(filledOrders)

    filledOrderKeys.forEach(key => {
      const filledOrder = filledOrders[key]
      const orderId = ethers.utils.formatUnits(filledOrder.id) * 10**18
      
      const table = {
        number: orderId,
        buy_address: filledOrder.tokenGet,
        buy_amount: filledOrder.amountGet,
        sell_address: filledOrder.tokenGive,
        sell_amount: filledOrder.amountGive,
        date: filledOrder.timestamp
      }
  
      filledOrdersData.push(table)
    })
  }

  if(!!cancelledOrders) {
    const cancelledOrderKeys = Object.keys(cancelledOrders)

    cancelledOrderKeys.forEach(key => {
      const cancelledOrder = cancelledOrders[key]
      const orderId = ethers.utils.formatUnits(cancelledOrder.id) * 10**18

      const table = {
              number: orderId,
              buy_address: cancelledOrder.tokenGet,
              buy_amount: cancelledOrder.amountGet,
              sell_address: cancelledOrder.tokenGive,
              sell_amount: cancelledOrder.amountGive,
              date: cancelledOrder.timestamp
      }

      cancelledOrdersData.push(table)
    })
  }  

  const openOrdersTable = [
    {
      title: "Order ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Buy Address",
      dataIndex: "tokenGet",
      key: "tokenGet"
    },
    {
      title: "Buy Amount",
      dataIndex: "amountGet",
      key: "amountGet"
    },
    {
      title: "Sell Address",
      dataIndex: "tokenGive",
      key: "tokenGive"
    },
    {
      title: "Sell Amount",
      dataIndex: "amountGive",
      key: "amountGive"
    },
    {
      title: "Date & Time",
      dataIndex: "timestamp",
      key: "timestamp"
    },
    {
      title: "Fill or Cancel Order",
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
      title: "Order ID",
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
      title: "Date & Time",
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
            {allOrders ? (
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
