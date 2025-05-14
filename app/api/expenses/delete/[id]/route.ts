import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import { Expense } from "@/models/Expense";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        if (!id) {
            return NextResponse.json({ error: "Expense ID is required" }, { status: 400 });
        }

        await connectToDB();

        const deletedExpense = await Expense.findByIdAndDelete(id);

        if (!deletedExpense) {
            return NextResponse.json({ error: "Expense not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Expense deleted successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete expense" }, { status: 500 });
    }
}