import "./list.css";
import categoryStyles from "../assets/styles/categoryStyles";
import React, { useState } from "react";

// Inside your component:



interface ExpenseItem {
  _id: string;
  type: "expense" | "budget";
  category_id: string;
  category?: string;
  expenseName?: string;
  date: string;
  amount: number;
  description?: string;
}

interface ExpenseListProps {
  data: ExpenseItem[];
  onDelete?: (id: string) => void; // Optional callback to update parent state
  // onEdit?: (item: ExpenseItem) => void; // You can add this if you want to enable editing
  onEdit?: (id: string) => void; // Optional callback to update parent state
}

function ExpenseList({ data, onDelete, onEdit }: ExpenseListProps) {
  const [editingItem, setEditingItem] = useState<ExpenseItem | null>(null);
  
  const handleDelete = (id: string) => {
    fetch(`/api/expenses/delete/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete expense");
        }
        return response.json();
      })
      .then((res) => {
        console.log(res.message || "Expense deleted");
        if (onDelete) onDelete(id); // Notify parent to remove item from state
      })
      .catch((error) => {
        console.error("Error deleting expense:", error);
      });
  };



  const openEditModal = (item: ExpenseItem) => {
    setEditingItem(item);
    const modal = document.getElementById("edit_modal") as HTMLDialogElement;
    if (modal) modal.showModal();
  };

  const saveEdit = async () => {
    if (!editingItem) return;

    try {
      const response = await fetch(`/api/expenses/update/${editingItem._id}`, {
        method: "PUT", // Use PUT for updating
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingItem),
      });

      if (!response.ok) {
        throw new Error("Update failed");
      }

      const result = await response.json();
      console.log("Updated:", result);
      (document.getElementById("edit_modal") as HTMLDialogElement)?.close();
      if (onEdit) onEdit(editingItem._id);
    } catch (error) {
      console.error("Error editing expense:", error);
    }
  };
   

  return (
    <>
      <div className="expense-list">
        {data.map((item) => {
          const category: { color?: string; icon?: string } =
            item.type === "expense"
              ? categoryStyles[item.category_id as keyof typeof categoryStyles] || {}
              : item.type === "budget"
              ? categoryStyles["budget"]
              : {};

          return (
            <div
              key={item._id}
              className="expense-item"
              style={{ borderLeftColor: category.color || "#ccc" }}
            >
              <div className="expense-details">
                <div
                  className="expense-icon-wrapper"
                  style={{ backgroundColor: category.color || "#ccc" }}
                >
                  {category.icon && (
                    <img
                      src={category.icon}
                      alt={`${item.category} Icon`}
                      className="expense-icon"
                    />
                  )}
                </div>
                <div className="expense-info">
                  <div className="leftmost">
                    <div className="expense-name">
                      {item.expenseName || item.category || item.type}
                    </div>
                    <div className="expense-date">{item.date}</div>
                  </div>
                  <div className="expense-amount">₱{item.amount}</div>
                </div>
              </div>
              <div className="expense-item-buttons mt-2 flex gap-2 justify-end">
                  <button
                  onClick={() => openEditModal(item)}
                  className="flex items-center gap-1 hover:bg-green-600 text-white text-sm font-medium py-1 px-3 rounded transition-colors duration-200"
                >
                  ✏️ Edit
                </button>

                <button
                  onClick={() => handleDelete(item._id)}
                  className="flex items-center gap-1 hover:bg-red-600 text-white text-sm font-medium py-1 px-3 rounded transition-colors duration-200"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {/* Edit Modal */}
      <dialog id="edit_modal" className="bg-transparent border-none p-0">
  <form
    className="bg-white border border-gray-300 rounded-md p-6 w-80 flex flex-col gap-4"
    onSubmit={(e) => {
      e.preventDefault();
      saveEdit();
    }}
  >
    <input
      type="text"
      placeholder="Expense Name (Optional)"
      value={editingItem?.expenseName || ""}
      onChange={(e) =>
        setEditingItem({ ...editingItem!, expenseName: e.target.value })
      }
      className="border border-gray-300 rounded px-3 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
    />

    <input
      type="number"
      placeholder="Amount"
      value={editingItem?.amount || ""}
      onChange={(e) =>
        setEditingItem({ ...editingItem!, amount: Number(e.target.value) })
      }
      className="border border-gray-300 rounded px-3 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
    />

    <input
      type="text"
      placeholder="Category (e.g., travel, food)"
      value={editingItem?.category || ""}
      onChange={(e) =>
        setEditingItem({ ...editingItem!, category: e.target.value })
      }
      className="border border-gray-300 rounded px-3 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
    />

    <input
      type="date"
      value={editingItem?.date.split("T")[0] || ""}
      onChange={(e) =>
        setEditingItem({ ...editingItem!, date: e.target.value })
      }
      className="border border-gray-300 rounded px-3 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
    />

    <textarea
      placeholder="Description (optional)"
      value={editingItem?.description || ""}
      onChange={(e) =>
        setEditingItem({ ...editingItem!, description: e.target.value })
      }
      className="border border-gray-300 rounded px-3 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 resize-y min-h-[60px]"
    />

    <div className="flex gap-3">
      <button
        type="submit"
        className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors"
      >
        Save
      </button>
      <button
        type="button"
        className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors"
        onClick={() =>
          (document.getElementById("edit_modal") as HTMLDialogElement)?.close()
        }
      >
        Cancel
      </button>
    </div>
  </form>
</dialog>
    </>
  );    
}
export default ExpenseList;
