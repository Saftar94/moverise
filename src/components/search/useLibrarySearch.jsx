import { useState } from "react";

const useLibrarySearch = (libraryMovies) => {
  const [searchResults, setSearchResults] = useState([]);

  const searchLibrary = (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const filteredMovies = libraryMovies.filter((movie) =>
      movie.title.toLowerCase().includes(query.toLowerCase())
    );

    setSearchResults(filteredMovies);
  };

  return { searchResults, searchLibrary };
};

export default useLibrarySearch;
