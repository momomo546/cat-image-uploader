import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css';
import Header from "./Header";
import Footer from "./Footer";
import Home from './Home';
import Uploader from './Uploader';

const App: React.FC = () => {
  return (
    <>
      <Router>
        <Header />
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/uploader" element={<Uploader />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </>
  );
}

export default App;
