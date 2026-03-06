function ExpenseTable({ expenses, onDelete, onEdit }) {
  return (
    <div
      style={{
        background: "#ffffff",
        padding: "30px",
        borderRadius: "12px",
        boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
        marginBottom: "30px",
      }}
    >
      <h2 style={{ marginBottom: "20px" }}>All Expenses</h2>

      {expenses.length === 0 ? (
        <p style={{ color: "#6b7280" }}>No expenses added yet.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr style={{ background: "#f9fafb", textAlign: "left" }}>
              <th style={thStyle}>Title</th>
              <th style={thStyle}>Amount</th>
              <th style={thStyle}>Category</th>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {expenses.map((exp) => (
              <tr
              key={exp.id}
              style={{
                borderBottom: "1px solid #e5e7eb",
                transition: "0.2s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#f8fafc")}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                  }
                  >
                <td style={tdStyle}>{exp.title}</td>
                <td style={tdStyle}>₹ {exp.amount}</td>
                <td style={tdStyle}>
                  <span
                    style={{
                      padding: "5px 10px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: "500",
                      background: "#eef2ff",
                      color: "#4338ca",
                      textTransform: "capitalize",
                    }}
                  >
                    {exp.category}
                  </span>
                </td>
                <td style={tdStyle}>{exp.date}</td>
                <td style={tdStyle}>
                  <button
                    onClick={() => onEdit(exp)}
                    style={editBtnStyle}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => onDelete(exp.id)}
                    style={deleteBtnStyle}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const thStyle = {
  padding: "12px",
  fontWeight: "600",
  fontSize: "14px",
  color: "#374151",
};

const tdStyle = {
  padding: "12px",
  fontSize: "14px",
};

const editBtnStyle = {
  padding: "6px 12px",
  marginRight: "8px",
  borderRadius: "6px",
  border: "none",
  background: "#3b82f6",
  color: "#fff",
  cursor: "pointer",
};

const deleteBtnStyle = {
  padding: "6px 12px",
  borderRadius: "6px",
  border: "none",
  background: "#ef4444",
  color: "#fff",
  cursor: "pointer",
};

export default ExpenseTable;