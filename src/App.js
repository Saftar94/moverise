import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Header from './components/header/header';
import Home from './components/home/home';
import Login from './components/login/login';
import MyLibrary from './components/myLibrary/myLibrary';
import ProtectedRoute from './components/protectedRoute/protectedRoute.jsx';
import { searchMovies } from './components/services/movieApi.js';
import Footer from './components/footer/footer';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState(); 
  const [libraryMovies, setLibraryMovies] = useState([]); 
  const [librarySearchResults, setLibrarySearchResults] = useState(null); 
  const location = useLocation();
  const [isSearching, setIsSearching] = useState(false); 
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      if (user) {
        const savedMovies = JSON.parse(localStorage.getItem(`userLibrary_${user.uid}`)) || [];
        setLibraryMovies(savedMovies);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSearch = async (query) => {
    if(!query  || query.trim() === '') {
      setMovies(null);
      setLibrarySearchResults(null); 
      return;
    }
  
    if (location.pathname === "/") {
      try {
        const data = await searchMovies(query);
        if (data.results.length === 0) {
          setMovies([]);
        } else {
          setMovies(data.results);
        }
      } catch (error) {
        console.error('Search error:', error);
        setMovies([]);
      }
    }
  else if (location.pathname === "/library") {
    setIsSearching(true); 
      
    const filteredMovies = libraryMovies.filter(movie =>
      movie.title.toLowerCase().includes(query.toLowerCase())
    );
    
    if (filteredMovies.length === 0) {
      setLibrarySearchResults([]); 
    } else {
      setLibrarySearchResults(filteredMovies);
    }
  }
  }


  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>   
      <Header user={user} onSearch={handleSearch} onSearchChange={setSearchQuery}  />
      <Routes>
        <Route 
          path="/" 
          element={<Home user={user} movies={movies} onSearch={handleSearch} searchQuery={searchQuery}/>}
        />
        <Route 
          path="/login" 
          element={!user ? <Login /> : <Navigate to="/" />} 
        />
        <Route 
          path="/library" 
          element={
            <ProtectedRoute user={user}>
              <MyLibrary user={user} moviesLibr={librarySearchResults === null ? libraryMovies : librarySearchResults } isSearching={isSearching}  />
            </ProtectedRoute>
          } 
        />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
