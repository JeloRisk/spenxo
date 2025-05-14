import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import { Expense } from "@/models/Expense";

// method 
export async function GET() {
  await connectToDB();
  const expenses = await Expense.find({}).sort({ date: -1 });
  return NextResponse.json(expenses);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  await connectToDB();
  const expense = await Expense.create(body);
  return NextResponse.json(expense, { status: 201 });
}
