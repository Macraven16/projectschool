"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Search, Eye, Edit, Trash2, CheckCircle, Shield } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { User, School } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";

// Simple Table components
function Table({ children, className }: { children: React.ReactNode; className?: string }) {
    return <div className={`w-full overflow-auto ${className || ""}`}><table className="w-full caption-bottom text-sm">{children}</table></div>;
}
function TableHeader({ children, className }: { children: React.ReactNode; className?: string }) {
    return <thead className={`[&_tr]:border-b bg-muted/50 ${className || ""}`}>{children}</thead>;
}
function TableBody({ children, className }: { children: React.ReactNode; className?: string }) {
    return <tbody className={`[&_tr:last-child]:border-0 ${className || ""}`}>{children}</tbody>;
}
function TableRow({ children, className }: { children: React.ReactNode; className?: string }) {
    return <tr className={`border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted ${className || ""}`}>{children}</tr>;
}
function TableHead({ children, className }: { children: React.ReactNode; className?: string }) {
    return <th className={`h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 ${className || ""}`}>{children}</th>;
}
function TableCell({ children, className }: { children: React.ReactNode; className?: string }) {
    return <td className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 ${className || ""}`}>{children}</td>;
}

export default function UserManagementTable() {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState("ALL");
    const [schoolFilter, setSchoolFilter] = useState("ALL");
    const [schools, setSchools] = useState<School[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);

    useEffect(() => {
        fetchUsers();
        fetchSchools();
    }, []);

    useEffect(() => {
        let result = users;

        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            result = result.filter(user =>
                user.name.toLowerCase().includes(lowerQuery) ||
                user.email.toLowerCase().includes(lowerQuery)
            );
        }

        if (roleFilter !== "ALL") {
            result = result.filter(user => user.role === roleFilter);
        }

        if (schoolFilter !== "ALL") {
            result = result.filter(user => user.schoolId === schoolFilter);
        }

        setFilteredUsers(result);
    }, [users, searchQuery, roleFilter, schoolFilter]);

    const fetchUsers = async () => {
        try {
            const res = await fetch("/api/users", {
                headers: { Authorization: `Bearer ${localStorage.getItem("school_fintech_token")}` }
            });
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
                setFilteredUsers(data);
            }
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSchools = async () => {
        try {
            const res = await fetch("/api/universities");
            if (res.ok) {
                const data = await res.json();
                setSchools(data);
            }
        } catch (error) {
            console.error("Failed to fetch schools", error);
        }
    };

    const handleDeleteUser = async (id: string, targetRole: string) => {
        const isRequest = currentUser?.role === 'STAFF' && targetRole === 'STUDENT';
        const message = isRequest
            ? "Are you sure you want to REQUEST deletion for this student?"
            : "Are you sure you want to delete this user?";

        if (!confirm(message)) return;

        try {
            const res = await fetch(`/api/users/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${localStorage.getItem("school_fintech_token")}` }
            });

            if (res.status === 202) {
                alert("Deletion request sent successfully.");
                return;
            }

            if (res.ok) {
                alert("User deleted successfully.");
                fetchUsers();
            } else {
                const data = await res.json();
                alert(data.error || "Failed to delete user");
            }
        } catch (error) {
            console.error("Failed to delete user", error);
        }
    };

    return (
        <>
            <Card className="border-none shadow-none">
                <CardHeader className="px-0 pt-0">
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <input
                                placeholder="Search users..."
                                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring pl-8"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                            <select
                                className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                            >
                                <option value="ALL">All Roles</option>
                                <option value="STUDENT">Students</option>
                                <option value="STAFF">Staff</option>
                                <option value="ADMIN">Admins</option>
                            </select>
                            <select
                                className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                value={schoolFilter}
                                onChange={(e) => setSchoolFilter(e.target.value)}
                            >
                                <option value="ALL">All Schools</option>
                                {schools.map(school => (
                                    <option key={school.id} value={school.id}>{school.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="px-0">
                    {loading ? (
                        <div className="flex items-center justify-center py-8 text-muted-foreground">
                            Loading users...
                        </div>
                    ) : (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>School</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredUsers.length === 0 ? (
                                        <TableRow>
                                            <TableCell>
                                                <div className="py-6 text-center text-muted-foreground">
                                                    No users found matching your filters.
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredUsers.map((user) => (
                                            <TableRow key={user.id}>
                                                <TableCell className="font-medium">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                                            {user.name?.[0] || "U"}
                                                        </div>
                                                        {user.name}
                                                    </div>
                                                </TableCell>
                                                <TableCell>{user.email}</TableCell>
                                                <TableCell>
                                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${user.role === 'ADMIN' ? 'bg-red-100 text-red-800' :
                                                        user.role === 'STAFF' ? 'bg-purple-100 text-purple-800' :
                                                            'bg-blue-100 text-blue-800'
                                                        }`}>
                                                        {user.role}
                                                    </span>
                                                </TableCell>
                                                <TableCell>{user.school?.name || "-"}</TableCell>
                                                <TableCell>
                                                    <span className="inline-flex items-center gap-1 text-green-600 text-xs font-medium">
                                                        <CheckCircle className="h-3 w-3" /> Active
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => { setSelectedUser(user); setIsViewOpen(true); }}
                                                            className="p-2 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground"
                                                            title="View Details"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => { setSelectedUser(user); setIsEditOpen(true); }}
                                                            className="p-2 hover:bg-muted rounded-full text-blue-600 hover:bg-blue-50"
                                                            title="Edit"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteUser(user.id, user.role)}
                                                            className={`p-2 hover:bg-muted rounded-full ${currentUser?.role === 'STAFF' && user.role === 'STUDENT'
                                                                ? "text-orange-600 hover:bg-orange-50"
                                                                : "text-red-600 hover:bg-red-50"
                                                                }`}
                                                            title={currentUser?.role === 'STAFF' && user.role === 'STUDENT' ? "Request Delete" : "Delete"}
                                                        >
                                                            {currentUser?.role === 'STAFF' && user.role === 'STUDENT' ? (
                                                                <Shield className="h-4 w-4" />
                                                            ) : (
                                                                <Trash2 className="h-4 w-4" />
                                                            )}
                                                        </button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* View User Modal */}
            <Modal isOpen={isViewOpen} onClose={() => setIsViewOpen(false)} title="User Details">
                {selectedUser && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl">
                                {selectedUser.name?.[0] || "U"}
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">{selectedUser.name}</h3>
                                <p className="text-muted-foreground">{selectedUser.email}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="font-medium text-muted-foreground">Role:</span>
                                <p>{selectedUser.role}</p>
                            </div>
                            <div>
                                <span className="font-medium text-muted-foreground">Status:</span>
                                <p className="text-green-600">Active</p>
                            </div>
                            <div>
                                <span className="font-medium text-muted-foreground">School:</span>
                                <p>{selectedUser.school?.name || "N/A"}</p>
                            </div>
                            {selectedUser.department && (
                                <div>
                                    <span className="font-medium text-muted-foreground">Department:</span>
                                    <p>{selectedUser.department.name}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </Modal>

            {/* Edit User Modal */}
            <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit User">
                {selectedUser && (
                    <form
                        onSubmit={async (e) => {
                            e.preventDefault();
                            try {
                                const res = await fetch(`/api/users/${selectedUser.id}`, {
                                    method: "PUT",
                                    headers: {
                                        "Content-Type": "application/json",
                                        Authorization: `Bearer ${localStorage.getItem("school_fintech_token")}`,
                                    },
                                    body: JSON.stringify({
                                        name: selectedUser.name,
                                        email: selectedUser.email,
                                        role: selectedUser.role,
                                        schoolId: selectedUser.schoolId,
                                        indexNumber: selectedUser.student?.studentIdNumber,
                                    }),
                                });

                                if (res.ok) {
                                    setIsEditOpen(false);
                                    fetchUsers(); // Refresh list
                                } else {
                                    alert("Failed to update user");
                                }
                            } catch (error) {
                                console.error("Failed to update user", error);
                            }
                        }}
                        className="space-y-4"
                    >
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Full Name</label>
                            <input
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                value={selectedUser.name}
                                onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email</label>
                            <input
                                type="email"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                value={selectedUser.email}
                                onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Role</label>
                            <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                value={selectedUser.role}
                                onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value as User["role"] })}
                            >
                                <option value="STUDENT">Student</option>
                                <option value="STAFF">Staff</option>
                                <option value="ADMIN">Admin</option>
                                <option value="MASTER_ADMIN">Master Admin</option>
                            </select>
                        </div>

                        {/* School Selection - Visible for all roles as they can belong to a school */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Assigned School</label>
                            <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                value={selectedUser.schoolId || ""}
                                onChange={(e) => setSelectedUser({ ...selectedUser, schoolId: e.target.value || undefined })}
                            >
                                <option value="">No School Assigned</option>
                                {schools.map((school) => (
                                    <option key={school.id} value={school.id}>
                                        {school.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Index Number - Only for Students */}
                        {selectedUser.role === 'STUDENT' && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Index Number</label>
                                <input
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    value={selectedUser.student?.studentIdNumber || ""}
                                    onChange={(e) => setSelectedUser({
                                        ...selectedUser,
                                        student: { ...selectedUser.student, studentIdNumber: e.target.value } as any
                                    })}
                                    placeholder="e.g. UNIV/24/001"
                                />
                            </div>
                        )}

                        <div className="flex justify-end gap-2 pt-4">
                            <button
                                type="button"
                                onClick={() => setIsEditOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                )}
            </Modal>
        </>
    );
}
