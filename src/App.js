import './App.css';
import React from 'react';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import Schedule from './pages/Schedule/Schedule';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/" element={<Schedule />} />
      </Routes>
    </Router>
  );
}

export default App;
