import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/header/header';
import Home from './components/home/home';
import './App.css';

const Login = () => <h1>Login</h1>;
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