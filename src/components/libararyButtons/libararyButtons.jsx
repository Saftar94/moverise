import React, { useState } from 'react';
import styled from 'styled-components';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import Toast from '../movieModal/toast';

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 10px;
  width: 100%;
  max-width: 300px;
  margin: 0 auto;

  @media (min-width: 768px) {
    max-width: 400px;
    gap: 12px;
    margin-top: 15px;
  }

  @media (min-width: 1024px) {
    flex-direction: row;
    max-width: 600px;
    gap: 15px;
    margin-top: 20px;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.3s ease;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (min-width: 768px) {
    padding: 12px 20px;
    font-size: 15px;
  }

  @media (min-width: 1024px) {
    padding: 12px 25px;
    font-size: 16px;
  }
`;

const WatchedButton = styled(Button)`
  background-color: rgb(255, 21, 21);
  color: white;

  &:hover:not(:disabled) {
    background-color: rgb(255, 104, 172);
  }
`;

const FutureButton = styled(Button)`
  background-color: rgb(30, 208, 60);
  color: white;

  &:hover:not(:disabled) {
    background-color: rgb(193, 193, 65);
  }
`;

const Message = styled.div`
  margin-top: 8px;
  color: ${props => props.type === 'error' ? '#ff6b6b' : '#51cf66'};
  font-size: 12px;
  text-align: center;

  @media (min-width: 768px) {
    margin-top: 10px;
    font-size: 13px;
  }

  @media (min-width: 1024px) {
    margin-top: 12px;
    font-size: 14px;
  }
`;

const LibraryButtons = ({ movie, user, onUpdate }) => {
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const addToLibrary = async (type) => {
    if (!user) {
      setMessage('Please login to add movies to your library');
      setMessageType('error');
      return;
    }

    try {
      const db = getFirestore();
      const movieRef = doc(db, 'users', user.uid, 'library', movie.id.toString());

      await setDoc(movieRef, {
        movieId: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        overview: movie.overview,
        vote_average: movie.vote_average,
        release_date: movie.release_date,
        type: type,
        addedAt: new Date().toISOString()
      });

      setMessage(`Successfully added to ${type} list!`);
      setMessageType('success');
      setToastMessage(`Successfully added to ${type} list!`);
      setShowToast(true);

      if (onUpdate) {
        onUpdate(movie, "add");
      }
    } catch (error) {
      setMessage('Error adding movie to library');
      setMessageType('error');
      setToastMessage('Error adding movie to library');
      setShowToast(true);
    }
  };

  return (
    <>
      <ButtonContainer>
        <WatchedButton
          onClick={() => addToLibrary('watched')}
          disabled={!user}
        >
          Add to Watched
        </WatchedButton>
        <FutureButton
          onClick={() => addToLibrary('future')}
          disabled={!user}
        >
          Add to Future
        </FutureButton>
      </ButtonContainer>
      {message && <Message type={messageType}>{message}</Message>}
      {showToast && <Toast message={toastMessage} type={messageType} />}
    </>
  );
};

export default LibraryButtons;
