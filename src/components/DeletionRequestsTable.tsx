"use client";

import { useState, useEffect } from "react";
import { Check, X, AlertCircle } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface DeletionRequest {
    id: string;
    student: {
        id: string;
        user: {
            name: string;
            email: string;
        };
    };
    staff: {
        name: string;
        email: string;
    };
    reason: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
    createdAt: string;
}

export default function DeletionRequestsTable() {
    const { user } = useAuth();
    const [requests, setRequests] = useState<DeletionRequest[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.role === 'MASTER_ADMIN') {
            fetchRequests();
        }
    }, [user]);

    const fetchRequests = async () => {
        try {
            const res = await fetch("/api/requests", {
                headers: { Authorization: `Bearer ${localStorage.getItem("school_fintech_token")}` }
            });
            if (res.ok) {
                const data = await res.json();
                setRequests(data);
            }
        } catch (error) {
            console.error("Failed to fetch requests", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (requestId: string, action: 'APPROVE' | 'REJECT') => {
        if (!confirm(`Are you sure you want to ${action.toLowerCase()} this request?`)) return;

        try {
            const res = await fetch("/api/requests", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("school_fintech_token")}`
                },
                body: JSON.stringify({ requestId, action })
            });

            if (res.ok) {
                fetchRequests();
            } else {
                alert("Failed to process request");
            }
        } catch (error) {
            console.error("Failed to process request", error);
        }
    };

    if (user?.role !== 'MASTER_ADMIN') {
        return <div className="p-4 text-center text-muted-foreground">Unauthorized Access</div>;
    }

    if (loading) {
        return <div className="p-8 text-center text-muted-foreground">Loading requests...</div>;
    }

    return (
        <div className="rounded-md border">
            <div className="w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b bg-muted/50">
                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Student</th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Requested By</th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Reason</th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                            <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                        {requests.length === 0 ? (
                            <tr className="border-b transition-colors hover:bg-muted/50">
                                <td colSpan={5} className="p-4 align-middle text-center text-muted-foreground">
                                    No pending deletion requests.
                                </td>
                            </tr>
                        ) : (
                            requests.map((req) => (
                                <tr key={req.id} className="border-b transition-colors hover:bg-muted/50">
                                    <td className="p-4 align-middle">
                                        <div className="flex flex-col">
                                            <span className="font-medium">{req.student.user.name}</span>
                                            <span className="text-xs text-muted-foreground">{req.student.user.email}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 align-middle">
                                        <div className="flex flex-col">
                                            <span className="font-medium">{req.staff.name}</span>
                                            <span className="text-xs text-muted-foreground">{req.staff.email}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 align-middle">{req.reason}</td>
                                    <td className="p-4 align-middle">{new Date(req.createdAt).toLocaleDateString()}</td>
                                    <td className="p-4 align-middle text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleAction(req.id, 'APPROVE')}
                                                className="p-2 hover:bg-green-100 rounded-full text-green-600 transition-colors"
                                                title="Approve"
                                            >
                                                <Check className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleAction(req.id, 'REJECT')}
                                                className="p-2 hover:bg-red-100 rounded-full text-red-600 transition-colors"
                                                title="Reject"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
