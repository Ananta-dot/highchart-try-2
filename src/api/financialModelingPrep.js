import axios from 'axios';

const API_KEY = process.env.REACT_APP_FMP_API_KEY;
const BASE_URL = 'https://financialmodelingprep.com/api/v3';

/**
 * Searches for stock symbols based on a user's query.
 * This is much more efficient than fetching the entire list.
 * @param {string} query The user's search term (e.g., "Apple").
 * @returns {Promise<Array>} A promise that resolves to an array of matching stock objects.
 */
export const searchSymbols = async (query) => {
  if (!query) {
    return [];
  }
  try {
    const url = `${BASE_URL}/search?query=${query}&limit=10&apikey=${API_KEY}`;
    const response = await axios.get(url);
    // Format for MUI Autocomplete: needs a `label` property
    return response.data.map(stock => ({
      symbol: stock.symbol,
      label: `${stock.name} (${stock.symbol})`
    }));
  } catch (error) {
    console.error('Error searching symbols:', error);
    return [];
  }
};

/**
 * Fetches the profile for a single stock, useful for getting the name for a default load.
 * @param {string} symbol The stock symbol.
 * @returns {Promise<Object>} A promise resolving to the stock profile.
 */
export const fetchStockProfile = async (symbol) => {
    try {
        const url = `${BASE_URL}/profile/${symbol}?apikey=${API_KEY}`;
        const response = await axios.get(url);
        if (response.data && response.data.length > 0) {
            const profile = response.data[0];
            return {
                symbol: profile.symbol,
                label: `${profile.companyName} (${profile.symbol})`
            };
        }
        return null;
    } catch (error) {
        console.error(`Error fetching profile for ${symbol}:`, error);
        return null;
    }
};

/**
 * Fetches historical daily stock data for a given symbol.
 * (This function remains the same)
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
    // Throw an error to be caught by the component
    throw new Error(`Could not fetch chart data for ${symbol}.`);
  }
};
