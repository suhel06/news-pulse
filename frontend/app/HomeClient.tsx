"use client";

import { useEffect, useState } from "react";

import TimelineChart from "../components/TimelineChart";
import ClusterDetails from "../components/ClusterDetails";

import {
  getTimeline,
  getCluster,
  triggerIngest,
  getIngestStatus,
} from "../lib/api";

const SOURCES = ["BBC", "NPR", "Guardian"];

export default function HomeClient() {
  const [timeline, setTimeline] = useState<any[]>([]);
  const [allClusters, setAllClusters] = useState<any[]>([]);
  const [selectedCluster, setSelectedCluster] = useState<any>(null);

  const [selectedSources, setSelectedSources] = useState<string[]>(
    SOURCES
  );
   const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [message, setMessage] = useState("");

  const loadTimeline = async () => {
  try {
    setLoading(true);

    const result = await getTimeline();

    setTimeline(result.data);
  } catch (error) {
    console.error("Failed to load timeline:", error);
  } finally {
    setLoading(false);
  }
};

  const loadClusters = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/clusters"
      );

      const result = await response.json();

      setAllClusters(result.data);
    } catch (error) {
      console.error("Failed to load clusters:", error);
    }
  };

  useEffect(() => {
    loadTimeline();
    loadClusters();
  }, []);

  const handleSourceChange = (source: string) => {
    setSelectedSources((previous) =>
      previous.includes(source)
        ? previous.filter((item) => item !== source)
        : [...previous, source]
    );
  };

  const filteredTimeline = timeline.map((cluster) => {
    const matchingCluster = allClusters.find(
      (item) => item.cluster_id === cluster.clusterId
    );

    if (!matchingCluster) {
      return {
        ...cluster,
        articleCount: 0,
      };
    }

    const filteredArticles = matchingCluster.articles.filter(
      (article: any) =>
        selectedSources.includes(article.source)
    );


    

    return {
      ...cluster,
      articleCount: filteredArticles.length,
    };
  });

  const handleBarClick = async (clusterId: number) => {
    console.log("Clicked Cluster:", clusterId);

    try {
      const result = await getCluster(clusterId);

      setSelectedCluster(result.data);
    } catch (error) {
      console.error("Failed to load cluster:", error);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      setMessage("Fetching latest news...");

      const job = await triggerIngest();
      const jobId = job.jobId;

      const interval = setInterval(async () => {
        try {
          const status = await getIngestStatus(jobId);

          console.log("Ingestion status:", status);

          if (status.status === "completed") {
            clearInterval(interval);

            setMessage("News updated successfully!");

            await loadTimeline();
            await loadClusters();

            setRefreshing(false);
          }

          if (status.status === "failed") {
            clearInterval(interval);

            setMessage("Failed to update news.");

            setRefreshing(false);

            console.error(
              "Ingestion failed:",
              status.error
            );
          }
        } catch (error) {
          clearInterval(interval);

          setRefreshing(false);

          setMessage("Something went wrong.");

          console.error(error);
        }
      }, 2000);
    } catch (error) {
      console.error(
        "Failed to start ingestion:",
        error
      );

      setMessage("Could not start refresh.");

      setRefreshing(false);
    }
  };


  const totalArticles = allClusters.reduce(
  (total, cluster) => total + (cluster.articles?.length || 0),
  0
);

const activeSources = SOURCES.filter((source) =>
  allClusters.some((cluster) =>
    cluster.articles?.some(
      (article: any) => article.source === source
    )
  )
).length;

  return (
    <main
      style={{
        padding: "20px",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
     <div
  style={{
    marginBottom: "30px",
  }}
>
  <h1
    style={{
      fontSize: "36px",
      marginBottom: "8px",
    }}
  >
    News Pulse
  </h1>

  <p
    style={{
      color: "#888",
      fontSize: "16px",
      margin: 0,
    }}
  >
    Track how news stories emerge, spread, and evolve over time.
  </p>
</div>


<div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "16px",
    marginBottom: "25px",
  }}
>
  <div
    style={{
      padding: "20px",
      border: "1px solid #333",
      borderRadius: "12px",
    }}
  >
    <p style={{ margin: 0, color: "#888" }}>
      Total Articles
    </p>

    <h2 style={{ margin: "8px 0 0" }}>
      {totalArticles}
    </h2>
  </div>

  <div
    style={{
      padding: "20px",
      border: "1px solid #333",
      borderRadius: "12px",
    }}
  >
    <p style={{ margin: 0, color: "#888" }}>
      News Clusters
    </p>

    <h2 style={{ margin: "8px 0 0" }}>
      {timeline.length}
    </h2>
  </div>

  <div
    style={{
      padding: "20px",
      border: "1px solid #333",
      borderRadius: "12px",
    }}
  >
    <p style={{ margin: 0, color: "#888" }}>
      Sources
    </p>

    <h2 style={{ margin: "8px 0 0" }}>
      {activeSources}
    </h2>
  </div>
</div>

      <button
        onClick={handleRefresh}
        disabled={refreshing}
        style={{
          padding: "10px 16px",
          marginBottom: "20px",
          cursor: refreshing
            ? "not-allowed"
            : "pointer",
        }}
      >
        {refreshing
          ? "Refreshing..."
          : "Refresh Data"}
      </button>

      {message && <p>{message}</p>}

     {/* Source Filters */}

<div
  style={{
    marginBottom: "25px",
    padding: "18px 20px",
    border: "1px solid #333",
    borderRadius: "12px",
  }}
>
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "14px",
    }}
  >
    <h3 style={{ margin: 0 }}>
      Filter by Source
    </h3>

    <span
      style={{
        fontSize: "13px",
        color: "#888",
      }}
    >
      {selectedSources.length} selected
    </span>
  </div>

  <div
    style={{
      display: "flex",
      gap: "10px",
      flexWrap: "wrap",
    }}
  >
    {SOURCES.map((source) => {
      const selected =
        selectedSources.includes(source);

      return (
        <label
          key={source}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "9px 14px",
            border: selected
              ? "1px solid #777"
              : "1px solid #333",
            borderRadius: "8px",
            cursor: "pointer",
            background: selected
              ? "#222"
              : "transparent",
          }}
        >
          <input
            type="checkbox"
            checked={selected}
            onChange={() =>
              handleSourceChange(source)
            }
          />

          <span>{source}</span>
        </label>
      );
    })}
  </div>
</div>

      {loading ? (
  <div
    style={{
      padding: "50px",
      textAlign: "center",
      border: "1px solid #333",
      borderRadius: "14px",
      color: "#888",
    }}
  >
    Loading news timeline...
  </div>
) : filteredTimeline.length === 0 ? (
  <div
    style={{
      padding: "50px",
      textAlign: "center",
      border: "1px solid #333",
      borderRadius: "14px",
    }}
  >
    <h2>No news data found</h2>

    <p style={{ color: "#888" }}>
      Try selecting another news source or refresh the data.
    </p>
  </div>
) : (
  <TimelineChart
    data={filteredTimeline}
    onBarClick={handleBarClick}
  />
)}

      <ClusterDetails
        cluster={selectedCluster}
      />
    </main>
  );
}