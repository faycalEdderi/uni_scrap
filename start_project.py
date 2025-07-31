#!/usr/bin/env python3
"""
Script de démarrage rapide pour Fandom Explorer
Usage: python start_project.py [--scraper-only] [--frontend-only]
"""

import os
import sys
import subprocess
import argparse
import webbrowser
from pathlib import Path


def check_requirements():
    """Vérifie que les prérequis sont installés"""
    print("🔍 Vérification des prérequis...")
    
    # Vérifier Python
    if sys.version_info < (3, 8):
        print("❌ Python 3.8+ requis")
        return False
    
    print("✅ Python OK")
    
    # Vérifier Node.js (avec support Windows)
    npm_cmd = 'npm.cmd' if os.name == 'nt' else 'npm'
    node_cmd = 'node.exe' if os.name == 'nt' else 'node'
    
    try:
        result = subprocess.run([node_cmd, '--version'], capture_output=True, text=True)
        if result.returncode == 0:
            print("✅ Node.js OK")
        else:
            print("❌ Node.js non trouvé")
            return False
    except FileNotFoundError:
        print("❌ Node.js non installé")
        return False
    
    return True


def setup_scraper():
    """Configure et démarre l'environnement scraper"""
    print("\n🐍 Configuration du scraper...")
    
    scraper_dir = Path("scraper")
    if not scraper_dir.exists():
        print("❌ Dossier scraper non trouvé")
        return False
    
    os.chdir(scraper_dir)
    
    # Vérifier que les dépendances sont installées
    try:
        import scrapy
        print("✅ Scrapy installé")
    except ImportError:
        print("❌ Scrapy non installé. Installez les dépendances :")
        print("   pip install -r requirements.txt")
        return False
    
    print("✅ Scraper prêt !")
    print("\n📝 Commandes utiles :")
    print("   python run_scraper.py https://leagueoflegends.fandom.com/")
    print("   python test_fandoms.py")
    
    os.chdir("..")
    return True


def setup_frontend():
    """Configure et démarre le frontend React"""
    print("\n⚛️ Configuration du frontend...")
    
    frontend_dir = Path("frontend")
    if not frontend_dir.exists():
        print("❌ Dossier frontend non trouvé")
        return False
    
    os.chdir(frontend_dir)
    
    # Commande npm selon l'OS
    npm_cmd = 'npm.cmd' if os.name == 'nt' else 'npm'
    
    # Vérifier si node_modules existe
    node_modules = Path("node_modules")
    if not node_modules.exists():
        print("📦 Installation des dépendances npm...")
        try:
            subprocess.run([npm_cmd, 'install'], check=True)
            print("✅ Dépendances installées")
        except subprocess.CalledProcessError:
            print("❌ Erreur lors de l'installation npm")
            os.chdir("..")
            return False
    else:
        print("✅ Dépendances npm OK")
    
    print("🚀 Démarrage du serveur de développement...")
    print("   L'application sera accessible sur http://localhost:3000")
    
    # Ouvrir le navigateur après un délai
    import threading
    def open_browser():
        import time
        time.sleep(3)  # Attendre que le serveur démarre
        webbrowser.open('http://localhost:3000')
    
    threading.Thread(target=open_browser, daemon=True).start()
    
    # Démarrer le serveur React
    try:
        subprocess.run([npm_cmd, 'start'], check=True)
    except KeyboardInterrupt:
        print("\n🛑 Serveur arrêté")
    except subprocess.CalledProcessError:
        print("❌ Erreur lors du démarrage du serveur")
        os.chdir("..")
        return False
    
    os.chdir("..")
    return True


def show_project_info():
    """Affiche les informations du projet"""
    print("""
🎭 FANDOM EXPLORER
==================

Un scraper universel pour les wikis Fandom avec interface web moderne.

📁 Structure:
   scraper/     - Code Python/Scrapy pour le scraping
   frontend/    - Interface React pour visualiser les données
   data/        - Données extraites (JSON)

🚀 Démarrage rapide:
   1. Lancer le frontend: python start_project.py --frontend-only
   2. Scraper un fandom: cd scraper && python run_scraper.py <URL>
   3. Voir les résultats dans l'interface web

📚 Documentation complète dans README.md
""")


def main():
    parser = argparse.ArgumentParser(description="Démarre Fandom Explorer")
    parser.add_argument('--scraper-only', action='store_true', help='Configure uniquement le scraper')
    parser.add_argument('--frontend-only', action='store_true', help='Démarre uniquement le frontend')
    parser.add_argument('--info', action='store_true', help='Affiche les infos du projet')
    
    args = parser.parse_args()
    
    if args.info:
        show_project_info()
        return
    
    print("🎭 Fandom Explorer - Démarrage")
    print("=" * 40)
    
    if not check_requirements():
        print("\n❌ Prérequis manquants. Veuillez les installer avant de continuer.")
        return
    
    if args.scraper_only:
        setup_scraper()
    elif args.frontend_only:
        setup_frontend()
    else:
        # Par défaut, configurer le scraper puis démarrer le frontend
        if setup_scraper():
            print("\n" + "="*50)
            setup_frontend()


if __name__ == "__main__":
    main()
