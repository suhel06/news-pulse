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

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const SOURCES = ["BBC", "NPR", "Guardian"];

export default function HomeClient() {
  const [timeline, setTimeline] = useState<any[]>([]);
  const [allClusters, setAllClusters] = useState<any[]>([]);
  const [selectedCluster, setSelectedCluster] = useState<any>(null);

  const [selectedSources, setSelectedSources] =
    useState<string[]>(SOURCES);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [message, setMessage] = useState("");

  const loadTimeline = async () => {
    try {
      setLoading(true);

      const result = await getTimeline();

      setTimeline(result.data || []);
    } catch (error) {
      console.error("Failed to load timeline:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadClusters = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/clusters`
      );

      const result = await response.json();

      setAllClusters(result.data || []);
    } catch (error) {
      console.error("Failed to load clusters:", error);
    }
  };

  useEffect(() => {
    loadTimeline();
    loadClusters();
  }, []);

  const handleSourceChange = (source: string) => {
    setSelectedSources((prev) =>
      prev.includes(source)
        ? prev.filter((item) => item !== source)
        : [...prev, source]
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

    const filteredArticles =
      matchingCluster.articles?.filter(
        (article: any) =>
          selectedSources.includes(article.source)
      ) || [];

    return {
      ...cluster,
      articleCount: filteredArticles.length,
    };
  });

  const handleBarClick = async (clusterId: number) => {
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

      const interval = setInterval(async () => {
        try {
          const status = await getIngestStatus(
            job.jobId
          );

          if (status.status === "completed") {
            clearInterval(interval);

            setMessage(
              "News updated successfully!"
            );

            await loadTimeline();
            await loadClusters();

            setRefreshing(false);
          }

          if (status.status === "failed") {
            clearInterval(interval);

            setMessage(
              "Failed to update news."
            );

            setRefreshing(false);
          }
        } catch (error) {
          clearInterval(interval);

          setRefreshing(false);

          setMessage(
            "Something went wrong."
          );

          console.error(error);
        }
      }, 2000);
    } catch (error) {
      console.error(error);

      setRefreshing(false);

      setMessage(
        "Could not start refresh."
      );
    }
  };

  const totalArticles = allClusters.reduce(
    (total, cluster) =>
      total +
      (cluster.articles?.length || 0),
    0
  );

  const activeSources = SOURCES.filter(
    (source) =>
      allClusters.some((cluster) =>
        cluster.articles?.some(
          (article: any) =>
            article.source === source
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
      <h1>News Pulse</h1>

      <p
        style={{
          color: "#888",
          marginBottom: "20px",
        }}
      >
        Track how news stories evolve over
        time.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(3, 1fr)",
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
          <p>Total Articles</p>
          <h2>{totalArticles}</h2>
        </div>

        <div
          style={{
            padding: "20px",
            border: "1px solid #333",
            borderRadius: "12px",
          }}
        >
          <p>News Clusters</p>
          <h2>{timeline.length}</h2>
        </div>

        <div
          style={{
            padding: "20px",
            border: "1px solid #333",
            borderRadius: "12px",
          }}
        >
          <p>Sources</p>
          <h2>{activeSources}</h2>
        </div>
      </div>

      <button
        onClick={handleRefresh}
        disabled={refreshing}
      >
        {refreshing
          ? "Refreshing..."
          : "Refresh Data"}
      </button>

      {message && <p>{message}</p>}

      <div
        style={{
          marginTop: "20px",
          marginBottom: "20px",
        }}
      >
        <h3>Filter by Source</h3>

        {SOURCES.map((source) => (
          <label
            key={source}
            style={{
              marginRight: "15px",
            }}
          >
            <input
              type="checkbox"
              checked={selectedSources.includes(
                source
              )}
              onChange={() =>
                handleSourceChange(source)
              }
            />

            {source}
          </label>
        ))}
      </div>

      {loading ? (
        <p>Loading timeline...</p>
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