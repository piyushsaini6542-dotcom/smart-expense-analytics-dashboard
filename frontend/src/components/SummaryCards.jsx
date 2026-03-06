import { useEffect, useState } from "react";
import axios from "axios";

function SummaryCards({ expenses }) {
  const [analytics, setAnalytics] = useState(null);
  const API_URL = "http://localhost:8000";

  // Glass Card Style
  const cardStyle = {
    background: "rgba(255,255,255,0.9)",
    backdropFilter: "blur(6px)",
    borderRadius: "16px",
    padding: "28px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.06)",
    transition: "all 0.25s ease",
  };

  // Total spending
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  // Category totals
  const categoryTotals = expenses.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {});

  const highestCategory =
    Object.keys(categoryTotals).length > 0
      ? Object.keys(categoryTotals).reduce((a, b) =>
          categoryTotals[a] > categoryTotals[b] ? a : b
        )
      : "N/A";

  // Fetch analytics from backend
  const fetchAnalytics = async () => {
    try {
      const res = await axios.get(`${API_URL}/analytics`);
      setAnalytics(res.data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [expenses]);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "20px",
        marginBottom: "30px",
      }}
    >
      {/* Total Spending Card */}
      <div
        style={cardStyle}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-6px)";
          e.currentTarget.style.boxShadow =
            "0 30px 60px rgba(0,0,0,0.08)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow =
            "0 20px 40px rgba(0,0,0,0.06)";
        }}
      >
        <p style={{ color: "#64748b", marginBottom: "8px" }}>
          Total Spending
        </p>

        <h2
          style={{
            fontSize: "30px",
            fontWeight: "800",
            letterSpacing: "-0.5px",
            color: "#0f172a",
          }}
        >
          ₹ {total}
        </h2>

        <p style={{ color: "#94a3b8", marginTop: "6px" }}>
          {expenses.length} Transactions
        </p>
      </div>

      {/* Highest Category Card */}
      <div
        style={cardStyle}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-6px)";
          e.currentTarget.style.boxShadow =
            "0 30px 60px rgba(0,0,0,0.08)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow =
            "0 20px 40px rgba(0,0,0,0.06)";
        }}
      >
        <p style={{ color: "#64748b", marginBottom: "8px" }}>
          Highest Spending Category
        </p>

        <h2
          style={{
            fontSize: "22px",
            fontWeight: "600",
            color: "#2563eb",
          }}
        >
          {highestCategory}
        </h2>
      </div>

      {/* Spending Insights Card */}
      {analytics && (
        <div
          style={{
            ...cardStyle,
            gridColumn: "span 2",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-6px)";
            e.currentTarget.style.boxShadow =
              "0 30px 60px rgba(0,0,0,0.08)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow =
              "0 20px 40px rgba(0,0,0,0.06)";
          }}
        >
          <p style={{ fontWeight: "600", marginBottom: "10px" }}>
            Spending Insights
          </p>

          <p>Weekend Spending: ₹ {analytics.weekend_total}</p>
          <p>Weekday Spending: ₹ {analytics.weekday_total}</p>

          {analytics.recommendation && (
            <div
              style={{
                marginTop: "12px",
                padding: "14px",
                background: "#eef2ff",
                borderRadius: "10px",
              }}
            >
              💡 {analytics.recommendation}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SummaryCards;