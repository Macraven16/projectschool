"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import UserManagementTable from "@/components/UserManagementTable";
import UserForm from "@/components/UserForm";
import { Users, UserPlus, Settings, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import DeletionRequestsTable from "@/components/DeletionRequestsTable";

import { useAuth } from "@/lib/auth-context";

import { Suspense } from "react";

function UsersContent() {
    const { user } = useAuth();
    const searchParams = useSearchParams();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("all");
    const [isPasswordResetOpen, setIsPasswordResetOpen] = useState(false);
    const [isStatusUpdateOpen, setIsStatusUpdateOpen] = useState(false);
    const [isRoleAssignmentOpen, setIsRoleAssignmentOpen] = useState(false);

    // New state for multi-select
    const [users, setUsers] = useState<any[]>([]);
    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
    const [userSearch, setUserSearch] = useState("");
    const [newRole, setNewRole] = useState("STUDENT");

    useEffect(() => {
        const tab = searchParams.get("tab");
        if (tab) {
            setActiveTab(tab);
        }
    }, [searchParams]);

    useEffect(() => {
        if (isRoleAssignmentOpen || isStatusUpdateOpen || isPasswordResetOpen) {
            fetchUsers();
        }
    }, [isRoleAssignmentOpen, isStatusUpdateOpen, isPasswordResetOpen]);

    const fetchUsers = async () => {
        try {
            const res = await fetch("/api/users", {
                headers: { Authorization: `Bearer ${localStorage.getItem("school_fintech_token")}` }
            });
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch (error) {
            console.error("Failed to fetch users", error);
        }
    };

    const handleRoleUpdate = async () => {
        if (selectedUserIds.length === 0) return;

        try {
            // Process in parallel
            await Promise.all(selectedUserIds.map(id =>
                fetch(`/api/users/${id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("school_fintech_token")}`,
                    },
                    body: JSON.stringify({ role: newRole }),
                })
            ));

            setIsRoleAssignmentOpen(false);
            setSelectedUserIds([]);
            // Ideally trigger refresh of table
            window.location.reload(); // Simple refresh for now
        } catch (error) {
            console.error("Failed to update roles", error);
            alert("Failed to update roles");
        }
    };

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.email.toLowerCase().includes(userSearch.toLowerCase())
    );

    const toggleUserSelection = (userId: string) => {
        setSelectedUserIds(prev =>
            prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
        );
    };

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        router.push(`/admin/users?tab=${tab}`);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
                <p className="text-muted-foreground">
                    Manage students, staff, and administrators across the institution.
                </p>
            </div>

            {/* Custom Tabs */}
            <div className="flex flex-col space-y-4">
                <div className="flex items-center p-1 bg-muted/50 rounded-lg w-full md:w-fit border">
                    <button
                        onClick={() => handleTabChange("all")}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === "all"
                            ? "bg-background text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                            }`}
                    >
                        <Users className="h-4 w-4" />
                        User Management
                    </button>
                    <button
                        onClick={() => handleTabChange("add")}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === "add"
                            ? "bg-background text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                            }`}
                    >
                        <UserPlus className="h-4 w-4" />
                        Add New User
                    </button>
                    {user?.role === 'MASTER_ADMIN' && (
                        <button
                            onClick={() => handleTabChange("requests")}
                            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === "requests"
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                                }`}
                        >
                            <Shield className="h-4 w-4" />
                            Requests
                        </button>
                    )}
                </div>

                <div className="mt-4">
                    {activeTab === "all" && (
                        <div className="space-y-8">
                            {/* Quick Actions & Bulk Tools */}
                            <div className="grid gap-6 md:grid-cols-2">
                                {/* Quick Actions */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">Quick Actions</h3>
                                    <div className="grid gap-4 grid-cols-2">
                                        <button
                                            onClick={() => handleTabChange("add")}
                                            className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border bg-card hover:bg-accent/50 transition-all text-center group h-full"
                                        >
                                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                                                <UserPlus className="h-5 w-5" />
                                            </div>
                                            <span className="font-medium text-sm">Add User</span>
                                        </button>
                                        <button
                                            onClick={() => setIsStatusUpdateOpen(true)}
                                            className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border bg-card hover:bg-accent/50 transition-all text-center group h-full"
                                        >
                                            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                                                <Users className="h-5 w-5" />
                                            </div>
                                            <span className="font-medium text-sm">Bulk Status</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Bulk Tools */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">Management Tools</h3>
                                    <div className="grid gap-4 grid-cols-2">
                                        <button
                                            onClick={() => setIsPasswordResetOpen(true)}
                                            className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border bg-card hover:bg-accent/50 transition-all text-center group h-full"
                                        >
                                            <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
                                                <Shield className="h-5 w-5" />
                                            </div>
                                            <span className="font-medium text-sm">Reset Passwords</span>
                                        </button>
                                        <button
                                            onClick={() => setIsRoleAssignmentOpen(true)}
                                            className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border bg-card hover:bg-accent/50 transition-all text-center group h-full"
                                        >
                                            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
                                                <Settings className="h-5 w-5" />
                                            </div>
                                            <span className="font-medium text-sm">Assign Roles</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">User Directory</h3>
                                <UserManagementTable />
                            </div>
                        </div>
                    )}

                    {activeTab === "add" && (
                        <div className="max-w-4xl">
                            <UserForm onSuccess={() => handleTabChange("all")} />
                        </div>
                    )}

                    {activeTab === "requests" && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Pending Deletion Requests</h3>
                            <DeletionRequestsTable />
                        </div>
                    )}


                </div>
            </div>

            {/* Modals */}
            <Modal isOpen={isPasswordResetOpen} onClose={() => setIsPasswordResetOpen(false)} title="Password Reset Tool">
                <div className="space-y-4">
                    <p className="text-muted-foreground">Select users to reset their passwords. A temporary password will be sent to their email.</p>
                    <div className="space-y-2">
                        <input
                            placeholder="Search users..."
                            className="w-full p-2 border rounded-md text-sm"
                            value={userSearch}
                            onChange={(e) => setUserSearch(e.target.value)}
                        />
                        <div className="h-48 overflow-y-auto border rounded-md p-2 space-y-1">
                            {filteredUsers.map(u => (
                                <div key={u.id} className="flex items-center gap-2 p-1 hover:bg-muted rounded cursor-pointer" onClick={() => toggleUserSelection(u.id)}>
                                    <input type="checkbox" checked={selectedUserIds.includes(u.id)} readOnly />
                                    <span className="text-sm">{u.name} ({u.email})</span>
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-muted-foreground">{selectedUserIds.length} users selected</p>
                    </div>
                    <div className="flex justify-end gap-2">
                        <button onClick={() => setIsPasswordResetOpen(false)} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">Cancel</button>
                        <button onClick={() => setIsPasswordResetOpen(false)} className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90">Send Reset Links</button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={isStatusUpdateOpen} onClose={() => setIsStatusUpdateOpen(false)} title="Bulk Status Update">
                <div className="space-y-4">
                    <p className="text-muted-foreground">Change the status of multiple users at once.</p>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">New Status</label>
                        <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                            <option value="ACTIVE">Active</option>
                            <option value="INACTIVE">Inactive</option>
                            <option value="SUSPENDED">Suspended</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <input
                            placeholder="Search users..."
                            className="w-full p-2 border rounded-md text-sm"
                            value={userSearch}
                            onChange={(e) => setUserSearch(e.target.value)}
                        />
                        <div className="h-48 overflow-y-auto border rounded-md p-2 space-y-1">
                            {filteredUsers.map(u => (
                                <div key={u.id} className="flex items-center gap-2 p-1 hover:bg-muted rounded cursor-pointer" onClick={() => toggleUserSelection(u.id)}>
                                    <input type="checkbox" checked={selectedUserIds.includes(u.id)} readOnly />
                                    <span className="text-sm">{u.name} ({u.email})</span>
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-muted-foreground">{selectedUserIds.length} users selected</p>
                    </div>
                    <div className="flex justify-end gap-2">
                        <button onClick={() => setIsStatusUpdateOpen(false)} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">Cancel</button>
                        <button onClick={() => setIsStatusUpdateOpen(false)} className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90">Update Status</button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={isRoleAssignmentOpen} onClose={() => setIsRoleAssignmentOpen(false)} title="Role Assignment">
                <div className="space-y-4">
                    <p className="text-muted-foreground">Assign a new role to selected users.</p>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">New Role</label>
                        <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={newRole}
                            onChange={(e) => setNewRole(e.target.value)}
                        >
                            <option value="STUDENT">Student</option>
                            <option value="STAFF">Staff</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <input
                            placeholder="Search users..."
                            className="w-full p-2 border rounded-md text-sm"
                            value={userSearch}
                            onChange={(e) => setUserSearch(e.target.value)}
                        />
                        <div className="h-48 overflow-y-auto border rounded-md p-2 space-y-1">
                            {filteredUsers.map(u => (
                                <div key={u.id} className="flex items-center gap-2 p-1 hover:bg-muted rounded cursor-pointer" onClick={() => toggleUserSelection(u.id)}>
                                    <input type="checkbox" checked={selectedUserIds.includes(u.id)} readOnly />
                                    <span className="text-sm">{u.name} ({u.email})</span>
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-muted-foreground">{selectedUserIds.length} users selected</p>
                    </div>
                    <div className="flex justify-end gap-2">
                        <button onClick={() => setIsRoleAssignmentOpen(false)} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">Cancel</button>
                        <button onClick={handleRoleUpdate} className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90">Assign Role</button>
                    </div>
                </div>
            </Modal>
        </div >
    );
}

export default function UsersPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
            <UsersContent />
        </Suspense>
    );
}
