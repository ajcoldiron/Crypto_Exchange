import { useEffect } from 'react';
import Chart from 'react-apexcharts';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCryptoDataWithInterval } from '../../../store/reducers/cryptoReducers';
import { DateTime } from 'luxon';


const PurchaseGraph = ({purchaseCryptoId, sellCryptoId, state}) => {
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
  // const mergedCryptoDatesArray = mergedCryptoPrices.map(mcp => new Date(mcp[0]).toISOString().substring(0,10))
  const mergedCryptoDatesArray = mergedCryptoPrices.map(mcp =>
    DateTime.fromMillis(mcp[0]).toISODate()
  );
  const allPrices = mergedCryptoPrices?.map(mcp => mcp[1])


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
          categories: state.target?.value === 'Year'
          ? mergedCryptoDatesArray?.map((date, index) => {
                if (index === 0 || index === 45 || index === 90 || index === 135 || index === 180 || index === 225 || index === 270 || index === 315 || index === 360) {
                  return date
                } else {
                  return ""
                }
              })
          : state.target?.value === 'Month'
            ? mergedCryptoDatesArray?.slice(-31).map((date, index) => {   
                  if (index === 0 || index === 5 || index === 10 || index === 15 || index === 20 || index === 25 || index === 30 || index === (mergedCryptoDatesArray.length - 1)) {
                    return new Date(date).getTime()
                  } else {
                    return ""
                  }
                })
            : state.target?.value === 'Week'
              ? mergedCryptoDatesArray.slice(-8).map(date => new Date(date).getTime())
              : [],

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
              const options = { month: '2-digit', day: '2-digit', year: 'numeric', timeZone: 'America/Chicago' }
              return date.toLocaleDateString('en-US', options)
            },
            rotate: 60,
            trim: false,
            offsetX: 10,
            offsetY: 50,
            style: {
              fontSize: '12px',
            },
            showDuplicates: false,
            hideOverlappingLabels: true,
            trim: true,
            rotateAlways: true,
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
        data: state.target.value === 'Year' ? (
          allPrices
        ) : state.target.value === 'Month' ? (
          allPrices.slice(-31)
        ) : state.target.value === 'Week' ? (
          allPrices.slice(-8)
        ) : null
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
