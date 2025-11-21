"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
    Home,
    CreditCard,
    Wallet,
    PieChart,
    User,
    LogOut,
    Bell,
    GraduationCap,
    ShoppingBag,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
    { icon: Home, label: "Home", href: "/student" },
    { icon: CreditCard, label: "Pay Fees", href: "/student/pay" },
    { icon: Wallet, label: "Wallet", href: "/student/wallet" },
    { icon: ShoppingBag, label: "Market", href: "/student/marketplace" },
    { icon: PieChart, label: "Plan", href: "/student/plan" },
    { icon: User, label: "Profile", href: "/student/profile" },
];

export default function StudentLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { logout, user } = useAuth();

    return (
        <div className="flex min-h-screen flex-col bg-muted/20 pb-16 md:pb-0">
            {/* Top Header */}
            <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-card px-4 shadow-sm md:px-6">
                <div className="flex items-center gap-2 font-bold text-lg text-primary">
                    <GraduationCap className="h-6 w-6" />
                    <span className="hidden md:inline">EduPay Student</span>
                </div>
                <div className="flex items-center gap-4">
                    <button className="relative p-2 text-muted-foreground hover:text-foreground">
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive ring-2 ring-card" />
                    </button>
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                        {user?.name?.[0] || "S"}
                    </div>
                    <button
                        onClick={logout}
                        className="hidden md:flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-destructive transition-colors"
                    >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-6 max-w-5xl mx-auto w-full">{children}</main>

            {/* Mobile Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t bg-card px-2 md:hidden">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center gap-1 rounded-lg px-3 py-1 text-xs font-medium transition-colors",
                                isActive
                                    ? "text-primary"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <item.icon className={cn("h-5 w-5", isActive && "fill-current")} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
