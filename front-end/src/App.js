import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';  // Import Routes and Route

// Import your components
import LoginForm from './components/_auth/LoginForm';
import SignUpForm from './components/_auth/SignUpForm';
import NavBar from './components/Navigation/NavBar';  // Example of importing NavBar
import Footer from './components/Footer/Footer';  // Example of importing Footer
import './index.css';

function App() {
  return (
    <>
      <Router>  {/* Wrap everything inside BrowserRouter */}
        <NavBar />  {/* Add NavBar component */}
        <Routes> {/* Use Routes instead of Switch */}
          <Route path="/login" element={<LoginForm />} /> {/* Use element prop for rendering components */}
          <Route path="/sign-up" element={<SignUpForm />} />
        </Routes>
      </Router>
      <Footer />  {/* Add Footer component */}
    </>
  );
}

export default App;
