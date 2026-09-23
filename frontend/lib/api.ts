const API_URL = "http://localhost:5000/api";

export async function getArticles() {
  const response = await fetch(`${API_URL}/articles`);

  if (!response.ok) {
    throw new Error("Failed to fetch articles");
  }

  return response.json();
}




export async function getTimeline() {
  const response = await fetch(
    "http://127.0.0.1:5000/api/timeline"
  );

  if (!response.ok) {
    throw new Error("Failed to fetch timeline");
  }

  return response.json();
}






export async function getCluster(clusterId: number) {
  const response = await fetch(
    `http://127.0.0.1:5000/api/clusters/${clusterId}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch cluster");
  }

  return response.json();
}

export async function triggerIngest() {
  const response = await fetch(
    "http://localhost:5000/api/ingest/trigger",
    {
      method: "POST",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to start ingestion");
  }

  return response.json();
}


export async function getIngestStatus(jobId: string) {
  const response = await fetch(
    `http://localhost:5000/api/ingest/status/${jobId}`
  );

  if (!response.ok) {
    throw new Error("Failed to get ingestion status");
  }

  return response.json();
}