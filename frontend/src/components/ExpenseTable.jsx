function ExpenseTable({ expenses, onDelete, onEdit }) {
  return (
    <div
      style={{
        background: "#ffffff",
        padding: "clamp(14px, 4vw, 30px)",   // ✅ responsive padding
        borderRadius: "12px",
        boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
        marginBottom: "30px",
        boxSizing: "border-box",              // ✅ prevents card overflow
        width: "100%",
      }}
    >
      <h2 style={{ marginBottom: "20px", fontSize: "clamp(16px, 4vw, 22px)" }}>
        All Expenses
      </h2>

      {expenses.length === 0 ? (
        <p style={{ color: "#6b7280" }}>No expenses added yet.</p>
      ) : (
        // ✅ KEY FIX: wrap table in a scrollable div
        // This allows horizontal scroll ONLY inside the table box
        // instead of the whole page scrolling sideways
        <div
          style={{
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",  // ✅ smooth scroll on iOS
            width: "100%",
          }}
        >
          <table
            style={{
              width: "100%",
              minWidth: "520px",           // ✅ table won't squish below this
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
                    (e.currentTarget.style.background = "#f8fafc")
                  }
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
                        whiteSpace: "nowrap",     // ✅ category badge stays on one line
                      }}
                    >
                      {exp.category}
                    </span>
                  </td>
                  <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>{exp.date}</td>
                  <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>
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
        </div>
      )}
    </div>
  );
}

const thStyle = {
  padding: "12px",
  fontWeight: "600",
  fontSize: "14px",
  color: "#374151",
  whiteSpace: "nowrap",   // ✅ header labels never wrap
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
