import React, { useState } from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';

const SearchContainer = styled.div`
  width: 100%;
  max-width: 280px;
  position: relative;
  margin: 0 auto;
  margin-top: 15px;

  @media (min-width: 768px) {
    max-width: 400px;
    margin-top: 20px;
  }

  @media (min-width: 1024px) {
    max-width: 600px;
    margin-top: 60px;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px;
  font-size: 14px;
  border: none;
  border-bottom: 2px solid #ff6b08;
  background: transparent;
  color: white;
  outline: none;

  &::placeholder {
    color: rgb(83, 238, 22);
    font-size: 14px;
  }

  &:focus {
    outline: none;
    border-color: #ff6b08;
  }

  @media (min-width: 768px) {
    padding: 12px;
    font-size: 15px;

    &::placeholder {
      font-size: 15px;
    }
  }

  @media (min-width: 1024px) {
    padding: 15px;
    font-size: 16px;

    &::placeholder {
      font-size: 16px;
    }
  }
`;



const SearchBar = ({ onSearch, libraryMovies }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const isLibraryPage = location.pathname === '/library';

  const handleSearch = (e) => {
    e.preventDefault();
    const query = e.target.value.trim();
    setSearchQuery(query);
    onSearch(query);
  
    if (!query) {
      onSearch(null); // Если строка поиска пустая, сбрасываем результаты и показываем топовые фильмы
      return;
    }
  
    if (isLibraryPage && libraryMovies) {
      const filteredMovies = libraryMovies.filter(movie => 
        movie.title.toLowerCase().includes(query.toLowerCase())
      );
  
      onSearch(filteredMovies.length > 0 ? filteredMovies : []);
    } else {
      onSearch(query);
    }
  };

  return (
    <SearchContainer>
      <SearchInput
        type="text"
        placeholder={isLibraryPage ? "Search in your library..." : "Search movies..."}
        value={searchQuery}
        onChange={handleSearch}
      />
    </SearchContainer>
  );
};

export default SearchBar;