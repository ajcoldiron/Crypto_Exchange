import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { 
  loadProvider,
  loadNetwork,
  initAccountConnection
 } from './store/reducers/connectionReducers'
import { loadTokens } from './store/reducers/tokenReducers'
import { loadExchange } from './store/reducers/exchangeReducers'
import config from './config.json'
import { RouterProvider } from "react-router"
import { router } from './core/router'
import { subscribeToTransfers } from './store/reducers/transferReducers'
import { initAllData } from './core/redux'
import { subscribeToPurchase } from './store/reducers/purchaseReducer'
import { loadAllOrders, loadFilledOrders, loadCancelledOrders } from './store/reducers/OrdersReducer'


function App() {
  const dispatch = useDispatch()
  initAllData();

  const loadBlockchaindata = async () => {
    const provider = await dispatch(loadProvider())
    const chainId = await dispatch(loadNetwork(provider.payload))
    await dispatch(initAccountConnection(provider.payload))

    const Eth = config[chainId.payload].eth
    const Btc = config[chainId.payload].btc
    const Ltc = config[chainId.payload].ltc
    const Xrp = config[chainId.payload].xrp
    const Bnb = config[chainId.payload].bnb
    const Ada = config[chainId.payload].ada

    
    const addresses = [Eth.address, Btc.address, Ltc.address, Xrp.address, Bnb.address, Ada.address]
    await dispatch(loadTokens({ provider: provider.payload, addresses }))

    const exchangeAddress = config[chainId.payload].exchange.address
    const exchange = await dispatch(loadExchange({ provider: provider.payload, exchange: exchangeAddress }))
    dispatch(subscribeToTransfers())
    dispatch(subscribeToPurchase())
    dispatch(loadAllOrders({ exchange, provider }))
    dispatch(loadFilledOrders({ exchange, provider }))
    dispatch(loadCancelledOrders({ exchange, provider }))
  }

  
  useEffect(() => {
    loadBlockchaindata();
  }, [loadBlockchaindata])
  return (
    <RouterProvider router={router}/>
  );
}

export default App;
