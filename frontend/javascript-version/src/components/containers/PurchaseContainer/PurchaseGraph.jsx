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
  const mergedCryptoDatesArray = mergedCryptoPrices.map(mcp => new Date(mcp[0]).toISOString().substring(0,10))

   const options = {
        chart: {
          type: 'area',
          height: 400,
          zoom: {
            enabled: false
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'smooth',
          width: 2
        },
    
        title: {
          text: 'My Balance',
          align: 'left'
        },
        subtitle: {
          text: ``,
          align: 'left'
        },
        xaxis: {
          type: 'string',
          categories: mergedCryptoDatesArray.map((date, index) => {
            if (index === 0 || index === 60 || index === 120 || index === 180 || index === 240 || index === 300 || index === 360) {
              return Date.parse(date);
            }
            return ""
          }),
          // mergedCryptoDatesArray,
          labels: {
            // formatter: function (value, index) {
            //   if (index === 0 || index === 60 || index === 120 || index === 180 || index === 240 || index === 300 || index === 360) {
            //     const date = new Date(value)
            //     const options = { month: '2-digit', day: '2-digit', year: 'numeric' }
            //     return date.toLocaleDateString('en-US', options)
            //   }
            //   return ''; // Return empty string for all other dates
            // },
            formatter: function (value) {
              const date = new Date(value)
              const options = { month: '2-digit', day: '2-digit', year: 'numeric' }
              return date.toLocaleDateString('en-US', options)
            },
            rotate: 60,
            trim: false,
            offsetX: 10,
            offsetY: 50,
            style: {
              fontSize: '12px',
            },
          },
        },
        yaxis: {
          opposite: true,
          labels: {
            formatter: function (value) {
              return value.toFixed(2);
            }
          }
        },
        legend: {
          horizontalAlign: 'left'
        }
    }
    
    const series = [{
        name: "Price",
        data: mergedCryptoPrices?.map(mcp => mcp[1])
    }]

    return (
        <div style={{width: "600px", marginLeft: "20px"}}>
            <Chart
                options={options}
                series={series}
                type='line'
                height='400'
                width='100%'
            />
        </div>
    )
}
export default PurchaseGraph
