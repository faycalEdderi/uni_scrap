# 🔧 Configuration de la barre de recherche

La barre de recherche est maintenant fonctionnelle ! Voici comment procéder :

## 🚀 Démarrage rapide

### Option 1 : Démarrage automatique complet
```bash
# Double-cliquez sur le fichier ou exécutez :
start_fullstack.bat
```

### Option 2 : Démarrage manuel
```bash
# Terminal 1 : Backend
start_backend.bat

# Terminal 2 : Frontend  
start_frontend.bat
```

## 📋 Prérequis

1. **Node.js** installé (pour le backend Express.js)
2. **Python** installé avec les dépendances scraper
3. **npm** accessible depuis la ligne de commande

## 🔍 Comment utiliser la barre de recherche

1. **Démarrez le backend** (port 3001) et le **frontend** (port 3000)
2. Allez sur http://localhost:3000
3. Dans la barre de recherche, entrez une URL Fandom valide :
   - ✅ `https://leagueoflegends.fandom.com/`
   - ✅ `https://starwars.fandom.com/`
   - ✅ `https://pokemon.fandom.com/`
   - ❌ `https://wikipedia.org/` (pas un fandom)

4. Cliquez sur "🎯 Démarrer le scraping"
5. Attendez que le scraping se termine (peut prendre quelques minutes)
6. Le nouveau fandom apparaîtra automatiquement dans la liste

## 🔧 Architecture technique

```
Frontend (React) → Backend (Express.js) → Scraper (Python/Scrapy)
     3000       →       3001           →    run_scraper.py
```

### Backend API

- **POST** `/api/scrape` - Déclenche le scraping
- **GET** `/api/health` - Vérifie le statut du serveur  
- **GET** `/api/fandoms` - Liste les fandoms disponibles

### Flux de données

1. L'utilisateur entre une URL dans le frontend
2. Le frontend envoie une requête POST au backend
3. Le backend lance le script Python `run_scraper.py`
4. Le scraper extrait les données et les sauvegarde en JSON
5. Le frontend recharge automatiquement pour afficher le nouveau fandom

## 🐛 Dépannage

### Erreur "Erreur de connexion au serveur"
- Vérifiez que le backend est démarré sur le port 3001
- Testez : http://localhost:3001/api/health

### Erreur "Scraping échoué"
- Vérifiez que l'URL Fandom est valide et accessible
- Regardez les logs dans la console du backend
- Assurez-vous que Python et Scrapy sont installés

### Le nouveau fandom n'apparaît pas
- Attendez que le scraping soit complètement terminé
- Rafraîchissez la page (F5)
- Vérifiez qu'un fichier `*_latest.json` a été créé dans `scraper/data/`

## 📁 Fichiers modifiés

- ✅ `backend/server.js` - Nouveau serveur API
- ✅ `backend/package.json` - Dépendances backend
- ✅ `frontend/src/components/HomePage.js` - Connexion à l'API
- ✅ `start_backend.bat` - Script de démarrage backend
- ✅ `start_fullstack.bat` - Script de démarrage complet
