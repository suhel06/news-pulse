from db.mongo import articles_collection


def save_articles(articles):
    inserted = 0
    skipped = 0

    for article in articles:
        existing_article = articles_collection.find_one(
            {"link": article["link"]}
        )

        if existing_article:
            skipped += 1
            continue

        articles_collection.insert_one(article)
        inserted += 1

    return inserted, skipped