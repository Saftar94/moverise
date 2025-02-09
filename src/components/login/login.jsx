import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { auth } from '../services/config';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';

import { FcGoogle } from 'react-icons/fc';


const LoginContainer = styled.div`
  max-width: 400px;
  margin: 50px auto;
  padding: 30px;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 8px;
  color: white;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #ff6b08;
  border-radius: 4px;
  background: transparent;
  color: white;
  
  &:focus {
    outline: none;
    border-color: #ff8533;
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }
`;

const Button = styled.button`
  padding: 12px;
  background: #ff6b08;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.3s ease;
  
  &:hover {
    background: #ff8533;
  }

  &:disabled {
    background: #666;
    cursor: not-allowed;
  }
`;

const GoogleButton = styled(Button)`
  background: white;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  
  &:hover {
    background: #f1f1f1;
  }
`;

const Message = styled.div`
  padding: 10px;
  margin: 10px 0;
  border-radius: 4px;
  text-align: center;
  
  &.error {
    background: rgba(255, 68, 68, 0.1);
    color: #ff4444;
  }
  
  &.success {
    background: rgba(0, 200, 81, 0.1);
    color: #00c851;
  }
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  color: #ff6b08;
  cursor: pointer;
  text-decoration: underline;
  margin-top: 10px;
  
  &:hover {
    color: #ff8533;
  }
`;

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      if (isLogin) {
        // Вход
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
        setMessage({ text: 'Successful login!', type: 'success' });
        setTimeout(() => navigate('/'), 1500);
      } else {
        // Регистрация
        try {
          await createUserWithEmailAndPassword(auth, formData.email, formData.password);
          setMessage({ text: 'Registration successful!', type: 'success' });
          setTimeout(() => navigate('/'), 1500);
        } catch (error) {
          if (error.code === 'auth/email-already-in-use') {
            setMessage({ text: 'A user with this email already exists', type: 'error' });
          } else {
            throw error;
          }
        }
      }
    } catch (error) {
      switch (error.code) {
        case 'auth/wrong-password':
          setMessage({ text: 'Incorrect password!', type: 'error' });
          break;
        case 'auth/user-not-found':
          setMessage({ text: 'User not found!', type: 'error' });
          break;
        case 'auth/invalid-email':
          setMessage({ text: 'Incorrect email!', type: 'error' });
          break;
        case 'auth/weak-password':
          setMessage({ text: 'Password must be at least 6 characters!', type: 'error' });
          break;
        default:
          setMessage({ text: 'An error has occurred. Please try again later!', type: 'error' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      setMessage({ text: 'Successful login via Google!', type: 'success' });
      setTimeout(() => navigate('/'), 1500);
    } catch (error) {
      setMessage({ text: 'Google login error!', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer>
      <h2>{isLogin ? 'Login' : 'Sing Up'}</h2>
      <Form onSubmit={handleSubmit}>
        <Input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          disabled={loading}
        />
        <Input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          disabled={loading}
        />
        <Button type="submit" disabled={loading}>
          {loading ? 'Loading...' : isLogin ? 'Login' : 'Sing up'}
        </Button>
        <GoogleButton type="button" onClick={handleGoogleLogin} disabled={loading}>
          <FcGoogle size={20} />
          Login with Google
        </GoogleButton>
      </Form>
      
      {message.text && (
        <Message className={message.type}>
          {message.text}
        </Message>
      )}

      <ToggleButton 
        type="button" 
        onClick={() => setIsLogin(!isLogin)}
        disabled={loading}
      >
        {isLogin ? `Don't have an account? Sign up` : 'Already have an account? Login'}
      </ToggleButton>
    </LoginContainer>
  );
};

export default Login;