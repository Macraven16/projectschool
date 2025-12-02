"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Filter, Calendar, Download, RefreshCw } from "lucide-react";

export default function ActivityLogPage() {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("");

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/transactions");
            if (res.ok) {
                const data = await res.json();
                setTransactions(data);
            }
        } catch (error) {
            console.error("Failed to fetch transactions", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredTransactions = transactions.filter(tx => {
        const matchesSearch =
            tx.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tx.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType ? tx.type === filterType : true;
        return matchesSearch && matchesType;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Activity Log</h1>
                <p className="text-muted-foreground">
                    View and monitor all system transactions and activities.
                </p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center justify-between py-4 bg-muted/20 p-4 rounded-lg border">
                <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <input
                            type="search"
                            placeholder="Search activity..."
                            className="w-full rounded-md border border-input bg-background pl-8 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="p-2 border rounded-md text-sm bg-background"
                    >
                        <option value="">All Types</option>
                        <option value="TUITION">Tuition Payment</option>
                        <option value="TOPUP">Wallet Top-up</option>
                    </select>
                    <button onClick={fetchTransactions} className="p-2 border rounded-md hover:bg-muted" title="Refresh">
                        <RefreshCw className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>System Activities</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {loading ? (
                            <div className="text-center py-8 text-muted-foreground">Loading activity log...</div>
                        ) : filteredTransactions.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">No activities found.</div>
                        ) : (
                            <div className="divide-y">
                                {filteredTransactions.map((tx) => (
                                    <div key={tx.id} className="flex items-center justify-between py-4">
                                        <div className="flex items-center gap-4">
                                            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${tx.type === 'TOPUP' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                                                }`}>
                                                {tx.type === 'TOPUP' ? '+' : '$'}
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">
                                                    {tx.type === 'TUITION' ? 'Tuition Payment' :
                                                        tx.type === 'TOPUP' ? 'Wallet Top-up' : tx.type}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {tx.studentName || 'Unknown User'} - {tx.description}
                                                </p>
                                                <p className="text-[10px] text-muted-foreground mt-0.5">
                                                    {new Date(tx.date).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`font-bold text-sm ${tx.type === 'TOPUP' ? 'text-green-600' : 'text-foreground'
                                                }`}>
                                                {tx.type === 'TOPUP' ? '+' : ''}GHS {tx.amount.toLocaleString()}
                                            </p>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full ${tx.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                                    tx.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-red-100 text-red-700'
                                                }`}>
                                                {tx.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
