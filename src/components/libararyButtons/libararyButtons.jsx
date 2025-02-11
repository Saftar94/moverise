import React, {useState} from 'react';
import styled from 'styled-components';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:disabled {
    // opacity: 0.5;
    cursor: not-allowed;
  }
`;

const WatchedButton = styled(Button)`
  background-color:rgb(255, 21, 21);
  color: white;
  
  &:hover {
    background-color:rgb(255, 104, 172);
  }
`;

const FutureButton = styled(Button)`
  background-color:rgb(30, 208, 60);
  color: white;
  
  &:hover {
    background-color:rgb(193, 193, 65);
  }
`;

const Message = styled.div`
  margin-top: 10px;
  color: ${props => props.type === 'error' ? '#ff6b6b' : '#51cf66'};
  font-size: 14px;
`;

const LibraryButtons = ({ movie, user, onUpdate }) => {
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
  
    const addToLibrary = async (type) => {
      if (!user) {
        setMessage('Please login to add movies to your library');
        setMessageType('error');
        return;
      }
      console.log('Adding to library:', { movie, user, type });

  
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

        console.log('Saving movie data:', setDoc);
        await setDoc(movieRef, `setDoc`);
        console.log('Successfully saved to Firestore')

        setMessage(`Successfully added to ${type} list!`);
        setMessageType('success');
        
        if (onUpdate) {
          onUpdate();
        }
      } catch (error) {
        console.error('Error adding movie:', error);
        setMessage('Error adding movie to library');
        setMessageType('error');
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
        </>
      );
};

export default LibraryButtons;