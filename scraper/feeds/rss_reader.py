import feedparser

from feeds.rss_feeds import RSS_FEEDS

def fetch_articles():
    articles = []

    for source, url in RSS_FEEDS.items():
        print(f"Fetching {source}...")

        feed = feedparser.parse(url)

        for entry in feed.entries:
            articles.append({
                "title": entry.get("title", ""),
                "link": entry.get("link", ""),
                "source": source,
                "published": entry.get("published", "")
            })

    return articles