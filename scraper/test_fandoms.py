"""
Script pour tester le scraper sur plusieurs fandoms automatiquement
"""

import os
import subprocess
import time
import json
from datetime import datetime


TEST_FANDOMS = [
    "https://leagueoflegends.fandom.com/",
    "https://starwars.fandom.com/",
    "https://pokemon.fandom.com/",
    "https://harrypotter.fandom.com/",
    "https://overwatch.fandom.com/",
    "https://genshinimpact.fandom.com/",
    "https://onepiece.fandom.com/",
    "https://naruto.fandom.com/",
    "https://minecraft.fandom.com/",
    "https://zelda.fandom.com/",
]


def test_fandom(fandom_url, max_pages=50):
    """Teste un fandom spécifique"""
    print(f"\n🎯 Test de {fandom_url}")
    
    start_time = time.time()
    
    # Lancer le scraper avec limite de pages pour les tests
    cmd = [
        'python', 'run_scraper.py', fandom_url,
        '--max-pages', str(max_pages)
    ]
    
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=600)  # 10 min max
        
        end_time = time.time()
        duration = end_time - start_time
        
        success = result.returncode == 0
        
        return {
            'fandom_url': fandom_url,
            'success': success,
            'duration': duration,
            'stdout': result.stdout,
            'stderr': result.stderr,
            'tested_at': datetime.now().isoformat()
        }
        
    except subprocess.TimeoutExpired:
        return {
            'fandom_url': fandom_url,
            'success': False,
            'duration': 600,
            'error': 'Timeout (10 minutes)',
            'tested_at': datetime.now().isoformat()
        }
    except Exception as e:
        return {
            'fandom_url': fandom_url,
            'success': False,
            'duration': 0,
            'error': str(e),
            'tested_at': datetime.now().isoformat()
        }


def main():
    print("🧪 Démarrage des tests automatiques des fandoms")
    
    results = []
    successful_fandoms = []
    
    for i, fandom_url in enumerate(TEST_FANDOMS, 1):
        print(f"\n📋 Test {i}/{len(TEST_FANDOMS)}")
        
        result = test_fandom(fandom_url)
        results.append(result)
        
        if result['success']:
            successful_fandoms.append(fandom_url)
            print(f"Succès en {result['duration']:.1f}s")
        else:
            print(f"Échec: {result.get('error', 'Erreur inconnue')}")
        
        # Pause entre les tests pour être respectueux
        if i < len(TEST_FANDOMS):
            print("Pause de 30 secondes...")
            time.sleep(30)
    
    # Résumé final
    success_rate = len(successful_fandoms) / len(TEST_FANDOMS) * 100
    print(f"\nRÉSUMÉ FINAL")
    print(f"Fandoms réussis: {len(successful_fandoms)}/{len(TEST_FANDOMS)} ({success_rate:.1f}%)")
    print(f"Fandoms fonctionnels:")
    for fandom in successful_fandoms:
        print(f"   - {fandom}")
    
    # Sauvegarder le rapport de tests
    report = {
        'test_summary': {
            'total_tested': len(TEST_FANDOMS),
            'successful': len(successful_fandoms),
            'success_rate': success_rate,
            'tested_at': datetime.now().isoformat()
        },
        'successful_fandoms': successful_fandoms,
        'detailed_results': results
    }
    
    with open('../data/test_report.json', 'w', encoding='utf-8') as f:
        json.dump(report, f, indent=2, ensure_ascii=False)
    
    # Mettre à jour tested_fandoms.txt
    with open('../tested_fandoms.txt', 'w', encoding='utf-8') as f:
        f.write("# Liste des fandoms testés avec succès\n")
        f.write("# Généré automatiquement par test_fandoms.py\n\n")
        for fandom in successful_fandoms:
            f.write(f"{fandom}\n")
    
    print(f"\n📄 Rapport sauvegardé dans ../data/test_report.json")
    print(f"📄 Liste des fandoms mise à jour dans ../tested_fandoms.txt")


if __name__ == "__main__":
    main()
