import { Radio } from 'antd';
import { useState } from 'react';
import Chart from 'react-apexcharts';
import { useSelector } from 'react-redux';


const CryptoGraph = () => {
  const [graphTime, setGraphTime] = useState({ target: { value: "Year" } })
  const cryptoName = useSelector((state) => state.cryptoReducers.selectedCrypto.name)
  const cryptoDataByInterval = useSelector((state) => state.cryptoReducers.currentCryptoData)
  const prices = cryptoDataByInterval?.prices ?? []
  const dates = prices.map(d => d[0])
  const allPrices = prices?.map(p => p[1])

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  });

  const graphTimeHandler = (value) => {
    setGraphTime(value)
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
      curve: 'smooth',
      width: 2.5
    },
    title: {
      text: `Price of ${cryptoName}`,
      align: 'center'
    },
    grid: {
      row: {
        colors: ['#f3f3f3', 'transparent'],
        opacity: 0.5
      },
    },
    xaxis: {
      categories: graphTime.target?.value === 'Year'
        ? dates?.map((date, index) => {
          if (index === 0 || index === 45 || index === 90 || index === 135 || index === 180 || index === 225 || index === 270 || index === 315 || index === 360) {
            return date
          } else {
            return ""
          }
        })
        : graphTime.target?.value === 'Month'
          ? dates?.slice(-31).map((date, index) => {
            if (index === 0 || index === 5 || index === 10 || index === 15 || index === 20 || index === 25 || index === 30) {
              return date
            } else {
              return ""
            }
          })
          : graphTime.target?.value === 'Week'
            ? dates.slice(-8)
            : [],

      labels: {
        formatter: (value) => {
          const date = new Date(value)
          const options = { month: '2-digit', day: '2-digit', year: 'numeric' }
          return date.toLocaleDateString('en-US', options)
        },
        rotate: 60,
        offsetX: 3,
        offsetY: 50,
        style: {
          fontSize: '11px',
        },
        
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
    data: graphTime.target.value === 'Year' ? (
      allPrices
    ) : graphTime.target.value === 'Month' ? (
      allPrices.slice(-31)
    ) : graphTime.target.value === 'Week' ? (
      allPrices.slice(-8)
    ) : null
  }]

  return (
    <>
      <div>
        <Chart
          options={options}
          series={series}
          type='line'
          height='350'
          width='75%'
        />
      </div>
      <section>
        <Radio.Group onChange={graphTimeHandler}>
          <Radio.Button value={"Year"} >Year</Radio.Button>
          <Radio.Button value={"Month"} >Month</Radio.Button>
          <Radio.Button value={"Week"} >Week</Radio.Button>
        </Radio.Group>
      </section>
    </>
  )
}

export default CryptoGraph
