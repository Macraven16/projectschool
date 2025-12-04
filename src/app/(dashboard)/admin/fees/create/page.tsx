"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Loader2, Save, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { School } from "@/lib/types";

export default function CreateFeePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [schools, setSchools] = useState<School[]>([]);
    const [formData, setFormData] = useState({
        schoolId: "",
        name: "",
        amount: 0,
        dueDate: "",
        breakdown: [{ item: "Tuition", amount: 0 }]
    });

    useEffect(() => {
        const fetchSchools = async () => {
            try {
                const res = await fetch("/api/universities");
                if (res.ok) {
                    const data = await res.json();
                    setSchools(data);
                }
            } catch (error) {
                console.error("Failed to fetch schools", error);
            }
        };
        fetchSchools();
    }, []);

    // Update total amount when breakdown changes
    useEffect(() => {
        const total = formData.breakdown.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
        setFormData(prev => ({ ...prev, amount: total }));
    }, [formData.breakdown]);

    const handleBreakdownChange = (index: number, field: 'item' | 'amount', value: string | number) => {
        const newBreakdown = [...formData.breakdown];
        newBreakdown[index] = { ...newBreakdown[index], [field]: value };
        setFormData({ ...formData, breakdown: newBreakdown });
    };

    const addBreakdownItem = () => {
        setFormData({
            ...formData,
            breakdown: [...formData.breakdown, { item: "", amount: 0 }]
        });
    };

    const removeBreakdownItem = (index: number) => {
        const newBreakdown = formData.breakdown.filter((_, i) => i !== index);
        setFormData({ ...formData, breakdown: newBreakdown });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("/api/fees", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                alert("Fee structure created successfully!");
                router.push("/admin/fees");
            } else {
                const error = await res.json();
                alert(`Error: ${error.error || "Failed to create fee structure"}`);
            }
        } catch (error) {
            console.error("Failed to create fee structure", error);
            alert("Failed to create fee structure");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Create Fee Structure</h1>
                <p className="text-muted-foreground">Define a new fee structure for a school.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        Fee Structure Details
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">School</label>
                                <select
                                    required
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    value={formData.schoolId}
                                    onChange={(e) => setFormData({ ...formData, schoolId: e.target.value })}
                                >
                                    <option value="">Select School</option>
                                    {schools.map(school => (
                                        <option key={school.id} value={school.id}>{school.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Term/Name</label>
                                <input
                                    required
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    placeholder="e.g. Term 1 2025"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Due Date</label>
                            <input
                                type="date"
                                required
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                value={formData.dueDate}
                                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                            />
                        </div>

                        <div className="space-y-4 border rounded-md p-4 bg-muted/10">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold">Fee Breakdown</h3>
                                <button
                                    type="button"
                                    onClick={addBreakdownItem}
                                    className="text-xs flex items-center gap-1 text-primary hover:underline"
                                >
                                    <Plus className="h-3 w-3" /> Add Item
                                </button>
                            </div>

                            {formData.breakdown.map((item, index) => (
                                <div key={index} className="flex gap-4 items-end">
                                    <div className="flex-1 space-y-1">
                                        <label className="text-xs text-muted-foreground">Item</label>
                                        <input
                                            required
                                            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                            value={item.item}
                                            onChange={(e) => handleBreakdownChange(index, 'item', e.target.value)}
                                            placeholder="e.g. Tuition"
                                        />
                                    </div>
                                    <div className="w-32 space-y-1">
                                        <label className="text-xs text-muted-foreground">Amount (GHS)</label>
                                        <input
                                            type="number"
                                            required
                                            min="0"
                                            step="0.01"
                                            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                            value={item.amount}
                                            onChange={(e) => handleBreakdownChange(index, 'amount', parseFloat(e.target.value))}
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeBreakdownItem(index)}
                                        className="h-9 w-9 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-md"
                                        title="Remove Item"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}

                            <div className="flex justify-end pt-2 border-t mt-2">
                                <div className="text-right">
                                    <span className="text-sm text-muted-foreground mr-2">Total Amount:</span>
                                    <span className="text-lg font-bold">GHS {formData.amount.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                            >
                                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                                Create Fee Structure
                            </button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
