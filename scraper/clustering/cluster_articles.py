from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import DBSCAN

from db.mongo import articles_collection, clusters_collection

# Fetch articles
articles = list(articles_collection.find())

if not articles:
    print("No articles found")
    exit()

titles = [article["title"] for article in articles]

# Convert titles to vectors
vectorizer = TfidfVectorizer(stop_words="english")
X = vectorizer.fit_transform(titles)

# Cluster similar titles
clustering = DBSCAN(
    eps=0.8,
    min_samples=2,
    metric="cosine"
).fit(X)

labels = clustering.labels_

clusters = {}

for article, label in zip(articles, labels):

    if label == -1:
        continue

    if label not in clusters:
        clusters[label] = []

    clusters[label].append(article)

# Clear old clusters
clusters_collection.delete_many({})

# Save clusters
for label, articles_list in clusters.items():

    clusters_collection.insert_one({
        "cluster_id": int(label),
        "size": len(articles_list),
        "articles": articles_list
    })

print(f"Saved {len(clusters)} clusters")