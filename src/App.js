import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import TypingTest from './components/TypingTest/TypingTest';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/typing-test" element={<TypingTest />} />
      </Routes>
    </Router>
  );
}

export default App;
