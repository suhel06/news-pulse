import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from feeds.rss_reader import fetch_articles
from db.article_repository import save_articles

articles = fetch_articles()

inserted, skipped = save_articles(articles)

print(f"\nInserted: {inserted}")
print(f"Skipped: {skipped}")


import importlib

importlib.import_module("clustering.cluster_articles")