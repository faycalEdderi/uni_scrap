"""
Script pour lancer le scraper Fandom avec différents paramètres
Usage: python run_scraper.py <fandom_url> [max_pages]
"""

import sys
import os
import subprocess
import argparse
from urllib.parse import urlparse


def validate_fandom_url(url):
    """Valide qu'une URL est bien un wiki Fandom"""
    try:
        parsed = urlparse(url)
        if 'fandom.com' not in parsed.hostname:
            return False, "L'URL doit être un wiki Fandom (*.fandom.com)"
        return True, ""
    except Exception as e:
        return False, f"URL invalide: {e}"


def main():
    parser = argparse.ArgumentParser(description="Lance le scraper Fandom")
    parser.add_argument('fandom_url', help='URL du wiki Fandom à scraper')
    parser.add_argument('--max-pages', type=int, help='Nombre maximum de pages à scraper')
    parser.add_argument('--output-dir', default='../data', help='Dossier de sortie pour les données')
    
    args = parser.parse_args()
    
    # Validation de l'URL
    valid, error_msg = validate_fandom_url(args.fandom_url)
    if not valid:
        print(f"Erreur: {error_msg}")
        sys.exit(1)
    
    # Créer le dossier de sortie
    os.makedirs(args.output_dir, exist_ok=True)
    
    # Construire la commande Scrapy
    cmd = [
        'scrapy', 'crawl', 'fandom',
        '-a', f'fandom_url={args.fandom_url}'
    ]
    
    if args.max_pages:
        cmd.extend(['-a', f'max_pages={args.max_pages}'])
    
    # Lancer le scraper
    print(f"[INFO] Demarrage du scraping de {args.fandom_url}")
    if args.max_pages:
        print(f"[INFO] Limite: {args.max_pages} pages")
    
    try:
        # Changer vers le dossier du projet Scrapy
        os.chdir('fandom_scrap')
        
        result = subprocess.run(cmd, check=True)
        print("[SUCCESS] Scraping termine avec succes!")
        
    except subprocess.CalledProcessError as e:
        print(f"Erreur lors du scraping: {e}")
        sys.exit(1)
    except KeyboardInterrupt:
        print("\nScraping interrompu par l'utilisateur")
        sys.exit(1)


if __name__ == "__main__":
    main()
