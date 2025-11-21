"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_STUDENTS, MOCK_TRANSACTIONS } from "@/lib/mock-data";
import { useAuth } from "@/lib/auth-context";
import { ArrowRight, CreditCard, Wallet, PiggyBank, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function StudentDashboard() {
    const { user } = useAuth();
    // In a real app, we'd fetch the student data based on the logged-in user
    const student = MOCK_STUDENTS[0];
    const recentTransactions = MOCK_TRANSACTIONS.slice(0, 3);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold tracking-tight">Hi, {user?.name || "Student"} 👋</h1>
                <p className="text-muted-foreground">Here's your financial overview for this term.</p>
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
                        <div className="text-3xl font-bold">GHS {student.balance.toLocaleString()}</div>
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
                            <button className="inline-flex items-center justify-center rounded-full bg-primary-foreground/10 px-4 py-2 text-sm font-medium text-white hover:bg-primary-foreground/20 transition-colors">
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
                        <div className="text-3xl font-bold">GHS 120.50</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Available for spending
                        </p>
                        <div className="mt-4 flex gap-2">
                            <button className="flex-1 inline-flex items-center justify-center rounded-md bg-primary/10 px-3 py-2 text-xs font-medium text-primary hover:bg-primary/20 transition-colors">
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
                    href="/student/profile"
                    className="flex flex-col items-center justify-center gap-2 rounded-xl border bg-card p-4 text-center shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                        <AlertCircle className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-medium">Help</span>
                </Link>
            </div>

            {/* Recent Transactions */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Recent Activity</h2>
                    <Link href="/student/wallet" className="text-sm font-medium text-primary hover:underline">
                        View All
                    </Link>
                </div>
                <div className="rounded-xl border bg-card shadow-sm">
                    <div className="divide-y">
                        {recentTransactions.map((tx) => (
                            <div key={tx.id} className="flex items-center justify-between p-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">{tx.type === "TUITION" ? "School Fees" : "Payment"}</p>
                                        <p className="text-xs text-muted-foreground">{new Date(tx.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <span className="text-sm font-bold">-GHS {tx.amount.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
