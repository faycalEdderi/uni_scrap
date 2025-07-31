import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import CharacterCard from './CharacterCard';
import SearchBar from './SearchBar';

const ExploreContainer = styled.div`
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

const FandomInfo = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 1rem 2rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: inline-block;
  margin-bottom: 2rem;
`;

const FandomName = styled.h2`
  color: #4ecdc4;
  margin: 0;
  font-size: 1.3rem;
`;

const CharacterCount = styled.p`
  color: rgba(255, 255, 255, 0.8);
  margin: 0.5rem 0 0 0;
`;

const FiltersContainer = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 1.5rem;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin-bottom: 2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FilterLabel = styled.label`
  color: white;
  font-size: 0.9rem;
  font-weight: 500;
`;

const FilterSelect = styled.select`
  padding: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 0.9rem;
  
  option {
    background: #1e3c72;
    color: white;
  }
`;

const SortButton = styled.button`
  background: ${props => props.active ? 'linear-gradient(45deg, #ff6b6b, #4ecdc4)' : 'rgba(255, 255, 255, 0.1)'};
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
    transform: translateY(-2px);
  }
`;

const CharactersGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  color: white;
  font-size: 1.2rem;
`;

const NoResults = styled.div`
  text-align: center;
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
  margin-top: 3rem;
`;

const ExplorePage = ({ characters, selectedFandom, loading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // Obtenir les types uniques pour le filtre
  const characterTypes = useMemo(() => {
    const types = [...new Set(characters.map(char => char.character_type).filter(Boolean))];
    return types.sort();
  }, [characters]);

  // Filtrer et trier les personnages
  const filteredAndSortedCharacters = useMemo(() => {
    let filtered = characters.filter(character => {
      const matchesSearch = character.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           character.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === 'all' || character.character_type === typeFilter;
      
      return matchesSearch && matchesType;
    });

    // Tri
    filtered.sort((a, b) => {
      let aValue = a[sortBy] || '';
      let bValue = b[sortBy] || '';
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [characters, searchTerm, typeFilter, sortBy, sortOrder]);

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  if (loading) {
    return (
      <ExploreContainer>
        <LoadingContainer>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            🔄
          </motion.div>
          <span style={{ marginLeft: '1rem' }}>Chargement des personnages...</span>
        </LoadingContainer>
      </ExploreContainer>
    );
  }

  if (!selectedFandom) {
    return (
      <ExploreContainer>
        <Header>
          <Title>Aucun fandom sélectionné</Title>
          <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            Retournez à l'accueil pour sélectionner un fandom à explorer.
          </p>
        </Header>
      </ExploreContainer>
    );
  }

  return (
    <ExploreContainer>
      <Header>
        <Title>🔍 Explorer les personnages</Title>
        <FandomInfo>
          <FandomName>{selectedFandom.name}</FandomName>
          <CharacterCount>{characters.length} personnages trouvés</CharacterCount>
        </FandomInfo>
      </Header>

      <SearchBar 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Rechercher un personnage..."
      />

      <FiltersContainer>
        <FilterGroup>
          <FilterLabel>Type de personnage</FilterLabel>
          <FilterSelect value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="all">Tous les types</option>
            {characterTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </FilterSelect>
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>Trier par</FilterLabel>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <SortButton 
              active={sortBy === 'name'}
              onClick={() => toggleSort('name')}
            >
              Nom {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
            </SortButton>
            <SortButton 
              active={sortBy === 'character_type'}
              onClick={() => toggleSort('character_type')}
            >
              Type {sortBy === 'character_type' && (sortOrder === 'asc' ? '↑' : '↓')}
            </SortButton>
          </div>
        </FilterGroup>
      </FiltersContainer>

      {filteredAndSortedCharacters.length === 0 ? (
        <NoResults>
          <h3>Aucun personnage trouvé</h3>
          <p>Essayez de modifier vos critères de recherche ou de filtrage.</p>
        </NoResults>
      ) : (
        <CharactersGrid>
          <AnimatePresence>
            {filteredAndSortedCharacters.map((character, index) => (
              <CharacterCard 
                key={character.name}
                character={character}
                index={index}
              />
            ))}
          </AnimatePresence>
        </CharactersGrid>
      )}
    </ExploreContainer>
  );
};

export default ExplorePage;
