import React from 'react';
import styled, { keyframes } from 'styled-components';

const slideIn = keyframes`
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const ToastContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: ${props => props.type === 'success' ? '#4CAF50' : '#f44336'};
  color: white;
  padding: 16px 24px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  animation: ${slideIn} 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Toast = ({ message, type = 'success' }) => {
  return (
    <ToastContainer type={type}>
      {message}
    </ToastContainer>
  );
};

export default Toast;