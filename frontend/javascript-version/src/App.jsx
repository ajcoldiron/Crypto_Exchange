import { useDispatch, useSelector } from 'react-redux'
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
import { loadExchangeBalances } from './store/reducers/exchangeBalanceReducers'


function App() {
  const dispatch = useDispatch()

  const loadBlockchaindata = async () => {
    const provider = await dispatch(loadProvider())
    const chainId = await dispatch(loadNetwork(provider.payload))
    await dispatch(initAccountConnection(provider.payload))

    const Eth = config[chainId.payload].eth
    const Btc = config[chainId.payload].btc
    
    const addresses = [Eth.address, Btc.address]
    await dispatch(loadTokens({ provider: provider.payload, addresses }))

    const exchange = config[chainId.payload].exchange 
    await dispatch(loadExchange({ provider: provider.payload, exchange }))
  }

  
  useEffect(() => {
    loadBlockchaindata();
  })
  return (
    <RouterProvider router={router}/>
  );
}

export default App;
