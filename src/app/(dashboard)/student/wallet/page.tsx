"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_TRANSACTIONS } from "@/lib/mock-data";
import { Wallet, ArrowUpRight, ArrowDownLeft, QrCode, History } from "lucide-react";

export default function WalletPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold tracking-tight">Digital Wallet</h1>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Wallet Card */}
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 p-6 text-white shadow-xl">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-400">Current Balance</p>
                            <h2 className="mt-2 text-4xl font-bold">GHS 120.50</h2>
                        </div>
                        <Wallet className="h-8 w-8 text-gray-400" />
                    </div>
                    <div className="mt-8 flex gap-4">
                        <button className="flex-1 rounded-lg bg-white/10 py-2 text-sm font-medium backdrop-blur-sm hover:bg-white/20 transition-colors flex items-center justify-center gap-2">
                            <ArrowDownLeft className="h-4 w-4" /> Top Up
                        </button>
                        <button className="flex-1 rounded-lg bg-white py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
                            <QrCode className="h-4 w-4" /> Pay
                        </button>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Spent</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">GHS 450.00</div>
                            <p className="text-xs text-muted-foreground mt-1">This month</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Savings</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">GHS 50.00</div>
                            <p className="text-xs text-green-600 mt-1">+10% goal</p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Transaction History */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <History className="h-5 w-5" /> Transaction History
                    </h2>
                    <button className="text-sm text-primary hover:underline">Filter</button>
                </div>

                <div className="rounded-xl border bg-card shadow-sm divide-y">
                    {MOCK_TRANSACTIONS.map((tx) => (
                        <div key={tx.id} className="flex items-center justify-between p-4">
                            <div className="flex items-center gap-4">
                                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${tx.type === 'WALLET_TOPUP' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                    }`}>
                                    {tx.type === 'WALLET_TOPUP' ? <ArrowDownLeft className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                                </div>
                                <div>
                                    <p className="font-medium text-sm">{tx.type.replace('_', ' ')}</p>
                                    <p className="text-xs text-muted-foreground">{new Date(tx.date).toLocaleDateString()} • {tx.reference}</p>
                                </div>
                            </div>
                            <span className={`font-bold text-sm ${tx.type === 'WALLET_TOPUP' ? 'text-green-600' : 'text-foreground'
                                }`}>
                                {tx.type === 'WALLET_TOPUP' ? '+' : '-'}GHS {tx.amount.toLocaleString()}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
