"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth-context";
import { RecentActivity } from "@/components/RecentActivity";
import { ArrowRight, CreditCard, Wallet, PiggyBank, AlertCircle, X } from "lucide-react";
import Link from "next/link";

export default function StudentDashboard() {
    const { user } = useAuth();
    const [outstandingFees, setOutstandingFees] = useState(0);
    const [totalPaid, setTotalPaid] = useState(0);
    const [walletBalance, setWalletBalance] = useState(0);
    const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [showBreakdown, setShowBreakdown] = useState(false);
    const [showTopUp, setShowTopUp] = useState(false);
    const [topUpAmount, setTopUpAmount] = useState("");
    const [feeBreakdown, setFeeBreakdown] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Invoices for Outstanding Fees
                const invoicesRes = await fetch('/api/student/invoices');
                if (invoicesRes.ok) {
                    const invoices = await invoicesRes.json();
                    const pending = invoices.filter((inv: any) => inv.status !== 'COMPLETED');
                    const totalOutstanding = pending.reduce((sum: number, inv: any) => sum + (inv.feeStructure.amount - inv.amountPaid), 0);
                    const paid = invoices.reduce((sum: number, inv: any) => sum + inv.amountPaid, 0);

                    setOutstandingFees(totalOutstanding);
                    setTotalPaid(paid);

                    // Prepare breakdown from pending invoices
                    const breakdown = pending.map((inv: any) => ({
                        name: inv.feeStructure.name,
                        amount: inv.feeStructure.amount - inv.amountPaid,
                        total: inv.feeStructure.amount,
                        paid: inv.amountPaid
                    }));
                    setFeeBreakdown(breakdown);
                }

                // Fetch Wallet Data
                const walletRes = await fetch('/api/wallet');
                if (walletRes.ok) {
                    const walletData = await walletRes.json();
                    setWalletBalance(walletData.balance);
                    setRecentTransactions(walletData.transactions.slice(0, 3));
                }
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="space-y-6 relative">
            {/* Breakdown Modal */}
            {showBreakdown && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="w-full max-w-md rounded-xl bg-card p-6 shadow-xl border animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold">Fee Breakdown</h3>
                            <button onClick={() => setShowBreakdown(false)} className="p-1 hover:bg-muted rounded-full">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="space-y-3">
                            {feeBreakdown.length > 0 ? (
                                feeBreakdown.map((item, index) => (
                                    <div key={index} className="flex flex-col py-2 border-b">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">{item.name}</span>
                                            <span className="font-medium">GHS {item.amount.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                            <span>Total: {item.total.toLocaleString()}</span>
                                            <span>Paid: {item.paid.toLocaleString()}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-muted-foreground py-4">No outstanding fees.</p>
                            )}

                            <div className="flex justify-between py-2 pt-4">
                                <span className="font-bold">Total Paid</span>
                                <span className="font-bold text-green-600">GHS {totalPaid.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between py-2">
                                <span className="font-bold">Total Due</span>
                                <span className="font-bold text-primary">GHS {outstandingFees.toLocaleString()}</span>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowBreakdown(false)}
                            className="w-full mt-6 bg-primary text-primary-foreground py-2 rounded-lg font-medium hover:opacity-90"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Top Up Modal */}
            {showTopUp && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="w-full max-w-md rounded-xl bg-card p-6 shadow-xl border animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold">Top Up Wallet</h3>
                            <button onClick={() => setShowTopUp(false)} className="p-1 hover:bg-muted rounded-full">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Amount (GHS)</label>
                                <input
                                    type="number"
                                    value={topUpAmount}
                                    onChange={(e) => setTopUpAmount(e.target.value)}
                                    className="w-full p-2 border rounded-lg bg-background"
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                {[50, 100, 200].map((amt) => (
                                    <button
                                        key={amt}
                                        onClick={() => setTopUpAmount(amt.toString())}
                                        className="py-1 px-2 border rounded hover:bg-muted text-sm"
                                    >
                                        GHS {amt}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={async () => {
                                    try {
                                        const res = await fetch('/api/wallet', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ amount: topUpAmount })
                                        });

                                        if (res.ok) {
                                            const data = await res.json();
                                            setWalletBalance(data.balance);
                                            alert(`Successfully topped up GHS ${topUpAmount}`);
                                            setShowTopUp(false);
                                            setTopUpAmount("");
                                            // Refresh transactions
                                            const walletRes = await fetch('/api/wallet');
                                            if (walletRes.ok) {
                                                const walletData = await walletRes.json();
                                                setRecentTransactions(walletData.transactions.slice(0, 3));
                                            }
                                        } else {
                                            alert('Top-up failed');
                                        }
                                    } catch (error) {
                                        console.error('Top-up error:', error);
                                        alert('An error occurred during top-up');
                                    }
                                }}
                                className="w-full mt-2 bg-primary text-primary-foreground py-2 rounded-lg font-medium hover:opacity-90"
                            >
                                Proceed to Pay
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col gap-2">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Hi, {user?.name || "Student"} 👋</h1>
                        <p className="text-muted-foreground">Here's your financial overview for this term.</p>
                    </div>
                    {user?.student?.studentIdNumber && (
                        <div className="bg-muted/50 px-3 py-1 rounded-md border">
                            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Index Number</p>
                            <p className="text-sm font-mono font-medium">{user.student.studentIdNumber}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Balance Card */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card className="bg-primary text-primary-foreground border-none shadow-lg relative overflow-hidden">
                    <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 translate-y-[-8px] rounded-full bg-white/10 blur-2xl" />
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-primary-foreground/80">
                            Outstanding Fees
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">
                            {loading ? "..." : `GHS ${outstandingFees.toLocaleString()}`}
                        </div>
                        <p className="text-xs text-primary-foreground/70 mt-1">
                            Due by Jan 15, 2025
                        </p>
                        <div className="mt-4 flex gap-3">
                            <Link
                                href="/student/pay"
                                className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-bold text-primary shadow-sm hover:bg-white/90 transition-colors"
                            >
                                Pay Now
                            </Link>
                            <button
                                onClick={() => setShowBreakdown(true)}
                                className="inline-flex items-center justify-center rounded-full bg-primary-foreground/10 px-4 py-2 text-sm font-medium text-white hover:bg-primary-foreground/20 transition-colors"
                            >
                                View Breakdown
                            </button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
                        <Wallet className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">
                            {loading ? "..." : `GHS ${walletBalance.toLocaleString()}`}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Available for spending
                        </p>
                        <div className="mt-4 flex gap-2">
                            <button
                                onClick={() => setShowTopUp(true)}
                                className="flex-1 inline-flex items-center justify-center rounded-md bg-primary/10 px-3 py-2 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
                            >
                                Top Up
                            </button>
                            <button className="flex-1 inline-flex items-center justify-center rounded-md bg-accent px-3 py-2 text-xs font-medium hover:bg-accent/80 transition-colors">
                                Scan to Pay
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <Link
                    href="/student/pay"
                    className="flex flex-col items-center justify-center gap-2 rounded-xl border bg-card p-4 text-center shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                        <CreditCard className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-medium">Pay Fees</span>
                </Link>
                <Link
                    href="/student/wallet"
                    className="flex flex-col items-center justify-center gap-2 rounded-xl border bg-card p-4 text-center shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600">
                        <Wallet className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-medium">Wallet</span>
                </Link>
                <Link
                    href="/student/plan"
                    className="flex flex-col items-center justify-center gap-2 rounded-xl border bg-card p-4 text-center shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                        <PiggyBank className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-medium">Savings</span>
                </Link>
                <Link
                    href="/student/help"
                    className="flex flex-col items-center justify-center gap-2 rounded-xl border bg-card p-4 text-center shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                        <AlertCircle className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-medium">Help</span>
                </Link>
            </div>

            {/* Recent Transactions */}
            <RecentActivity transactions={recentTransactions} />
        </div>
    );
}
