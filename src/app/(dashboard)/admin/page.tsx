"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, TrendingUp, Activity, UserCheck, ArrowUpRight, ArrowDownRight, Wallet, CreditCard, FileText } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import UserManagementTable from "@/components/UserManagementTable";

function DashboardCard({
    title,
    value,
    icon: Icon,
    description,
    trend,
    trendValue,
    href
}: {
    title: string;
    value: string;
    icon: any;
    description: string;
    trend?: "up" | "down" | "neutral";
    trendValue?: string;
    href?: string;
}) {
    const Content = (
        <div className={`group relative overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md hover:border-primary/50 ${href ? 'cursor-pointer' : ''}`}>
            <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="tracking-tight text-sm font-medium text-muted-foreground">{title}</h3>
                <div className={`p-2 rounded-full transition-colors ${title.includes("Revenue") ? "bg-green-100 text-green-600" :
                    title.includes("Outstanding") ? "bg-red-100 text-red-600" :
                        "bg-primary/10 text-primary"
                    }`}>
                    <Icon className="h-4 w-4" />
                </div>
            </div>
            <div className="p-6 pt-0">
                <div className="text-2xl font-bold tracking-tight">{value}</div>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                    {trend === "up" && <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />}
                    {trend === "down" && <ArrowDownRight className="mr-1 h-3 w-3 text-red-500" />}
                    <span className={trend === "up" ? "text-green-600 font-medium" : trend === "down" ? "text-red-600 font-medium" : ""}>
                        {trendValue}
                    </span>
                    <span className="ml-1">{description}</span>
                </div>
            </div>
        </div>
    );

    if (href) {
        return <Link href={href}>{Content}</Link>;
    }

    return Content;
}

