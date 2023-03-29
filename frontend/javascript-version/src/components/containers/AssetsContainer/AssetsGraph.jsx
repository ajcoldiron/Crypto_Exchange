import Chart from 'react-apexcharts';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { loadExchangeBalances } from '../../../store/reducers/exchangeBalanceReducers';
import { Spin } from "antd"
// import { store } from '../../../core/redux';
// import { fetchCryptoDataWithInterval } from '../../../store/reducers/cryptoReducers';



const AssetsGraph = () => {
  const dispatch = useDispatch()
  const exchange = useSelector(state => state.exchangeReducers.exchange)

  const token1 = useSelector(state => state.tokenReducers.entities?.ETH?.token)
  const token2 = useSelector(state => state.tokenReducers.entities?.BTC?.token)
  const token1Symbol = useSelector(state => state.tokenReducers.entities?.ETH?.symbol)
  const token2Symbol = useSelector(state => state.tokenReducers.entities?.BTC?.symbol)
  const account = useSelector(state => state.connectionReducers.account)

  const exchangeTokens = useSelector(state => state.exchangeBalanceReducers.entities)
  const exchangeCryptoSymbols = Object.keys(exchangeTokens)

  const allCryptos = useSelector(state => state.cryptoReducers.entities)
  const allCryptoValues = Object.values(allCryptos)
  // const allCryptoPrices = useSelector(state => state.currentCryptoData.prices)
  useEffect(() => {
    if (!!exchange && token1 && token2 && account && token1Symbol && token2Symbol) {
      const tokens = [token1, token2]
      dispatch(loadExchangeBalances({ exchange, tokens, account, symbols: [token1Symbol, token2Symbol] }))
    }
  }, [dispatch, exchange, token1, token2, account, token1Symbol, token2Symbol])


  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  });

  if(!Object.keys(exchangeTokens).length) {
    return <Spin size="large" />
  }
  let totalBalance = []
  let currentOwnedCrypto = []

  if (allCryptos && exchangeTokens) {

    allCryptoValues.forEach(cryptoInfo => {

      const cryptoSymbol = cryptoInfo.symbol.toUpperCase()
      // console.log(cryptoInfo)

      if(exchangeCryptoSymbols.includes(cryptoSymbol)) {
        const correspondingExchangeCrypto = exchangeTokens[cryptoSymbol]
        currentOwnedCrypto.push(correspondingExchangeCrypto)
        let balance = Number(correspondingExchangeCrypto.balance) * cryptoInfo.current_price
        totalBalance.push(balance)
        currentOwnedCrypto.forEach(crypto => {
          // let amount = crypto.balance
          // let symbol = crypto.symbol.toLowerCase()
          // const stuff = store.dispatch(fetchCryptoDataWithInterval({
          //   cryptoId: symbol
          // }))
          // console.log(stuff)
        })
      }
    })
  }
  totalBalance = totalBalance.reduce((a,b) => a + parseInt(b), 0)
  let totalBalanceFormatted = formatter.format(totalBalance)

  const options = {
    chart: {
      type: 'area',
      height: 350,
      zoom: {
        enabled: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth'
    },

    title: {
      text: 'My Balance',
      align: 'left'
    },
    subtitle: {
      text: `${totalBalanceFormatted}`,
      align: 'left'
    },
    labels: 'placeHolder'//switch to dates
    ,
    xaxis: {
      type: 'string'//switch to dateTime
      ,
    },
    yaxis: {
      opposite: true
    },
    legend: {
      horizontalAlign: 'left'
    }
  }

  const series = [{
    name: "Price",
    data: []
  }]

  return (
    <div>
      <Chart
        options={options}
        series={series}
        type='line'
        height='300'
        width='50%'
      />
    </div>
  )

}
export default AssetsGraph