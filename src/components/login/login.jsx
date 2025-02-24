import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


import styled from 'styled-components';

import handleGoogleLogin from './handGooglelogin';
import handleSubmit from './handleSubmit';
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

  const handleSubmitForm = (e) => {
    handleSubmit({ 
      e, 
      isLogin, 
      formData: {
        email: formData.email.trim(),
        password: formData.password
      }, 
      setLoading, 
      setMessage, 
      navigate 
    });
  };
  const handleGoogleLoginClick = async (e) => {
    e.preventDefault();
    await handleGoogleLogin({ 
      setLoading, 
      setMessage, 
      navigate 
    });
  };

  return (
    <LoginContainer>
      <h2>{isLogin ? 'Login' : 'Sing Up'}</h2>
      <Form onSubmit={handleSubmitForm}>
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
        <GoogleButton type="button" onClick={handleGoogleLoginClick} disabled={loading}>
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