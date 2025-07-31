import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const HomeContainer = styled.div`
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
`;

const Title = styled(motion.h1)`
  font-size: 3.5rem;
  font-weight: bold;
  color: white;
  margin-bottom: 1rem;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled(motion.p)`
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 3rem;
  max-width: 600px;
`;

const SearchSection = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin-bottom: 3rem;
  width: 100%;
  max-width: 600px;
`;

const SearchLabel = styled.label`
  display: block;
  color: white;
  font-size: 1.1rem;
  margin-bottom: 1rem;
  font-weight: 500;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
  margin-bottom: 1rem;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
  
  &:focus {
    outline: none;
    border-color: #4ecdc4;
    box-shadow: 0 0 20px rgba(78, 205, 196, 0.3);
  }
`;

const Button = styled(motion.button)`
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const FandomGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  width: 100%;
  max-width: 1000px;
`;

const FandomCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 1.5rem;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
    border-color: #4ecdc4;
  }
`;

const FandomName = styled.h3`
  color: white;
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
`;

const FandomUrl = styled.p`
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  font-size: 0.9rem;
  word-break: break-all;
`;

const HomePage = ({ fandoms, onSelectFandom }) => {
  const [fandomUrl, setFandomUrl] = useState('');
  const [isScrapingMode, setIsScrapingMode] = useState(false);
  const navigate = useNavigate();

  const handleUrlSubmit = async () => {
    if (!fandomUrl.trim()) {
      toast.error('Veuillez entrer une URL Fandom');
      return;
    }

    if (!fandomUrl.includes('fandom.com')) {
      toast.error('Veuillez entrer une URL Fandom valide (*.fandom.com)');
      return;
    }

    setIsScrapingMode(true);
    toast.loading('Démarrage du scraping...', { duration: 3000 });
    
    // Simuler le lancement du scraping
    setTimeout(() => {
      toast.success('Scraping terminé ! Redirection vers les résultats...');
      setTimeout(() => {
        navigate('/explore');
      }, 1000);
    }, 3000);
  };

  const handleFandomSelect = (fandom) => {
    onSelectFandom(fandom.id);
    toast.success(`Chargement de ${fandom.name}...`);
    setTimeout(() => {
      navigate('/explore');
    }, 1000);
  };

  return (
    <HomeContainer>
      <Title
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Fandom Explorer
      </Title>
      
      <Subtitle
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        Explorez et comparez vos personnages préférés de tous les univers Fandom
      </Subtitle>

      <SearchSection
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <SearchLabel>
          🔗 Entrez l'URL d'un wiki Fandom pour démarrer le scraping
        </SearchLabel>
        <SearchInput
          type="url"
          value={fandomUrl}
          onChange={(e) => setFandomUrl(e.target.value)}
          placeholder="https://leagueoflegends.fandom.com/"
        />
        <Button
          onClick={handleUrlSubmit}
          disabled={isScrapingMode}
          whileTap={{ scale: 0.95 }}
        >
          {isScrapingMode ? '🚀 Scraping en cours...' : '🎯 Démarrer le scraping'}
        </Button>
      </SearchSection>

      {fandoms.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          style={{ width: '100%', maxWidth: '1000px' }}
        >
          <h2 style={{ color: 'white', textAlign: 'center', marginBottom: '2rem' }}>
            📚 Ou explorez les fandoms déjà scrapés
          </h2>
          <FandomGrid>
            {fandoms.map((fandom, index) => (
              <FandomCard
                key={fandom.id}
                onClick={() => handleFandomSelect(fandom)}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FandomName>{fandom.name}</FandomName>
                <FandomUrl>{fandom.url}</FandomUrl>
              </FandomCard>
            ))}
          </FandomGrid>
        </motion.div>
      )}
    </HomeContainer>
  );
};

export default HomePage;
