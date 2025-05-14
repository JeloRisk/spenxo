import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import { Expense } from "@/models/Expense";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;

    try {
        await connectToDB();

        const body = await req.json();
        const updatedExpense = await Expense.findByIdAndUpdate(id, body, { new: true });

        if (!updatedExpense) {
            return NextResponse.json({ error: "Expense not found" }, { status: 404 });
        }

        return NextResponse.json(updatedExpense, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to update expense" }, { status: 500 });
    }
}