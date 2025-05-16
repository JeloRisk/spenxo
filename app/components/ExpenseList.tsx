import "./list.css";
import categoryStyles from "../assets/styles/categoryStyles";
import React, { useState, useEffect } from "react";
import Swal from 'sweetalert2';

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
  onUpdate:() => void; // Optional callback to update parent state
  onSendCategory?: (category: string) => void; // Optional callback to send category
  category?: string; // Optional category prop
}

function ExpenseList({ data, onDelete, onEdit, onUpdate, onSendCategory, category }: ExpenseListProps) {
  const [editingItem, setEditingItem] = useState<ExpenseItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  

  // dropdown filter
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
useEffect(() => {
  if (onSendCategory) {
    onSendCategory(selectedCategory);
  }
}, [selectedCategory, onSendCategory]);

  // useEffect(() => {
  //   fetch("/api/expenses")
  //     .then((res) => res.json())
  //     .then((data) => setExpenses(data));
  // }, []);
  
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
        onUpdate();
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
      onUpdate();
      (document.getElementById("edit_modal") as HTMLDialogElement)?.close();
      if (onEdit) onEdit(result);
    } catch (error) {
    }

    // Removed invalid hook and categories logic from here

    
  };

  return (
    <>
       {/* Filter Dropdown */}
      <div className="filter-section mb-4">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="All">All Category</option>
          {categories.map((cat) => (
        <option key={cat} value={cat}>
          {cat}
        </option>
          ))}
        </select>
      </div>
      <div className="expense-list">
              {data
          // .filter(
          //   (item) =>
          //     selectedCategory === "All" ||
          //     (item.category && item.category === selectedCategory)
          // )
    .map((item) => {
          const category: { color?: string; icon?: string } =
            item.type === "expense"
              ? categoryStyles[item.category_id as keyof typeof categoryStyles] || {}
              : item.type === "budget"
              ? categoryStyles["budget"]
              : {};
              // Format the date
              const formattedDate = item.date ? new Date(item.date).toLocaleString("en-US", {
              weekday: "short",
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true
            }) : "No date";
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
                    <div className="text-sm text-gray-600">
                      {item.category} | {formattedDate}
                    </div>
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
                  onClick={() => {
                    Swal.fire({
                      title: 'Are you sure?',
                      icon: 'warning',
                      showCancelButton: true,
                      confirmButtonColor: '#d33',
                      cancelButtonColor: '#3085d6',
                      confirmButtonText: 'Yes!',
                    }).then((result) => {
                      if (result.isConfirmed) {
                        handleDelete(item._id);
                        Swal.fire('Item deleted successfully!');
                      }
                    });
                  }}
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
      <dialog id="edit_modal" className="modal">
  <div className="modal-box">
    <form
      onSubmit={(e) => {
        e.preventDefault();
        saveEdit();
      }}
      className="space-y-2 mb-6 border p-4 rounded"
    >
      <input
        type="text"
        placeholder="Expense Name (Optional)"
        value={editingItem?.expenseName || ""}
        onChange={(e) =>
          setEditingItem({ ...editingItem!, expenseName: e.target.value })
        }
        className="w-full border px-3 py-2 rounded"
      />

      <input
        type="number"
        placeholder="Amount"
        value={editingItem?.amount || ""}
        onChange={(e) =>
          setEditingItem({ ...editingItem!, amount: Number(e.target.value) })
        }
        className="w-full border px-3 py-2 rounded"
      />

      <select
        name="category"
        value={editingItem?.category || ""}
        onChange={(e) =>
          setEditingItem({ ...editingItem!, category: e.target.value })
        }
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
        value={editingItem?.date.split("T")[0] || ""}
        onChange={(e) =>
          setEditingItem({ ...editingItem!, date: e.target.value })
        }
        className="w-full border px-3 py-2 rounded"
      />

      <textarea
        placeholder="Description (optional)"
        value={editingItem?.description || ""}
        onChange={(e) =>
          setEditingItem({ ...editingItem!, description: e.target.value })
        }
        className="w-full border px-3 py-2 rounded"
      />

      <div className="flex gap-3">
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Save
        </button>
        <button
          type="button"
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          onClick={() =>
            (document.getElementById("edit_modal") as HTMLDialogElement)?.close()
          }
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
</dialog>
    </>
  );    
}
export default ExpenseList;
