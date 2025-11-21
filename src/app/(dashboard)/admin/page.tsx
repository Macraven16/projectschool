"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_TRANSACTIONS, MOCK_STUDENTS } from "@/lib/mock-data";
import { DollarSign, Users, TrendingUp, Activity } from "lucide-react";

// Temporary Card component until we build the UI library properly
function DashboardCard({
    title,
    value,
    icon: Icon,
    description,
}: {
    title: string;
    value: string;
    icon: any;
    description: string;
}) {
    return (
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
            <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="tracking-tight text-sm font-medium">{title}</h3>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="p-6 pt-0">
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground">{description}</p>
            </div>
        </div>
    );
}

export default function AdminDashboard() {
    const totalRevenue = MOCK_TRANSACTIONS.reduce((acc, tx) => acc + tx.amount, 0);
    const totalStudents = MOCK_STUDENTS.length;
    const recentTransactions = MOCK_TRANSACTIONS.slice(0, 5);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <div className="flex items-center gap-2">
                    <button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90">
                        Download Report
                    </button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <DashboardCard
                    title="Total Revenue"
                    value={`GHS ${totalRevenue.toLocaleString()}`}
                    icon={DollarSign}
                    description="+20.1% from last month"
                />
                <DashboardCard
                    title="Active Students"
                    value={totalStudents.toString()}
                    icon={Users}
                    description="+180 new students"
                />
                <DashboardCard
                    title="Collection Rate"
                    value="85%"
                    icon={TrendingUp}
                    description="+5% from last term"
                />
                <DashboardCard
                    title="Active Now"
                    value="12"
                    icon={Activity}
                    description="Parents on platform"
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4 rounded-xl border bg-card text-card-foreground shadow-sm">
                    <div className="p-6 flex flex-col space-y-1.5">
                        <h3 className="font-semibold leading-none tracking-tight">Recent Transactions</h3>
                        <p className="text-sm text-muted-foreground">
                            Latest fee payments from students.
                        </p>
                    </div>
                    <div className="p-6 pt-0">
                        <div className="space-y-4">
                            {recentTransactions.map((tx) => (
                                <div key={tx.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                    <div className="flex items-center gap-4">
                                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                            <DollarSign className="h-4 w-4" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium leading-none">
                                                {tx.type === "TUITION" ? "Tuition Payment" : "Other Payment"}
                                            </p>
                                            <p className="text-xs text-muted-foreground">{tx.studentId}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <span className="font-bold text-sm">
                                            +GHS {tx.amount.toLocaleString()}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {new Date(tx.date).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="col-span-3 rounded-xl border bg-card text-card-foreground shadow-sm">
                    <div className="p-6 flex flex-col space-y-1.5">
                        <h3 className="font-semibold leading-none tracking-tight">Quick Actions</h3>
                        <p className="text-sm text-muted-foreground">
                            Manage your school efficiently.
                        </p>
                    </div>
                    <div className="p-6 pt-0 space-y-2">
                        <button className="w-full justify-start text-left rounded-md border p-3 hover:bg-accent transition-colors text-sm font-medium">
                            Create New Fee Structure
                        </button>
                        <button className="w-full justify-start text-left rounded-md border p-3 hover:bg-accent transition-colors text-sm font-medium">
                            Enroll New Student
                        </button>
                        <button className="w-full justify-start text-left rounded-md border p-3 hover:bg-accent transition-colors text-sm font-medium">
                            Send Payment Reminders
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
