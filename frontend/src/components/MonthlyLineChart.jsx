import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function MonthlyLineChart({ expenses }) {
  const monthlyData = Object.values(
    expenses.reduce((acc, curr) => {
      const month = new Date(curr.date).toLocaleString("default", {
        month: "short",
      });

      if (!acc[month]) {
        acc[month] = { month, total: 0 };
      }

      acc[month].total += curr.amount;
      return acc;
    }, {})
  );

  // ✅ Premium Card Style
  const cardStyle = {
    background: "rgba(255,255,255,0.9)",
    backdropFilter: "blur(6px)",
    borderRadius: "16px",
    padding: "30px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.06)",
    transition: "all 0.25s ease",
    height: "350px",
  };

  return (
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
      <h3
        style={{
          marginBottom: "15px",
          fontSize: "16px",
          fontWeight: "600",
        }}
      >
        Monthly Trend
      </h3>

      <ResponsiveContainer width="100%" height="80%">
        <LineChart data={monthlyData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />

          {/* ✅ Updated Line Styling */}
          <Line
            type="monotone"
            dataKey="total"
            stroke="#4f46e5"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default MonthlyLineChart;