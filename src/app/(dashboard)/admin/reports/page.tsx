"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_TRANSACTIONS } from "@/lib/mock-data";
import { Download, FileText, Filter, Calendar, Printer, Mail } from "lucide-react";

export default function ReportsPage() {
    const [dateRange, setDateRange] = useState({ start: "", end: "" });
    const totalRevenue = MOCK_TRANSACTIONS.reduce((acc, tx) => acc + tx.amount, 0);

    const handleExport = () => {
        alert("Report exported to CSV successfully!");
    };

    const handlePrint = () => {
        window.print();
    };

    const handleEmail = () => {
        const email = prompt("Enter email address to send report to:");
        if (email) {
            alert(`Report sent to ${email}`);
        }
    };

    const handleDateChange = () => {
        // Mock date range selection
        const start = prompt("Enter start date (YYYY-MM-DD):", "2023-01-01");
        const end = prompt("Enter end date (YYYY-MM-DD):", "2023-12-31");
        if (start && end) {
            setDateRange({ start, end });
            alert(`Filtering reports from ${start} to ${end}`);
        }
    };

    return (
        <div className="space-y-6 print:p-0">
            <div className="flex items-center justify-between print:hidden">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Financial Reports</h1>
                    <p className="text-muted-foreground">View and export school financial data.</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleDateChange}
                        className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
                    >
                        <Calendar className="mr-2 h-4 w-4" />
                        {dateRange.start ? `${dateRange.start} - ${dateRange.end}` : "Select Date Range"}
                    </button>
                    <button
                        onClick={handlePrint}
                        className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
                    >
                        <Printer className="mr-2 h-4 w-4" />
                        Print
                    </button>
                    <button
                        onClick={handleEmail}
                        className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
                    >
                        <Mail className="mr-2 h-4 w-4" />
                        Email
                    </button>
                    <button
                        onClick={handleExport}
                        className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
                    >
                        <Download className="mr-2 h-4 w-4" />
                        Export CSV
                    </button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3 print:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Collections</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">GHS {totalRevenue.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Outstanding Fees</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">GHS 45,231.89</div>
                        <p className="text-xs text-muted-foreground">-4% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Net Revenue</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">GHS {(totalRevenue * 0.95).toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">After platform fees</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="print:shadow-none print:border-none">
                <CardHeader>
                    <CardTitle>Transaction Report</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm">
                            <thead className="[&_tr]:border-b">
                                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Transaction ID</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Student ID</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Type</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Method</th>
                                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {MOCK_TRANSACTIONS.map((tx) => (
                                    <tr key={tx.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <td className="p-4 align-middle">{new Date(tx.date).toLocaleDateString()}</td>
                                        <td className="p-4 align-middle font-mono text-xs">{tx.reference}</td>
                                        <td className="p-4 align-middle">{tx.studentId}</td>
                                        <td className="p-4 align-middle">{tx.type}</td>
                                        <td className="p-4 align-middle">{tx.method}</td>
                                        <td className="p-4 align-middle text-right font-medium">GHS {tx.amount.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
