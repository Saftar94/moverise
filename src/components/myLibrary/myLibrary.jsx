import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { db } from '../services/firebaseConfig';
import { collection, onSnapshot } from 'firebase/firestore';
import DeleteButton from '../libararyButtons/DeleteButton';

const LibraryContainer = styled.div`
  max-width: 100%;
  margin: 0 auto;
  padding: 10px;

  @media (min-width: 768px) {
    max-width: 768px;
    padding: 15px;
  }

  @media (min-width: 1024px) {
    max-width: 1200px;
    padding: 20px;
  }
`;

const MovieGrid = styled.div`
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));

  @media (min-width: 768px) {
    gap: 15px;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  }

  @media (min-width: 1024px) {
    gap: 20px;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
`;

const MovieCard = styled.div`
  position: relative;
  border-radius: 6px;
  overflow: hidden;
  background-color: ${props =>
    props.type === 'watched' ? 'rgba(255, 107, 107, 0.2)' :
    props.type === 'future' ? 'rgba(81, 207, 102, 0.2)' : 'transparent'};

  @media (min-width: 768px) {
    border-radius: 8px;
  }
`;

const MovieImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;

  @media (min-width: 768px) {
    height: 250px;
  }

  @media (min-width: 1024px) {
    height: 300px;
  }
`;

const MovieInfo = styled.div`
  padding: 8px;
  color: white;

  @media (min-width: 768px) {
    padding: 10px;
  }

  @media (min-width: 1024px) {
    padding: 10px;
  }
`;

const MovieTitle = styled.h3`
  margin: 0;
  font-size: 14px;

  @media (min-width: 768px) {
    font-size: 15px;
  }

  @media (min-width: 1024px) {
    font-size: 16px;
  }
`;

const FilterButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 15px;
  justify-content: center;

  @media (min-width: 768px) {
    flex-direction: row;
    gap: 10px;
    margin-bottom: 20px;
  }

  @media (min-width: 1024px) {
    gap: 10px;
    margin-bottom: 20px;
  }
`;

const FilterButton = styled.button`
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: ${props => props.$active ? '#ff6b08' : '#333'};
  color: white;
  font-size: 14px;

  @media (min-width: 768px) {
    padding: 10px 20px;
    font-size: 15px;
  }

  @media (min-width: 1024px) {
    padding: 10px 20px;
    font-size: 16px;
  }

  &:hover {
    background-color: #ff6b08;
  }
`;

const EmptyLibraryMessage = styled.div`
  text-align: center;
  padding: 15px;
  color: rgb(255, 94, 0);
  background-color: rgb(0, 0, 0);
  font-weight: 700;
  font-size: 20px;
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (min-width: 768px) {
    padding: 20px;
    font-size: 28px;
    height: 90px;
  }

  @media (min-width: 1024px) {
    font-size: 34px;
    height: 100px;
  }
`;

const MyLibrary = ({ user, moviesLibr: librarySearchResults, isSearching }) => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
  useEffect(() => {
    let unsubscribe = null;

    const fetchLibrary = async () => {
      if (!user) {
        setMovies([]);
        setLoading(false);
        return;
      }

      const cachedData = localStorage.getItem(`userLibrary_${user.uid}`);
      if (cachedData) {
        setMovies(JSON.parse(cachedData));
        setLoading(false);
      }
      try {
        const libraryRef = collection(db, 'users', user.uid, 'library');
        console.log('Fetching library data...');

         unsubscribe = onSnapshot(
          libraryRef,
          (snapshot) => {
            const moviesList = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));

            setMovies(moviesList);
            setLoading(false);
            setError(null);

            localStorage.setItem(`userLibrary_${user.uid}`, JSON.stringify(moviesList));
          },
          (error) => {
            console.error("Firestore onSnapshot error:", error);
            setError(error.message);
            setLoading(false);

            const cachedData = localStorage.getItem(`userLibrary_${user.uid}`);
            if (cachedData) {
              setMovies(JSON.parse(cachedData));
            }
          }
        );
      } catch (error) {
        console.error("Error fetching library data:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchLibrary();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user]);

  useEffect(() => {
    if (librarySearchResults === null) {
      const finalFilteredMovies = filter === 'all'
        ? movies
        : movies.filter(movie => movie.type === filter);
      setFilteredMovies(finalFilteredMovies);
    } else if (Array.isArray(librarySearchResults) && librarySearchResults.length === 0) {
      setFilteredMovies([]);
    } else {
      const finalFilteredMovies = filter === 'all'
        ? librarySearchResults
        : librarySearchResults.filter(movie => movie.type === filter);
      setFilteredMovies(finalFilteredMovies);
    }
  }, [librarySearchResults, movies, filter]);

  const handleMovieDelete = (movieId) => {
    setMovies(prevMovies => prevMovies.filter(movie => movie.id !== movieId));
    
  };

  return (
    <LibraryContainer>
      <FilterButtons>
        <FilterButton
          $active={filter === 'all'}
          onClick={() => setFilter('all')}
        >
          All Movies
        </FilterButton>
        <FilterButton
          $active={filter === 'watched'}
          onClick={() => setFilter('watched')}
        >
          Watched
        </FilterButton>
        <FilterButton
          $active={filter === 'future'}
          onClick={() => setFilter('future')}
        >
          Watch Later
        </FilterButton>
      </FilterButtons>

      {loading ? (
        <EmptyLibraryMessage>Loading your library...</EmptyLibraryMessage>
      ) : error ? (
        <EmptyLibraryMessage>Error: {error}</EmptyLibraryMessage>
      ) : librarySearchResults.length === 0 ? (
        <EmptyLibraryMessage>
          {isSearching
            ? `The search didn't turn up any results!`
            : 'Your library is empty. Add some movies!'
          }
        </EmptyLibraryMessage>
      ) : (
        <>
          <MovieGrid>
            {filteredMovies.map(movie => (
              <MovieCard key={movie.id} type={movie.type}>
                <DeleteButton
                  movieId={movie.id}
                  user={user}
                  onDelete={handleMovieDelete}
                />
                <MovieImage
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                      : 'https://via.placeholder.com/500x750?text=No+Image'
                  }
                  alt={movie.title}
                />
                <MovieInfo>
                  <MovieTitle>{movie.title}</MovieTitle>
                </MovieInfo>
              </MovieCard>
            ))}
          </MovieGrid>
        </>
      )}
    </LibraryContainer>
  );
};

export default MyLibrary;
