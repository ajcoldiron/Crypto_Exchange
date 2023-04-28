import Chart from 'react-apexcharts';
import { useSelector } from 'react-redux';


const CryptoGraph = () => {
  const cryptoName = useSelector((state) => state.cryptoReducers.selectedCrypto.name)
  const cryptoDataByInterval = useSelector((state) => state.cryptoReducers.currentCryptoData)
  const prices = cryptoDataByInterval?.prices ?? []
  const dates = prices.map(d => d[0])
  // const minValue = Math.min(...prices.map((p) => p[1]))
  // const maxValue = Math.max(...prices.map((p) => p[1]))

  
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
      categories: dates?.map((date, index) => {
        if (index === 0 || index === 45 || index === 90 || index === 135 || index === 180 || index === 225 || index === 270 || index === 315 || index === 360) {
          return Date(date)
        } else {
          return ""
        }
      }),
      labels: {
        formatter: function (value) {
          const date = new Date(value)
          const options = { month: '2-digit', day: '2-digit', year: 'numeric' }
          return date.toLocaleDateString('en-US', options)
        },
        rotate: 60,
        trim: false,
        offsetX: 5,
        offsetY: 50,
        style: {
          fontSize: '11px',
        },
      },
    },
    yaxis: {
      opposite: false,
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
    data: prices ? prices.map(p => p[1]) : ("No Crypto Selected")
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

export default CryptoGraph
