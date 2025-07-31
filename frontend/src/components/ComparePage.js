import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import SearchBar from './SearchBar';

const CompareContainer = styled.div`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  color: white;
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
`;

const SelectionArea = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 3rem;
`;

const CharacterSelector = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 1.5rem;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const SelectorTitle = styled.h3`
  color: white;
  margin: 0 0 1rem 0;
  text-align: center;
`;

const CharacterList = styled.div`
  max-height: 300px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const CharacterOption = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  padding: 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid ${props => props.selected ? '#4ecdc4' : 'transparent'};
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateX(5px);
  }
`;

const CharacterName = styled.div`
  color: white;
  font-weight: 500;
  margin-bottom: 0.25rem;
`;

const CharacterType = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
`;

const ComparisonArea = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
`;

const ComparisonCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const EmptySlot = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 2px dashed rgba(255, 255, 255, 0.3);
  padding: 3rem;
  border-radius: 16px;
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  font-size: 1.1rem;
`;

const CharacterImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 1rem;
`;

const ImagePlaceholder = styled.div`
  width: 100%;
  height: 200px;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: white;
  margin-bottom: 1rem;
`;

const CompareTitle = styled.h3`
  color: white;
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
`;

const CompareType = styled.div`
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  display: inline-block;
  margin-bottom: 1rem;
`;

const CompareDescription = styled.p`
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const CompareAttributes = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const CompareAttribute = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 0.75rem;
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
`;

const ClearButton = styled.button`
  background: linear-gradient(45deg, #ff6b6b, #ff8e8e);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 1rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(255, 107, 107, 0.4);
  }
`;

const ComparePage = ({ characters, selectedFandom }) => {
  const [searchTerm1, setSearchTerm1] = useState('');
  const [searchTerm2, setSearchTerm2] = useState('');
  const [character1, setCharacter1] = useState(null);
  const [character2, setCharacter2] = useState(null);

  const filteredCharacters1 = characters.filter(char =>
    char.name.toLowerCase().includes(searchTerm1.toLowerCase()) &&
    char !== character2
  );

  const filteredCharacters2 = characters.filter(char =>
    char.name.toLowerCase().includes(searchTerm2.toLowerCase()) &&
    char !== character1
  );

  const renderCharacterCard = (character, onClear) => {
    if (!character) {
      return (
        <EmptySlot>
          <div>🎭</div>
          <div style={{ marginTop: '1rem' }}>
            Sélectionnez un personnage pour le comparer
          </div>
        </EmptySlot>
      );
    }

    return (
      <ComparisonCard
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {character.image_url ? (
          <CharacterImage src={character.image_url} alt={character.name} />
        ) : (
          <ImagePlaceholder>🎭</ImagePlaceholder>
        )}
        
        <CompareTitle>{character.name}</CompareTitle>
        
        {character.character_type && (
          <CompareType>{character.character_type}</CompareType>
        )}
        
        <CompareDescription>
          {character.description || 'Aucune description disponible.'}
        </CompareDescription>
        
        <CompareAttributes>
          {character.attribute_1 && (
            <CompareAttribute>{character.attribute_1}</CompareAttribute>
          )}
          {character.attribute_2 && (
            <CompareAttribute>{character.attribute_2}</CompareAttribute>
          )}
          {character.fandom_name && (
            <CompareAttribute>Fandom: {character.fandom_name}</CompareAttribute>
          )}
        </CompareAttributes>
        
        <ClearButton onClick={onClear}>
          Supprimer de la comparaison
        </ClearButton>
      </ComparisonCard>
    );
  };

  if (!selectedFandom || characters.length === 0) {
    return (
      <CompareContainer>
        <Header>
          <Title>Comparateur de personnages</Title>
          <Subtitle>
            Sélectionnez d'abord un fandom depuis l'accueil pour comparer des personnages.
          </Subtitle>
        </Header>
      </CompareContainer>
    );
  }

  return (
    <CompareContainer>
      <Header>
        <Title>⚔️ Comparateur de personnages</Title>
        <Subtitle>
          Comparez deux personnages de {selectedFandom.name} côte à côte
        </Subtitle>
      </Header>

      <SelectionArea>
        <CharacterSelector>
          <SelectorTitle>Personnage 1</SelectorTitle>
          <SearchBar
            searchTerm={searchTerm1}
            onSearchChange={setSearchTerm1}
            placeholder="Rechercher le premier personnage..."
          />
          <CharacterList>
            {filteredCharacters1.slice(0, 10).map(character => (
              <CharacterOption
                key={character.name}
                selected={character1 === character}
                onClick={() => setCharacter1(character)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <CharacterName>{character.name}</CharacterName>
                <CharacterType>{character.character_type}</CharacterType>
              </CharacterOption>
            ))}
          </CharacterList>
        </CharacterSelector>

        <CharacterSelector>
          <SelectorTitle>Personnage 2</SelectorTitle>
          <SearchBar
            searchTerm={searchTerm2}
            onSearchChange={setSearchTerm2}
            placeholder="Rechercher le second personnage..."
          />
          <CharacterList>
            {filteredCharacters2.slice(0, 10).map(character => (
              <CharacterOption
                key={character.name}
                selected={character2 === character}
                onClick={() => setCharacter2(character)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <CharacterName>{character.name}</CharacterName>
                <CharacterType>{character.character_type}</CharacterType>
              </CharacterOption>
            ))}
          </CharacterList>
        </CharacterSelector>
      </SelectionArea>

      <ComparisonArea>
        {renderCharacterCard(character1, () => setCharacter1(null))}
        {renderCharacterCard(character2, () => setCharacter2(null))}
      </ComparisonArea>
    </CompareContainer>
  );
};

export default ComparePage;
