'use client';

import { useEffect, useState } from "react";
import ExpenseList from "../components/ExpenseList";

export default function HomePage() {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({
    expenseName: "",
    amount: "",
    category: "",
    date: "",
    description: ""
  });
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const categories = [
  "Housing",
  "Transportation",
  "Food",
  "Health & Insurance",
  "Personal & Lifestyle",
  "Debt Payments",
  "Savings & Investments",
  "Education",
  "Children & Family",
  "Entertainment & Recreation",
  "Gifts & Donations",
  "Business Expenses"
];

  /**
   * Fetches expenses from the `/api/expenses` endpoint with an empty category filter,
   * parses the JSON response, and updates the expenses state using `setExpenses`.
   */
  const fetchExpenses = () => {
    fetch("/api/expenses?category=")
      .then(res => res.json())
      .then(data => setExpenses(data));
  };
//This code runs the fetchExpenses function once, right after the page loads.
  useEffect(() => {
    fetchExpenses();
  }, []);

  //This function runs every time the selected category changes. It fetches expense data for that category from the server and updates the list of expenses, while also logging the selected category to the console.
useEffect(() => {
  const url = selectedCategory && selectedCategory !== "All"
    ? `/api/expenses?category=${selectedCategory}`
    : "/api/expenses";

  fetch(url)
    .then(res => res.json())
    .then(data => setExpenses(data));

  console.log("Selected Category:", selectedCategory);
}, [selectedCategory]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.category || !form.date || !form.amount) return alert("Date and amount are required");
    const response = await fetch("/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        amount: parseFloat(form.amount),
        date: form.date || new Date().toISOString()
      }),
    });
    if (response.ok) {
      setForm({ expenseName: "", amount: "", category: "", date: "", description: "" });
      fetchExpenses();
      const modal = document.getElementById("my_modal_1") as HTMLDialogElement;
      modal?.close();
    } else {
      alert("Failed to add expense.");
    }
  };


  return (
    <main className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold flex justify-center mt-5">Spenxo: Expense Tracking System</h1>
      <button
        className="btn btn-primary rounded-full mt-5 mb-5"
        onClick={() => {
          const modal = document.getElementById('my_modal_1') as HTMLDialogElement | null;
          if (modal && typeof modal.showModal === 'function') {
            modal.showModal();
          }
        }}
      >
        ➕ Add Expense
      </button>

      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <form
            onSubmit={handleSubmit}
            className="space-y-2 mb-6 border p-4 rounded"
          >
            <input
              type="text"
              name="expenseName"
              value={form.expenseName}
              onChange={handleChange}
              placeholder="Expense Name"
              className="w-full border px-3 py-2 rounded"
            />
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              placeholder="Amount"
              className="w-full border px-3 py-2 rounded"
            />
            <select
              name="category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full border px-3 py-2 rounded"
              required
            >
              <option value="" disabled hidden>
                Select Category
              </option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description (optional)"
              className="w-full border px-3 py-2 rounded"
            />
            <div className="flex gap-2">
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
                Add Expense
              </button>
              <button
                type="button"
                className="bg-red-600 text-white px-4 py-2 rounded"
                onClick={() => {
                  setForm({
                    expenseName: "",
                    amount: "",
                    category: "",
                    date: "",
                    description: ""
                  }); // Reset form to initial state
                  const modal = document.getElementById('my_modal_1') as HTMLDialogElement | null;
                  if (modal && typeof modal.close === 'function') {
                    modal.close();
                  }
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </dialog>
        <ExpenseList
        data={expenses}
        // viewItem={handleView}
          onUpdate={fetchExpenses}
          onSendCategory={(newCategory: string) => {
          setSelectedCategory(newCategory); }}
            category={selectedCategory}
        ></ExpenseList>                     
                  {/* {expenses.length != 0 ? (
                      // create newe component
                      <ExpenseList
                          data={expenses}
                          // viewItem={handleView}
                          onUpdate={fetchExpenses}
                          onSendCategory={(newCategory: string) => {
                              setSelectedCategory(newCategory);
                          }}
                          category={selectedCategory}
                      ></ExpenseList>
                  ) : (
                    <div className="flex justify-center mt-24">
                    <span className="loading loading-dots loading-xl"></span>
                  </div>
                  )} */}
    </main>
  );
}
