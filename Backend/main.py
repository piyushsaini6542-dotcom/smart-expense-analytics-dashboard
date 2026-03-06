from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
from datetime import date, datetime
from collections import defaultdict

app = FastAPI()

# CORS Configuration
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------------

class Expense(BaseModel):
    id: Optional[int] = None
    title: str
    amount: float
    category: str
    date: date


class Budget(BaseModel):
    category: str
    limit: float


expenses: List[dict] = []
budgets = {}
current_id = 1

# ----------------------------
# Expense Endpoints
# ----------------------------

@app.get("/expenses")
def get_expenses():
    return expenses


@app.post("/add-expense")
def add_expense(expense: Expense):
    global current_id

    expense_dict = expense.dict()
    expense_dict["id"] = current_id
    current_id += 1

    expenses.append(expense_dict)
    return expense_dict


@app.delete("/delete-expense/{expense_id}")
def delete_expense(expense_id: int):
    global expenses
    expenses = [e for e in expenses if e["id"] != expense_id]
    return {"message": "Expense deleted successfully"}


@app.put("/update-expense/{expense_id}")
def update_expense(expense_id: int, updated_expense: Expense):
    for index, expense in enumerate(expenses):
        if expense["id"] == expense_id:
            updated_dict = updated_expense.dict()
            updated_dict["id"] = expense_id
            expenses[index] = updated_dict
            return updated_dict

    return {"error": "Expense not found"}


# ----------------------------
# Budget Endpoint
# ----------------------------

@app.post("/set-budget")
def set_budget(budget: Budget):
    budgets[budget.category.lower()] = budget.limit
    return {"message": "Budget set successfully"}


# ----------------------------
# Analytics Endpoint
# ----------------------------

@app.get("/analytics")
def get_analytics():
    category_totals = defaultdict(float)
    weekend_total = 0
    weekday_total = 0

    for exp in expenses:
        category = exp["category"].lower()
        amount = exp["amount"]
        category_totals[category] += amount

        exp_date = exp["date"]

        # Convert to datetime if needed
        if isinstance(exp_date, str):
            exp_date = datetime.strptime(exp_date, "%Y-%m-%d")
        else:
            exp_date = datetime.combine(exp_date, datetime.min.time())

        if exp_date.weekday() >= 5:
            weekend_total += amount
        else:
            weekday_total += amount

    top_category = max(category_totals, key=category_totals.get) if category_totals else None

    over_budget = []
    budget_vs_actual = {}

    for category, total in category_totals.items():
        limit = budgets.get(category, 0)
        budget_vs_actual[category] = {
            "spent": total,
            "limit": limit,
            "remaining": limit - total
        }

        if limit and total > limit:
            over_budget.append(category)

    weekend_spike = weekend_total > weekday_total

    recommendation = None

    if over_budget:
        recommendation = f"You exceeded budget in: {', '.join(over_budget)}."
    elif weekend_spike:
        recommendation = "Your weekend spending is higher than weekdays. Consider reducing weekend expenses."
    elif top_category:
        recommendation = f"Most of your spending is in {top_category}. Monitor this category closely."

    return {
        "top_category": top_category,
        "weekend_total": weekend_total,
        "weekday_total": weekday_total,
        "weekend_spike": weekend_spike,
        "budget_analysis": budget_vs_actual,
        "recommendation": recommendation
    }