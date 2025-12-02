"use client";

import { useState, useEffect } from "react";
import { Activity, CheckCircle, AlertCircle } from "lucide-react";

export function SystemStatus() {
    const [status, setStatus] = useState<"loading" | "operational" | "down">("loading");

    useEffect(() => {
        checkHealth();
        const timer = setInterval(checkHealth, 30000); // Check every 30s
        return () => clearInterval(timer);
    }, []);

    const checkHealth = async () => {
        try {
            const res = await fetch("/api/health");
            if (res.ok) {
                setStatus("operational");
            } else {
                setStatus("down");
            }
        } catch (error) {
            setStatus("down");
        }
    };

    if (status === "loading") return null;

    return (
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium border ${status === "operational"
                ? "bg-green-500/10 text-green-600 border-green-500/20"
                : "bg-red-500/10 text-red-600 border-red-500/20"
            }`}>
            {status === "operational" ? (
                <>
                    <div className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </div>
                    <span>Operational</span>
                </>
            ) : (
                <>
                    <AlertCircle className="h-3 w-3" />
                    <span>System Issues</span>
                </>
            )}
        </div>
    );
}
