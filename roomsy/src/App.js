import logo from './logo.svg';
import './App.css';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './pages/LoginPage';
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <Router>
      <Routes>
        <Route path = "/" element = {<Login />} />
        <Route path = "/dashboard" element = {<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;