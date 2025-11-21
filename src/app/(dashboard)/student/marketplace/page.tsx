"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, Home, Search, ShoppingCart } from "lucide-react";

const BOOKS = [
    { id: 1, title: "Advanced Mathematics", price: 120, image: "📚" },
    { id: 2, title: "Physics for SHS", price: 95, image: "⚛️" },
    { id: 3, title: "English Literature", price: 80, image: "📖" },
    { id: 4, title: "Chemistry Vol. 1", price: 110, image: "🧪" },
];

const HOSTELS = [
    { id: 1, name: "Unity Hall", price: 2500, type: "4 in a room", image: "🏢" },
    { id: 2, name: "Freedom Hostel", price: 3200, type: "2 in a room", image: "🏠" },
    { id: 3, name: "Campus View", price: 4000, type: "1 in a room", image: "🏘️" },
];

export default function MarketplacePage() {
    const [activeTab, setActiveTab] = useState<"books" | "hostels">("books");

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Campus Marketplace</h1>
                <div className="flex items-center gap-2">
                    <button className="relative p-2 rounded-full hover:bg-accent">
                        <ShoppingCart className="h-5 w-5" />
                        <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center">
                            0
                        </span>
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-4 border-b pb-4">
                <button
                    onClick={() => setActiveTab("books")}
                    className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${activeTab === "books"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        }`}
                >
                    <Book className="h-4 w-4" />
                    Bookstore
                </button>
                <button
                    onClick={() => setActiveTab("hostels")}
                    className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${activeTab === "hostels"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        }`}
                >
                    <Home className="h-4 w-4" />
                    Hostels
                </button>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                    type="search"
                    placeholder={`Search ${activeTab}...`}
                    className="w-full rounded-lg border border-input bg-background pl-10 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {activeTab === "books"
                    ? BOOKS.map((book) => (
                        <Card key={book.id} className="overflow-hidden">
                            <div className="aspect-square bg-muted flex items-center justify-center text-6xl">
                                {book.image}
                            </div>
                            <CardContent className="p-4">
                                <h3 className="font-semibold">{book.title}</h3>
                                <p className="text-sm text-muted-foreground mt-1">GHS {book.price}</p>
                                <button className="mt-4 w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                                    Add to Cart
                                </button>
                            </CardContent>
                        </Card>
                    ))
                    : HOSTELS.map((hostel) => (
                        <Card key={hostel.id} className="overflow-hidden">
                            <div className="aspect-video bg-muted flex items-center justify-center text-6xl">
                                {hostel.image}
                            </div>
                            <CardContent className="p-4">
                                <h3 className="font-semibold">{hostel.name}</h3>
                                <p className="text-sm text-muted-foreground mt-1">{hostel.type}</p>
                                <p className="font-bold mt-2">GHS {hostel.price} / year</p>
                                <button className="mt-4 w-full rounded-md border border-primary text-primary px-4 py-2 text-sm font-medium hover:bg-primary/10">
                                    View Details
                                </button>
                            </CardContent>
                        </Card>
                    ))}
            </div>
        </div>
    );
}
