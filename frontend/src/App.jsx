import { useState, useEffect } from "react";
import axios from "axios";
import ExpenseForm from "./components/ExpenseForm";
import SummaryCards from "./components/SummaryCards";
import CategoryPieChart from "./components/CategoryPieChart";
import MonthlyLineChart from "./components/MonthlyLineChart";
import ExpenseTable from "./components/ExpenseTable";
import AnalyticsDashboard from "./components/AnalyticsDashboard";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [monthlyBudget, setMonthlyBudget] = useState(20000);
  const [budgetInput, setBudgetInput] = useState(20000);
  const [budgetMessage, setBudgetMessage] = useState("");

  const API_URL = "https://smart-expense-analytics-dashboard.onrender.com";

  const handleSaveBudget = () => {
    const newBudget = Number(budgetInput);
    setMonthlyBudget(newBudget);
    setBudgetMessage(`Your monthly budget is set to ₹${newBudget}`);
  };

  const fetchExpenses = async () => {
    try {
      const res = await axios.get(`${API_URL}/expenses`);
      setExpenses(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const addExpense = async (expense) => {
    try {
      await axios.post(`${API_URL}/add-expense`, expense);
      setShowForm(false);
      fetchExpenses();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteExpense = async (id) => {
    try {
      await axios.delete(`${API_URL}/delete-expense/${id}`);
      fetchExpenses();
    } catch (error) {
      console.error(error);
    }
  };

  const updateExpense = async (id, updatedData) => {
    try {
      await axios.put(`${API_URL}/update-expense/${id}`, updatedData);
      setEditingExpense(null);
      setShowForm(false);
      fetchExpenses();
    } catch (error) {
      console.error(error);
    }
  };

  const filteredExpenses = selectedMonth
    ? expenses.filter((e) => e.date.startsWith(selectedMonth))
    : expenses;

  const uniqueMonths = [
    ...new Set(expenses.map((e) => e.date.slice(0, 7))),
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        padding: "clamp(20px, 5vw, 50px) clamp(12px, 4vw, 20px)", // ✅ responsive padding
        boxSizing: "border-box",
        overflowX: "hidden",   // ✅ kills sideways page scroll on mobile
      }}
    >
      <div style={{ width: "100%", maxWidth: "1100px" }}>

        {/* Header */}
        <div style={{ marginBottom: "clamp(20px, 5vw, 40px)" }}>
          <h1
            style={{
              fontSize: "clamp(24px, 6vw, 42px)",   // ✅ responsive font
              fontWeight: "800",
              letterSpacing: "-1px",
              color: "#0f172a",
              lineHeight: "1.1",
              marginBottom: "12px",
            }}
          >
            Smart Expense Tracker{" "}
            <span style={{ color: "#6366f1" }}>Dashboard</span>
          </h1>

          <p
            style={{
              fontSize: "clamp(14px, 3vw, 17px)",   // ✅ responsive font
              color: "#475569",
            }}
          >
            Track, analyze and manage your expenses efficiently.
          </p>
        </div>

        {/* Budget Control */}
        <div
          style={{
            marginTop: "25px",
            marginBottom: "30px",
            background: "#ffffff",
            padding: "18px",
            borderRadius: "10px",
            boxShadow: "0 6px 18px rgba(0,0,0,0.05)",
            maxWidth: "420px",
            boxSizing: "border-box",   // ✅ fix
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <span style={{ fontWeight: "600", color: "#0f172a" }}>
              💰 Monthly Budget
            </span>

            <input
              type="number"
              value={budgetInput}
              onChange={(e) => setBudgetInput(e.target.value)}
              style={{
                padding: "6px 10px",
                borderRadius: "6px",
                border: "1px solid #cbd5e1",
                width: "120px",
              }}
            />

            <button
              onClick={handleSaveBudget}
              style={{
                padding: "6px 12px",
                borderRadius: "6px",
                border: "none",
                background: "#6366f1",
                color: "#fff",
                fontWeight: "500",
                cursor: "pointer",
              }}
            >
              Update
            </button>
          </div>

          {budgetMessage && (
            <p
              style={{
                marginTop: "10px",
                fontSize: "13px",
                color: "#16a34a",
                fontWeight: "500",
              }}
            >
              {budgetMessage}
            </p>
          )}
        </div>

        {/* Summary Cards */}
        <div style={{ marginBottom: "50px" }}>
          <SummaryCards expenses={filteredExpenses} />
        </div>

        {/* Analytics */}
        <AnalyticsDashboard
          expenses={filteredExpenses}
          monthlyBudget={monthlyBudget}
        />

        {/* Charts — FIXED for mobile */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",  // ✅ 280px instead of 350px
            gap: "25px",
            marginBottom: "60px",
          }}
        >
          <CategoryPieChart expenses={filteredExpenses} />
          <MonthlyLineChart expenses={filteredExpenses} />
        </div>

        {/* Add Expense Button */}
        <div style={{ marginBottom: "20px" }}>
          <button
            onClick={() => {
              setEditingExpense(null);
              setShowForm(!showForm);
            }}
            style={{
              padding: "12px 20px",
              borderRadius: "8px",
              border: "none",
              background: "#6366f1",
              color: "#fff",
              fontWeight: "600",
              cursor: "pointer",
              boxShadow: "0 6px 15px rgba(99, 102, 241, 0.3)",
            }}
          >
            {showForm ? "Close Form" : "+ Add Expense"}
          </button>
        </div>

        {/* Expense Form */}
        {showForm && (
          <ExpenseForm
            onAdd={addExpense}
            editingExpense={editingExpense}
            onUpdate={updateExpense}
            onClose={() => {
              setShowForm(false);
              setEditingExpense(null);
            }}
          />
        )}

        {/* Month Filter */}
        <div style={{ marginBottom: "20px" }}>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            style={{
              padding: "8px 12px",
              borderRadius: "6px",
              border: "1px solid #cbd5e1",
              background: "#fff",
            }}
          >
            <option value="">All Months</option>
            {uniqueMonths.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>

        {/* Expense Table */}
        <ExpenseTable
          expenses={filteredExpenses}
          onDelete={deleteExpense}
          onEdit={(expense) => {
            setEditingExpense(expense);
            setShowForm(true);
          }}
        />
      </div>
    </div>
  );
}

export default App;
