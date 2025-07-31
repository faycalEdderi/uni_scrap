import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  color: rgba(255, 255, 255, 0.8);
`;

const FooterTitle = styled.h3`
  color: white;
  margin: 0 0 1rem 0;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const FooterLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin: 1rem 0;
  flex-wrap: wrap;
`;

const FooterLink = styled.a`
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: color 0.3s ease;
  
  &:hover {
    color: #4ecdc4;
  }
`;

const Copyright = styled.p`
  margin: 1rem 0 0 0;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterTitle>Fandom Explorer</FooterTitle>
        <p>
          Explorez et comparez vos personnages préférés de tous les univers Fandom
        </p>
        <FooterLinks>
          <FooterLink href="https://github.com/faycalEdderi/uni_scrap" target="_blank" rel="noopener noreferrer">
            GitHub
          </FooterLink>
          <FooterLink href="#" onClick={(e) => e.preventDefault()}>
            Documentation
          </FooterLink>
          <FooterLink href="#" onClick={(e) => e.preventDefault()}>
            À propos
          </FooterLink>
        </FooterLinks>
        <Copyright>
          © 2025 Fandom Explorer - Projet universitaire par Faycal Edderi - Aoughane Mouad
        </Copyright>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;
