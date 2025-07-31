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
      // Essayer de charger la liste des fandoms depuis les fichiers réels
      const availableFandoms = [];
      
      // Liste des fandoms potentiels à vérifier
      const potentialFandoms = [
        { id: 'leagueoflegends', name: 'League of Legends', url: 'https://leagueoflegends.fandom.com/' },
        { id: 'starwars', name: 'Star Wars', url: 'https://starwars.fandom.com/' },
        { id: 'pokemon', name: 'Pokemon', url: 'https://pokemon.fandom.com/' },
        { id: 'harrypotter', name: 'Harry Potter', url: 'https://harrypotter.fandom.com/' },
        { id: 'overwatch', name: 'Overwatch', url: 'https://overwatch.fandom.com/' },
        { id: 'onepiece', name: 'One Piece', url: 'https://onepiece.fandom.com/' },
        { id: 'witcher', name: 'Witcher', url: 'https://thewitcher.fandom.com/' },
        { id: 'godofwar', name: 'God of War', url: 'https://godofwar.fandom.com/' },


      ];
      
      // Vérifier quels fichiers existent réellement
      for (const fandom of potentialFandoms) {
        try {
          const response = await fetch(`/data/${fandom.id}_latest.json`, { method: 'HEAD' });
          if (response.ok) {
            availableFandoms.push(fandom);
          }
        } catch (error) {
          // Fichier n'existe pas, on continue
          console.log(`Fichier ${fandom.id}_latest.json non trouvé`);
        }
      }
      
      setFandoms(availableFandoms);
      
      if (availableFandoms.length === 0) {
        console.log("Aucun fandom scraped trouvé. Scrapez d'abord des données !");
      }
      
    } catch (error) {
      console.error('Erreur lors du chargement des fandoms:', error);
      setFandoms([]); // Pas de fallback mock
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
        console.log(`Données chargées pour ${fandomId}:`, data.length, 'personnages');
      } else {
        console.error(`Fichier ${fandomId}_latest.json non trouvé`);
        setCharacters([]);
        setSelectedFandom(fandoms.find(f => f.id === fandomId));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des personnages:', error);
      setCharacters([]);
      setSelectedFandom(fandoms.find(f => f.id === fandomId));
    }
    setLoading(false);
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
