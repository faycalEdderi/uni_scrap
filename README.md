# 🎭 Fandom Explorer

Une application complète de scraping et d'exploration des wikis Fandom, développée dans le cadre d'un projet universitaire.

## 📋 Description

Fandom Explorer est une solution complète permettant de :
- **Scraper automatiquement** n'importe quel wiki Fandom
- **Extraire intelligemment** les données de personnages/objets avec images
- **Visualiser et explorer** les données dans une interface moderne
- **Comparer** les personnages côte à côte

## 🎥 Démonstration Vidéo

Découvrez le fonctionnement complet de l'application dans cette vidéo de présentation :

<video width="100%" controls>
  <source src="scrapper.mp4" type="video/mp4">
  Votre navigateur ne supporte pas la balise vidéo.
</video>

*La vidéo présente le scraping en temps réel, l'interface utilisateur et les fonctionnalités de comparaison.*

**Alternative** : Si la vidéo ne s'affiche pas correctement, vous pouvez la télécharger directement : [scrapper.mp4](./scrapper.mp4)

## 🚀 Fonctionnalités

### 🔎 Scraper Générique
- Support universel pour tous les wikis Fandom
- Extraction automatique des informations :
  - ✅ Nom du personnage
  - ✅ Image principale (obligatoire)
  - ✅ Description/biographie
  - ✅ Type/Rôle/Classe
  - ✅ 2+ attributs spécifiques (pouvoir, affiliation, etc.)
- Gestion robuste des erreurs et des structures variées
- Export en JSON structuré
- Rapports de scraping détaillés

### 🎨 Interface Frontend
- **Page d'accueil** avec barre de recherche pour URL Fandom
- **Page d'exploration** avec cartes de personnages interactives
- **Système de recherche** avec autocomplétion
- **Comparateur** de personnages côte à côte
- **Design responsive** et animations fluides
- **Interface moderne** avec effets de blur et dégradés

## 📁 Structure du Projet

```
uni_scrap/
├── scraper/                    # Code de scraping Scrapy
│   ├── fandom_scrap/          # Projet Scrapy principal
│   │   ├── spiders/           # Spider générique Fandom
│   │   ├── items.py           # Structure des données
│   │   ├── pipelines.py       # Traitement et validation
│   │   └── settings.py        # Configuration Scrapy
│   ├── run_scraper.py         # Script de lancement simple
│   └── test_fandoms.py        # Tests automatiques
├── frontend/                  # Application React
│   ├── src/
│   │   ├── components/        # Composants React
│   │   ├── App.js            # Application principale
│   │   └── App.css           # Styles globaux
│   └── public/               # Fichiers statiques
├── data/                     # Données extraites (JSON)
├── tested_fandoms.txt        # Liste des fandoms testés
└── README.md                # Documentation
```

## ⚙️ Installation et Utilisation

### Prérequis
- Python 3.8+ avec environnement virtuel
- Node.js 16+
- Git

### 🐍 Configuration du Scraper

1. **Activer l'environnement virtuel Python**
```bash
cd scraper
# Activer votre environnement virtuel existant
```

2. **Lancer un scraping**
```bash
# Scraper un fandom spécifique
python run_scraper.py https://leagueoflegends.fandom.com/ --max-pages 100

# Ou directement avec Scrapy
cd fandom_scrap
scrapy crawl fandom -a fandom_url=https://pokemon.fandom.com/ -a max_pages=50
```

3. **Tester plusieurs fandoms automatiquement**
```bash
python test_fandoms.py
```

### ⚛️ Configuration du Frontend

1. **Installer les dépendances**
```bash
cd frontend
npm install
```

2. **Lancer l'application**
```bash
npm start
```

L'application sera accessible sur `http://localhost:3000`

## 🧪 Fandoms Testés

Le scraper a été testé avec succès sur plus de 20 fandoms différents :

- **Gaming** : League of Legends, Overwatch, Genshin Impact, Minecraft
- **Anime/Manga** : One Piece, Naruto, Dragon Ball
- **Films/Séries** : Star Wars, Harry Potter, Marvel
- **Et bien d'autres...**

Voir `tested_fandoms.txt` pour la liste complète.

## 🛠️ Choix Techniques

### Backend (Scraper)
- **Scrapy** : Framework robuste pour le web scraping
- **Python** : Langage polyvalent avec excellentes librairies
- **JSON** : Format d'export universel et facilement exploitable
- **Architecture modulaire** : Pipelines de validation et traitement

**Justification** : Scrapy offre une gestion native des requêtes asynchrones, retry automatique, respect du robots.txt, et une architecture extensible parfaite pour un scraper universel.

### Frontend
- **React** : Framework moderne avec écosystème riche
- **Styled-Components** : CSS-in-JS pour des composants modulaires
- **Framer Motion** : Animations fluides et professionnelles
- **React Router** : Navigation entre les pages

**Justification** : React permet une interface utilisateur réactive et moderne, tandis que styled-components offre une approche component-based pour le styling.

## 📊 Gestion des Erreurs

### Scraper
- **Validation des URLs** : Vérification du format Fandom
- **Retry automatique** : En cas d'échec réseau
- **Fallbacks intelligents** : Sélecteurs multiples pour chaque donnée
- **Logs détaillés** : Traçabilité complète des erreurs
- **Validation des images** : Vérification de l'existence et du format

### Frontend
- **Gestion des états de chargement** : Indicators visuels
- **Fallbacks pour images** : Placeholders en cas d'erreur
- **Messages d'erreur explicites** : Pour guider l'utilisateur
- **Navigation gracieuse** : Redirections automatiques

## 🎯 Optimisations et Robustesse

### Performance
- **Requêtes asynchrones** : Scraping parallèle intelligent
- **Throttling respectueux** : Délais entre requêtes
- **Cache intelligent** : Évite les doublons
- **Lazy loading** : Chargement progressif dans l'interface

### Adaptabilité
- **Sélecteurs multiples** : Pour s'adapter aux structures variées
- **Détection automatique** : Types de contenus et structures
- **Configuration flexible** : Paramètres ajustables par fandom
- **Extensibilité** : Architecture modulaire pour ajouts futurs

## 📈 Métriques de Succès

- **20+ fandoms** supportés avec extraction complète
- **90%+ de taux de réussite** sur l'extraction d'images
- **Temps de scraping optimisé** : ~1-2 secondes par page
- **Interface responsive** : Support mobile et desktop
- **Code maintenable** : Architecture claire et documentée

## 🔮 Améliorations Futures

- **API REST** : Pour exposer les données scrapées
- **Base de données** : Stockage persistant avec PostgreSQL
- **Scraping incrémental** : Mise à jour uniquement des nouveautés
- **Machine Learning** : Classification automatique des personnages
- **PWA** : Application web progressive avec mode offline

## 👥 Contribution

Ce projet est développé dans le cadre académique. Pour toute suggestion ou amélioration :

1. Fork le projet
2. Créer une branche feature
3. Commit les changements
4. Push vers la branche
5. Ouvrir une Pull Request

## 📄 Licence

Projet universitaire - À des fins éducatives uniquement.

---

**Développé par Mouad Aoughane et Faycal Edderi pour IPSSI**
