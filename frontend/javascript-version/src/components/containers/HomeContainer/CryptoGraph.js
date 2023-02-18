import React, {Component} from 'react';
import Chart from 'react-apexcharts';

class CryptoGraph extends Component {
      constructor(props) {
        super(props)

        this.state = {
        
          series: [{
              name: "Price",
              data: [1000, 2000, 3000, 4000]
          }],
          options: {
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
          },
        
        
        };
      }
  render() {
    return (
      <div>
        <Chart 
          options={this.state.options}
          series={this.state.series}
          type= 'line'
          height='450'
          width='100%'
        />
      </div>
    )
  }
}

export default CryptoGraph
