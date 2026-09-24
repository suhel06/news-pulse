# News Pulse

A full-stack news aggregation and topic-clustering platform that collects articles from multiple RSS feeds, groups related stories into clusters, and visualizes them on an interactive timeline.

## Features

### RSS News Ingestion
- Fetches articles from multiple RSS feeds
- Normalizes feed data into a common format
- Avoids duplicate article storage
- Stores articles in MongoDB

### Topic Clustering
- Groups related news articles into clusters
- Generates cluster labels automatically
- Stores clustered articles for visualization

### Backend API
- Get all clusters
- Get cluster details
- Get timeline data
- Trigger ingestion pipeline
- Check ingestion job status

### Interactive Timeline
- Timeline visualization using React and Recharts
- Clickable clusters
- Detailed cluster view
- Real-time data fetched from backend API

### Source Filtering
- Filter timeline by news source
- Dynamic timeline updates

---

## Tech Stack

### Frontend
- Next.js
- React
- TypeScript
- Recharts

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

### Data Pipeline
- Python
- Feedparser
- BeautifulSoup
- MongoDB

---

## Project Structure

```text
news-pulse/
│
├── frontend/
│   ├── app/
│   ├── components/
│   └── lib/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   └── routes/
│
├── scraper/
│   ├── feeds/
│   ├── clustering/
│   ├── db/
│   └── main.py
│
└── README.md
```

---

## API Endpoints

### Timeline

```http
GET /api/timeline
```

Returns all timeline clusters.

### Cluster Details

```http
GET /api/clusters/:id
```

Returns all articles inside a cluster.

### Trigger Ingestion

```http
POST /api/ingest/trigger
```

Starts the scraping and clustering pipeline.

### Job Status

```http
GET /api/ingest/status/:jobId
```

Returns ingestion job status.

---

## Environment Variables

### Backend

Create:

```bash
backend/.env
```

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
```

### Scraper

Create:

```bash
scraper/.env
```

```env
MONGODB_URI=your_mongodb_connection_string
DB_NAME=news_pulse
```

---

## Local Setup

### Clone Repository

```bash
git clone https://github.com/suhel06/news-pulse.git
cd news-pulse
```

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Scraper

```bash
cd scraper

python -m venv venv

# Windows
venv\Scripts\activate

pip install -r requirements.txt

python main.py
```

---

## Architecture

```text
RSS Feeds
    ↓
Python Scraper
    ↓
MongoDB
    ↓
Node.js API
    ↓
Next.js Frontend
    ↓
Timeline Visualization
```

## News Sources

- BBC RSS
- NPR RSS
- The Guardian RSS

----

## Challenges Faced

- RSS feeds use inconsistent formats
- Duplicate article handling
- Topic clustering of similar stories
- Integrating Python pipeline with Node.js backend
- Timeline visualization and cluster interaction

---

## Future Improvements

- Better NLP-based clustering
- Live timeline updates
- Improved cluster labeling
- Advanced filtering and search
- Cross-source story merging

---

## Author

Mohd Suhel Khan

GitHub: https://github.com/suhel06
