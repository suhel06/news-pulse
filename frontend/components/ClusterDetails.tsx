"use client";

type Article = {
  _id: string;
  title: string;
  source: string;
  published: string;
  link: string;
};

type Cluster = {
  _id: string;
  cluster_id: number;
  size: number;
  articles: Article[];
};

export default function ClusterDetails({
  cluster,
}: {
  cluster: Cluster | null;
}) {
  if (!cluster) {
    return (
      <section
        style={{
          marginTop: "30px",
          padding: "30px",
          border: "1px solid #333",
          borderRadius: "14px",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginTop: 0 }}>
          Cluster Details
        </h2>

        <p style={{ color: "#888" }}>
          Select a cluster from the timeline to
          explore its related articles.
        </p>
      </section>
    );
  }

  return (
    <section style={{ marginTop: "30px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <div>
          <h2 style={{ margin: 0 }}>
            Cluster {cluster.cluster_id}
          </h2>

          <p
            style={{
              margin: "6px 0 0",
              color: "#888",
            }}
          >
            {cluster.articles.length} related{" "}
            {cluster.articles.length === 1
              ? "article"
              : "articles"}
          </p>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "16px",
        }}
      >
        {cluster.articles.map((article) => (
          <article
            key={article._id}
            style={{
              border: "1px solid #333",
              borderRadius: "12px",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              minHeight: "190px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "10px",
                marginBottom: "12px",
              }}
            >
              <span
                style={{
                  fontSize: "13px",
                  padding: "4px 8px",
                  border: "1px solid #444",
                  borderRadius: "6px",
                }}
              >
                {article.source}
              </span>

              <span
                style={{
                  fontSize: "12px",
                  color: "#888",
                }}
              >
                {new Date(
                  article.published
                ).toLocaleDateString()}
              </span>
            </div>

            <h3
              style={{
                margin: "0 0 15px",
                lineHeight: 1.4,
                fontSize: "17px",
              }}
            >
              {article.title}
            </h3>

            <div style={{ marginTop: "auto" }}>
              <a
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  textDecoration: "none",
                }}
              >
                Read Article →
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}