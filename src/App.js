import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />        
        <Route path="/login" element={<LoginForm />} />     
        <Route path="/signup" element={<SignUpForm />} />
      </Routes>
    </Router>
  );
}

export default App;
