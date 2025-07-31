import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const CardContainer = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
    border-color: #4ecdc4;
  }
`;

const ImageContainer = styled.div`
  height: 200px;
  overflow: hidden;
  position: relative;
`;

const CharacterImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  
  ${CardContainer}:hover & {
    transform: scale(1.1);
  }
`;

const ImagePlaceholder = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: white;
`;

const Content = styled.div`
  padding: 1.5rem;
`;

const CharacterName = styled.h3`
  color: white;
  margin: 0 0 0.5rem 0;
  font-size: 1.3rem;
  font-weight: 600;
`;

const CharacterType = styled.span`
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  display: inline-block;
  margin-bottom: 1rem;
`;

const Description = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  line-height: 1.4;
  margin: 0 0 1rem 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const AttributesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Attribute = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 0.5rem;
  border-radius: 8px;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.9);
`;

const ExpandButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 1rem;
  width: 100%;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const Modal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
`;

const ModalContent = styled(motion.div)`
  background: rgba(30, 60, 114, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 2rem;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const CharacterCard = ({ character, index }) => {
  const [expanded, setExpanded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <>
      <CardContainer
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        whileHover={{ y: -5 }}
        onClick={() => setExpanded(true)}
      >
        <ImageContainer>
          {imageError || !character.image_url ? (
            <ImagePlaceholder>
              🎭
            </ImagePlaceholder>
          ) : (
            <CharacterImage
              src={character.image_url}
              alt={character.name}
              onError={handleImageError}
            />
          )}
        </ImageContainer>
        
        <Content>
          <CharacterName>{character.name}</CharacterName>
          {character.character_type && (
            <CharacterType>{character.character_type}</CharacterType>
          )}
          
          <Description>
            {character.description || 'Aucune description disponible.'}
          </Description>
          
          <AttributesContainer>
            {character.attribute_1 && (
              <Attribute>{character.attribute_1}</Attribute>
            )}
            {character.attribute_2 && (
              <Attribute>{character.attribute_2}</Attribute>
            )}
          </AttributesContainer>
          
          <ExpandButton onClick={(e) => {
            e.stopPropagation();
            setExpanded(true);
          }}>
            Voir plus de détails
          </ExpandButton>
        </Content>
      </CardContainer>

      {expanded && (
        <Modal
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setExpanded(false)}
        >
          <ModalContent
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <CloseButton onClick={() => setExpanded(false)}>
              ×
            </CloseButton>
            
            <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
              <div style={{ flex: '1', minWidth: '200px' }}>
                {imageError || !character.image_url ? (
                  <ImagePlaceholder style={{ height: '250px', borderRadius: '12px' }}>
                    🎭
                  </ImagePlaceholder>
                ) : (
                  <img
                    src={character.image_url}
                    alt={character.name}
                    style={{
                      width: '100%',
                      height: '250px',
                      objectFit: 'cover',
                      borderRadius: '12px'
                    }}
                    onError={handleImageError}
                  />
                )}
              </div>
              
              <div style={{ flex: '2' }}>
                <h2 style={{ color: 'white', margin: '0 0 1rem 0' }}>{character.name}</h2>
                {character.character_type && (
                  <CharacterType style={{ marginBottom: '1rem' }}>
                    {character.character_type}
                  </CharacterType>
                )}
                
                <h4 style={{ color: '#4ecdc4', marginBottom: '0.5rem' }}>Description</h4>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                  {character.description || 'Aucune description disponible.'}
                </p>
                
                <h4 style={{ color: '#4ecdc4', marginBottom: '0.5rem' }}>Attributs</h4>
                <AttributesContainer>
                  {character.attribute_1 && <Attribute>{character.attribute_1}</Attribute>}
                  {character.attribute_2 && <Attribute>{character.attribute_2}</Attribute>}
                  {character.fandom_name && (
                    <Attribute>Fandom: {character.fandom_name}</Attribute>
                  )}
                  {character.page_url && (
                    <Attribute>
                      <a 
                        href={character.page_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ color: '#4ecdc4', textDecoration: 'none' }}
                      >
                        Voir la page originale →
                      </a>
                    </Attribute>
                  )}
                </AttributesContainer>
              </div>
            </div>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default CharacterCard;
