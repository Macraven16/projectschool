"use client";

import { useState } from "react";
import { MOCK_FEES } from "@/lib/mock-data";
import { Plus, FileText, MoreHorizontal, Trash, Edit } from "lucide-react";

export default function FeesPage() {
    const [fees, setFees] = useState(MOCK_FEES);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Fee Structures</h1>
                    <p className="text-muted-foreground">Manage tuition fees and payment breakdowns.</p>
                </div>
                <button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90">
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Fee
                </button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {fees.map((fee) => (
                    <div key={fee.id} className="rounded-xl border bg-card text-card-foreground shadow-sm">
                        <div className="p-6 flex flex-row items-start justify-between space-y-0 pb-2">
                            <div className="space-y-1">
                                <h3 className="font-semibold leading-none tracking-tight">{fee.name}</h3>
                                <p className="text-sm text-muted-foreground">Due: {new Date(fee.dueDate).toLocaleDateString()}</p>
                            </div>
                            <div className="flex gap-2">
                                <button className="text-muted-foreground hover:text-primary">
                                    <Edit className="h-4 w-4" />
                                </button>
                                <button className="text-muted-foreground hover:text-destructive">
                                    <Trash className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                        <div className="p-6 pt-4">
                            <div className="text-2xl font-bold mb-4">GHS {fee.amount.toLocaleString()}</div>
                            <div className="space-y-2">
                                <p className="text-xs font-medium text-muted-foreground uppercase">Breakdown</p>
                                {fee.breakdown.map((item, index) => (
                                    <div key={index} className="flex justify-between text-sm">
                                        <span>{item.item}</span>
                                        <span className="font-medium">GHS {item.amount}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="p-6 pt-0 mt-4 border-t flex items-center justify-between">
                            <button className="text-sm font-medium text-primary hover:underline">
                                View Invoices
                            </button>
                            <span className="text-xs text-muted-foreground">
                                Applied to All Students
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
