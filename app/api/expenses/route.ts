import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import { Expense } from "@/models/Expense";
// get all expenses

// put specific expense by id
// delete specific expense by id
// method

// without dynamic filtering
// export async function GET() {
//   await connectToDB();
//   const expenses = await Expense.find({}).sort({ date: -1 });
//   return NextResponse.json(expenses);
// }

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") || undefined;
  const expenseName = searchParams.get("expenseName") || undefined;
  const date = searchParams.get("date") || undefined;
  const search = searchParams.get("search") || undefined;


  await connectToDB();

  // Build filter object dynamically
  const filter: any = {}; 
  if (category) filter.category = category;
  if (expenseName) filter.expenseName = expenseName;
  if (date) filter.date = date;
  if (search) {
    filter.$or = [
      { expenseName: { $regex: search, $options: "i" } },
      { category: { $regex: search, $options: "i" } },
    ];
  }

  const expenses = await Expense.find(filter).sort({ date: -1 });

  return NextResponse.json(expenses);
}

// get specific expense by id
export async function GET_BY_ID(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  await connectToDB();
  const expense = await Expense.findById(id);

  if (!expense) {
    return NextResponse.json({ error: "Expense not found" }, { status: 404 });
  }

  return NextResponse.json(expense);
}



// without validation technique
// export async function POST(req: NextRequest) {
//   const body = await req.json();
//   await connectToDB();
//   const expense = await Expense.create(body);
//   return NextResponse.json(expense, { status: 201 });
// }

export async function POST(req: NextRequest) {

  // 201 for okay, nakapost idjay database
  // 400 for bad request
  // 500 for server error
  const body = await req.json();

  // Server-side validation
  if (!body.amount || typeof body.amount !== "number" || body.amount <= 0) {
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
  }
  if (!body.category || typeof body.category !== "string") {
    return NextResponse.json({ error: "Invalid category" }, { status: 400 });
  }
  if (!body.date) {
    return NextResponse.json({ error: "Invalid date" }, { status: 400 });
  }
  await connectToDB();
  const expense = await Expense.create(body);
  return NextResponse.json(expense, { status: 201 });
}
