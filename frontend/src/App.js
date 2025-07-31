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
    console.log('🔄 App.js mounted - Loading fandoms...');
    loadAvailableFandoms();
  }, []);

  // DEBUG: Fonction temporaire pour forcer le refresh
  useEffect(() => {
    window.debugReloadFandoms = () => {
      console.log('🔧 DEBUG: Force reload fandoms');
      loadAvailableFandoms();
    };
    
    return () => {
      delete window.debugReloadFandoms;
    };
  }, []);

  const loadAvailableFandoms = async () => {
    try {
      // Récupérer la liste dynamique des fandoms depuis l'API backend
      const response = await fetch('http://localhost:3001/api/fandoms');
      
      if (response.ok) {
        const availableFandoms = await response.json();
        setFandoms(availableFandoms);
        console.log(`✅ ${availableFandoms.length} fandoms chargés dynamiquement:`, availableFandoms.map(f => f.name));
      } else {
        console.error('❌ Erreur lors de la récupération des fandoms depuis l\'API');
        setFandoms([]);
      }
      
    } catch (error) {
      console.error('❌ Erreur lors du chargement des fandoms:', error);
      console.log('🔄 Tentative de fallback avec vérification locale...');
      
      // Fallback : vérifier les fichiers localement comme avant
      await loadFandomsFromLocalFiles();
    }
  };

  // Fonction fallback pour vérifier les fichiers localement
  const loadFandomsFromLocalFiles = async () => {
    const availableFandoms = [];
    
    // Liste de base pour le fallback (tous les fandoms possibles)
    const knownFandoms = [
      { id: 'leagueoflegends', name: 'League of Legends', url: 'https://leagueoflegends.fandom.com/' },
      { id: 'starwars', name: 'Star Wars', url: 'https://starwars.fandom.com/' },
      { id: 'pokemon', name: 'Pokemon', url: 'https://pokemon.fandom.com/' },
      { id: 'harrypotter', name: 'Harry Potter', url: 'https://harrypotter.fandom.com/' },
      { id: 'overwatch', name: 'Overwatch', url: 'https://overwatch.fandom.com/' },
      { id: 'onepiece', name: 'One Piece', url: 'https://onepiece.fandom.com/' },
      { id: 'witcher', name: 'Witcher', url: 'https://witcher.fandom.com/' },
      { id: 'godofwar', name: 'God of War', url: 'https://godofwar.fandom.com/' },
      { id: 'naruto', name: 'Naruto', url: 'https://naruto.fandom.com/' },
      { id: 'attackontitan', name: 'Attack on Titan', url: 'https://attackontitan.fandom.com/' },
      { id: 'dragonball', name: 'Dragon Ball', url: 'https://dragonball.fandom.com/' },
      { id: 'marvel', name: 'Marvel', url: 'https://marvel.fandom.com/' },
      { id: 'dc', name: 'DC Comics', url: 'https://dc.fandom.com/' }
    ];
    
    // ✅ VÉRIFICATION DYNAMIQUE : N'afficher QUE les fandoms dont le fichier JSON existe réellement
    for (const fandom of knownFandoms) {
      try {
        const response = await fetch(`/data/${fandom.id}_latest.json`, { method: 'HEAD' });
        if (response.ok) {
          availableFandoms.push(fandom);
          console.log(`✅ Fichier trouvé: ${fandom.id}_latest.json`);
        } else {
          console.log(`❌ Fichier manquant: ${fandom.id}_latest.json (masqué de la liste)`);
        }
      } catch (error) {
        console.log(`❌ Erreur de vérification pour ${fandom.id}_latest.json:`, error.message);
      }
    }
    
    setFandoms(availableFandoms);
    console.log(`📋 Fallback: ${availableFandoms.length} fandoms disponibles localement`);
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
                  onFandomsUpdate={loadAvailableFandoms}
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
