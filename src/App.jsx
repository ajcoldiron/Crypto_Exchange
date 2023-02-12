import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { 
  providerLoaded, 
  networkLoaded, 
  accountLoaded, 
  tokenLoaded, 
  exchangeLoaded 
} from '../store/reducers/connectionReducers'
import config from './config.json'
import { RouterProvider } from "react-router"
import { router } from './core/router'

function App() {
  const dispatch = useDispatch()

  const loadBlockchaindata = async () => {
    const provider = dispatch(providerLoaded())
    const chainId = dispatch(networkLoaded(provider))
    dispatch(accountLoaded(provider))

    const Eth = config[chainId].eth
    const Btc = config[chainId].btc
    dispatch(tokenLoaded(provider, [Eth.address, Btc.address]))

    const exchange = config[chainId].exchange
    dispatch(exchangeLoaded(provider, exchange.address))
  }
  
  useEffect(() => {
    loadBlockchaindata();
  })
  
  return (
    <RouterProvider router={router}/>
  );
}

export default App;
