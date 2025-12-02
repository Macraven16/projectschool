"use client";

import { useState, useEffect } from "react";

export function DateTimeDisplay() {
    const [date, setDate] = useState<Date | null>(null);

    useEffect(() => {
        setDate(new Date());
        const timer = setInterval(() => setDate(new Date()), 60000); // Update every minute
        return () => clearInterval(timer);
    }, []);

    if (!date) return null;

    return (
        <div className="hidden md:flex flex-col items-end text-xs text-muted-foreground border-r pr-4 border-border/60">
            <span className="font-semibold text-foreground">
                {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            <span>
                {date.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
        </div>
    );
}
