"use client";

import { useState } from "react";
import { MOCK_STUDENTS, MOCK_USERS } from "@/lib/mock-data";
import { Search, Filter, MoreHorizontal, Mail, FileText, Plus, Trash2, Edit, Download, Printer, X, CheckSquare, Square } from "lucide-react";

export default function StudentsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [showBulkAdd, setShowBulkAdd] = useState(false);
    const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

    // Mock State for Students (in real app, use context/backend)
    const [students, setStudents] = useState(
        MOCK_STUDENTS.map(student => {
            const user = MOCK_USERS.find(u => u.id === student.userId);
            return { ...student, name: user?.name, email: user?.email };
        })
    );

    const filteredStudents = students.filter(student =>
        student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.studentIdNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddStudent = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock Add Logic
        alert("Student Added Successfully!");
        setShowAddModal(false);
    };

    const handleBulkAdd = () => {
        // Mock Bulk Add Logic
        alert("5 Students Added Successfully!");
        setShowBulkAdd(false);
    };

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this student?")) {
            setStudents(students.filter(s => s.id !== id));
        }
    };

    const toggleSelectAll = () => {
        if (selectedStudents.length === filteredStudents.length) {
            setSelectedStudents([]);
        } else {
            setSelectedStudents(filteredStudents.map(s => s.id));
        }
    };

    const toggleSelectStudent = (id: string) => {
        if (selectedStudents.includes(id)) {
            setSelectedStudents(selectedStudents.filter(s => s !== id));
        } else {
            setSelectedStudents([...selectedStudents, id]);
        }
    };

    return (
        <div className="space-y-6 relative">
            {/* Add Student Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="w-full max-w-md rounded-xl bg-card p-6 shadow-xl border animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">Add New Student</h3>
                            <button onClick={() => setShowAddModal(false)}><X className="h-5 w-5" /></button>
                        </div>
                        <form onSubmit={handleAddStudent} className="space-y-4">
                            <input type="text" placeholder="Full Name" className="w-full p-2 border rounded-md" required />
                            <input type="email" placeholder="Email" className="w-full p-2 border rounded-md" required />
                            <input type="text" placeholder="Student ID" className="w-full p-2 border rounded-md" required />
                            <input type="text" placeholder="Grade/Class" className="w-full p-2 border rounded-md" required />
                            <button type="submit" className="w-full bg-primary text-primary-foreground py-2 rounded-md">Add Student</button>
                        </form>
                    </div>
                </div>
            )}

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Students</h1>
                    <p className="text-muted-foreground">Manage student enrollment and financial status.</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowBulkAdd(!showBulkAdd)}
                        className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Bulk Add (5)
                    </button>
                    {showBulkAdd && (
                        <div className="absolute top-20 right-4 z-10 bg-card border shadow-lg p-4 rounded-lg w-64">
                            <p className="text-sm mb-2">Add 5 students at once?</p>
                            <button onClick={handleBulkAdd} className="w-full bg-primary text-primary-foreground py-1 rounded text-sm">Confirm</button>
                        </div>
                    )}
                    <button className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground">
                        <Filter className="mr-2 h-4 w-4" />
                        Filter
                    </button>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Student
                    </button>
                </div>
            </div>

            <div className="flex items-center justify-between py-4">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                        type="search"
                        placeholder="Search students..."
                        className="w-full rounded-md border border-input bg-background pl-8 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <button className="p-2 border rounded-md hover:bg-muted" title="Print List">
                        <Printer className="h-4 w-4" />
                    </button>
                    <button className="p-2 border rounded-md hover:bg-muted" title="Export CSV">
                        <Download className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <div className="rounded-md border bg-card">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[50px]">
                                    <button onClick={toggleSelectAll}>
                                        {selectedStudents.length === filteredStudents.length && filteredStudents.length > 0 ?
                                            <CheckSquare className="h-4 w-4" /> :
                                            <Square className="h-4 w-4" />
                                        }
                                    </button>
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Student ID</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Grade</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Outstanding Balance</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {filteredStudents.map((student) => (
                                <tr key={student.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <td className="p-4 align-middle">
                                        <button onClick={() => toggleSelectStudent(student.id)}>
                                            {selectedStudents.includes(student.id) ?
                                                <CheckSquare className="h-4 w-4 text-primary" /> :
                                                <Square className="h-4 w-4 text-muted-foreground" />
                                            }
                                        </button>
                                    </td>
                                    <td className="p-4 align-middle font-medium">{student.studentIdNumber}</td>
                                    <td className="p-4 align-middle">
                                        <div className="flex flex-col">
                                            <span className="font-medium">{student.name}</span>
                                            <span className="text-xs text-muted-foreground">{student.email}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 align-middle">{student.grade}</td>
                                    <td className="p-4 align-middle">
                                        <span className={student.balance > 0 ? "text-destructive font-medium" : "text-green-600 font-medium"}>
                                            GHS {student.balance.toLocaleString()}
                                        </span>
                                    </td>
                                    <td className="p-4 align-middle">
                                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary hover:bg-primary/20">
                                            Active
                                        </span>
                                    </td>
                                    <td className="p-4 align-middle text-right">
                                        <div className="flex justify-end gap-2">
                                            <button className="p-2 hover:bg-accent rounded-md" title="Edit Student">
                                                <Edit className="h-4 w-4 text-muted-foreground" />
                                            </button>
                                            <button className="p-2 hover:bg-accent rounded-md" title="Send Reminder">
                                                <Mail className="h-4 w-4 text-muted-foreground" />
                                            </button>
                                            <button className="p-2 hover:bg-accent rounded-md" title="View Invoice">
                                                <FileText className="h-4 w-4 text-muted-foreground" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(student.id)}
                                                className="p-2 hover:bg-destructive/10 rounded-md"
                                                title="Delete Student"
                                            >
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
