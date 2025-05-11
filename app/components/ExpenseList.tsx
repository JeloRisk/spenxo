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

function ExpenseList({ data }: ExpenseListProps) {
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
          </div>
        );
      })}
    </div>
  );
}

export default ExpenseList;
