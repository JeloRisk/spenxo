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


  const fetchExpenses = () => {
    fetch("/api/expenses")
      .then(res => res.json())
      .then(data => setExpenses(data));
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

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
      <h1 className="text-2xl font-bold mb-4">Spenxo: Expense Tracking System</h1>
      <button
        className="btn btn-primary"
        onClick={() => {
          const modal = document.getElementById('my_modal_1') as HTMLDialogElement | null;
          if (modal && typeof modal.showModal === 'function') {
            modal.showModal();
          }
        }}
      >
        Add Expense
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
              placeholder="Expense Name (Optional)"
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
            <input
              type="text"
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="Category (e.g., travel, food)"
              className="w-full border px-3 py-2 rounded"
            />
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

      

<dialog id="my_modal_1" className="modal">
  <div className="modal-box">
      <form onSubmit={handleSubmit} className="space-y-2 mb-6 border p-4 rounded">
        <input
          type="text"
          name="expenseName"
          value={form.expenseName}
          onChange={handleChange}
          placeholder="Expense Name (Optional)"
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
        <input
          type="text"
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Category (e.g., travel, food)"
          className="w-full border px-3 py-2 rounded"
        />
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
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          Add Expense
        </button> 
        <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded">
          Cancel
        </button> 
      </form>
      </div>
      </dialog>

      {/* <ul className="space-y-2">
        {expenses.map((exp: any) => (
          <li key={exp._id} className="border p-2 rounded">
            <div className="font-medium">
              {exp.expenseName} — ${exp.amount.toFixed(2)}
            </div>
            <div className="text-sm text-gray-600">
              {exp.category} | {new Date(exp.date).toLocaleDateString()}
            </div>
            {exp.description && (
              <p className="text-xs italic text-gray-500 mt-1">{exp.description}</p>
            )}
          </li>
        ))}
      </ul> */}
                  {expenses.length != 0 ? (
                      // create newe component
                      <ExpenseList
                          data={expenses}
                          // viewItem={handleView}
                          onUpdate={fetchExpenses}
                      ></ExpenseList>
                  ) : (
                      <div>Loading...</div>
                  )}
    </main>
  );
}
