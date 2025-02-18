import React from 'react';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getPopularMovies, getGenres, getMovies, getPaginationMovies } from '../services/movieApi';
import Hero from '../hero/hero';
import MovieModal from '../movieModal/movieModal';
import Sorting from '../sorting/sorting';
import Pagination from '../pagination/pagination';

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

export const EmptyLibraryMessage = styled.div`
  text-align: center;
  padding: 20px;
  color:rgb(255, 94, 0);
  background-color:rgb(0, 0, 0) ;
  font-weight: 700;
  justify-content: center;
  text-align: center;
  align-items: center;
  display: flex;
  font-size: 34px;
  width: 100%;
  height: 100px;
`;

const Home = ({user, movies}) => {
  const [localMovies, setLocalMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedMovie, setSelectedMovie] = useState(null)
    const [genres, setGenres] = useState([]);
    const [sortingCriteria, setSortingCriteria] = useState({
      genre: '',
      year: '',
      sortBy: 'popularity.desc'
    });
    const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);


  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await getPaginationMovies(currentPage);
        setLocalMovies(data.results);
        setTotalPages(data.total_pages);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchMovies();
  }, [currentPage]);



    useEffect(() => {
      const fetchGenres = async () => {
        try {
          const genresData = await getGenres();
          setGenres(genresData.genres);
        } catch (error) {
          console.error('Error fetching genres:', error);
        }
      };
      fetchGenres();
    }, []);
  
    useEffect(() => {
      const fetchMovies = async () => {
        try {
          const data = await getMovies({
            genre: sortingCriteria.genre,
            year: sortingCriteria.year,
            sortBy: sortingCriteria.sortBy
          });
          setLocalMovies(data.results);
        } catch (error) {
          console.error('Error fetching movies:', error);
        }
      };
  
      fetchMovies();
    }, [sortingCriteria]);
  
    const handleSortChange = (type, value) => {
      setSortingCriteria(prev => ({
        ...prev,
        [type]: value
      }));
      setCurrentPage(1);
    };
  
    const handlePageChange = (page) => {
      setCurrentPage(page);
    };

useEffect(() => {
  const loadMovies = async () => {
    try {
      setLoading(true);
      
      if (Array.isArray(movies)) {
        setLocalMovies(movies);
        setLoading(false);
        return;
      }

      const data = await getPopularMovies();
      if (data && data.results) {
        setLocalMovies(data.results);
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

  loadMovies();
}, [movies]); 

        if (loading){
            return <div>Loading...</div>
        }

        if (error) {
            return <div>{error}</div>;
        }

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
  }

  const fallbackImageUrl = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='750' viewBox='0 0 500 750'%3E%3Crect width='100%25' height='100%25' fill='%23333'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='24' fill='%23666'%3ENo Image%3C/text%3E%3C/svg%3E";
  return (
    <>
   <Hero />

   <Sorting 
        onSortChange={handleSortChange}
        genres={genres}
      />
            <HomeContainer>
            {Array.isArray(movies) && movies.length === 0 ? (
          <EmptyLibraryMessage>
            The search didn't turn up any results!
          </EmptyLibraryMessage>
        ) : (
          <MovieGrid>
                   {localMovies.map(movie => (
              <MovieCard 
                key={movie.id}
                movie={movie}
                user={user}
                onClick={() => handleMovieClick(movie)}
              >
                <MovieRating>★ {movie.vote_average.toFixed(1)}</MovieRating>
                <MovieImage 
                  src={movie.poster_path 
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                      : fallbackImageUrl
                  } 
                  alt={movie.title} 
                />
                <MovieInfo>
                  <MovieTitle>{movie.title}</MovieTitle>
                  <MovieGenre>
                    {movie.release_date 
                      ? movie.release_date.split('-')[0] 
                      : 'Date not specified'
                    }
                  </MovieGenre>
                </MovieInfo>
              </MovieCard>
            ))}
          </MovieGrid>
        )}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
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