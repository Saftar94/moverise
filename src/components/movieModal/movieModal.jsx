import React from 'react';
import styled from 'styled-components';
import LibraryButtons from '../libararyButtons/libararyButtons';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  overflow-y: auto; /* Добавляем вертикальную прокрутку */
`;

const ModalContent = styled.div`
  background-color: #1f1f1f;
  border-radius: 8px;
  max-width: 800px;
  width: 90%;
  position: relative;
  color: white;
  overflow: hidden;
  max-height: 90vh; /* Ограничиваем высоту контента */
  overflow-y: auto; /* Добавляем вертикальную прокрутку */
`;

const CloseButton = styled.button`
   position: absolute;
  top: 10px;
  right: 10px;
  background-color: #ff6b08;
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.3s ease;

  &:hover {
    background-color: red;
  }
`;

const MovieDetails = styled.div`
  display: flex;
  padding: 20px;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const MoviePoster = styled.img`
  width: 300px;
  height: 450px;
  object-fit: cover;
  border-radius: 4px;

  @media (max-width: 768px) {
    width: 100%;
    height: auto;
  }
`;

const MovieInfo = styled.div`
  flex: 1;
`;

const MovieTitle = styled.h2`
  margin: 0 0 10px 0;
  color: #ff6b08;
  font-size: 24px;
`;

const MovieRating = styled.div`
  display: inline-block;
  background-color: #ff6b08;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  margin-bottom: 15px;
`;

const InfoRow = styled.div`
  margin-bottom: 15px;

  span:first-child {
    color: #888;
    margin-right: 10px;
  }
`;

const Overview = styled.p`
  line-height: 1.6;
  margin-top: 20px;
`;

const MovieModal = ({ movie, onClose, user }) => {
  if (!movie) return null;

  // Предотвращаем всплытие клика по контенту
  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={handleContentClick}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <MovieDetails>
          <MoviePoster
            src={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : 'https://via.placeholder.com/500x750?text=No+Image'
            }
            alt={movie.title}
          />
          <MovieInfo>
            <MovieTitle>{movie.title}</MovieTitle>
            <MovieRating>★ {movie.vote_average.toFixed(1)}</MovieRating>

            <InfoRow>
              <span>Release Date:</span>
              <span>{movie.release_date}</span>
            </InfoRow>

            <InfoRow>
              <span>Original Language:</span>
              <span>{movie.original_language.toUpperCase()}</span>
            </InfoRow>

            <InfoRow>
              <span>Vote Count:</span>
              <span>{movie.vote_count}</span>
            </InfoRow>

            <InfoRow>
              <span>Popularity:</span>
              <span>{movie.popularity.toFixed(1)}</span>
            </InfoRow>

            <Overview>{movie.overview}</Overview>

            <LibraryButtons
              movie={movie}
              user={user}
              onUpdate={() => {}}
            />
          </MovieInfo>
        </MovieDetails>
      </ModalContent>
    </ModalOverlay>
  );
};

export default MovieModal;
