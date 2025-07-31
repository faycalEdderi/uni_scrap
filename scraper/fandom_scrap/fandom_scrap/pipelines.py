# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html

import json
import os
from datetime import datetime
from itemadapter import ItemAdapter


class JsonWriterPipeline:
    def __init__(self):
        self.items_file = None
        self.items = []
    
    def open_spider(self, spider):
        # Créer les dossiers s'ils n'existent pas
        os.makedirs('../data', exist_ok=True)
        os.makedirs('../../frontend/public/data', exist_ok=True)
        
        # Nom du fichier basé sur le fandom et timestamp
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"../data/{spider.fandom_name}_{timestamp}.json"
        self.items_file = open(filename, 'w', encoding='utf-8')
        spider.logger.info(f"Saving items to {filename}")
    
    def close_spider(self, spider):
        # Sauvegarder tous les items dans le dossier data principal
        json.dump(self.items, self.items_file, indent=2, ensure_ascii=False)
        self.items_file.close()
        
        # Créer le fichier "latest" pour le scraper
        latest_filename = f"../data/{spider.fandom_name}_latest.json"
        with open(latest_filename, 'w', encoding='utf-8') as f:
            json.dump(self.items, f, indent=2, ensure_ascii=False)
        
        # NOUVEAU : Copier aussi dans le frontend pour accès direct
        frontend_filename = f"../../frontend/public/data/{spider.fandom_name}_latest.json"
        try:
            with open(frontend_filename, 'w', encoding='utf-8') as f:
                json.dump(self.items, f, indent=2, ensure_ascii=False)
            spider.logger.info(f"Data also saved to frontend: {frontend_filename}")
        except Exception as e:
            spider.logger.warning(f"Could not save to frontend: {e}")
    
    def process_item(self, item, spider):
        # Valider que l'item a au minimum les champs obligatoires
        adapter = ItemAdapter(item)
        if not adapter.get('name') or not adapter.get('image_url'):
            spider.logger.warning(f"Skipping item without name or image: {adapter.get('page_url')}")
            return item
        
        self.items.append(dict(adapter))
        return item


class ValidationPipeline:
    def process_item(self, item, spider):
        adapter = ItemAdapter(item)
        
        # Validation du nom
        if not adapter.get('name') or len(adapter['name'].strip()) < 2:
            raise ValueError(f"Invalid name: {adapter.get('name')}")
        
        # Validation de l'image (obligatoire)
        if not adapter.get('image_url'):
            raise ValueError("Image URL is required")
        
        # Validation de l'URL de l'image
        image_url = adapter['image_url']
        if not image_url.startswith(('http://', 'https://')):
            raise ValueError(f"Invalid image URL: {image_url}")
        
        # Nettoyer les données
        adapter['name'] = adapter['name'].strip()
        adapter['description'] = adapter.get('description', '').strip()
        adapter['character_type'] = adapter.get('character_type', 'Unknown').strip()
        
        return item


class DuplicatesPipeline:
    def __init__(self):
        self.seen_names = set()
    
    def process_item(self, item, spider):
        adapter = ItemAdapter(item)
        name = adapter['name'].lower().strip()
        
        if name in self.seen_names:
            spider.logger.warning(f"Duplicate item found: {adapter['name']}")
            return item  # On garde quand même, peut-être des variants
        
        self.seen_names.add(name)
        return item
