import React, { useState } from 'react';
import styled from 'styled-components';
import { FaSearch } from "react-icons/fa";
import { searchMovies } from '../services/movieApi';

const HeroSection = styled.section`
  background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
              url('https://image.tmdb.org/t/p/original/wwemzKWzjKYJFfCeiB57q3r4Bcm.jpg');
  background-size: cover;
  background-position: center;
  height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  padding: 0 20px;
`;

const SearchContainer = styled.div`
  width: 100%;
  max-width: 600px;
  position: relative;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 15px;
  font-size: 16px;
  border: none;
  border-bottom: 2px solid #ff6b08;
  background: transparent;
  color: white;
  outline: none;

  &::placeholder {
    color: #ffffff80;
  }
`;

const SearchButton = styled.button`
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: #ff6b08;
  cursor: pointer;
  padding: 10px;
  
  &:hover {
    color: #ff8533;
  }
`;

const ErrorMessage = styled.div`
  color: #ff6b08;
  margin-top: 20px;
  text-align: center;
  font-size: 16px;
`;

const Title = styled.h1`
  font-size: 32px;
  margin-bottom: 30px;
  text-align: center;
`;

const Hero = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setError('Please enter the name of the film!');
      return;
    }

    try {
        const data = await searchMovies(searchQuery); 
        
        if (data.results.length === 0) {
          setError(`The search didn't yield any results!`);
          onSearch([]);
        } else {
          setError('');
          onSearch(data.results);
        }
      } catch (error) {
        console.error('Search error:', error);
        setError('An error occurred during the search. Try again later.');
      }
  };

  return (
    <HeroSection>
      <Title>Search Films</Title>
      <SearchContainer>
        <form onSubmit={handleSearch}>
          <SearchInput
            type="text"
            placeholder="Film Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <SearchButton type="submit">
            <span role="img" aria-label="search"><FaSearch /></span>
          </SearchButton>
        </form>
      </SearchContainer>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </HeroSection>
  );
};

export default Hero;