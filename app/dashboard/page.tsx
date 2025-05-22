'use client';

import { useEffect, useState } from "react";
import ExpenseList from "../components/ExpenseList";
import Link from "next/link"; 
// import ExpenseCharts from "../components/ExpenseCharts";

export default function HomePage() {
  const [expenses, setExpenses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [datePicker, setDatePicker] = useState("");
  
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
      "Health and Insurance",
      "Personal and Lifestyle",
      "Debt Payments",
      "Savings and Investments",
      "Education",
      "Children and Family",
      "Entertainment and Recreation",
      "Gifts and Donations",
      "Business Expenses"
    ];

  /**
   * Fetches expenses from the `/api/expenses` endpoint with an empty category filter,
   * parses the JSON response, and updates the expenses state using `setExpenses`.
   */
  const fetchExpenses = (searchQuery="") => {
    const queryParams = searchQuery ? `?name=${encodeURIComponent(searchQuery)}` : "";
    fetch(`/api/expenses${queryParams}`)
      .then(res => res.json())
      .then(data => setExpenses(data));
  };
//This code runs the fetchExpenses function once, right after the page loads.
  useEffect(() => {
    fetchExpenses();
  }, []);

  //   useEffect(() => {
  //   const timeout = setTimeout(() => {
  //     fetchExpenses(searchTerm);
  //   }, 300); // delay for smoother UX

  //   return () => clearTimeout(timeout); // debounce to avoid excessive calls
  // }, [searchTerm]);

  //This function runs every time the selected category changes. It fetches expense data for that category from the server and updates the list of expenses, while also logging the selected category to the console.
useEffect(() => {
  console.log("Selected Category:", searchTerm);
  
  const url = selectedCategory && selectedCategory !== "All"
    ? `/api/expenses?category=${encodeURIComponent(selectedCategory)}&search=${encodeURIComponent(searchTerm)}&date=${encodeURIComponent(datePicker)}`
    : `/api/expenses?search=${encodeURIComponent(searchTerm)}&date=${encodeURIComponent(datePicker)}`; 

  fetch(url)
    .then(res => res.json())
    .then(data => setExpenses(data));

  console.log("Selected Category:", selectedCategory);
}, [selectedCategory, searchTerm, datePicker]);

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
      <h1 className="text-2xl font-bold flex justify-center mb-10">Spenxo: Expense Tracking System</h1>
      <div className="flex justify-between items-center mb-5">
      <button
        className="btn btn-primary rounded-full"
        onClick={() => {
          const modal = document.getElementById('my_modal_1') as HTMLDialogElement | null;
          if (modal && typeof modal.showModal === 'function') {
            modal.showModal();
          }
        }}
      >
        ➕ Add Expense
      </button>

      <Link href="/dashboard/analytics">
        <button className="btn btn-primary rounded-full">
          View Analytics
        </button>
      </Link>
    </div>
      <div className="flex items-center gap-2 mb-4">
        <input
        type="text"
        placeholder="Search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pl-10 pr-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"        
        />
      </div>
        <input
        type="date"
        name="date"
        value={datePicker}
        onChange={(e) => setDatePicker(e.target.value)}
        className="border rounded px-2 py-1 text-sm mb-5"
        />

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
        />
        {/* <ExpenseCharts data={expenses} />      */}
    </main>

  );
}
