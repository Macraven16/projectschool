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

    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [notifications, setNotifications] = useState([
        { id: 1, title: "School Fees Due", message: "Your tuition fees for the next semester are due in 3 days.", read: false },
        { id: 2, title: "New Exam Schedule", message: "The final exam schedule has been released.", read: false }
    ]);

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
        setShowNotifications(false);
    };

    return (
        <div className="flex min-h-screen flex-col bg-muted/20 pb-16 md:pb-0">
            {/* Top Header */}
            <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-card px-4 shadow-sm md:px-6">
                <Link href="/student" className="flex items-center gap-2 font-bold text-lg text-primary hover:opacity-80 transition-opacity">
                    <GraduationCap className="h-6 w-6" />
                    <span className="hidden md:inline">Student</span>
                </Link>
                <div className="flex items-center gap-4">
                    {/* Notifications */}
                    <div className="relative">
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="relative p-2 text-muted-foreground hover:text-foreground"
                        >
                            <Bell className="h-5 w-5" />
                            {unreadCount > 0 && (
                                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive ring-2 ring-card" />
                            )}
                        </button>

                        {showNotifications && (
                            <div className="absolute right-0 top-full mt-2 w-80 rounded-xl border bg-card shadow-lg z-50 animate-in fade-in zoom-in-95 duration-200">
                                <div className="p-4 border-b flex justify-between items-center">
                                    <h3 className="font-semibold">Notifications</h3>
                                    {unreadCount > 0 && (
                                        <button onClick={markAllAsRead} className="text-xs text-primary hover:underline">
                                            Mark all as read
                                        </button>
                                    )}
                                </div>
                                <div className="max-h-[300px] overflow-y-auto p-2 space-y-2">
                                    {notifications.length === 0 ? (
                                        <p className="text-center text-sm text-muted-foreground p-4">No notifications</p>
                                    ) : (
                                        notifications.map((n) => (
                                            <div key={n.id} className={`p-3 rounded-lg text-sm ${n.read ? 'bg-background' : 'bg-muted/50'}`}>
                                                <p className="font-medium">{n.title}</p>
                                                <p className="text-muted-foreground text-xs mt-1">{n.message}</p>
                                            </div>
                                        ))
                                    )}
                                </div>
                                <div className="p-2 border-t">
                                    <button
                                        onClick={logout}
                                        className="w-full flex items-center justify-center gap-2 p-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Avatar Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                            className="flex items-center gap-2 focus:outline-none"
                        >
                            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                                {user?.name?.[0] || "S"}
                            </div>
                        </button>

                        {showProfileMenu && (
                            <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border bg-card shadow-lg z-50 animate-in fade-in zoom-in-95 duration-200">
                                <div className="p-3 border-b">
                                    <p className="font-medium text-sm">{user?.name || "Student"}</p>
                                    <p className="text-xs text-muted-foreground truncate">{user?.email || "student@edupay.com"}</p>
                                </div>
                                <div className="p-1">
                                    <Link
                                        href="/student/profile"
                                        className="flex items-center gap-2 w-full p-2 text-sm rounded-lg hover:bg-muted transition-colors"
                                        onClick={() => setShowProfileMenu(false)}
                                    >
                                        <User className="h-4 w-4" />
                                        Profile
                                    </Link>
                                    <button
                                        onClick={logout}
                                        className="flex items-center gap-2 w-full p-2 text-sm rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
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
