import scrapy
import re
import json
import logging
from datetime import datetime
from urllib.parse import urljoin, urlparse
from fandom_scrap.items import FandomCharacterItem


class FandomSpider(scrapy.Spider):
    name = 'fandom'
    
    def __init__(self, fandom_url=None, max_pages=None, *args, **kwargs):
        super(FandomSpider, self).__init__(*args, **kwargs)
        
        if not fandom_url:
            raise ValueError("fandom_url parameter is required")
        
        self.fandom_url = fandom_url.rstrip('/')
        self.max_pages = int(max_pages) if max_pages else None
        self.pages_scraped = 0
        self.errors = []
        self.start_time = datetime.now()
        
        # Extraction du nom du fandom depuis l'URL
        parsed_url = urlparse(fandom_url)
        self.fandom_name = parsed_url.hostname.split('.')[0] if parsed_url.hostname else "unknown"
        
        # URLs de départ pour trouver les listes de pages
        self.start_urls = [
            f"{self.fandom_url}/wiki/Special:AllPages",
            f"{self.fandom_url}/wiki/Category:Characters",
            f"{self.fandom_url}/wiki/Category:Character",
            f"{self.fandom_url}/wiki/Category:People",
            f"{self.fandom_url}/wiki/Category:Heroes",
            f"{self.fandom_url}/wiki/Category:Villains",
            f"{self.fandom_url}/wiki/Category:Champions",  # Pour League of Legends
            f"{self.fandom_url}/wiki/Category:Pokemon",     # Pour Pokemon
            f"{self.fandom_url}/wiki/Category:Jedi",        # Pour Star Wars
        ]
    
    def start_requests(self):
        """Démarre les requêtes initiales"""
        for url in self.start_urls:
            yield scrapy.Request(
                url=url,
                callback=self.parse_category_page,
                errback=self.handle_error,
                meta={'dont_cache': True}
            )
    
    def parse_category_page(self, response):
        """Parse les pages de catégories pour trouver les liens vers les fiches"""
        # Différents sélecteurs pour les listes de pages selon la structure Fandom
        character_links = []
        
        # Sélecteurs communs pour les liens de personnages/objets
        selectors = [
            'div.category-page__members a::attr(href)',
            'div.category-page__member a::attr(href)',
            'li.category-page__member a::attr(href)',
            'div.mw-content-text ul li a::attr(href)',
            'div.mw-category-group ul li a::attr(href)',
            'div.CategoryTreeChildren a::attr(href)',
            'table.wikitable td a::attr(href)',
            '.category-page__trending-pages a::attr(href)',
        ]
        
        for selector in selectors:
            links = response.css(selector).getall()
            character_links.extend(links)
        
        # Filtrer les liens valides (éviter les pages système, redirections, etc.)
        valid_links = []
        for link in character_links:
            if link and self.is_valid_character_page(link):
                full_url = urljoin(response.url, link)
                valid_links.append(full_url)
        
        # Supprimer les doublons
        valid_links = list(set(valid_links))
        
        self.logger.info(f"Found {len(valid_links)} potential character pages on {response.url}")
        
        # Scraper chaque page de personnage
        for link in valid_links:
            if self.max_pages and self.pages_scraped >= self.max_pages:
                break
            
            yield scrapy.Request(
                url=link,
                callback=self.parse_character_page,
                errback=self.handle_error,
                meta={'dont_cache': True}
            )
        
        # Suivre la pagination si elle existe
        next_page_selectors = [
            'a.category-page__pagination-next::attr(href)',
            'a[rel="next"]::attr(href)',
            '.mw-nextlink::attr(href)',
        ]
        
        for selector in next_page_selectors:
            next_page = response.css(selector).get()
            if next_page:
                yield scrapy.Request(
                    url=urljoin(response.url, next_page),
                    callback=self.parse_category_page,
                    errback=self.handle_error
                )
                break
    
    def is_valid_character_page(self, link):
        """Vérifie si un lien pointe vers une page de personnage valide"""
        if not link:
            return False
        
        # Exclusions communes
        excluded_patterns = [
            '/wiki/Special:',
            '/wiki/Category:',
            '/wiki/Template:',
            '/wiki/File:',
            '/wiki/User:',
            '/wiki/Talk:',
            '/wiki/Help:',
            '/wiki/MediaWiki:',
            'action=edit',
            'redlink=1',
            '#',
        ]
        
        for pattern in excluded_patterns:
            if pattern in link:
                return False
        
        return True
    
    def parse_character_page(self, response):
        """Parse une page de personnage individuelle"""
        try:
            self.pages_scraped += 1
            
            item = FandomCharacterItem()
            
            # Métadonnées de base
            item['fandom_url'] = self.fandom_url
            item['fandom_name'] = self.fandom_name
            item['page_url'] = response.url
            item['scraped_at'] = datetime.now().isoformat()
            
            # Extraction du nom
            item['name'] = self.extract_name(response)
            
            # Extraction de l'image principale (OBLIGATOIRE)
            item['image_url'] = self.extract_main_image(response)
            
            # Si pas d'image trouvée, on skip cette fiche
            if not item['image_url']:
                self.logger.warning(f"No image found for {response.url}, skipping")
                return
            
            # Extraction des autres données
            item['description'] = self.extract_description(response)
            item['character_type'] = self.extract_character_type(response)
            
            # Extraction des attributs supplémentaires depuis l'infobox
            infobox_data = self.extract_infobox_data(response)
            item['infobox_data'] = infobox_data
            
            # Tentative d'extraction de 2 attributs structurés
            attributes = self.extract_attributes(infobox_data, response)
            item['attribute_1'] = attributes.get('attribute_1', '')
            item['attribute_2'] = attributes.get('attribute_2', '')
            
            # Catégories
            item['categories'] = self.extract_categories(response)
            
            # Images supplémentaires
            item['additional_images'] = self.extract_additional_images(response)
            
            yield item
            
        except Exception as e:
            error_msg = f"Error parsing {response.url}: {str(e)}"
            self.logger.error(error_msg)
            self.errors.append(error_msg)
    
    def extract_name(self, response):
        """Extrait le nom du personnage"""
        selectors = [
            'h1.page-header__title::text',
            'h1.title::text', 
            'h1#firstHeading::text',
            'h1.mw-page-title-main::text',
            '.page-title::text',
            'h1::text',
            '#content h1::text',
            '.mw-parser-output h1::text',
        ]
        
        for selector in selectors:
            name = response.css(selector).get()
            if name and name.strip():
                return name.strip()
        
        # Fallback: extraire depuis l'URL
        url_name = response.url.split('/')[-1].replace('_', ' ')
        # Nettoyer les paramètres URL
        if '?' in url_name:
            url_name = url_name.split('?')[0]
        if '#' in url_name:
            url_name = url_name.split('#')[0]
        # Décoder l'URL
        from urllib.parse import unquote
        return unquote(url_name)
    
    def extract_main_image(self, response):
        """Extrait l'URL de l'image principale (OBLIGATOIRE)"""
        image_selectors = [
            # Infobox images (plus communes)
            '.infobox img::attr(src)',
            '.portable-infobox img::attr(src)',
            '.infobox-image img::attr(src)',
            '.infobox .image img::attr(src)',
            
            # Images dans les templates
            '.character-infobox img::attr(src)',
            '.hero-infobox img::attr(src)',
            '.pokemon-infobox img::attr(src)',
            
            # Images générales en haut de page
            '.mw-content-text p:first-of-type img::attr(src)',
            '.article-content img:first-of-type::attr(src)',
            
            # Autres patterns
            'figure.thumb img::attr(src)',
            '.thumbinner img::attr(src)',
        ]
        
        for selector in image_selectors:
            images = response.css(selector).getall()
            for img_url in images:
                if img_url and self.is_valid_image_url(img_url):
                    # Convertir en URL absolue si nécessaire
                    full_url = urljoin(response.url, img_url)
                    return self.clean_image_url(full_url)
        
        return None
    
    def is_valid_image_url(self, url):
        """Vérifie si l'URL d'image est valide"""
        if not url:
            return False
        
        # Vérifier l'extension
        valid_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
        url_lower = url.lower()
        
        # Exclure les icônes et images système
        excluded_patterns = [
            'edit-icon',
            'commons-logo',
            'wikia-logo',
            'fandom-logo',
            'blank.gif',
            'pixel.gif',
            '/thumb/',  # Images thumbnail trop petites
        ]
        
        for pattern in excluded_patterns:
            if pattern in url_lower:
                return False
        
        return any(ext in url_lower for ext in valid_extensions)
    
    def clean_image_url(self, url):
        """Nettoie l'URL de l'image pour obtenir la version haute qualité"""
        # Supprimer les paramètres de redimensionnement Fandom
        url = re.sub(r'/revision/.*$', '', url)
        url = re.sub(r'\?.*$', '', url)
        
        return url
    
    def extract_description(self, response):
        """Extrait la description/biographie"""
        selectors = [
            '.mw-content-text > p:first-of-type::text',
            '.article-content > p:first-of-type::text',
            '.character-bio::text',
            '.description::text',
        ]
        
        for selector in selectors:
            desc = response.css(selector).get()
            if desc and len(desc.strip()) > 50:  # Au moins 50 caractères
                return desc.strip()
        
        # Fallback: prendre tous les paragraphes du début
        paragraphs = response.css('.mw-content-text p::text').getall()
        if paragraphs:
            return ' '.join(p.strip() for p in paragraphs[:3] if p.strip())
        
        return ""
    
    def extract_character_type(self, response):
        """Extrait le type/rôle/classe du personnage"""
        # Rechercher dans l'infobox
        infobox_labels = [
            'type', 'class', 'role', 'species', 'occupation', 
            'position', 'race', 'faction', 'allegiance', 'origin'
        ]
        
        for label in infobox_labels:
            xpath = f"//th[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '{label}')]/following-sibling::td//text()"
            value = response.xpath(xpath).get()
            if value:
                return value.strip()
        
        # Rechercher dans les catégories
        categories = response.css('.page-footer__categories a::text').getall()
        for category in categories:
            if any(word in category.lower() for word in ['character', 'hero', 'villain', 'champion']):
                return category
        
        return "Character"
    
    def extract_infobox_data(self, response):
        """Extrait toutes les données de l'infobox"""
        infobox_data = {}
        
        # Sélecteurs pour les infobox
        infobox_selectors = [
            '.infobox tr',
            '.portable-infobox .pi-item',
            '.character-infobox tr',
        ]
        
        for selector in infobox_selectors:
            rows = response.css(selector)
            for row in rows:
                label = row.css('th::text, .pi-data-label::text').get()
                value = row.css('td::text, .pi-data-value::text').get()
                
                if label and value:
                    infobox_data[label.strip().lower()] = value.strip()
        
        return infobox_data
    
    def extract_attributes(self, infobox_data, response):
        """Extrait 2 attributs structurés supplémentaires"""
        attributes = {}
        
        # Priorités d'attributs selon le type de fandom
        attribute_priorities = [
            # Gaming
            'power', 'ability', 'element', 'weapon', 'class', 'rarity',
            # Anime/Manga
            'affiliation', 'village', 'clan', 'devil_fruit', 'quirk',
            # General
            'height', 'weight', 'age', 'birthplace', 'status',
            'first_appearance', 'creator', 'voice_actor'
        ]
        
        found_attributes = []
        for key in attribute_priorities:
            if key in infobox_data and len(found_attributes) < 2:
                found_attributes.append((key, infobox_data[key]))
        
        # Assigner aux champs
        if len(found_attributes) >= 1:
            attributes['attribute_1'] = f"{found_attributes[0][0].title()}: {found_attributes[0][1]}"
        if len(found_attributes) >= 2:
            attributes['attribute_2'] = f"{found_attributes[1][0].title()}: {found_attributes[1][1]}"
        
        return attributes
    
    def extract_categories(self, response):
        """Extrait les catégories de la page"""
        return response.css('.page-footer__categories a::text').getall()
    
    def extract_additional_images(self, response):
        """Extrait des images supplémentaires"""
        additional_images = []
        images = response.css('.mw-content-text img::attr(src)').getall()
        
        for img_url in images[:5]:  # Limiter à 5 images max
            if img_url and self.is_valid_image_url(img_url):
                full_url = urljoin(response.url, img_url)
                additional_images.append(self.clean_image_url(full_url))
        
        return additional_images
    
    def handle_error(self, failure):
        """Gère les erreurs de requête"""
        error_msg = f"Request failed for {failure.request.url}: {failure.value}"
        self.logger.error(error_msg)
        self.errors.append(error_msg)
    
    def closed(self, reason):
        """Appelé à la fin du scraping"""
        end_time = datetime.now()
        duration = end_time - self.start_time
        
        stats = {
            'fandom_name': self.fandom_name,
            'fandom_url': self.fandom_url,
            'pages_scraped': self.pages_scraped,
            'duration_seconds': duration.total_seconds(),
            'errors_count': len(self.errors),
            'errors': self.errors,
            'finished_at': end_time.isoformat()
        }
        
        # Sauvegarder le rapport
        report_path = f"../data/{self.fandom_name}_scraping_report.json"
        try:
            with open(report_path, 'w', encoding='utf-8') as f:
                json.dump(stats, f, indent=2, ensure_ascii=False)
        except Exception as e:
            self.logger.error(f"Could not save report: {e}")
        
        self.logger.info(f"Scraping completed: {self.pages_scraped} pages in {duration}")
