import mongoose from "mongoose";

const ExpenseSchema = new mongoose.Schema({
  expenseName: String,
  amount: Number,
  category: String,
  date: { type: Date, default: Date.now },
  description: String
},{timestamps: true });

export const Expense = mongoose.models.Expense || mongoose.model("Expense", ExpenseSchema);