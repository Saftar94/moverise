import React, { useState } from 'react';
import styled from 'styled-components';
import { FaSearch } from "react-icons/fa";
import { searchMovies } from '../services/movieApi';

const SearchContainer = styled.div`
  width: 100%;
  max-width: 300px;
  position: relative;
  margin: 0 auto;
  margin-top: 20px;

  @media (min-width: 768px) {
    max-width: 450px;
    margin-top: 30px;
  }

  @media (min-width: 1024px) {
    max-width: 600px;
    margin-top: 60px;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  font-size: 14px;
  border: none;
  border-bottom: 2px solid #ff6b08;
  background: transparent;
  color: white;
  outline: none;

  &::placeholder {
    color: #ffffff80;
    font-size: 14px;
  }

  @media (min-width: 768px) {
    font-size: 15px;

    &::placeholder {
      font-size: 15px;
    }
  }

  @media (min-width: 1024px) {
    font-size: 16px;

    &::placeholder {
      font-size: 16px;
    }
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
  padding: 8px;
  font-size: 16px;

  @media (min-width: 768px) {
    padding: 9px;
    font-size: 18px;
  }

  @media (min-width: 1024px) {
    padding: 10px;
    font-size: 20px;
  }

  &:hover {
    color: #ff8533;
  }
`;

const ErrorMessage = styled.div`
  color: #ff6b08;
  margin-top: 10px;
  text-align: center;
  font-size: 12px;

  @media (min-width: 768px) {
    margin-top: 15px;
    font-size: 14px;
  }

  @media (min-width: 1024px) {
    margin-top: 20px;
    font-size: 16px;
  }
`;

const SearchComponent = ({ onSearch }) => {
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
    <SearchContainer>
      <form onSubmit={handleSearch}>
        <SearchInput
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search films..."
        />
        <SearchButton type="submit">
          <FaSearch />
        </SearchButton>
      </form>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </SearchContainer>
  );
};

export default SearchComponent;