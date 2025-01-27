import './App.css';
import React from 'react';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import Schedule from './pages/Schedule/Schedule';
import PageTitle from './components/PageTitle';

function App() {
  return (
    <Router>
      <PageTitle title="Расписание ИКТИБ" />
      <Routes>
        <Route path="/schedule" element={<Schedule />} />
      </Routes>
    </Router>
  );
}
export default App;
