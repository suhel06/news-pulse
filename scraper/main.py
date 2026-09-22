from db.mongo import articles_collection

test_article = {
    "title": "Test Article",
    "source": "System"
}

result = articles_collection.insert_one(test_article)

print("Inserted:", result.inserted_id)