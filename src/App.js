import React from 'react';
import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Header from './components/header/header';
import Home from './components/home/home';
import Login from './components/login/login';
import MyLibrary from './components/myLibrary/myLibrary';
import ProtectedRoute from './components/protectedRoute/protectedRoute.jsx';


function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
<>   
   <Header user={user} />
      <Routes>
      <Route 
        path="/" 
        element={<Home user={user} />}
      />
 <Route 
        path="/login" 
        element={!user ? <Login /> : <Navigate to="/" />} 
      />
      <Route 
          path="/library" 
          element={
            <ProtectedRoute user={user}>
              <MyLibrary user={user} />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </>
  );
}

export default App;