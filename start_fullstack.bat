@echo off
echo 🎭 Fandom Explorer - Démarrage complet
echo =====================================
echo.

echo 📁 Vérification de la structure du projet...
if not exist "backend" (
    echo ❌ Dossier backend manquant
    pause
    exit /b 1
)

if not exist "frontend" (
    echo ❌ Dossier frontend manquant
    pause
    exit /b 1
)

if not exist "scraper" (
    echo ❌ Dossier scraper manquant
    pause
    exit /b 1
)

echo ✅ Structure du projet OK
echo.

echo 🌐 Démarrage du backend...
cd /d "%~dp0backend"

if not exist node_modules (
    echo 📦 Installation des dépendances backend...
    npm install
)

echo 🚀 Lancement du serveur backend en arrière-plan...
start "Backend Fandom Explorer" cmd /k "npm start"

cd /d "%~dp0"
timeout /t 3 /nobreak >nul

echo ⚛️ Démarrage du frontend...
cd /d "%~dp0frontend"

if not exist node_modules (
    echo 📦 Installation des dépendances frontend...
    npm install
)

echo 🚀 Lancement du serveur frontend...
echo.
echo 🌍 L'application sera accessible sur: http://localhost:3000
echo 📡 API backend accessible sur: http://localhost:3001/api
echo.
echo Pour arrêter les serveurs, fermez les fenêtres de terminal
echo.

npm start

cd /d "%~dp0"
