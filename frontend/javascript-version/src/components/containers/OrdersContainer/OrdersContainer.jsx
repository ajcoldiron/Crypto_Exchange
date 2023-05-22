import { useDispatch, useSelector } from 'react-redux'
import LayoutWrapper from '../../LayoutWrapper.jsx/LayoutWrapper'
import { loadAllOrders, cancelOrder, loadFilledOrders, loadCancelledOrders, fillOrderInitiate } from '../../../store/reducers/ordersReducer'
import { useEffect, useState } from 'react'
import { Table, Button, Space } from 'antd'
import { ethers } from 'ethers'
import styles from './Orders.modules.css'
// import moment from "moment";


const addressMapping = {
  "0x5FbDB2315678afecb367f032d93F642f64180aa3": "Ethereum",
  "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512": "Bitcoin",
  "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0": "Litecoin",
  "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9": "Ripple",
  "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9": "Binance Coin",
  "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707": "Cardano",
  "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266": "Local Host User1",
  "0x70997970C51812dc3A010C7d01b50e0d17dc79C8": "Local Host User2",
  "0x34a685bD5366D48BF53d4C91F621A250769DC641": "Sepolia User1",
  "0x24fC0A7B9620994d1B5211b36A841a1089ebaF66": "Sepolia User2",
}


const OrdersContainer = () => {
  const dispatch = useDispatch()
  const exchange = useSelector(state => state.exchangeReducers.exchange)
  const provider = useSelector(state => state.connectionReducers.ethersConnection)
  const allOrders = useSelector(state => state.ordersReducer?.entities)
  const filledOrders = useSelector(state => state.ordersReducer?.filledOrders)
  const cancelledOrders = useSelector(state => state.ordersReducer?.cancelledOrders)

  const [function1CallFlag, setFunction1CallFlag] = useState(false);
  // const [function2CallFlag, setFunction2CallFlag] = useState(false);

  useEffect(() => {
    if (function1CallFlag) {
      window.location.reload();
    }
  }, [function1CallFlag]);


  useEffect(() => {
    if (!!exchange && !!provider) {
      dispatch(loadFilledOrders({ exchange, provider }))
      dispatch(loadCancelledOrders({ exchange, provider }))
      dispatch(loadAllOrders({ exchange, provider }))
    }
  }, [dispatch, exchange, provider])

  const fillHandler = (order) => {
    setFunction1CallFlag(true);
    const orderToFill = allOrders[order.id]
    dispatch(fillOrderInitiate({ provider, exchange, order : orderToFill }))
    setFunction1CallFlag(false);
  }

  const cancelHandler = (order) => {
    setFunction1CallFlag(true);
    const orderToFill = allOrders[order.id]
    dispatch(cancelOrder({ provider, exchange, order : orderToFill }))
    setFunction1CallFlag(false);
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

      const tokenGetToken = addressMapping[openOrder.tokenGet]
      const tokenGiveToken = addressMapping[openOrder.tokenGive]
      const user = addressMapping[openOrder.user]

      const table = {
        id: orderId,
        tokenGet: tokenGetToken,
        amountGet: openOrder.amountGet,
        tokenGive: tokenGiveToken,
        amountGive: openOrder.amountGive,
        timestamp: openOrder.timestamp,
        purchaser: user
      }
  
      openOrdersData.push(table)
    })
  }

  if(!!filledOrders) {
    const filledOrderKeys = Object.keys(filledOrders)

    filledOrderKeys.forEach(key => {
      const filledOrder = filledOrders[key]
      const orderId = ethers.utils.formatUnits(filledOrder.id) * 10**18

      const tokenGetToken = addressMapping[filledOrder.tokenGet]
      const tokenGiveToken = addressMapping[filledOrder.tokenGive]
      const user = addressMapping[filledOrder.user]
      
      const table = {
        id: orderId,
        tokenGet: tokenGetToken,
        amountGet: filledOrder.amountGet,
        tokenGive: tokenGiveToken,
        amountGive: filledOrder.amountGive,
        timestamp: filledOrder.timestamp,
        purchaser: user
      }
  
      filledOrdersData.push(table)
    })
  }

  if(!!cancelledOrders) {
    const cancelledOrderKeys = Object.keys(cancelledOrders)

    cancelledOrderKeys.forEach(key => {
      const cancelledOrder = cancelledOrders[key]
      const orderId = ethers.utils.formatUnits(cancelledOrder.id) * 10**18

      const tokenGetToken = addressMapping[cancelledOrder.tokenGet]
      const tokenGiveToken = addressMapping[cancelledOrder.tokenGive]
      const user = addressMapping[cancelledOrder.user]

      const table = {
              id: orderId,
              tokenGet: tokenGetToken,
              amountGet: cancelledOrder.amountGet,
              tokenGive: tokenGiveToken,
              amountGive: cancelledOrder.amountGive,
              timestamp: cancelledOrder.timestamp,
              purchaser: user
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
      title: "Buy Token",
      dataIndex: "tokenGet",
      key: "tokenGet"
    },
    {
      title: "Buy Amount",
      dataIndex: "amountGet",
      key: "amountGet"
    },
    {
      title: "Sell Token",
      dataIndex: "tokenGive",
      key: "tokenGive"
    },
    {
      title: "Sell Amount",
      dataIndex: "amountGive",
      key: "amountGive"
    },
    {
      title: "Purchaser",
      dataIndex: "purchaser",
      key: "purchaser"
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
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Buy Token",
      dataIndex: "tokenGet",
      key: "tokenGet"
    },
    {
      title: "Buy Amount",
      dataIndex: "amountGet",
      key: "amountGet"
    },
    {
      title: "Sell Token",
      dataIndex: "tokenGive",
      key: "tokenGive"
    },
    {
      title: "Sell Amount",
      dataIndex: "amountGive",
      key: "amountGive"
    },
    {
      title: "Purchaser",
      dataIndex: "purchaser",
      key: "purchaser"
    },
    {
      title: "Date & Time",
      dataIndex: "timestamp",
      key: "timestamp"
    }
  ]
  
  return (
    <LayoutWrapper>
      <div>
        <div className={styles.openOrders}>
          <h1>Open Orders</h1>
          <span>
            {allOrders ? (
              <Table dataSource={openOrdersData} columns={openOrdersTable} rowKey="id" />
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
                <Table dataSource={filledOrdersData} columns={otherOrdersTable} rowKey="id" />
              ) : (
                <p>No Filled Orders Available</p>
              )}
            </span>
          </div>
          <div className={styles.cancelledOrders}>
            <h1>Cancelled Orders</h1>
            <span>
              {cancelledOrders ? (
                <Table dataSource={cancelledOrdersData} columns={otherOrdersTable} rowKey="id" />
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
