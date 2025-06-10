import axios from 'axios';

const API_KEY = process.env.REACT_APP_FMP_API_KEY;
const BASE_URL = 'https://financialmodelingprep.com/api/v3';

/**
 * Fetches the list of all tradable stock symbols.
 * Endpoint source: https://site.financialmodelingprep.com/developer/docs/tradable-list-api [4]
 * @returns {Promise<Array>} A promise that resolves to an array of stock objects.
 */
export const fetchTradableSymbols = async () => {
  try {
    const url = `${BASE_URL}/available-traded/list?apikey=${API_KEY}`;
    const response = await axios.get(url);
    // Format for MUI Autocomplete: needs a `label` property [3]
    return response.data.map(stock => ({
      symbol: stock.symbol,
      label: `${stock.name} (${stock.symbol})`
    }));
  } catch (error) {
    console.error('Error fetching tradable symbols:', error);
    return [];
  }
};

/**
 * Fetches historical daily stock data for a given symbol.
 * @param {string} symbol The stock symbol (e.g., 'AAPL').
 * @returns {Promise<Array>} A promise that resolves to an array of [timestamp, close_price].
 */
export const fetchStockData = async (symbol) => {
  try {
    const url = `${BASE_URL}/historical-price-full/${symbol}?apikey=${API_KEY}`;
    const response = await axios.get(url);
    
    if (response.data && response.data.historical) {
      const formattedData = response.data.historical.map(item => [
        new Date(item.date).getTime(),
        item.close,
      ]).reverse();
      return formattedData;
    }
    return [];
  } catch (error) {
    console.error(`Error fetching data for ${symbol}:`, error);
    return [];
  }
};
