import { useState, useEffect } from "react";

function ExpenseForm({ onAdd, editingExpense, onUpdate, onClose }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    if (editingExpense) {
      setTitle(editingExpense.title);
      setAmount(editingExpense.amount);
      setCategory(editingExpense.category);
      setDate(editingExpense.date);
    } else {
      setTitle("");
      setAmount("");
      setCategory("");
      setDate("");
    }
  }, [editingExpense]);

  const handleSubmit = () => {
    if (!title || !amount || !category || !date) return;

    const expenseData = {
      title,
      amount: parseFloat(amount),
      category,
      date,
    };

    editingExpense
      ? onUpdate(editingExpense.id, expenseData)
      : onAdd(expenseData);

    onClose();
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={headerStyle}>
          <h2 style={{ margin: 0 }}>
            {editingExpense ? "Update Expense" : "Add Expense"}
          </h2>
          <button style={closeBtnStyle} onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Form Fields */}
        <div style={gridStyle}>
          <input
            type="text"
            placeholder="Expense Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={inputStyle}
          />

          <input
            type="number"
            placeholder="Amount (₹)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={inputStyle}
          />

          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={inputStyle}
          />

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* Submit Button */}
        <button style={submitBtnStyle} onClick={handleSubmit}>
          {editingExpense ? "Update Expense" : "Add Expense"}
        </button>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalStyle = {
  background: "#fff",
  width: "90%",
  maxWidth: "500px",
  padding: "30px",
  borderRadius: "12px",
  boxShadow: "0 15px 40px rgba(0,0,0,0.2)",
  animation: "fadeIn 0.2s ease-in-out",
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "20px",
};

const closeBtnStyle = {
  background: "transparent",
  border: "none",
  fontSize: "18px",
  cursor: "pointer",
};

const gridStyle = {
  display: "grid",
  gap: "15px",
  marginBottom: "20px",
};

const inputStyle = {
  padding: "12px",
  fontSize: "14px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  outline: "none",
};

const submitBtnStyle = {
  width: "100%",
  padding: "12px",
  fontSize: "15px",
  borderRadius: "8px",
  border: "none",
  background: "#6366f1",
  color: "#fff",
  cursor: "pointer",
};

export default ExpenseForm;