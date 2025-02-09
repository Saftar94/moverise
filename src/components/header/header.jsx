import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { GiFilmSpool } from "react-icons/gi";
import { auth } from '../services/config';
import { useAuthState } from 'react-firebase-hooks/auth';

const HeaderContainer = styled.header`
  background-color: #000;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
`;

const Nav = styled.nav`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LogoLink = styled(Link)`
  text-decoration: none;
  color: white;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: color 0.3s ease;
  font-weight: 700;
  font-size: 24px;
  &:hover {
    color: #ff6b08;
  }
`;



const LogoIcon = styled.span`
  font-size: 28px;
`;

const NavList = styled.ul`
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
  gap: 30px;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: #fff;
  font-size: 16px;
  padding: 5px 0;
  position: relative;
  
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
  gap: 8px;
  color: #fff;
`;

const UserAvatar = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #ff6b08;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: #ff6b08;
  cursor: pointer;
  padding: 5px;
  margin-left: 10px;
  
  &:hover {
    color: #ff8533;
  }
`;

const Header = () => {
  const location = useLocation();
  const [user] = useAuthState(auth);

  const handleLogout = () => {
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
              to="/contacts" 
              className={location.pathname === '/contacts' ? 'active' : ''}
            >
              MY LIBRARY
            </StyledLink>
          </li>
        </NavList>
      </Nav>
    </HeaderContainer>
  );
};

export default Header;