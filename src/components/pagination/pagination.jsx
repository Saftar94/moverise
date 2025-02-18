import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const PaginationContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin: 20px 0;
  padding: 10px;
`;

const PageButton = styled.button`
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  background: ${props => props.active ? '#ff6b08' : 'transparent'};
  color: ${props => props.active ? 'white' : '#ff6b08'};
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #ff6b08;

  &:hover {
    background: #ff6b08;
    color: white;
  }

  @media (min-width: 768px) {
    padding: 10px 15px;
  }
`;

const PageInfo = styled.span`
  color: white;
  padding: 8px 12px;
  
  @media (min-width: 768px) {
    padding: 10px 15px;
  }
`;

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const [visiblePages, setVisiblePages] = useState([]);
  const [maxPage, setMaxPage] = useState(100);

  useEffect(() => {
    if (currentPage > maxPage - 10) {
      setMaxPage(prev => prev + 100);
    }

    const calculateVisiblePages = () => {
      const pages = [];
      
      pages.push(1);

      let startPage = Math.max(2, currentPage - 2);
      let endPage = Math.min(maxPage - 1, currentPage + 2);

      if (startPage > 2) {
        pages.push('...');
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < maxPage - 1) {
        pages.push('...');
      }

      pages.push(maxPage);

      setVisiblePages(pages);
    };

    calculateVisiblePages();
  }, [currentPage, maxPage, totalPages]);

  const handlePageClick = (page) => {
    if (page !== '...' && page !== currentPage) {
      onPageChange(page);
      window.scrollTo(0, 0);
    }
  };

  return (
    <PaginationContainer>
      {currentPage > 1 && (
        <PageButton onClick={() => handlePageClick(currentPage - 1)}>
          ←
        </PageButton>
      )}

      {visiblePages.map((page, index) => (
        page === '...' ? (
          <PageInfo key={`dots-${index}`}>...</PageInfo>
        ) : (
          <PageButton
            key={page}
            active={page === currentPage}
            onClick={() => handlePageClick(page)}
          >
            {page}
          </PageButton>
        )
      ))}

      {currentPage < maxPage && (
        <PageButton onClick={() => handlePageClick(currentPage + 1)}>
          →
        </PageButton>
      )}
    </PaginationContainer>
  );
};

export default Pagination;