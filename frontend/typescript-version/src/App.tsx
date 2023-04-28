import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import config from './config.json'
import { RouterProvider } from "react-router"
import { router } from './core/router'
import { initAllData } from './core/redux'
import { loadProvider, loadNetwork, initAccountConnection } from './store/reducers/connectionReducers'
import { loadTokens } from './store/reducers/tokenReducers'
import { loadExchange } from './store/reducers/exchangeReducers'

function App() {
  const dispatch = useDispatch()

  const loadBlockchaindata = async () => {
    const provider = dispatch(loadProvider() as any)
    const network = dispatch(loadNetwork(provider) as any)
    dispatch(initAccountConnection(provider) as any)

    const eth = (config as any)[network].eth
    const btc = (config as any)[network].btc
    // dispatch(loadTokens(provider) as any, (eth.address) as any)

    const exchange = (config as any)[network].exchange
    // dispatch(loadExchange((provider) as any, exchange.address) as any)

  }
  
  useEffect(() => {
    loadBlockchaindata();
  })
  
  return (
    <RouterProvider router={router}/>
  );
}

export default App;
