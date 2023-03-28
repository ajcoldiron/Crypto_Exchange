import Chart from 'react-apexcharts';
import { useSelector } from 'react-redux';


const CryptoGraph = () => {
  const cryptoName = useSelector((state) => state.cryptoReducers.selectedCrypto.name)
  const cryptoDataByInterval = useSelector((state) => state.cryptoReducers.currentCryptoData)
  const prices = cryptoDataByInterval?.prices ?? []
  // const minValue = Math.min(...prices.map((p) => p[1]))
  // const maxValue = Math.max(...prices.map((p) => p[1]))

  let intervalAndDate1, intervalAndDate2, intervalAndDate3, intervalAndDate4, intervalAndDate5
  let price1, price2, price3, price4, price5
  let interval1Date, interval2Date, interval3Date, interval4Date, interval5Date
  const PriceAndDate = (priceDay) => {
    let price = priceDay[1]
    let dateInUnix = priceDay[0]
    let date = new Date(dateInUnix)
    let newDate = date.toLocaleDateString()
    return [newDate, price]
  }

  if(prices.length > 0) {
    intervalAndDate1 = PriceAndDate(prices[0])
    intervalAndDate2 = PriceAndDate(prices[90])
    intervalAndDate3 = PriceAndDate(prices[180])
    intervalAndDate4 = PriceAndDate(prices[270])
    intervalAndDate5 = PriceAndDate(prices[360])

    price1 = intervalAndDate1[1]
    interval1Date = intervalAndDate1[0]

    price2 = intervalAndDate2[1]
    interval2Date = intervalAndDate2[0]

    price3 = intervalAndDate3[1]
    interval3Date = intervalAndDate3[0]

    price4 = intervalAndDate4[1]
    interval4Date = intervalAndDate4[0]

    price5 = intervalAndDate5[1]
    interval5Date = intervalAndDate5[0]
  } else {
    return null
  }

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
      curve: 'smooth'
    },
    title: {
      text: `Price of ${cryptoName}`,
      align: 'center'
    },
    grid: {
      row: {
        colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
        opacity: 0.5
      },
    },
    xaxis: {
      categories: [interval1Date.toString(), interval2Date.toString(), interval3Date.toString(), interval4Date.toString(), interval5Date.toString()],
    }
  }

  const series = [{
    name: "Price",
    data: [price1, price2, price3, price4, price5]
  }]
//
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

export default CryptoGraph
