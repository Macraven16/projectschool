"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, ArrowRight, Wallet, AlertCircle } from "lucide-react";
import Link from "next/link";

const MOCK_CHILDREN = [
    { id: 1, name: "Kofi Addo", school: "University of Ghana", balance: 2500, avatar: "K" },
    { id: 2, name: "Ama Addo", school: "Achimota School", balance: 1200, avatar: "A" },
    { id: 3, name: "Yaw Addo", school: "Presec Legon", balance: 0, avatar: "Y" }
];

export default function ParentDashboard() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold tracking-tight">Parent Dashboard</h1>
                <p className="text-muted-foreground">Overview of your children's accounts.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {MOCK_CHILDREN.map((child) => (
                    <Card key={child.id} className="overflow-hidden hover:shadow-md transition-shadow">
                        <CardHeader className="bg-muted/30 pb-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                        {child.avatar}
                                    </div>
                                    <div>
                                        <CardTitle className="text-base">{child.name}</CardTitle>
                                        <p className="text-xs text-muted-foreground">{child.school}</p>
                                    </div>
                                </div>
                                <Link href={`/student?childId=${child.id}`} className="text-xs font-medium text-primary hover:underline">
                                    Manage
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Outstanding Fees</span>
                                <span className={`font-bold ${child.balance > 0 ? 'text-destructive' : 'text-green-600'}`}>
                                    GHS {child.balance.toLocaleString()}
                                </span>
                            </div>

                            <div className="flex gap-2">
                                <Link
                                    href={`/student/pay?childId=${child.id}`}
                                    className="flex-1 inline-flex items-center justify-center rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                                >
                                    Pay Fees
                                </Link>
                                <Link
                                    href={`/student/wallet?childId=${child.id}`}
                                    className="flex-1 inline-flex items-center justify-center rounded-md border bg-background px-3 py-2 text-xs font-medium hover:bg-accent transition-colors"
                                >
                                    Wallet
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="rounded-xl border bg-blue-50 p-4 flex gap-3 items-start text-blue-900">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <div>
                    <h3 className="font-semibold text-sm">Parent Notice</h3>
                    <p className="text-xs mt-1 opacity-90">
                        Please ensure all outstanding fees for the current term are cleared by Jan 15, 2025 to avoid penalties.
                    </p>
                </div>
            </div>
        </div>
    );
}
