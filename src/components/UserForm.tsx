"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, Loader2 } from "lucide-react";
import { School } from "@/lib/types";
import { SearchableSelect } from "@/components/ui/searchable-select";

interface Department {
    id: string;
    name: string;
}

export default function UserForm({ onSuccess }: { onSuccess?: () => void }) {
    const [newUser, setNewUser] = useState({
        name: "",
        email: "",
        password: "",
        role: "STUDENT",
        departmentId: "",
        schoolId: "",
        phoneNumber: ""
    });
    const [departments, setDepartments] = useState<Department[]>([]);
    const [schools, setSchools] = useState<School[]>([]);
    const [loading, setLoading] = useState(false);
    const [indexNumber, setIndexNumber] = useState("");
    const [emailUsername, setEmailUsername] = useState("");
    const [emailDomain, setEmailDomain] = useState("@st.university.edu");
    const [customSchoolName, setCustomSchoolName] = useState("");

    useEffect(() => {
        if (emailDomain === "OTHER") {
            setNewUser(prev => ({ ...prev, email: emailUsername }));
        } else {
            setNewUser(prev => ({ ...prev, email: `${emailUsername}${emailDomain}` }));
        }
    }, [emailUsername, emailDomain]);

    useEffect(() => {
        fetchDepartments();
        fetchSchools();
    }, []);

    // Auto-generate index number when school/role changes (mock logic)
    useEffect(() => {
        if (newUser.role === 'STUDENT' && newUser.schoolId) {
            const schoolCode = schools.find(s => s.id === newUser.schoolId)?.code || 'SCH';
            const year = new Date().getFullYear().toString().slice(-2);
            const random = Math.floor(1000 + Math.random() * 9000);
            setIndexNumber(`${schoolCode}/${year}/${random}`);
        } else {
            setIndexNumber("");
        }
    }, [newUser.schoolId, newUser.role, schools]);

    const fetchDepartments = async () => {
        try {
            const res = await fetch("/api/departments");
            if (res.ok) {
                const data = await res.json();
                setDepartments(data);
            }
        } catch (error) {
            console.error("Failed to fetch departments", error);
        }
    };

    const fetchSchools = async () => {
        try {
            const res = await fetch("/api/universities");
            if (res.ok) {
                const data = await res.json();
                console.log("Fetched schools:", data);
                setSchools(data);
            }
        } catch (error) {
            console.error("Failed to fetch schools", error);
        }
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                ...newUser,
                studentIdNumber: indexNumber,
                schoolName: newUser.schoolId === 'OTHER' ? customSchoolName : undefined,
                schoolId: newUser.schoolId === 'OTHER' ? undefined : newUser.schoolId
            };
            const res = await fetch("/api/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("school_fintech_token")}`
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setNewUser({ name: "", email: "", password: "", role: "STUDENT", departmentId: "", schoolId: "", phoneNumber: "" });
                setIndexNumber("");
                setEmailUsername("");
                setEmailDomain("@st.university.edu");
                setCustomSchoolName("");
                alert("User created successfully");
                if (onSuccess) onSuccess();
            } else {
                const error = await res.json();
                alert(`Error: ${error.error}`);
            }
        } catch (error) {
            console.error("Failed to create user", error);
            alert("Failed to create user");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <UserPlus className="h-5 w-5" />
                    Add New User
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleCreateUser} className="space-y-4 max-w-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Full Name</label>
                            <input
                                type="text"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                value={newUser.name}
                                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                required
                                placeholder="John Doe"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email</label>
                            <div className="flex gap-2">
                                <input
                                    type={emailDomain === "OTHER" ? "email" : "text"}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    value={emailUsername}
                                    onChange={(e) => setEmailUsername(e.target.value)}
                                    required
                                    placeholder={emailDomain === "OTHER" ? "john@mail.com" : "john.doe"}
                                />
                                <select
                                    className="flex h-10 w-[180px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    value={emailDomain}
                                    onChange={(e) => setEmailDomain(e.target.value)}
                                >
                                    <option value="@st.university.edu">@st.university.edu</option>
                                    <option value="@university.edu">@university.edu</option>
                                    <option value="OTHER">Other</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Password</label>
                            <input
                                type="password"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                value={newUser.password}
                                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                required
                                placeholder="••••••••"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Phone Number</label>
                            <input
                                type="tel"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                value={newUser.phoneNumber}
                                onChange={(e) => setNewUser({ ...newUser, phoneNumber: e.target.value })}
                                placeholder="+233 20 000 0000"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Role</label>
                            <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                value={newUser.role}
                                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                            >
                                <option value="STUDENT">Student</option>
                                <option value="STAFF">Staff</option>
                                <option value="ADMIN">Admin</option>
                                <option value="MASTER_ADMIN">Master Admin</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Assign School</label>
                            <SearchableSelect
                                options={[
                                    ...schools.map(s => ({ value: s.id, label: s.name })),
                                    { value: "OTHER", label: "Other" }
                                ]}
                                value={newUser.schoolId}
                                onChange={(value) => setNewUser({ ...newUser, schoolId: value })}
                                placeholder="Select School"
                            />
                            {newUser.schoolId === 'OTHER' && (
                                <input
                                    type="text"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 mt-2"
                                    value={customSchoolName}
                                    onChange={(e) => setCustomSchoolName(e.target.value)}
                                    placeholder="Enter School Name"
                                    required
                                />
                            )}
                        </div>
                    </div>

                    {newUser.role === 'STUDENT' && indexNumber && (
                        <div className="p-4 bg-muted/50 rounded-lg border">
                            <p className="text-sm font-medium text-muted-foreground">Auto-generated Index Number</p>
                            <p className="text-lg font-mono font-bold tracking-wider">{indexNumber}</p>
                        </div>
                    )}

                    {newUser.role === 'STAFF' && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Department</label>
                            <SearchableSelect
                                options={departments.map(d => ({ value: d.id, label: d.name }))}
                                value={newUser.departmentId}
                                onChange={(value) => setNewUser({ ...newUser, departmentId: value })}
                                placeholder="Select Department"
                            />
                        </div>
                    )}

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full md:w-auto min-w-[150px]"
                        >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <UserPlus className="h-4 w-4 mr-2" />}
                            Create User
                        </button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
