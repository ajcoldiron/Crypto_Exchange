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


function App() {
  const dispatch = useDispatch()

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

    const exchange = config[chainId.payload].exchange 
    await dispatch(loadExchange({ provider: provider.payload, exchange }))
  }

  
  useEffect(() => {
    loadBlockchaindata();
  }, [loadBlockchaindata])
  return (
    <RouterProvider router={router}/>
  );
}

export default App;
