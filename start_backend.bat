@echo off
echo 🚀 Démarrage du backend Fandom Explorer...
cd /d "%~dp0backend"

echo 📦 Vérification des dépendances...
if not exist node_modules (
    echo Installation des dépendances npm...
    npm install
)

echo 🌐 Démarrage du serveur backend sur le port 3001...
echo.
echo 📡 Backend accessible sur: http://localhost:3001/api
echo 🔍 Health check: http://localhost:3001/api/health
echo.
echo Pour arrêter le serveur, appuyez sur Ctrl+C
echo.

npm start
pause
