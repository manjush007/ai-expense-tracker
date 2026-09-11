import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://localhost:8080/api/expenses";

const categories = [
  {
    name: "Food",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 3v7M4 3v7a3 3 0 0 0 3 3v8M10 3v7a3 3 0 0 1-3 3M16 3v18M16 3c0-4 2-6 4-6V3" />
      </svg>
    ),
  },
  {
    name: "Shopping",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 8h14l1 13H4L5 8Z" />
        <path d="M9 8a3 3 0 0 1 6 0" />
      </svg>
    ),
  },
  {
    name: "Transport",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 17h14l-1-8H6l-1 8Z" />
        <path d="M7 9l1.5-4h7L17 9" />
        <circle cx="8" cy="18" r="1.5" />
        <circle cx="16" cy="18" r="1.5" />
      </svg>
    ),
  },
  {
    name: "Entertainment",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m10 9 5 3-5 3V9Z" />
      </svg>
    ),
  },
  {
    name: "Bills",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M13 2 4 13h6l-1 9 9-11h-6l1-9Z" />
      </svg>
    ),
  },
  {
    name: "Health",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 21S4 16 4 9a4.5 4.5 0 0 1 8-2.7A4.5 4.5 0 0 1 20 9c0 7-8 12-8 12Z" />
        <path d="M9 11h6M12 8v6" />
      </svg>
    ),
  },
  {
    name: "Education",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m3 9 9-5 9 5-9 5-9-5Z" />
        <path d="M7 11v5c3 2 7 2 10 0v-5" />
        <path d="M21 9v6" />
      </svg>
    ),
  },
  {
    name: "Travel",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 14h18M5 14l2-8h3l2 8M19 14l-2-8h-3l-2 8" />
        <path d="M7 18h10M9 18v3M15 18v3" />
      </svg>
    ),
  },
  {
    name: "Other",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 10h18" />
        <path d="M7 15h3" />
      </svg>
    ),
  },
];

