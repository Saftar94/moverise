import React from 'react';
import styled from 'styled-components';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';

const StyledDeleteButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #ff6b08;
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.3s ease;

  &:hover {
    background-color: red;
  }
`;

const DeleteButton = ({ movieId, user, onDelete }) => {
    
  const handleDelete = async () => {
    if (!user) return;

    try {
      const movieRef = doc(db, 'users', user.uid, 'library', movieId.toString());
      await deleteDoc(movieRef);
      console.log('Movie deleted successfully');
      if (onDelete) {
        onDelete(movieId);
      }
    } catch (error) {
      console.error('Error deleting movie:', error);
    }
  };

  return (
    <StyledDeleteButton
      onClick={(e) => {
        e.stopPropagation();
        handleDelete();
      }}
    >
      ×
    </StyledDeleteButton>
  );
};

export default DeleteButton;