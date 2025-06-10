import React, { useState, useEffect } from 'react';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField'; 
import CircularProgress from '@mui/material/CircularProgress'; 

import { fetchStockData, fetchTradableSymbols } from './api/financialModelingPrep';
import './App.css';

const chartOptionsBase = {
  title: {
    text: 'Stock Price History'
  },
  rangeSelector: {
    selected: 5 
  },
  yAxis: {
    title: {
      text: 'Price (USD)'
    }
  },
  legend: {
    enabled: true
  },
  series: [] 
};

function App() {
  const [symbols, setSymbols] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [chartOptions, setChartOptions] = useState(chartOptionsBase);
  const [isLoadingSymbols, setIsLoadingSymbols] = useState(false);
  const [isLoadingChart, setIsLoadingChart] = useState(false);

  useEffect(() => {
    setIsLoadingSymbols(true);
    fetchTradableSymbols()
      .then(data => {
        setSymbols(data);
      })
      .catch(error => console.error("Failed to fetch symbols list", error))
      .finally(() => setIsLoadingSymbols(false));
  }, []);

  useEffect(() => {
    if (!selectedStock) {
      setChartOptions(prevOptions => ({ ...prevOptions, series: [], title: { text: 'Stock Price History' } }));
      return;
    }

    setIsLoadingChart(true);
    fetchStockData(selectedStock.symbol)
      .then(data => {
        setChartOptions({
          ...chartOptionsBase,
          title: {
            text: `${selectedStock.label} Price History`
          },
          series: [{
            name: selectedStock.symbol,
            data: data,
            tooltip: {
              valueDecimals: 2
            }
          }]
        });
      })
      .catch(error => console.error(`Failed to fetch data for ${selectedStock.symbol}`, error))
      .finally(() => setIsLoadingChart(false));
  }, [selectedStock]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Stock Chart Search</h1>
      </header>
      <main>
        <Autocomplete
          id="stock-symbol-search"
          options={symbols}
          getOptionLabel={(option) => option.label}
          isOptionEqualToValue={(option, value) => option.symbol === value.symbol}
          style={{ width: 500, margin: '20px auto' }}
          loading={isLoadingSymbols}
          onChange={(event, newValue) => {
            setSelectedStock(newValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search for a stock..."
              variant="outlined"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {isLoadingSymbols ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />
        
        <div className="chart-container">
          {isLoadingChart ? (
            <p>Loading chart data...</p>
          ) : selectedStock ? (
            <HighchartsReact
              highcharts={Highcharts}
              constructorType={'stockChart'}
              options={chartOptions}
            />
          ) : (
            <p>Please select a stock to view its chart.</p>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
