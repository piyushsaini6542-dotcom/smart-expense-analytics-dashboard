import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
} from "recharts";

function CategoryPieChart({ expenses }) {
  const categoryData = Object.values(
    expenses.reduce((acc, curr) => {
      if (!acc[curr.category]) {
        acc[curr.category] = { name: curr.category, value: 0 };
      }
      acc[curr.category].value += curr.amount;
      return acc;
    }, {})
  );

  const COLORS = [
    "#6366f1",
    "#22c55e",
    "#f59e0b",
    "#ef4444",
    "#14b8a6",
    "#a855f7",
    "#f97316",
  ];

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
        Category Distribution
      </h3>

      {categoryData.length <= 1 ? (
        <p style={{ color: "#6b7280" }}>
          Add more categories to see distribution.
        </p>
      ) : (
        <ResponsiveContainer width="100%" height="80%">
          <PieChart>
            <Pie
              data={categoryData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={65}   
              outerRadius={95}   
              paddingAngle={3}
            >
              {categoryData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default CategoryPieChart;