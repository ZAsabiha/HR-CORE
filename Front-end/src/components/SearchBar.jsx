
// import React, { useState, useEffect } from 'react';
// import './SearchBar.css';
// import { IoMdMenu } from "react-icons/io";
// import { CiSearch } from "react-icons/ci";

// function SearchBar() {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [results, setResults] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // Debounced search (optional for performance)
//   useEffect(() => {
//     const delayDebounce = setTimeout(() => {
//       if (searchTerm.trim() === '') {
//         setResults([]);
//         return;
//       }

//       const fetchSearchResults = async () => {
//         try {
//           setLoading(true);
//           const response = await fetch(`/api/employees/search?name=${encodeURIComponent(searchTerm)}`);
//           const data = await response.json();
//           setResults(data);
//         } catch (error) {
//           console.error('Search failed:', error);
//           setResults([]);
//         } finally {
//           setLoading(false);
//         }
//       };

//       fetchSearchResults();
//     }, 300); // 300ms debounce

//     return () => clearTimeout(delayDebounce);
//   }, [searchTerm]);

//   return (
//  <div
//   className="search-container"
//   style={{
//     padding: "20px",
//     fontSize: "18px",
//     maxWidth: "600px",
//     margin: "0 auto",
//   }}
// >
//   <label
//     htmlFor="search-input"
//     className="search-label"
//     style={{
//       fontSize: "20px",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "space-between",
//       marginBottom: "10px",
//     }}
//   >
//     <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
//       <IoMdMenu style={{ fontSize: "35px" }} />
//       <span>Search Employees</span>
//     </div>
//     <CiSearch style={{ fontSize: "24px" }} />
//   </label>

// <div
//   style={{
//     display: "flex",
//     justifyContent: "flex-start",
//     marginBottom: "25px",
//     width: "800px",
//     position: "relative",
//     left: "-2cm",   // move the whole container (and input) 5cm left
//   }}
// >
//   <input
//     id="search-input"
//     type="text"
//     className="search-input"
//     placeholder="Search employees..."
//     value={searchTerm}
//     onChange={(e) => setSearchTerm(e.target.value)}
//     style={{
//       padding: "10px",
//       fontSize: "16px",
//       width: "100%",       // fills the container
//       borderRadius: "6px",
//       border: "1px solid #ccc",
//       outline: "none",
//       boxSizing: "border-box",
//     }}
//   />
// </div>




//   <ul
//     className="search-results"
//     style={{
//       marginTop: "15px",
//       fontSize: "16px",
//       listStyle: "none",
//       padding: 0,
//     }}
//   >
//     {loading ? (
//       <li style={{ padding: "8px", color: "gray" }}>Searching...</li>
//     ) : results.length > 0 ? (
//       results.map((emp) => (
//         <li
//           key={emp.id}
//           className="result-item"
//           style={{
//             padding: "8px",
//             borderBottom: "1px solid #ccc",
//             cursor: "pointer",
//           }}
//         >
//           {emp.name} – {emp.email}
//         </li>
//       ))
//     ) : (
//       searchTerm.trim() !== "" && (
//         <li className="no-results" style={{ padding: "8px", color: "red" }}>
//           No employees found.
//         </li>
//       )
//     )}
//   </ul>
// </div>

//   );
// }

// export default SearchBar;


import React, { useState, useEffect, useRef } from 'react';
import './SearchBar.css';
import { IoMdMenu } from "react-icons/io";
import { CiSearch } from "react-icons/ci";

function SearchBar({ onSearchResults }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const abortControllerRef = useRef(null);

  // Debounced search
  useEffect(() => {
    // Cancel previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const delayDebounce = setTimeout(() => {
      if (searchTerm.trim() === '') {
        setResults([]);
        setLoading(false);
        onSearchResults([], false); // Not searching, show all employees
        return;
      }

      const fetchSearchResults = async () => {
        try {
          // Create new AbortController for this request
          abortControllerRef.current = new AbortController();
          
          setLoading(true);
          onSearchResults([], true); // Searching state
          
          const response = await fetch(
            `/api/employees/search?name=${encodeURIComponent(searchTerm)}`,
            { signal: abortControllerRef.current.signal }
          );
          
          if (!response.ok) throw new Error('Search failed');
          
          const data = await response.json();
          setResults(data);
          onSearchResults(data, true); // Pass results to parent
        } catch (error) {
          if (error.name !== 'AbortError') {
            console.error('Search failed:', error);
            setResults([]);
            onSearchResults([], true);
          }
        } finally {
          setLoading(false);
        }
      };

      fetchSearchResults();
    }, 300);

    return () => {
      clearTimeout(delayDebounce);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [searchTerm, onSearchResults]);

  return (
    <div
      className="search-container"
      style={{
        padding: "20px",
        fontSize: "18px",
        maxWidth: "600px",
        margin: "0 auto",
      }}
    >
      <label
        htmlFor="search-input"
        className="search-label"
        style={{
          fontSize: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
          <IoMdMenu style={{ fontSize: "35px" }} />
          <span>Search Employees</span>
        </div>
        <CiSearch style={{ fontSize: "24px" }} />
      </label>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          marginBottom: "25px",
          width: "800px",
          position: "relative",
          left: "-2cm",
        }}
      >
        <input
          id="search-input"
          type="text"
          className="search-input"
          placeholder="Search employees..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={{
            padding: "10px",
            fontSize: "16px",
            width: "100%",
            borderRadius: "6px",
            border: isFocused ? "1px solid #276f82" : "1px solid #ccc",
            outline: "none",
            boxSizing: "border-box",
            // Fix text visibility
            color: "#333", // Dark text color for input text
            backgroundColor: "#fff", // White background
            boxShadow: isFocused ? "0 0 5px rgba(39, 111, 130, 0.3)" : "none", // Subtle glow when focused
            // Placeholder styling (note: ::placeholder pseudo-element can't be styled inline, but we can ensure good contrast)
          }}
        />
      </div>

      {/* Optional: Show search results preview */}
      {searchTerm.trim() !== '' && (
        <ul
          className="search-results"
          style={{
            marginTop: "15px",
            fontSize: "16px",
            listStyle: "none",
            padding: 0,
          }}
        >
          {loading ? (
            <li style={{ padding: "8px", color: "gray" }}>Searching...</li>
          ) : results.length > 0 ? (
            <li style={{ padding: "8px", color: "green" }}>
              Found {results.length} employee(s). Results shown below.
            </li>
          ) : (
            <li className="no-results" style={{ padding: "8px", color: "red" }}>
              No employees found.
            </li>
          )}
        </ul>
      )}

      {/* CSS for placeholder - since ::placeholder can't be styled inline, we add a style tag */}
      <style jsx>{`
        #search-input::placeholder {
          color: #888 !important;
          opacity: 1 !important;
          font-style: italic;
        }
      `}</style>
    </div>
  );
}

export default SearchBar;