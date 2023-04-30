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

  const eth = useSelector(state => state.tokenReducers.entities?.ETH?.token)
  const btc = useSelector(state => state.tokenReducers.entities?.BTC?.token)
  const ltc = useSelector(state => state.tokenReducers.entities?.LTC?.token)
  const xrp = useSelector(state => state.tokenReducers.entities?.XRP?.token)
  const bnb = useSelector(state => state.tokenReducers.entities?.BNB?.token)
  const ada = useSelector(state => state.tokenReducers.entities?.ADA?.token)
  const ethSymbol = useSelector(state => state.tokenReducers.entities?.ETH?.symbol)
  const btcSymbol = useSelector(state => state.tokenReducers.entities?.BTC?.symbol)
  const ltcSymbol = useSelector(state => state.tokenReducers.entities?.LTC?.symbol)
  const xrpSymbol = useSelector(state => state.tokenReducers.entities?.XRP?.symbol)
  const bnbSymbol = useSelector(state => state.tokenReducers.entities?.BNB?.symbol)
  const adaSymbol = useSelector(state => state.tokenReducers.entities?.ADA?.symbol)
  const account = useSelector(state => state.connectionReducers.account)
  const tokens = [eth, btc, ltc, xrp, bnb, ada]
  const symbols = [ethSymbol, btcSymbol, ltcSymbol, xrpSymbol, bnbSymbol, adaSymbol]

  const exchangeTokens = useSelector(state => state.exchangeBalanceReducers.entities)
  const exchangeCryptoSymbols = Object.keys(exchangeTokens)

  const allCryptos = useSelector(state => state.cryptoReducers.entities)
  const allCryptoValues = Object.values(allCryptos)

  const cachedIntervalData = useSelector(state => state.cryptoReducers?.cachedIntervalData)
  // const allCryptoPrices = useSelector(state => state.currentCryptoData.prices)
  //eth && btc && ltc && xrp && bnb && ada && ethSymbol && btcSymbol && ltcSymbol && xrpSymbol && bnbSymbol && adaSymbol
  useEffect(() => {
    if (!!exchange && eth && btc && ltc && xrp && bnb && ada && ethSymbol && btcSymbol && ltcSymbol && xrpSymbol && bnbSymbol && adaSymbol && account) {
      dispatch(loadExchangeBalances({ exchange, tokens, account, symbols }))
    }
  }, [dispatch, exchange, eth, btc, ltc, xrp, bnb, ada, account, ethSymbol, btcSymbol, ltcSymbol, xrpSymbol, bnbSymbol, adaSymbol])


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

      if(exchangeCryptoSymbols.includes(cryptoSymbol)) {
        const correspondingExchangeCrypto = exchangeTokens[cryptoSymbol]
        currentOwnedCrypto.push(correspondingExchangeCrypto)
        let balance = Number(correspondingExchangeCrypto.balance) * cryptoInfo.current_price
        totalBalance.push(balance)
      }
    })

    const pricesById = currentOwnedCrypto.reduce((acc, crypto) => {
      const symbol = crypto.symbol.toLowerCase();
      const id = allCryptos[symbol].id;
      const cachedData = cachedIntervalData[id];
      const prices = cachedData.prices;
    
      return {
        ...acc,
        [id]: prices,
      };
    }, {});
    console.log(pricesById)
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