import React from 'react';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getPopularMovies } from '../services/movieApi';
import Hero from '../hero/hero';
import MovieModal from '../movieModal/movieModal';

const HomeContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const MovieGrid = styled.div`
  display: grid;
  gap: 20px;
  
  grid-template-columns: 1fr;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const MovieCard = styled.div`
  position: relative;
  border-radius: 5px;
  overflow: hidden;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.03);
  }
`;

const MovieImage = styled.img`
  width: 100%;
  height: 400px;
  object-fit: cover;
`;

const MovieInfo = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 15px;
  background: linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0));
  color: white;
`;

const MovieTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 500;
`;

const MovieGenre = styled.p`
  margin: 5px 0 0;
  font-size: 14px;
  color: #ff6b08;
`;

const MovieRating = styled.div`
    margin: 15px;
    position: absolute;
    display: inline-block;
    background: linear-gradient(to left, #ff6b08, rgba(0, 0, 0, 0.1));
    color: white;
    padding: 30px 20px;
    border-radius: 50%;
    font-size: 20px;
    font-weight: 900;
`;


const Home = ({user}) => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedMovie, setSelectedMovie] = useState(null)

    const handleSearch = (searchResults) => {
        if (Array.isArray(searchResults)) {
            setMovies(searchResults);
        }
    };

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const data = await getPopularMovies();
                if (data && data.results) {
                    setMovies(data.results);
                } else {
                    setError('Failed to load data');
                }
            } catch (error) {
                console.error('Error fetching movies:', error);
                setError('An error occurred while downloading films');
            } finally {
                setLoading(false);
            }
        };
        fetchMovies();


    }, []);

        if (loading){
            return <div>Loading...</div>
        }

        if (error) {
            return <div>{error}</div>;
        }

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
  }
  return (
    <>
   <Hero onSearch={handleSearch} />
            <HomeContainer>
                <MovieGrid>
                    {movies && movies.length > 0 ? (
                        movies.map(movie => (
                            <MovieCard 
                            key={movie.id}
                              onClick={() => handleMovieClick(movie)}
                              >
                               <MovieRating>★ {movie.vote_average.toFixed(1)}</MovieRating>
                                <MovieImage 
                                    src={movie.poster_path 
                                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                                        : 'https://via.placeholder.com/500x750?text=No+Image'} 
                                    alt={movie.title} 
                                />
                                <MovieInfo>
                                    <MovieTitle>{movie.title}</MovieTitle>
                                    <MovieGenre>
                                        {movie.release_date 
                                            ? movie.release_date.split('-')[0] 
                                            : 'Date not specified'}
                                    </MovieGenre>
                                </MovieInfo>
                            </MovieCard>
                        ))
                    ) : (
                        <div>Films not found</div>
                    )}
                </MovieGrid>
            </HomeContainer>

            {selectedMovie && (
                <MovieModal 
                    movie={selectedMovie} 
                    onClose={() => setSelectedMovie(null)} 
                    user={user}
                />
            )}
    </>
  );
};

export default Home;

// 8eadd8b4df8a5dcd77ffa3f63c5736c3