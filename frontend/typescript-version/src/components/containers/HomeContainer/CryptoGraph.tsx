import React, { Component } from 'react';
import Chart from 'react-apexcharts';
import { useSelector } from 'react-redux';
import { RootState } from '../../../core/redux';

interface IProps {

}

const CryptoGraph = () => {

  const cryptoDataByInterval = useSelector((state: RootState) => state.cryptoReducers.currentCryptoData)
  console.log(cryptoDataByInterval)
  const prices = cryptoDataByInterval?.prices ?? []
  const minValue = Math.min(...prices.map((p: any) => p[1]))
  const maxValue = Math.max(...prices.map((p: any) => p[1]))
  console.log(minValue, maxValue);
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
      curve: 'straight'
    },
    title: {
      text: 'Price of Crypto',
      align: 'left'
    },
    grid: {
      row: {
        colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
        opacity: 0.5
      },
    },
    xaxis: {
      categories: ['24hr low', '24hr high'],
    }
  }

  const series = [{
    name: "Price",
    data: [1000, 2000, 3000, 4000]
  }]

  return (
    <div>
      <Chart
        options={options as any}
        series={series}
        type='line'
        height='450'
        width='100%'
      />
    </div>
  )
}

export default CryptoGraph
