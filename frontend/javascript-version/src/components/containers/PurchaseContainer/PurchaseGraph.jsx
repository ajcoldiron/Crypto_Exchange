import { useEffect } from 'react';
import Chart from 'react-apexcharts';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCryptoDataWithInterval } from '../../../store/reducers/cryptoReducers';


const PurchaseGraph = ({purchaseCryptoId, sellCryptoId}) => {
  const dispatch = useDispatch()
  const cachedIntervalData = useSelector(state => state.cryptoReducers.cachedIntervalData)

  // 1 . Make sure that the cache for purchase and sell crypto exist
  useEffect(() => {
    if (purchaseCryptoId && sellCryptoId) {
    dispatch(fetchCryptoDataWithInterval({
      cryptoId: purchaseCryptoId
    }))
    dispatch(fetchCryptoDataWithInterval({
      cryptoId: sellCryptoId
    }))
    }
  }, [])
  
  if (!purchaseCryptoId || !sellCryptoId) {
    return null
  }

  let purchaseCryptoPrices = []
  if (purchaseCryptoId in cachedIntervalData) {
    purchaseCryptoPrices =  cachedIntervalData[purchaseCryptoId].prices
  }

  let sellCryptoPrices = []
  if (sellCryptoId in cachedIntervalData) {
    sellCryptoPrices =  cachedIntervalData[sellCryptoId].prices
  }

  let mergedCryptoPrices = []
  if (purchaseCryptoPrices.length && sellCryptoPrices.length) {
    mergedCryptoPrices = purchaseCryptoPrices.map((purchaseCryptoPrice, indexCurrentDay) => {
      const associatedSoldPriceForThisDay = sellCryptoPrices[indexCurrentDay]
      const mergedPrices = [purchaseCryptoPrice[0], purchaseCryptoPrice[1]/associatedSoldPriceForThisDay[1]]
      return mergedPrices;
    })
  }

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
          text: ``,
          align: 'left'
        },
        labels: 'placeHolder'//switch to dates
        ,
        xaxis: {
          // type: 'string'//switch to dateTime
          // ,
          categories: mergedCryptoPrices.map(mcp => new Date(mcp[0]).toISOString().substring(0,10))
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
        data: mergedCryptoPrices.map(mcp => mcp[1])
    }]

    return (
        <div style={{width: "600px"}}>
            <Chart
                options={options}
                series={series}
                type='line'
                height='300'
                width='100%'
            />
        </div>
    )
}
export default PurchaseGraph
