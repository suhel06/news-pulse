"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

type TimelineItem = {
  clusterId: number;
  label: string;
  articleCount: number;
  startTime: string | null;
  endTime: string | null;
};

export default function TimelineChart({
  data,
  onBarClick,
}: {
  data: TimelineItem[];
  onBarClick: (id: number) => void;
}) {
  const chartData = data.map((item) => ({
    ...item,

    start: item.startTime
      ? new Date(item.startTime).getTime()
      : 0,

    end: item.endTime
      ? new Date(item.endTime).getTime()
      : 0,
  }));

  return (
    <section
      style={{
        marginTop: "30px",
        marginBottom: "40px",
        padding: "22px",
        border: "1px solid #333",
        borderRadius: "14px",
      }}
    >
      <div style={{ marginBottom: "20px" }}>
        <h2 style={{ margin: 0 }}>
          News Activity Timeline
        </h2>

        <p
          style={{
            marginTop: "6px",
            marginBottom: 0,
            color: "#888",
            fontSize: "14px",
          }}
        >
          Each cluster represents a group of related news
          articles. Click a cluster to explore its stories.
        </p>
      </div>

      <div style={{ width: "100%", height: 500 }}>
        <ResponsiveContainer>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{
              top: 10,
              right: 30,
              left: 30,
              bottom: 20,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              opacity={0.2}
            />

            <XAxis
              type="number"
              domain={["dataMin", "dataMax"]}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString(
                  undefined,
                  {
                    month: "short",
                    day: "numeric",
                  }
                )
              }
            />

            <YAxis
              type="category"
              dataKey="label"
              width={90}
            />

            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) {
                  return null;
                }

                const item = payload[0].payload;

                return (
                  <div
                    style={{
                      background: "#111",
                      border: "1px solid #444",
                      borderRadius: "8px",
                      padding: "12px",
                    }}
                  >
                    <strong>
                      {item.label}
                    </strong>

                    <p
                      style={{
                        margin: "8px 0 0",
                      }}
                    >
                      Articles:{" "}
                      {item.articleCount}
                    </p>

                    <p
                      style={{
                        margin: "4px 0 0",
                      }}
                    >
                      Started:{" "}
                      {item.startTime
                        ? new Date(
                            item.startTime
                          ).toLocaleString()
                        : "Unknown"}
                    </p>

                    <p
                      style={{
                        margin: "4px 0 0",
                      }}
                    >
                      Last article:{" "}
                      {item.endTime
                        ? new Date(
                            item.endTime
                          ).toLocaleString()
                        : "Unknown"}
                    </p>
                  </div>
                );
              }}
            />

            <Bar
              dataKey="start"
              stackId="timeline"
              fill="transparent"
              onClick={(data) =>
                onBarClick(
                  data.payload.clusterId
                )
              }
            />

            <Bar
              dataKey="end"
              stackId="timeline"
              onClick={(data) =>
                onBarClick(
                  data.payload.clusterId
                )
              }
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}