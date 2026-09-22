from feeds.rss_reader import fetch_articles
from db.article_repository import save_articles

articles = fetch_articles()

inserted, skipped = save_articles(articles)

print(f"\nInserted: {inserted}")
print(f"Skipped: {skipped}")