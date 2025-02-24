import React from 'react';
import styled from 'styled-components';
import { FaHeart } from 'react-icons/fa';

const FooterContainer = styled.footer`
  background-color: #000;
  color: #fff;
  padding: 20px 0;
  text-align: center;
  margin-top: auto; // Прижимает футер к низу страницы
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const Copyright = styled.p`
  margin: 0;
  padding: 5px 0;
  font-size: 14px;
`;

const DevelopedBy = styled.p`
  margin: 10px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  font-size: 14px;
`;

const HeartIcon = styled(FaHeart)`
  color: #ff6b08;
  margin: 0 5px;
`;

const Link = styled.a`
  color: #ff6b08;
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: #ff8533;
  }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <Copyright>© 2024 All Rights Reserved</Copyright>
        <DevelopedBy>
          Developed with <HeartIcon /> by{' '}
          <Link 
            href="https://beetrootacademy.com/" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            beetrootacademy
          </Link>
          {' '}Student Aliyev Saftar
        </DevelopedBy>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;