import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { db } from '../services/firebaseConfig';
import {  collection, onSnapshot } from 'firebase/firestore';
import DeleteButton from '../libararyButtons/DeleteButton';


const LibraryContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const MovieGrid = styled.div`
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
`;

const MovieCard = styled.div`
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  background-color: ${props => 
    props.type === 'watched' ? 'rgba(255, 107, 107, 0.2)' : 
    props.type === 'future' ? 'rgba(81, 207, 102, 0.2)' : 'transparent'};
`;

const MovieImage = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
`;

const MovieInfo = styled.div`
  padding: 10px;
  color: white;
`;

const MovieTitle = styled.h3`
  margin: 0;
  font-size: 16px;
`;

const FilterButtons = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  justify-content: center;
`;

const FilterButton = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: ${props => props.active ? '#ff6b08' : '#333'};
  color: white;

  &:hover {
    background-color: #ff6b08;
  }
`;

const EmptyMessage = styled.div`
  text-align: center;
  color: white;
  margin-top: 20px;
  font-size: 18px;
`;


const EmptyLibraryMessage = styled.div`
  text-align: center;
  color: white;
  font-size: 24px;
  margin-top: 50px;
  padding: 20px;
  background: #ff6b08;
  border-radius: 8px;
`;


const MyLibrary = ({ user }) => {
  const [movies, setMovies] = useState([]);
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
            console.error("Error loading library:", error);
            setError(error.message);
            setLoading(false);

            const cachedData = localStorage.getItem(`userLibrary_${user.uid}`);
            if (cachedData) {
              setMovies(JSON.parse(cachedData));
            }
          }
        );
      } catch (error) {
        console.error("Error setting up listener:", error);
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

 

  const handleMovieDelete = (movieId) => {
    setMovies(prevMovies => prevMovies.filter(movie => movie.id !== movieId));
  };

    const filteredMovies = filter === 'all' 
    ? movies 
    : movies.filter(movie => movie.type === filter);

  if (!user) {
    return <EmptyMessage>
        Please login to view your library
        </EmptyMessage>;
  }


  return (
    <LibraryContainer>
      <FilterButtons>
        <FilterButton 
          active={filter === 'all'} 
          onClick={() => setFilter('all')}
        >
          All Movies
        </FilterButton>
        <FilterButton 
          active={filter === 'watched'} 
          onClick={() => setFilter('watched')}
        >
          Watched
        </FilterButton>
        <FilterButton 
          active={filter === 'future'} 
          onClick={() => setFilter('future')}
        >
          Watch Later
        </FilterButton>
      </FilterButtons>

      {loading ? (
        <EmptyLibraryMessage>Loading your library...</EmptyLibraryMessage>
      ) : error ? (
        <EmptyLibraryMessage>Error: {error}</EmptyLibraryMessage>
      ) : filteredMovies.length === 0 ? (
        <EmptyLibraryMessage>
          {filter === 'all' 
            ? 'Your library is empty. Add some movies!' 
            : `No ${filter} movies in your library`}
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

          {!loading && filteredMovies.length === 0 && (
            <EmptyMessage>
              {filter === 'all' 
                ? 'No movies in your library yet. Add some movies!' 
                : `No ${filter} movies in your library`}
            </EmptyMessage>
          )}
        </>
      )}
    </LibraryContainer>
  );
};

export default MyLibrary;