function App() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const [form, setForm] = useState({
    amount: "",
    category: "",
    date: "",
    description: "",
  });

  // ================================
  // FETCH EXPENSES
  // ================================

  const fetchExpenses = async () => {
    try {
      setError("");

      const response = await axios.get(API_URL);
      setExpenses(response.data);
    } catch (err) {
      console.error(err);
      setError("Unable to connect to the Spring Boot backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // ================================
  // FORM HANDLING
  // ================================

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setError("");
    setSuccess("");
  };

  const selectCategory = (category) => {
    setForm({
      ...form,
      category,
    });

    setError("");
    setSuccess("");
  };

  // ================================
  // ADD EXPENSE
  // ================================

  const addExpense = async (e) => {
    e.preventDefault();

    if (!form.amount || Number(form.amount) <= 0) {
      setError("Enter an amount greater than ₹0 to continue.");
      return;
    }

    if (!form.category) {
      setError("Please select a category.");
      return;
    }

    if (!form.date) {
      setError("Please select a date.");
      return;
    }

    if (!form.description.trim()) {
      setError("Please enter a description.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      await axios.post(API_URL, {
        amount: Number(form.amount),
        category: form.category,
        date: form.date,
        description: form.description,
      });

      setForm({
        amount: "",
        category: "",
        date: "",
        description: "",
      });

      setSuccess("Expense added successfully.");

      await fetchExpenses();

      setTimeout(() => {
        setSuccess("");
      }, 2500);
    } catch (err) {
      console.error(err);
      setError("Could not add the expense. Check your backend.");
    } finally {
      setSubmitting(false);
    }
  };

  // ================================
  // DELETE EXPENSE
  // ================================

  const deleteExpense = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this expense?"
    );

    if (!confirmed) return;

    try {
      setError("");

      await axios.delete(`${API_URL}/${id}`);

      await fetchExpenses();
    } catch (err) {
      console.error(err);
      setError("Could not delete the expense.");
    }
  };

  // ================================
  // DASHBOARD CALCULATIONS
  // ================================

  const totalExpenses = expenses.reduce(
    (total, expense) => total + Number(expense.amount),
    0
  );

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyExpenses = expenses
    .filter((expense) => {
      const date = new Date(expense.date);

      return (
        date.getMonth() === currentMonth &&
        date.getFullYear() === currentYear
      );
    })
    .reduce((total, expense) => total + Number(expense.amount), 0);

  const highestExpense =
    expenses.length > 0
      ? Math.max(...expenses.map((expense) => Number(expense.amount)))
      : 0;

  // ================================
  // SEARCH + FILTER
  // ================================

  const filteredExpenses = expenses.filter((expense) => {
    const searchValue = searchTerm.trim().toLowerCase();

    const matchesCategory =
      categoryFilter === "All" ||
      expense.category === categoryFilter;

    const matchesSearch =
      !searchValue ||
      expense.description.toLowerCase().includes(searchValue) ||
      expense.category.toLowerCase().includes(searchValue);

    return matchesCategory && matchesSearch;
  });

  // ================================
  // CATEGORY ICON
  // ================================

  const getCategoryIcon = (category) => {
    const found = categories.find(
      (item) => item.name === category
    );

    return found
      ? found.icon
      : categories[categories.length - 1].icon;
  };

  return (
    <div className="app">

      {/* HEADER */}

      <header className="dashboard-header">

        <div className="brand">

          <div className="brand-icon">
            <svg viewBox="0 0 24 24">
              <path d="M3 6h18v13H3z" />
              <path d="M3 10h18" />
              <path d="M7 15h4" />
            </svg>
          </div>

          <div>
            <h1>Expense Tracker</h1>
            <p>Smart spending. Better decisions.</p>
          </div>

        </div>

      </header>

      {/* MESSAGES */}

      {error && (
        <div className="message error-message">
          <span>!</span>
          {error}
        </div>
      )}

      {success && (
        <div className="message success-message">
          <span>✓</span>
          {success}
        </div>
      )}

      {/* STATISTICS */}

      <section className="stats-grid">

        <div className="stat-card">
          <div className="stat-icon blue-icon">
            <span>₹</span>
          </div>

          <div className="stat-content">
            <span>Total Expenses</span>
            <strong>
              ₹{totalExpenses.toLocaleString("en-IN")}
            </strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon light-blue-icon">
            <span>◷</span>
          </div>

          <div className="stat-content">
            <span>This Month</span>
            <strong>
              ₹{monthlyExpenses.toLocaleString("en-IN")}
            </strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon blue-icon">
            <span>▤</span>
          </div>

          <div className="stat-content">
            <span>Transactions</span>
            <strong>{expenses.length}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon dark-blue-icon">
            <span>↗</span>
          </div>

          <div className="stat-content">
            <span>Highest Expense</span>
            <strong>
              ₹{highestExpense.toLocaleString("en-IN")}
            </strong>
          </div>
        </div>

      </section>

      {/* ADD EXPENSE */}

      <section className="section">

        <div className="section-heading">

          <div>
            <div className="section-title-row">
              <span className="section-number">01</span>
              <h2>Add New Expense</h2>
            </div>

            <p>
              Record your spending and keep your finances organized.
            </p>
          </div>

        </div>

        <form onSubmit={addExpense} className="expense-form">

          {/* AMOUNT */}

          <div className="input-group">

            <label>Amount</label>

            <div className="input-wrapper">

              <span className="currency-symbol">₹</span>

              <input
                type="number"
                name="amount"
                placeholder="0.00"
                value={form.amount}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
              />

            </div>

          </div>

          {/* DATE */}

          <div className="input-group">

            <label>Date</label>

            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
            />

          </div>

          {/* CATEGORY */}

          <div className="input-group category-group">

            <label>Category</label>

            <div className="category-grid">

              {categories.map((category) => (

                <button
                  type="button"
                  key={category.name}
                  className={`category-button ${
                    form.category === category.name
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    selectCategory(category.name)
                  }
                  aria-pressed={
                    form.category === category.name
                  }
                >

                  <span className="category-icon">
                    {category.icon}
                  </span>

                  <span className="category-name">
                    {category.name}
                  </span>

                  {form.category === category.name && (
                    <span className="selected-check">
                      ✓
                    </span>
                  )}

                </button>

              ))}

            </div>

          </div>

          {/* DESCRIPTION */}

          <div className="input-group">

            <label>Description</label>

            <input
              type="text"
              name="description"
              placeholder="e.g. Lunch with friends"
              value={form.description}
              onChange={handleChange}
              required
            />

          </div>

          {/* ADD BUTTON */}

          <button
            type="submit"
            className="add-button"
            disabled={submitting}
          >

            {submitting ? (
              <>
                <span className="button-spinner"></span>
                Adding Expense...
              </>
            ) : (
              <>
                <span className="plus-icon">＋</span>
                Add Expense
              </>
            )}

          </button>

        </form>

      </section>

      {/* RECENT EXPENSES */}

      <section className="section expenses-section">

        <div className="section-heading">

          <div>

            <div className="section-title-row">
              <span className="section-number">02</span>
              <h2>Recent Expenses</h2>
            </div>

            <p>Your latest transactions.</p>

          </div>

          <div className="transaction-count">
            {filteredExpenses.length}{" "}
            {filteredExpenses.length === 1
              ? "transaction"
              : "transactions"}
          </div>

        </div>

        {/* SEARCH */}

        <div className="expense-tools">

          <label className="search-field">

            <svg viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="6" />
              <path d="m16 16 4 4" />
            </svg>

            <input
              type="search"
              placeholder="Search expenses"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
            />

          </label>

          <select
            className="category-filter"
            value={categoryFilter}
            onChange={(event) =>
              setCategoryFilter(event.target.value)
            }
          >

            <option value="All">
              All categories
            </option>

            {categories.map((category) => (
              <option
                key={category.name}
                value={category.name}
              >
                {category.name}
              </option>
            ))}

          </select>

          {(searchTerm ||
            categoryFilter !== "All") && (

            <button
              type="button"
              className="clear-filters"
              onClick={() => {
                setSearchTerm("");
                setCategoryFilter("All");
              }}
            >
              Clear
            </button>

          )}

        </div>

        {/* EXPENSE STATES */}

        {loading ? (

          <div className="empty-state">
            <div className="loading-spinner"></div>
            <p>Loading expenses...</p>
          </div>

        ) : expenses.length === 0 ? (

          <div className="empty-state">

            <div className="empty-icon">
              <svg viewBox="0 0 24 24">
                <path d="M4 4h16v16H4z" />
                <path d="M8 8h8M8 12h8M8 16h5" />
              </svg>
            </div>

            <h3>No expenses yet</h3>

            <p>
              Add your first expense above to get started.
            </p>

          </div>

        ) : filteredExpenses.length === 0 ? (

          <div className="empty-state">

            <div className="empty-icon">
              <svg viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="6" />
                <path d="m16 16 4 4" />
              </svg>
            </div>

            <h3>No matching expenses</h3>

            <p>
              Try a different search or category filter.
            </p>

          </div>

        ) : (

          <div className="expense-list">

            {filteredExpenses.map((expense) => (

              <div
                className="expense-card"
                key={expense.id}
              >

                <div className="expense-icon">
                  {getCategoryIcon(expense.category)}
                </div>

                <div className="expense-details">

                  <div className="expense-top">

                    <div>

                      <h3>
                        {expense.description}
                      </h3>

                      <span className="category-badge">
                        {expense.category}
                      </span>

                    </div>

                    <strong className="expense-amount">
                      ₹
                      {Number(
                        expense.amount
                      ).toLocaleString("en-IN")}
                    </strong>

                  </div>

                  <div className="expense-bottom">

                    <span className="expense-date">

                      <svg viewBox="0 0 24 24">
                        <rect
                          x="3"
                          y="4"
                          width="18"
                          height="17"
                          rx="2"
                        />
                        <path d="M7 2v4M17 2v4M3 9h18" />
                      </svg>

                      {expense.date}

                    </span>

                    <button
                      className="delete-button"
                      onClick={() =>
                        deleteExpense(expense.id)
                      }
                    >

                      <svg viewBox="0 0 24 24">
                        <path d="M4 7h16M10 11v6M14 11v6M6 7l1 14h10l1-14M9 7V4h6v3" />
                      </svg>

                      Delete

                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </section>

      {/* FOOTER */}

      <footer>

        <div className="footer-brand">
          <span className="footer-dot"></span>
          AI Expense Tracker
        </div>

        <span>
      
        </span>

      </footer>

    </div>
  );
}

export default App;