export default function AdminDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalStudents: 0,
        totalStaff: 0,
        totalRevenue: 0,
        outstandingFees: 0,
        recentUsers: []
    });
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, txRes] = await Promise.all([
                    fetch("/api/dashboard/stats"),
                    fetch("/api/transactions")
                ]);

                if (statsRes.ok) {
                    const data = await statsRes.json();
                    setStats(data);
                }
                if (txRes.ok) {
                    const data = await txRes.json();
                    setTransactions(data);
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
        <div className="space-y-8 animate-in fade-in duration-500 relative z-0">
            <div className="flex flex-col gap-2">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                            Institution Admin
                        </h1>
                        <p className="text-muted-foreground">
                            Overview of your institution's financial performance.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 bg-card border px-3 py-1.5 rounded-full shadow-sm">
                        <div className={`h-2.5 w-2.5 rounded-full ${loading ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`} />
                        <span className="text-xs font-medium">System Operational</span>
                    </div>
                </div>
            </div>

            {/* Revenue Chart Placeholder - Banking Style */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="col-span-2">
                    <CardHeader>
                        <CardTitle>Revenue Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[200px] flex items-end justify-between gap-2 p-4">
                            {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                                <div key={i} className="w-full bg-primary/10 hover:bg-primary/20 rounded-t-md relative group transition-all" style={{ height: `${h}%` }}>
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                                        {h}%
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between px-4 text-xs text-muted-foreground mt-2">
                            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Quick Stats</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Daily Revenue</span>
                            <span className="font-bold">GHS 12,450</span>
                        </div>
                        <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                            <div className="bg-green-500 h-full w-[75%]" />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Target</span>
                            <span className="font-bold">75%</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Financial Overview Section */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <DashboardCard
                    title="Total Revenue"
                    value={loading ? "..." : `GHS ${stats.totalRevenue.toLocaleString()}`}
                    icon={DollarSign}
                    description="collected this year"
                    trend="up"
                    trendValue="+12%"
                />
                <DashboardCard
                    title="Outstanding Fees"
                    value={loading ? "..." : `GHS ${stats.outstandingFees?.toLocaleString() || '0'}`}
                    icon={FileText}
                    description="pending collection"
                    trend="down"
                    trendValue="8%"
                />
                <DashboardCard
                    title="Active Students"
                    value={loading ? "..." : stats.totalStudents.toString()}
                    icon={Users}
                    description="enrolled students"
                    trend="up"
                    trendValue="+5"
                    href="/admin/users/students"
                />
                <DashboardCard
                    title="Total Staff"
                    value={loading ? "..." : stats.totalStaff.toString()}
                    icon={UserCheck}
                    description="active staff members"
                />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                {/* Recent Transactions - Banking Style */}
                <div className="col-span-4 rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
                    <div className="p-6 border-b bg-muted/30 flex justify-between items-center">
                        <div>
                            <h3 className="font-semibold leading-none tracking-tight">Recent Transactions</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                Real-time payment feed.
                            </p>
                        </div>
                        <Link href="/admin/reports" className="text-xs font-medium bg-primary/10 text-primary px-3 py-1 rounded-full hover:bg-primary/20 transition-colors">
                            View Reports
                        </Link>
                    </div>
                    <div className="p-0">
                        <div className="divide-y">
                            {loading ? (
                                <div className="p-8 text-center text-muted-foreground">Loading transactions...</div>
                            ) : transactions.length === 0 ? (
                                <div className="p-8 text-center text-muted-foreground">No transactions found.</div>
                            ) : (
                                transactions.slice(0, 5).map((tx) => (
                                    <div key={tx.id} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors group">
                                        <div className="flex items-center gap-4">
                                            <div className={`h-10 w-10 rounded-full flex items-center justify-center transition-colors ${tx.type === 'TOPUP' ? 'bg-green-100 text-green-600 group-hover:bg-green-200' :
                                                'bg-blue-100 text-blue-600 group-hover:bg-blue-200'
                                                }`}>
                                                {tx.type === 'TOPUP' ? <Wallet className="h-5 w-5" /> : <CreditCard className="h-5 w-5" />}
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium leading-none">
                                                    {tx.type === 'TUITION' ? 'Tuition Payment' :
                                                        tx.type === 'TOPUP' ? 'Wallet Top-up' : tx.type}
                                                </p>
                                                <p className="text-xs text-muted-foreground">{tx.studentName || 'Student'} • {new Date(tx.date).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            <span className={`font-bold text-sm ${tx.type === 'TOPUP' ? 'text-green-600' : 'text-foreground'
                                                }`}>
                                                {tx.type === 'TOPUP' ? '+' : ''}GHS {tx.amount.toLocaleString()}
                                            </span>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full ${tx.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                                tx.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-red-100 text-red-700'
                                                }`}>
                                                {tx.status}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Quick Actions & Stats */}
                <div className="col-span-3 space-y-6">
                    <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
                        <div className="p-6 border-b bg-muted/30">
                            <h3 className="font-semibold leading-none tracking-tight">Quick Actions</h3>
                        </div>
                        <div className="p-4 space-y-2">
                            <Link href="/admin/fees" className="flex items-center w-full p-3 rounded-lg border hover:bg-accent transition-all hover:shadow-sm group">
                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 group-hover:bg-primary/20">
                                    <DollarSign className="h-4 w-4 text-primary" />
                                </div>
                                <span className="text-sm font-medium">Create Fee Structure</span>
                            </Link>
                            <Link href="/admin/users/students" className="flex items-center w-full p-3 rounded-lg border hover:bg-accent transition-all hover:shadow-sm group">
                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 group-hover:bg-primary/20">
                                    <UserCheck className="h-4 w-4 text-primary" />
                                </div>
                                <span className="text-sm font-medium">Enroll New Student</span>
                            </Link>
                            <Link href="/admin/reports" className="flex items-center w-full p-3 rounded-lg border hover:bg-accent transition-all hover:shadow-sm group">
                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 group-hover:bg-primary/20">
                                    <Activity className="h-4 w-4 text-primary" />
                                </div>
                                <span className="text-sm font-medium">Generate Reports</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-4">
                <h3 className="text-lg font-semibold mb-4">User Management</h3>
                <UserManagementTable />
            </div>
        </div>
    );
}
