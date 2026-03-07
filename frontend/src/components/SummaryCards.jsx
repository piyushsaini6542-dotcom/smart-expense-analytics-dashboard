import { useEffect, useState } from "react";
import axios from "axios";

function SummaryCards({ expenses }) {
  const [analytics, setAnalytics] = useState(null);
  const API_URL = "https://smart-expense-analytics-dashboard.onrender.com";

  const cardStyle = {
    background: "rgba(255,255,255,0.9)",
    backdropFilter: "blur(6px)",
    borderRadius: "16px",
    padding: "clamp(16px, 4vw, 28px)",   // ✅ responsive padding
    boxShadow: "0 20px 40px rgba(0,0,0,0.06)",
    transition: "all 0.25s ease",
    boxSizing: "border-box",              // ✅ prevents overflow
    minWidth: 0,                          // ✅ allows grid children to shrink
  };

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

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
    <>
      {/* Top two cards — always side by side */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",   // ✅ always 2 cols for small cards
          gap: "20px",
          marginBottom: "20px",
        }}
      >
        {/* Total Spending Card */}
        <div
          style={cardStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-6px)";
            e.currentTarget.style.boxShadow = "0 30px 60px rgba(0,0,0,0.08)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.06)";
          }}
        >
          <p style={{ color: "#64748b", marginBottom: "8px", fontSize: "clamp(12px, 3vw, 14px)" }}>
            Total Spending
          </p>

          <h2
            style={{
              fontSize: "clamp(20px, 5vw, 30px)",   // ✅ responsive font
              fontWeight: "800",
              letterSpacing: "-0.5px",
              color: "#0f172a",
              wordBreak: "break-word",
            }}
          >
            ₹ {total}
          </h2>

          <p style={{ color: "#94a3b8", marginTop: "6px", fontSize: "clamp(11px, 2.5vw, 13px)" }}>
            {expenses.length} Transactions
          </p>
        </div>

        {/* Highest Category Card */}
        <div
          style={cardStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-6px)";
            e.currentTarget.style.boxShadow = "0 30px 60px rgba(0,0,0,0.08)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.06)";
          }}
        >
          <p style={{ color: "#64748b", marginBottom: "8px", fontSize: "clamp(12px, 3vw, 14px)" }}>
            Highest Spending Category
          </p>

          <h2
            style={{
              fontSize: "clamp(16px, 4vw, 22px)",   // ✅ responsive font
              fontWeight: "600",
              color: "#2563eb",
              wordBreak: "break-word",
            }}
          >
            {highestCategory}
          </h2>
        </div>
      </div>

      {/* Spending Insights — full width, separate row */}
      {/* ✅ KEY FIX: Pulled out of grid entirely, no more gridColumn span issues */}
      {analytics && (
        <div
          style={{
            ...cardStyle,
            marginBottom: "30px",
            width: "100%",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-6px)";
            e.currentTarget.style.boxShadow = "0 30px 60px rgba(0,0,0,0.08)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.06)";
          }}
        >
          <p style={{ fontWeight: "600", marginBottom: "10px", fontSize: "clamp(13px, 3vw, 15px)" }}>
            Spending Insights
          </p>

          <p style={{ fontSize: "clamp(12px, 3vw, 14px)" }}>
            Weekend Spending: ₹ {analytics.weekend_total}
          </p>
          <p style={{ fontSize: "clamp(12px, 3vw, 14px)" }}>
            Weekday Spending: ₹ {analytics.weekday_total}
          </p>

          {analytics.recommendation && (
            <div
              style={{
                marginTop: "12px",
                padding: "14px",
                background: "#eef2ff",
                borderRadius: "10px",
                fontSize: "clamp(12px, 3vw, 14px)",
              }}
            >
              💡 {analytics.recommendation}
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default SummaryCards;
