import axios from 'axios';
import { myKey } from './serviceskey';


const API_KEY = myKey;
const BASE_URL = 'https://api.themoviedb.org/3';


const instance = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'en-EN'
  }
});

export const getPopularMovies = async (page = 1) => {
  try {
    const response = await instance.get('/movie/popular', {
      params: { page }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
  }
};

export const searchMovies = async (query) => {
  try {
    const response = await instance.get('/search/movie', {
      params: { query }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching movies:', error);
    throw error;
  }
};