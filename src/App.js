import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/header/header';
import Home from './components/home/home';
import Login from './components/login/login';
import './App.css';

const Contacts = () => <h1>Contacts</h1>;

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/contacts" element={<Contacts />} />
      </Routes>
    </div>
  );
}

export default App;