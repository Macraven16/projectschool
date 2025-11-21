"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Target, TrendingUp, Plus } from "lucide-react";

export default function PlanningPage() {
    const [savingsGoal, setSavingsGoal] = useState(500);
    const [currentSavings, setCurrentSavings] = useState(50);

    const progress = (currentSavings / savingsGoal) * 100;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold tracking-tight">Financial Planning</h1>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Savings Goal */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tuition Savings Goal</CardTitle>
                        <Target className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="mt-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Progress</span>
                                <span className="font-medium">{progress.toFixed(0)}%</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-secondary">
                                <div
                                    className="h-2 rounded-full bg-primary transition-all"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground pt-1">
                                <span>GHS {currentSavings} saved</span>
                                <span>Goal: GHS {savingsGoal}</span>
                            </div>
                        </div>
                        <div className="mt-6">
                            <button className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                                Add to Savings
                            </button>
                        </div>
                    </CardContent>
                </Card>

                {/* Monthly Budget */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Monthly Budget</CardTitle>
                        <PieChart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="mt-4 space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Food & Cafeteria</span>
                                    <span className="font-medium">GHS 150 / 300</span>
                                </div>
                                <div className="h-2 w-full rounded-full bg-secondary">
                                    <div className="h-2 rounded-full bg-green-500" style={{ width: "50%" }} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Transport</span>
                                    <span className="font-medium">GHS 80 / 100</span>
                                </div>
                                <div className="h-2 w-full rounded-full bg-secondary">
                                    <div className="h-2 rounded-full bg-yellow-500" style={{ width: "80%" }} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Books & Supplies</span>
                                    <span className="font-medium">GHS 20 / 50</span>
                                </div>
                                <div className="h-2 w-full rounded-full bg-secondary">
                                    <div className="h-2 rounded-full bg-blue-500" style={{ width: "40%" }} />
                                </div>
                            </div>
                        </div>
                        <div className="mt-6">
                            <button className="w-full rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
                                Edit Budget
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tips */}
            <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-6 flex items-start gap-4">
                    <div className="rounded-full bg-primary/10 p-2 text-primary">
                        <TrendingUp className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-primary">Smart Tip</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            If you save GHS 10 every day, you'll reach your tuition goal in 45 days!
                            Try setting up an auto-deduction from your wallet.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
