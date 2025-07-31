# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy


class FandomCharacterItem(scrapy.Item):
    # Champs obligatoires
    name = scrapy.Field()
    image_url = scrapy.Field()
    description = scrapy.Field()
    character_type = scrapy.Field()  # Type/Rôle/Classe/Origine
    
    # Attributs supplémentaires (variables selon le fandom)
    attribute_1 = scrapy.Field()  # Ex: pouvoir, rareté, élément
    attribute_2 = scrapy.Field()  # Ex: affiliation, région, série
    
    # Métadonnées
    fandom_url = scrapy.Field()
    fandom_name = scrapy.Field()
    page_url = scrapy.Field()
    scraped_at = scrapy.Field()
    
    # Données additionnelles (optionnelles)
    additional_images = scrapy.Field()
    categories = scrapy.Field()
    infobox_data = scrapy.Field()
