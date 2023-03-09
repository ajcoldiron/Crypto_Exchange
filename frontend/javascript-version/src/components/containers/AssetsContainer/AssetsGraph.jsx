import Chart from 'react-apexcharts';
import { useDispatch, useSelector } from 'react-redux';

import { useEffect } from 'react';
import { loadExchangeBalances } from '../../../store/reducers/exchangeBalanceReducers';


const AssetsGraph = () => {
    const dispatch = useDispatch()
    const exchange = useSelector(state => state.exchangeReducers.exchange)
    const token1 = useSelector(state => state.tokenReducers.token1)
    const token2 = useSelector(state => state.tokenReducers.token2)
    const account = useSelector(state => state.connectionReducers.account)

    const tokens = [token1, token2]
    

    useEffect(() => {
      dispatch(loadExchangeBalances({ exchange, tokens, account }))
    }, [exchange, tokens, account])


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
      text: 'Balance in Dollars',
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