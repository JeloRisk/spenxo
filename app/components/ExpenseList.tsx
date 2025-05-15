import "./list.css";
import categoryStyles from "../assets/styles/categoryStyles";


interface ExpenseItem {
  type: "expense" | "budget";
  category_id: string;
  category?: string;
  expenseName?: string;
  date: string;
  amount: number;
}

interface ExpenseListProps {
  data: ExpenseItem[];
 // viewItem: (item: ExpenseItem) => void;
}

// function handleDelete(index: number) {
//   // Implement delete functionality here
//   console.log(`Delete item at index: ${index}`);
// }

// function handleEdit(item: ExpenseItem, index: number) {
// const handleDelete = async (id: string) => {
//   try {
//     const response = await fetch(`/api/expenses/delete/${id}`, {
//       method: "DELETE",
//     });

//     if (!response.ok) {
//       throw new Error("Failed to delete expense");
//     }

//     const data = await response.json();
//     console.log(data.message);
//   } catch (error) {
//     console.error("Error deleting expense:", error);
//   }
// }
// function handleEdit(item: ExpenseItem) {
// const handleEdit = async (item: ExpenseItem) => {
//   try {
//     const response = await fetch(`/api/expenses/update/${item.id}`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(item),
//     });

//     if (!response.ok) {
//       throw new Error("Failed to update expense");
//     }

//     const data = await response.json();
//     console.log(data);
//   } catch (error) {
//     console.error("Error updating expense:", error);
//   }
// }

function ExpenseList({data}: ExpenseListProps) {
  return (
    <div className="expense-list">
      {data.map((item, index) => {
        const category: { color?: string; icon?: string } =
          item.type === "expense"
            ? categoryStyles[item.category_id as keyof typeof categoryStyles] || {}
            : item.type === "budget"
            ? categoryStyles["budget"]
            : {};
        return (
          <div
            key={index}
            className="expense-item"
            style={{ borderLeftColor: category.color || "#ccc" }}
            // onClick={() => viewItem(item)}
          >
            <div className="expense-details">
              <div
                className="expense-icon-wrapper"
                style={{
                  backgroundColor: category.color || "#ccc",
                }}
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
                // onClick={() => handleEdit(item)}
                className="flex items-center gap-1 hover:bg-green-600 text-white text-sm font-medium py-1 px-3 rounded transition-colors duration-200"
              >
                ✏️ Edit
              </button>
              <button
                // onClick={() => handleDelete(item.id)}
                className="flex items-center gap-1 hover:bg-red-600 text-white text-sm font-medium py-1 px-3 rounded transition-colors duration-200"
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ExpenseList;
