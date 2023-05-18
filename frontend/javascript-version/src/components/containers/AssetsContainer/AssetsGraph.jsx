import Chart from 'react-apexcharts';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { loadExchangeBalances } from '../../../store/reducers/exchangeBalanceReducers';
import { Spin } from "antd"
import { fetchCryptoDataWithInterval } from '../../../store/reducers/cryptoReducers';


const AssetsGraph = ({ state }) => {
  const dispatch = useDispatch()
  const exchange = useSelector(state => state.exchangeReducers.exchange)

  const eth = useSelector(state => state.tokenReducers.entities?.ETH?.token)
  const btc = useSelector(state => state.tokenReducers.entities?.BTC?.token)
  const ltc = useSelector(state => state.tokenReducers.entities?.LTC?.token)
  const xrp = useSelector(state => state.tokenReducers.entities?.XRP?.token)
  const bnb = useSelector(state => state.tokenReducers.entities?.BNB?.token)
  const ada = useSelector(state => state.tokenReducers.entities?.ADA?.token)
  const account = useSelector(state => state.connectionReducers.account)
  const tokens = [eth, btc, ltc, xrp, bnb, ada]

  const exchangeTokens = useSelector(state => state.exchangeBalanceReducers.entities)
  const exchangeCryptoSymbols = Object.keys(exchangeTokens)

  const allCryptos = useSelector(state => state.cryptoReducers.entities)
  const allCryptoValues = Object.values(allCryptos)

  const cachedIntervalData = useSelector(state => state.cryptoReducers?.cachedIntervalData)

  useEffect(() => {
    if (!!exchange && eth && btc && ltc && xrp && bnb && ada && account) {
      dispatch(loadExchangeBalances({ exchange, tokens, account }))
    }
  }, [dispatch, exchange, eth, btc, ltc, xrp, bnb, ada, account])

  useEffect(() => {
    if (Object.values(cachedIntervalData).length === 0) {
      dispatch(fetchCryptoDataWithInterval({cryptoId: 'bitcoin'}))
      dispatch(fetchCryptoDataWithInterval({cryptoId: 'ethereum'}))
      dispatch(fetchCryptoDataWithInterval({cryptoId: 'binancecoin'}))
      dispatch(fetchCryptoDataWithInterval({cryptoId: 'ripple'}))
      dispatch(fetchCryptoDataWithInterval({cryptoId: 'cardano'}))
      dispatch(fetchCryptoDataWithInterval({cryptoId: 'litecoin'}))
    }
  }, [cachedIntervalData.length])


  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  });

  if(!Object.keys(exchangeTokens).length) {
    return <Spin size="large" />
  }
  let totalBalance = []
  let currentOwnedCrypto = []
  let pricesById

  if (allCryptos && exchangeTokens) {

    allCryptoValues.forEach(cryptoInfo => {

      const cryptoSymbol = cryptoInfo.symbol.toUpperCase()

      if(exchangeCryptoSymbols.includes(cryptoSymbol)) {
        const correspondingExchangeCrypto = exchangeTokens[cryptoSymbol]
        currentOwnedCrypto.push(correspondingExchangeCrypto)
        let balance = parseFloat(correspondingExchangeCrypto) * cryptoInfo.current_price
        totalBalance.push(balance)
      }
    })

    pricesById = exchangeCryptoSymbols.reduce((acc, crypto) => {
      const symbol = crypto.toLowerCase()
      const id = allCryptos[symbol].id;
      const cachedData = cachedIntervalData[id];
      const prices = cachedData?.prices ?? [];
    
      return {
        ...acc,
        [id]: prices,
      };
    }, {});
  }

  const allCryptoDates = pricesById?.ethereum.map(d => d[0]) ??  []
  
  const ethereumAnnualPrices = pricesById?.ethereum.map(d => d[1]) ?? []
  const ethereumGraphArray = ethereumAnnualPrices.map(price => {
    return price * parseInt(exchangeTokens.ETH) 
  })

  const bitcoinAnnualPrices = pricesById?.bitcoin.map(d => d[1])
  const bitcoinGraphArray = bitcoinAnnualPrices.map(price => {
    return price * parseInt(exchangeTokens.BTC)
  })
  
  const litecoinAnnualPrices = pricesById?.litecoin.map(d => d[1])
  const litecoinGraphArray = litecoinAnnualPrices.map(price => {
    return price * parseInt(exchangeTokens.LTC)
  })
  
  const rippleAnnualPrices = pricesById?.ripple.map(d => d[1])
  const rippleGraphArray = rippleAnnualPrices.map(price => {
    return price * parseInt(exchangeTokens.XRP)
  })
  
  const cardanoAnnualPrices = pricesById?.cardano.map(d => d[1])
  const cardanoGraphArray = cardanoAnnualPrices.map(price => {
    return price * parseInt(exchangeTokens.ADA)
  })
  
  const binancecoinAnnualPrices = pricesById?.binancecoin.map(d => d[1])
  const binancecoinGraphArray = binancecoinAnnualPrices.map(price => {
    return price * parseInt(exchangeTokens.BTC)
  })

  const totalAnnualPrices = ethereumGraphArray.map((num, index) => 
    num + bitcoinGraphArray[index] + litecoinGraphArray[index] + rippleGraphArray[index] + cardanoGraphArray[index] + binancecoinGraphArray[index]);



  totalBalance = totalBalance.reduce((a,b) => a + parseInt(b), 0)
  let totalBalanceFormatted = formatter.format(totalBalance)

  const options = {
    chart: {
      height: 350,
      type: 'line',
      zoom: {
        enabled: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 2.5
    },
    title: {
      text: `Total Balance ${totalBalanceFormatted}`,
      align: 'left'
    },
    grid: {
      row: {
        colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
        opacity: 0.5
      },
    },
    xaxis: {
      categories: state.target?.value === 'Year'
      ? allCryptoDates?.map((date, index) => {
            if (index === 0 || index === 45 || index === 90 || index === 135 || index === 180 || index === 225 || index === 270 || index === 315 || index === 360) {
              return date
            } else {
              return ""
            }
          })
      : state.target?.value === 'Month'
        ? allCryptoDates?.slice(-31).map((date, index) => {    
              if (index === 0 || index === 5 || index === 10 || index === 15 || index === 20 || index === 25 || index === 30) {
                return date
              } else {
                return ""
              }
            })
        : state.target?.value === 'Week'
          ? allCryptoDates.slice(-8)
          : [],
          
        labels: {
          formatter: (value) => {
            const date = new Date(value)
            const options = { month: '2-digit', day: '2-digit', year: 'numeric' }
            return date.toLocaleDateString('en-US', options)
          },
          rotate: 60,
          trim: false,
          offsetX: 3,
          offsetY: 50,
          style: {
            fontSize: '11px',
          },
          // show every other label to avoid overlap
          showDuplicates: false,
          hideOverlappingLabels: true,
          trim: true,
          rotateAlways: true,
        },
      },
      
      
    yaxis: {
      opposite: false,
      labels: {
        formatter: function (value) {
          return formatter.format(value);
        }
      }
    },
    legend: {
      horizontalAlign: 'left'
    }
  }

  const series = [{
    name: "Price",
    data: state.target.value === 'Year' ? (
      totalAnnualPrices
    ) : state.target.value === 'Month' ? (
      totalAnnualPrices.slice(-31)
    ) : state.target.value === 'Week' ? (
      totalAnnualPrices.slice(-8)
    ) : null
  }]

  return (
    <div>
      <Chart
        options={options}
        series={series}
        type='line'
        height='350'
        width='75%'
      />
    </div>
  )

}
export default AssetsGraph