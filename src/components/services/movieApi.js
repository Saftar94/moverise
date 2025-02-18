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
    throw error;
  }
};

export const getTopMovies = async () => {
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  const fromDate = threeMonthsAgo.toISOString().split('T')[0];
  const toDate = new Date().toISOString().split('T')[0];

  const response = await fetch(
    `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=vote_average.desc&vote_count.gte=1000&primary_release_date.gte=${fromDate}&primary_release_date.lte=${toDate}&page=1`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch top movies');
  }

  return response.json();
};


export const getGenres = async () => {
  const response = await fetch(
    `${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch genres');
  }
  
  return response.json();
};

export const getMovies = async ({ genre = '', year = '', sortBy = 'popularity.desc' }) => {
  let url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US`;

  if (genre) {
    url += `&with_genres=${genre}`;
  }

  if (year) {
    url += `&primary_release_year=${year}`;
  }

  url += `&sort_by=${sortBy}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to fetch movies');
  }

  return response.json();
};


export const getPaginationMovies = async (page = 1) => {
  const response = await fetch(
    `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch movies');
  }
  
  return response.json();
};