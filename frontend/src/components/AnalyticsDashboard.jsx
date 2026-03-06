import { useEffect, useState } from "react";
import axios from "axios";

function AnalyticsDashboard({ expenses, monthlyBudget }) {
  const [analytics, setAnalytics] = useState(null);
  const API_URL = "http://localhost:8000";

  

  const cardStyle = {
    background: "rgba(255,255,255,0.9)",
    backdropFilter: "blur(6px)",
    borderRadius: "16px",
    padding: "30px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.06)",
    transition: "all 0.25s ease",
    marginBottom: "30px",
  };

  // =========================
  // Budget Calculations
  // =========================

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

  const percentageUsed = monthlyBudget
    ? (totalSpent / monthlyBudget) * 100
    : 0;

  const remaining = monthlyBudget - totalSpent;

  // =========================
  // Category Calculations
  // =========================

  const categoryTotals = {};

  expenses.forEach((e) => {
    categoryTotals[e.category] =
      (categoryTotals[e.category] || 0) + e.amount;
  });

  const highestCategory = Object.entries(categoryTotals).sort(
    (a, b) => b[1] - a[1]
  )[0];

  // Top 3 categories
  const topCategories = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  // =========================
  // Average Daily Spend
  // =========================

  const uniqueDays = new Set(expenses.map((e) => e.date)).size;

  const avgDaily =
    uniqueDays > 0
      ? (totalSpent / uniqueDays).toFixed(2)
      : 0;

  // =========================
  // Month Comparison
  // =========================

  const currentMonth = new Date().getMonth();
  const previousMonth = currentMonth - 1;

  let currentMonthTotal = 0;
  let previousMonthTotal = 0;

  expenses.forEach((e) => {
    const month = new Date(e.date).getMonth();

    if (month === currentMonth) {
      currentMonthTotal += e.amount;
    }

    if (month === previousMonth) {
      previousMonthTotal += e.amount;
    }
  });

  let monthChange = 0;

  if (previousMonthTotal > 0) {
    monthChange =
      ((currentMonthTotal - previousMonthTotal) /
        previousMonthTotal) *
      100;
  }

  // =========================
  // Recommendation Engine
  // =========================

  let recommendation = "";

  if (percentageUsed > 90) {
    recommendation =
      "You are close to exceeding your monthly budget.";
  } else if (percentageUsed > 75) {
    recommendation =
      "You have used more than 75% of your budget.";
  } else {
    recommendation =
      "Your spending is within healthy limits.";
  }

  // =========================
  // Backend Analytics
  // =========================

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

  if (!analytics) return null;

  return (
    <div style={cardStyle}>
      <h2
        style={{
          fontSize: "24px",
          fontWeight: "700",
          color: "#0f172a",
          marginBottom: "20px",
        }}
      >
        Analytics Overview
      </h2>

      {/* Metric Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))",
          gap: "16px",
          marginBottom: "20px",
        }}
      >
        <MetricCard
          title="Weekend Spending"
          value={`₹${analytics.weekend_total}`}
        />

        <MetricCard
          title="Weekday Spending"
          value={`₹${analytics.weekday_total}`}
        />

        <MetricCard
          title="Highest Category"
          value={highestCategory?.[0] || "N/A"}
        />

        <MetricCard
          title="Avg Daily Spend"
          value={`₹${avgDaily}`}
        />
      </div>

      {/* Top Categories */}
      <div style={{ marginBottom: "20px" }}>
        <h4
          style={{
            fontWeight: "600",
            marginBottom: "8px",
          }}
        >
          Top Spending Categories
        </h4>

        {topCategories.map(([category, amount], index) => (
          <p key={category}>
            {index + 1}️⃣ {category} — ₹{amount}
          </p>
        ))}
      </div>

      {/* Month Comparison */}
      <div
        style={{
          padding: "12px",
          borderRadius: "8px",
          background: monthChange > 0 ? "#fee2e2" : "#dcfce7",
          color: monthChange > 0 ? "#b91c1c" : "#166534",
          fontWeight: "500",
          marginBottom: "20px",
        }}
      >
        {monthChange > 0
          ? `Spending increased by ${monthChange.toFixed(
              1
            )}% compared to last month`
          : `Spending decreased by ${Math.abs(
              monthChange
            ).toFixed(1)}% compared to last month`}
      </div>

      {/* Budget Progress Bar */}
      <div style={{ marginTop: "10px" }}>
        <div
          style={{
            height: "10px",
            background: "#e2e8f0",
            borderRadius: "6px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${Math.min(percentageUsed, 100)}%`,
              height: "100%",
              background:
              percentageUsed > 90
              ? "#ef4444"
              : percentageUsed > 70
              ? "#f59e0b"
              : "#22c55e",
              transition: "0.3s ease",
            }}
          />
        </div>

        <p style={{ marginTop: "8px", fontSize: "14px" }}>
          ₹{totalSpent} spent of ₹{monthlyBudget} budget
        </p>
      </div>

      {/* Recommendation */}
      <div
        style={{
          marginTop: "20px",
          padding: "14px",
          background: "#e0f2fe",
          borderRadius: "10px",
          color: "#0369a1",
          fontWeight: "500",
        }}
      >
        {recommendation}
      </div>

      {/* Weekend Warning */}
      {analytics.weekend_spike && (
        <div
          style={{
            marginTop: "20px",
            padding: "14px",
            background: "#fee2e2",
            borderRadius: "10px",
            color: "#b91c1c",
            fontWeight: "500",
          }}
        >
          Weekend spending is higher than weekdays ⚠
        </div>
      )}
    </div>
  );
}

function MetricCard({ title, value }) {
  return (
    <div
      style={{
        background: "#f8fafc",
        padding: "14px",
        borderRadius: "10px",
      }}
    >
      <p
        style={{
          fontSize: "12px",
          color: "#64748b",
          marginBottom: "4px",
        }}
      >
        {title}
      </p>

      <h3
        style={{
          fontSize: "18px",
          fontWeight: "700",
          color: "#0f172a",
        }}
      >
        {value}
      </h3>
    </div>
  );
}

export default AnalyticsDashboard;