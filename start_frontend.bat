@echo off
echo 🎭 Fandom Explorer - Démarrage Windows
echo ========================================

cd frontend

echo 📦 Installation des dépendances...
call npm install

if %errorlevel% neq 0 (
    echo ❌ Erreur lors de l'installation npm
    pause
    exit /b 1
)

echo ✅ Dépendances installées
echo 🚀 Démarrage du serveur React...
echo    L'application sera accessible sur http://localhost:3000

start http://localhost:3000
call npm start

pause
