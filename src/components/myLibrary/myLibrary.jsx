import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { db } from '../services/config';
import { collection, query, where, onSnapshot, deleteDoc, doc  } from 'firebase/firestore';

const DeleteButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(255, 0, 0, 0.7);
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;

  &:hover {
    background-color: red;
  }
`;

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

const MyLibrary = ({ user }) => {
  const [movies, setMovies] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const handleDelete = async (movieId) => {
    try {
      const movieRef = doc(db, 'users', user.uid, 'library', movieId.toString());
      await deleteDoc(movieRef);
      console.log('Movie deleted successfully');
    } catch (error) {
      console.error('Error deleting movie:', error);
    }
  };

  useEffect(() => {
    if (!user) {
      setMovies([]);
      setLoading(false);
      return;
    }

    // Создаем слушатель изменений
    const libraryRef = collection(db, 'users', user.uid, 'library');
    let q = libraryRef;

    if (filter !== 'all') {
      q = query(libraryRef, where('type', '==', filter));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const moviesList = [];
      snapshot.forEach((doc) => {
        moviesList.push({ id: doc.id, ...doc.data() });
      });
      setMovies(moviesList);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching library:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, filter]);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

  if (!user) {
    return <div>Please login to view your library</div>;
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

      <MovieGrid>
        {movies.map(movie => (
          <MovieCard key={movie.id} type={movie.type}>
               <DeleteButton onClick={() => handleDelete(movie.id)}>
              ×HELLO
            </DeleteButton>
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

      {movies.length === 0 && (
        <div style={{ textAlign: 'center', color: 'white', marginTop: '20px' }}>
          No movies in your library
        </div>
      )}
    </LibraryContainer>
  );
};

export default MyLibrary;