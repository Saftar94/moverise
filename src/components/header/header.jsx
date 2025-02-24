import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { GiFilmSpool } from "react-icons/gi";
import { auth } from '../services/firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import SearchBar from '../search/searchBar';


const HeaderContainer = styled.header`
  background: linear-gradient(
    45deg,
    #0f0f0f,
    #2c1810,
    #1f1f1f,
    #ff6b0833,
    #0f0f0f
  );
  background-size: 400% 400%;
  animation: gradientBG 10s ease infinite;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);

  @media (min-width: 768px) {
    padding: 2rem;
  }

  @media (min-width: 1024px) {
    padding: 4rem 2rem;
  }
`;

const Nav = styled.nav`
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;

  @media (min-width: 768px) {
    max-width: 768px;
    flex-direction: row;
    justify-content: space-between;
  }

  @media (min-width: 1024px) {
    max-width: 1200px;
  }
`;

const LogoLink = styled(Link)`
  text-decoration: none;
  color: white;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: color 0.3s ease;
  font-weight: 700;
  font-size: 20px;

  @media (min-width: 768px) {
    font-size: 22px;
    gap: 10px;
  }

  @media (min-width: 1024px) {
    font-size: 24px;
  }

  &:hover {
    color: #ff6b08;
  }
`;

const LogoIcon = styled.span`
  font-size: 24px;

  @media (min-width: 768px) {
    font-size: 26px;
  }

  @media (min-width: 1024px) {
    font-size: 28px;
  }
`;

const NavList = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: center;
  list-style: none;
  padding: 0;
  margin: 0;
  gap: 15px;

  @media (min-width: 768px) {
    flex-direction: row;
    gap: 20px;
  }

  @media (min-width: 1024px) {
    gap: 30px;
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: #fff;
  font-size: 14px;
  padding: 4px 0;
  position: relative;
  
  @media (min-width: 768px) {
    font-size: 15px;
    padding: 5px 0;
  }

  @media (min-width: 1024px) {
    font-size: 16px;
  }
  
  &:after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: #ff6b08;
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }

  &.active:after {
    transform: scaleX(1);
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #fff;

  @media (min-width: 768px) {
    gap: 8px;
  }
`;

const UserAvatar = styled.div`
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background-color: #ff6b08;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  font-size: 12px;

  @media (min-width: 768px) {
    width: 28px;
    height: 28px;
    font-size: 13px;
  }

  @media (min-width: 1024px) {
    width: 30px;
    height: 30px;
    font-size: 14px;
  }
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: #ff6b08;
  cursor: pointer;
  padding: 4px;
  margin-left: 8px;
  font-size: 12px;
  
  @media (min-width: 768px) {
    padding: 5px;
    margin-left: 10px;
    font-size: 13px;
  }

  @media (min-width: 1024px) {
    font-size: 14px;
  }
  
  &:hover {
    color: #ff8533;
  }
`;

const Header = ({onSearch, libraryMovies, onSearchChange}) => {
  const location = useLocation();
  const [user] = useAuthState(auth);



  const handleLogout = () => {
    localStorage.removeItem(`userLibrary_${user.uid}`);
    auth.signOut();
  };
  
  const getInitials = (name) => {
    return name
      ? name.split(' ')
          .map(word => word[0])
          .join('')
          .toUpperCase()
      : '?';
  };

  return (
    <HeaderContainer>
      <Nav>
        <LogoLink to="/">
          <LogoIcon><GiFilmSpool /></LogoIcon>
          MOVERISE
        </LogoLink>
        <NavList>
        {user ? (
            <li>
              <UserInfo>
                <UserAvatar>
                  {getInitials(user.displayName || user.email)}
                </UserAvatar>
                <span>{user.displayName || user.email.split('@')[0]}</span>
                <LogoutButton onClick={handleLogout}>
                 Logout
                </LogoutButton>
              </UserInfo>
            </li>
          ) : (
            <li>
              <StyledLink 
                to="/login" 
                className={location.pathname === '/login' ? 'active' : ''}
              >
                <GiFilmSpool />
                LOGIN
              </StyledLink>
            </li>
          )}
          <li>
            <StyledLink 
              to="/" 
              className={location.pathname === '/' ? 'active' : ''}
            >
              HOME
            </StyledLink>
          </li>
          <li>
            <StyledLink 
              to="/library" 
              className={location.pathname === '/library' ? 'active' : ''}
            >
              MY LIBRARY
            </StyledLink>
          </li>
        </NavList>
      </Nav>
      <SearchBar 
        onSearch={onSearch}
        libraryMovies={libraryMovies}
        onSearchChange={onSearchChange}
      />

    </HeaderContainer>
  );
};

export default Header;