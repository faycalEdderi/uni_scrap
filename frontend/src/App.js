import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import HomePage from './components/HomePage';
import ExplorePage from './components/ExplorePage';
import ComparePage from './components/ComparePage';
import Header from './components/Header';
import Footer from './components/Footer';
import './App.css';

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
`;

const MainContent = styled.main`
  flex: 1;
  padding: 0;
`;

function App() {
  const [fandoms, setFandoms] = useState([]);
  const [selectedFandom, setSelectedFandom] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(false);

  // Charger la liste des fandoms disponibles
  useEffect(() => {
    loadAvailableFandoms();
  }, []);

  const loadAvailableFandoms = async () => {
    try {
      // Simuler le chargement des fandoms depuis les fichiers JSON
      const mockFandoms = [
        { id: 'leagueoflegends', name: 'League of Legends', url: 'https://leagueoflegends.fandom.com/' },
        { id: 'starwars', name: 'Star Wars', url: 'https://starwars.fandom.com/' },
        { id: 'pokemon', name: 'Pokemon', url: 'https://pokemon.fandom.com/' },
        { id: 'harrypotter', name: 'Harry Potter', url: 'https://harrypotter.fandom.com/' },
        { id: 'overwatch', name: 'Overwatch', url: 'https://overwatch.fandom.com/' },
      ];
      setFandoms(mockFandoms);
    } catch (error) {
      console.error('Erreur lors du chargement des fandoms:', error);
    }
  };

  const loadCharactersFromFandom = async (fandomId) => {
    setLoading(true);
    try {
      // Charger les données depuis le fichier JSON correspondant
      const response = await fetch(`/data/${fandomId}_latest.json`);
      if (response.ok) {
        const data = await response.json();
        setCharacters(data);
        setSelectedFandom(fandoms.find(f => f.id === fandomId));
      } else {
        // Données de démonstration si le fichier n'existe pas
        const mockData = generateMockCharacters(fandomId);
        setCharacters(mockData);
        setSelectedFandom(fandoms.find(f => f.id === fandomId));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des personnages:', error);
      // Fallback avec des données de démonstration
      const mockData = generateMockCharacters(fandomId);
      setCharacters(mockData);
      setSelectedFandom(fandoms.find(f => f.id === fandomId));
    }
    setLoading(false);
  };

  const generateMockCharacters = (fandomId) => {
    const mockCharacters = {
      leagueoflegends: [
        {
          name: "Ahri",
          image_url: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Ahri_0.jpg",
          description: "Ahri est une gumiho, une renarde à neuf queues capable de manipuler l'essence spirituelle.",
          character_type: "Mage Assassin",
          attribute_1: "Région: Ionia",
          attribute_2: "Rôle: Mid Lane",
          fandom_name: "League of Legends"
        },
        {
          name: "Yasuo",
          image_url: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Yasuo_0.jpg",
          description: "Yasuo est un guerrier ionien intransigeant et agile qui manie le pouvoir du vent.",
          character_type: "Fighter Assassin",
          attribute_1: "Région: Ionia",
          attribute_2: "Rôle: Mid/Top Lane",
          fandom_name: "League of Legends"
        }
      ],
      starwars: [
        {
          name: "Luke Skywalker",
          image_url: "https://upload.wikimedia.org/wikipedia/en/9/9b/Luke_Skywalker.png",
          description: "Luke Skywalker est un Jedi qui a aidé à vaincre l'Empire Galactique.",
          character_type: "Jedi Knight",
          attribute_1: "Affiliation: Alliance Rebelle",
          attribute_2: "Planète: Tatooine",
          fandom_name: "Star Wars"
        }
      ]
    };
    
    return mockCharacters[fandomId] || [];
  };

  return (
    <Router>
      <AppContainer>
        <Header />
        <MainContent>
          <Routes>
            <Route 
              path="/" 
              element={
                <HomePage 
                  fandoms={fandoms}
                  onSelectFandom={loadCharactersFromFandom}
                />
              } 
            />
            <Route 
              path="/explore" 
              element={
                <ExplorePage 
                  characters={characters}
                  selectedFandom={selectedFandom}
                  loading={loading}
                />
              } 
            />
            <Route 
              path="/compare" 
              element={
                <ComparePage 
                  characters={characters}
                  selectedFandom={selectedFandom}
                />
              } 
            />
          </Routes>
        </MainContent>
        <Footer />
        <Toaster position="top-right" />
      </AppContainer>
    </Router>
  );
}

export default App;
