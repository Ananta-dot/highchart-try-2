import React, { useState, useEffect, useCallback, useRef } from 'react';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import { fetchStockData, searchSymbols, fetchStockProfile } from '../api/financialModelingPrep';

// MUI Components
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

// Base options for the Highcharts chart
const chartOptionsBase = {
  chart: { height: 500 },
  rangeSelector: { selected: 5 },
  yAxis: { title: { text: 'Price (USD)' } },
  legend: { enabled: true },
  series: []
};

const DashboardPage = () => {
  const [options, setOptions] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [chartOptions, setChartOptions] = useState(chartOptionsBase);
  const [loading, setLoading] = useState({ search: false, chart: true });
  const [error, setError] = useState(null);
  const debounceTimeout = useRef(null);

  useEffect(() => {
    const loadDefaultStock = async () => {
      setLoading(prev => ({ ...prev, chart: true }));
      setError(null);
      try {
        const defaultSymbol = 'AAPL';
        const [profile, data] = await Promise.all([
          fetchStockProfile(defaultSymbol),
          fetchStockData(defaultSymbol)
        ]);
        
        if (profile && data.length > 0) {
          setSelectedStock(profile);
          setChartOptions({
            ...chartOptionsBase,
            title: { text: `${profile.label} Price History` },
            series: [{ name: profile.symbol, data: data, tooltip: { valueDecimals: 2 } }]
          });
        } else {
            throw new Error("Could not load default stock data.");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(prev => ({ ...prev, chart: false }));
      }
    };
    loadDefaultStock();
  }, []);

  useEffect(() => {
    if (!selectedStock) return;
    setLoading(prev => ({ ...prev, chart: true }));
    setError(null);
    fetchStockData(selectedStock.symbol)
      .then(data => {
        if (data.length === 0) throw new Error("No historical data found for this stock.");
        setChartOptions({
          ...chartOptionsBase,
          title: { text: `${selectedStock.label} Price History` },
          series: [{ name: selectedStock.symbol, data: data, tooltip: { valueDecimals: 2 } }]
        });
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(prev => ({ ...prev, chart: false })));
  }, [selectedStock]);

  const handleInputChange = useCallback((event, newInputValue) => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    setLoading(prev => ({ ...prev, search: true }));
    debounceTimeout.current = setTimeout(async () => {
      if (newInputValue) {
        const results = await searchSymbols(newInputValue);
        setOptions(results);
      } else {
        setOptions([]);
      }
      setLoading(prev => ({ ...prev, search: false }));
    }, 500);
  }, []);

  return (
    <>
      <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px' }}>
        <Autocomplete
          id="stock-symbol-search"
          options={options}
          getOptionLabel={(option) => option.label || ""}
          isOptionEqualToValue={(option, value) => option.symbol === value.symbol}
          filterOptions={(x) => x}
          loading={loading.search}
          value={selectedStock}
          onInputChange={handleInputChange}
          onChange={(event, newValue) => {
            setOptions(newValue ? [newValue, ...options] : options);
            setSelectedStock(newValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search for a stock (e.g., 'Tesla' or 'TSLA')"
              variant="outlined"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading.search ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />
      </Paper>

      <Paper elevation={3} className="chart-container">
        {loading.chart ? (
          <CircularProgress size={60} />
        ) : error ? (
          <Alert severity="error" style={{ width: '100%', justifyContent: 'center' }}>
            <AlertTitle>Error</AlertTitle>
            {error}
          </Alert>
        ) : (
          <HighchartsReact
            highcharts={Highcharts}
            constructorType={'stockChart'}
            options={chartOptions}
          />
        )}
      </Paper>
    </>
  );
};

export default DashboardPage;
