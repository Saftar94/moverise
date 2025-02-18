import React from 'react';
import styled from 'styled-components';

const SortingContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin: 10px;
  padding: 15px;
  background: #ff6b08;
  border-radius: 8px;

  @media (min-width: 768px) {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    gap: 20px;
    margin: 15px;
  }

  @media (min-width: 1024px) {
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-around;
    gap: 20px;
    margin: 20px;
  }
`;

const SortingGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 100%;

  @media (min-width: 768px) {
    width: calc(50% - 10px);
  }

  @media (min-width: 1024px) {
    width: auto;
    min-width: 200px;
  }
`;

const Label = styled.label`
  font-weight: bold;
  color: #333;
  font-size: 14px;
  margin-bottom: 5px;

  @media (min-width: 768px) {
    font-size: 15px;
  }

  @media (min-width: 1024px) {
    font-size: 16px;
  }
`;
const Select = styled.select`
  width: 100%;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ddd;
  background-color: white;
  cursor: pointer;
  font-size: 14px;
  appearance: none; /* Убираем стандартную стрелку */
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 16px;

  &:hover {
    border-color: #999;
  }

  &:focus {
    outline: none;
    border-color: #666;
    box-shadow: 0 0 0 2px rgba(0,0,0,0.1);
  }

  @media (min-width: 768px) {
    font-size: 15px;
    padding: 12px;
  }

  @media (min-width: 1024px) {
    font-size: 16px;
    padding: 12px;
  }

  @supports (-webkit-touch-callout: none) {
    padding-right: 30px; /* Больше места для стрелки в Safari */
  }
`;

const Option = styled.option`
  padding: 8px;
  font-size: 14px;

  @media (min-width: 768px) {
    font-size: 15px;
  }

  @media (min-width: 1024px) {
    font-size: 16px;
  }
`;

const Sorting = ({ onSortChange, genres }) => {
  return (
    <SortingContainer>
      <SortingGroup>
        <Label>Genre:</Label>
        <Select onChange={(e) => onSortChange('genre', e.target.value)}>
        <Option value="">All Genres</Option>
          {genres.map(genre => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </Select>
      </SortingGroup>

      <SortingGroup>
        <Label>Year:</Label>
        <Select onChange={(e) => onSortChange('year', e.target.value)}>
          <option value="">All Years</option>
          {Array.from({ length: 25 }, (_, i) => new Date().getFullYear() - i).map(year => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </Select>
      </SortingGroup>

      <SortingGroup>
        <Label>Sort By:</Label>
        <Select onChange={(e) => onSortChange('sortBy', e.target.value)}>
          <option value="popularity.desc">Popularity (High to Low)</option>
          <option value="popularity.asc">Popularity (Low to High)</option>
          <option value="title.asc">Title (A-Z)</option>
          <option value="title.desc">Title (Z-A)</option>
          <option value="release_date.desc">Release Date (Newest)</option>
          <option value="release_date.asc">Release Date (Oldest)</option>
        </Select>
      </SortingGroup>
    </SortingContainer>
  );
};

export default Sorting;