"use client";

import { useState } from "react";
import { MOCK_FEES } from "@/lib/mock-data";
import { Plus, FileText, MoreHorizontal, Trash, Edit, X, Download } from "lucide-react";

export default function FeesPage() {
    const [fees, setFees] = useState(MOCK_FEES);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showInvoiceModal, setShowInvoiceModal] = useState(false);
    const [selectedFee, setSelectedFee] = useState<any>(null);

    // Form State
    const [newFeeName, setNewFeeName] = useState("");
    const [newFeeAmount, setNewFeeAmount] = useState("");
    const [newFeeDate, setNewFeeDate] = useState("");

    const handleCreateFee = (e: React.FormEvent) => {
        e.preventDefault();
        const newFee = {
            id: Math.random().toString(36).substr(2, 9),
            schoolId: "school1",
            name: newFeeName,
            amount: Number(newFeeAmount),
            dueDate: newFeeDate,
            breakdown: [{ item: "Tuition", amount: Number(newFeeAmount) }] // Simplified for demo
        };
        setFees([...fees, newFee]);
        setShowCreateModal(false);
        setNewFeeName("");
        setNewFeeAmount("");
        setNewFeeDate("");
        alert("Fee Created Successfully!");
    };

    const handleDelete = (id: string) => {
        if (confirm("Delete this fee structure?")) {
            setFees(fees.filter(f => f.id !== id));
        }
    };

    const handleViewInvoice = (fee: any) => {
        setSelectedFee(fee);
        setShowInvoiceModal(true);
    };

    return (
        <div className="space-y-6 relative">
            {/* Create Fee Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="w-full max-w-md rounded-xl bg-card p-6 shadow-xl border animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">Create New Fee</h3>
                            <button onClick={() => setShowCreateModal(false)}><X className="h-5 w-5" /></button>
                        </div>
                        <form onSubmit={handleCreateFee} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Fee Name</label>
                                <input
                                    type="text"
                                    value={newFeeName}
                                    onChange={(e) => setNewFeeName(e.target.value)}
                                    className="w-full p-2 border rounded-md"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Amount (GHS)</label>
                                <input
                                    type="number"
                                    value={newFeeAmount}
                                    onChange={(e) => setNewFeeAmount(e.target.value)}
                                    className="w-full p-2 border rounded-md"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Due Date</label>
                                <input
                                    type="date"
                                    value={newFeeDate}
                                    onChange={(e) => setNewFeeDate(e.target.value)}
                                    className="w-full p-2 border rounded-md"
                                    required
                                />
                            </div>
                            <button type="submit" className="w-full bg-primary text-primary-foreground py-2 rounded-md font-medium">
                                Create Fee
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* View Invoice Modal */}
            {showInvoiceModal && selectedFee && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="w-full max-w-lg rounded-xl bg-card p-8 shadow-xl border animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h2 className="text-2xl font-bold text-primary">INVOICE</h2>
                                <p className="text-sm text-muted-foreground">#{selectedFee.id.toUpperCase()}</p>
                            </div>
                            <div className="text-right">
                                <h3 className="font-bold">EduPay School</h3>
                                <p className="text-xs text-muted-foreground">123 Education Lane</p>
                                <p className="text-xs text-muted-foreground">Accra, Ghana</p>
                            </div>
                        </div>

                        <div className="mb-8">
                            <p className="text-sm font-medium text-muted-foreground">Bill To:</p>
                            <p className="font-bold">All Students</p>
                            <p className="text-sm">Due Date: {new Date(selectedFee.dueDate).toLocaleDateString()}</p>
                        </div>

                        <table className="w-full mb-8">
                            <thead>
                                <tr className="border-b text-left text-sm">
                                    <th className="pb-2">Description</th>
                                    <th className="pb-2 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedFee.breakdown.map((item: any, idx: number) => (
                                    <tr key={idx} className="border-b">
                                        <td className="py-2">{item.item}</td>
                                        <td className="py-2 text-right">GHS {item.amount.toLocaleString()}</td>
                                    </tr>
                                ))}
                                <tr className="font-bold text-lg">
                                    <td className="pt-4">Total</td>
                                    <td className="pt-4 text-right">GHS {selectedFee.amount.toLocaleString()}</td>
                                </tr>
                            </tbody>
                        </table>

                        <div className="flex gap-3">
                            <button className="flex-1 bg-primary text-primary-foreground py-2 rounded-md flex items-center justify-center gap-2">
                                <Download className="h-4 w-4" /> Download PDF
                            </button>
                            <button
                                onClick={() => setShowInvoiceModal(false)}
                                className="flex-1 border bg-background py-2 rounded-md hover:bg-accent"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Fee Structures</h1>
                    <p className="text-muted-foreground">Manage tuition fees and payment breakdowns.</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Fee
                </button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {fees.map((fee) => (
                    <div key={fee.id} className="rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
                        <div className="p-6 flex flex-row items-start justify-between space-y-0 pb-2">
                            <div className="space-y-1">
                                <h3 className="font-semibold leading-none tracking-tight">{fee.name}</h3>
                                <p className="text-sm text-muted-foreground">Due: {new Date(fee.dueDate).toLocaleDateString()}</p>
                            </div>
                            <div className="flex gap-2">
                                <button className="text-muted-foreground hover:text-primary">
                                    <Edit className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(fee.id)}
                                    className="text-muted-foreground hover:text-destructive"
                                >
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
                            <button
                                onClick={() => handleViewInvoice(fee)}
                                className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
                            >
                                <FileText className="h-4 w-4" /> View Invoice
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
