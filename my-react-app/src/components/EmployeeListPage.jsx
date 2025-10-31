import React, { useState, useCallback } from 'react';
import SearchBar from './SearchBar';
import EmployeeList from './EmployeeList';

function EmployeeListPage() {
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearchResults = useCallback((results, searching) => {
    setSearchResults(results);
    setIsSearching(searching);
  }, []);

  return (
    <>
      <SearchBar onSearchResults={handleSearchResults} />
      <EmployeeList searchResults={searchResults} isSearching={isSearching} />
    </>
  );
}

export default EmployeeListPage;