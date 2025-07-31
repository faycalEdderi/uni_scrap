const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Route pour déclencher le scraping
app.post('/api/scrape', async (req, res) => {
  const { fandomUrl, maxPages = 50 } = req.body;

  if (!fandomUrl) {
    return res.status(400).json({ 
      error: 'URL Fandom requise' 
    });
  }

  if (!fandomUrl.includes('fandom.com')) {
    return res.status(400).json({ 
      error: 'URL doit être un wiki Fandom (*.fandom.com)' 
    });
  }

  try {
    console.log(`🚀 Démarrage du scraping de ${fandomUrl}`);
    
    // Chemin vers le script Python
    const scraperPath = path.join(__dirname, '..', 'scraper');
    const scriptPath = path.join(scraperPath, 'run_scraper.py');

    // Lancer le scraper Python
    const pythonProcess = spawn('python', [
      scriptPath,
      fandomUrl,
      '--max-pages', maxPages.toString()
    ], {
      cwd: scraperPath,
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let output = '';
    let errorOutput = '';

    pythonProcess.stdout.on('data', (data) => {
      const text = data.toString();
      output += text;
      console.log(`📊 Scraper: ${text.trim()}`);
    });

    pythonProcess.stderr.on('data', (data) => {
      const text = data.toString();
      errorOutput += text;
      console.error(`❌ Scraper error: ${text.trim()}`);
    });

    pythonProcess.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Scraping terminé avec succès!');
        
        // Extraire le nom du fandom de l'URL
        const fandomName = extractFandomName(fandomUrl);
        
        res.json({
          success: true,
          message: 'Scraping terminé avec succès!',
          fandomName: fandomName,
          output: output
        });
      } else {
        console.error(`❌ Scraping échoué avec le code ${code}`);
        res.status(500).json({
          success: false,
          error: `Scraping échoué (code ${code})`,
          output: errorOutput || output
        });
      }
    });

    pythonProcess.on('error', (error) => {
      console.error('❌ Erreur lors du lancement du scraper:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors du lancement du scraper',
        details: error.message
      });
    });

  } catch (error) {
    console.error('❌ Erreur:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur interne du serveur',
      details: error.message
    });
  }
});

// Route pour vérifier le statut du serveur
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Backend Fandom Explorer fonctionne!',
    timestamp: new Date().toISOString()
  });
});

// Route pour lister les fandoms disponibles
app.get('/api/fandoms', (req, res) => {
  try {
    const dataPath = path.join(__dirname, '..', 'scraper', 'data');
    const files = fs.readdirSync(dataPath);
    
    const fandoms = files
      .filter(file => file.endsWith('_latest.json'))
      .map(file => {
        const fandomId = file.replace('_latest.json', '');
        return {
          id: fandomId,
          name: formatFandomName(fandomId),
          dataFile: file
        };
      });

    res.json(fandoms);
  } catch (error) {
    console.error('Erreur lors de la lecture des fandoms:', error);
    res.json([]);
  }
});

// Fonctions utilitaires
function extractFandomName(url) {
  try {
    const match = url.match(/https?:\/\/([^.]+)\.fandom\.com/);
    return match ? match[1] : 'unknown';
  } catch (error) {
    return 'unknown';
  }
}

function formatFandomName(fandomId) {
  const nameMap = {
    'leagueoflegends': 'League of Legends',
    'starwars': 'Star Wars',
    'pokemon': 'Pokemon',
    'harrypotter': 'Harry Potter',
    'overwatch': 'Overwatch',
    'onepiece': 'One Piece',
    'naruto': 'Naruto'
  };
  
  return nameMap[fandomId] || fandomId.charAt(0).toUpperCase() + fandomId.slice(1);
}

app.listen(PORT, () => {
  console.log(`🚀 Backend Fandom Explorer démarré sur le port ${PORT}`);
  console.log(`📡 API accessible sur http://localhost:${PORT}/api`);
  console.log(`🔍 Health check: http://localhost:${PORT}/api/health`);
});
