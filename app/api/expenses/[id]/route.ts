import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import { Expense } from "@/models/Expense";

// It seems like the placeholder contains an incorrect or misplaced string.
// If you intended to implement a route handler, here's an example:

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectToDB();
        const expense = await Expense.findById(params.id);

        if (!expense) {
            return NextResponse.json({ error: "Expense not found" }, { status: 404 });
        }

        return NextResponse.json(expense);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch expense" }, { status: 500 });
    }
}