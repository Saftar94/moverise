import { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { getTopMovies } from '../services/movieApi';


const HeroContainer = styled.div`
  position: relative;
  width: 100%;
  height: 300px;
  overflow: hidden;
  margin-bottom: 20px;

  @media (min-width: 768px) {
    height: 350px;
  }

  @media (min-width: 1024px) {
    height: 400px;
    margin-bottom: 30px;
  }
`;

const SliderWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  gap: 5px;
  padding: 0 10px;

  @media (min-width: 768px) {
    gap: 8px;
    padding: 0 15px;
  }

  @media (min-width: 1024px) {
    gap: 10px;
    padding: 0 20px;
  }
`;

const MovieCard = styled.div`
  flex: 0 0 calc(50% - 5px);
  height: 100%;
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s ease;

  @media (min-width: 768px) {
    flex: 0 0 calc(33.333% - 8px);
  }

  @media (min-width: 1024px) {
    flex: 0 0 calc(20% - 8px);
  }

  &:hover {
    transform: scale(1.02);
  }
`;

const MovieImage = styled.div`
  width: 100%;
  height: 100%;
  background-image: url(${props => props.$backdrop});
  background-size: cover;
  background-position: center;
`;

const MovieInfo = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 10px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.9));
  color: white;

  @media (min-width: 768px) {
    padding: 12px;
  }

  @media (min-width: 1024px) {
    padding: 15px;
  }
`;

const MovieTitle = styled.h3`
  margin: 0;
  font-size: 0.9rem;
  margin-bottom: 3px;

  @media (min-width: 768px) {
    font-size: 1rem;
    margin-bottom: 4px;
  }

  @media (min-width: 1024px) {
    font-size: 1.1rem;
    margin-bottom: 5px;
  }
`;

const Rating = styled.div`
  position: absolute;
  top: 5px;
  right: 5px;
  background: rgba(0, 0, 0, 0.7);
  color: #ffd700;
  padding: 4px 6px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: bold;

  @media (min-width: 768px) {
    top: 8px;
    right: 8px;
    padding: 5px 7px;
    font-size: 0.9rem;
  }

  @media (min-width: 1024px) {
    top: 10px;
    right: 10px;
    padding: 5px 8px;
    font-size: 0.9rem;
  }
`;

const NavigationButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  font-size: 16px;

  @media (min-width: 768px) {
    width: 35px;
    height: 35px;
    font-size: 18px;
  }

  @media (min-width: 1024px) {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }

  &:hover {
    background: rgba(0, 0, 0, 0.8);
  }

  &.prev {
    left: 5px;
    @media (min-width: 768px) {
      left: 8px;
    }
    @media (min-width: 1024px) {
      left: 10px;
    }
  }

  &.next {
    right: 5px;
    @media (min-width: 768px) {
      right: 8px;
    }
    @media (min-width: 1024px) {
      right: 10px;
    }
  }
`;



const Hero = () => {
  const [allMovies, setAllMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0); // Circular index
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const autoPlayRef = useRef();
  const [scrollPosition, setScrollPosition] = useState(0);
  const sliderRef = useRef(null);
  useEffect(() => {
    const fetchMovies = async () => {
        try {
            const data = await getTopMovies();
            const movies = data.results.slice(0, 10);
            setAllMovies(movies);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching movies:', error);
            setLoading(false);
        }
    };

    fetchMovies();
}, []);

  useEffect(() => {
    const animate = () => {
      setScrollPosition((prevPosition) => prevPosition - 1); 
      if (sliderRef.current) {
        sliderRef.current.style.transform = `translateX(${scrollPosition}px)`;
      }
      requestAnimationFrame(animate); 
    };

    requestAnimationFrame(animate); 

    return () => {
      cancelAnimationFrame(animate);
    };
  });
  


  const visibleMovies = allMovies.slice(currentIndex, currentIndex + 10); // Dynamic slice
  if (visibleMovies.length < 5) {
      visibleMovies.push(...allMovies.slice(0, 5 - visibleMovies.length)); // Wrap around
  }


  const rotateMovies = useCallback((direction) => {
      setCurrentIndex((prevIndex) => {
          const newIndex = direction === 'next' ? prevIndex + 1 : prevIndex - 1;
          return (newIndex + allMovies.length) % allMovies.length; // Ensure it's within bounds
      });
  }, [allMovies]);

  useEffect(() => {
      autoPlayRef.current = () => {
          if (!isPaused) {
              rotateMovies('next');
          }
      };
  }, [isPaused, rotateMovies]);

  useEffect(() => {
      if (loading || allMovies.length === 0) return;

      const play = () => {
          autoPlayRef.current();
      };

      const interval = setInterval(play, 3000);

      return () => clearInterval(interval);
  }, [loading, allMovies]);

  const handleManualRotate = (direction) => {
      setIsPaused(true);
      rotateMovies(direction);
      setTimeout(() => setIsPaused(false), 5000);
  };

  if (loading) {
      return <div>Loading...</div>;
  }

  return (
      <HeroContainer
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
      >
          <SliderWrapper>
              {visibleMovies.map((movie) => (
                  <MovieCard key={movie.id}>
                      <MovieImage
                          $backdrop={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
                      />
                      <Rating>★ {movie.vote_average.toFixed(1)}</Rating>
                      <MovieInfo>
                          <MovieTitle>{movie.title}</MovieTitle>
                      </MovieInfo>
                  </MovieCard>
              ))}
          </SliderWrapper>

          <NavigationButton
              className="prev"
              onClick={() => handleManualRotate('prev')}
          >
              ←
          </NavigationButton>
          <NavigationButton
              className="next"
              onClick={() => handleManualRotate('next')}
          >
              →
          </NavigationButton>
      </HeroContainer>
  );
};

export default Hero;

