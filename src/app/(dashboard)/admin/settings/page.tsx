"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MOCK_SCHOOLS } from "@/lib/mock-data";
import { Save, School, Bell, Shield, CreditCard, UserPlus, Users } from "lucide-react";

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("general");
    const [newAdminEmail, setNewAdminEmail] = useState("");

    // Mock using the first school
    const school = MOCK_SCHOOLS[0];

    const handleSave = () => {
        alert("Settings saved successfully!");
    };

    const handleAddAdmin = (e: React.FormEvent) => {
        e.preventDefault();
        alert(`Invitation sent to ${newAdminEmail}`);
        setNewAdminEmail("");
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                    <p className="text-muted-foreground">Manage school profile and system preferences.</p>
                </div>
                <button
                    onClick={handleSave}
                    className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
                >
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                </button>
            </div>

            <div className="grid gap-6 md:grid-cols-[250px_1fr]">
                <nav className="flex flex-col space-y-1">
                    <button
                        onClick={() => setActiveTab("general")}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${activeTab === 'general' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'}`}
                    >
                        <School className="h-4 w-4" />
                        General
                    </button>
                    <button
                        onClick={() => setActiveTab("payments")}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${activeTab === 'payments' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'}`}
                    >
                        <CreditCard className="h-4 w-4" />
                        Payments
                    </button>
                    <button
                        onClick={() => setActiveTab("notifications")}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${activeTab === 'notifications' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'}`}
                    >
                        <Bell className="h-4 w-4" />
                        Notifications
                    </button>
                    <button
                        onClick={() => setActiveTab("security")}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${activeTab === 'security' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'}`}
                    >
                        <Shield className="h-4 w-4" />
                        Security & Roles
                    </button>
                </nav>

                <div className="space-y-6">
                    {activeTab === "general" && (
                        <Card>
                            <CardHeader>
                                <CardTitle>School Profile</CardTitle>
                                <CardDescription>Update your school's public information.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">School Name</label>
                                    <input
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        defaultValue={school.name}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">Address</label>
                                    <input
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        defaultValue={school.address}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <label className="text-sm font-medium">Contact Email</label>
                                        <input
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                            defaultValue={school.contactEmail}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <label className="text-sm font-medium">Phone Number</label>
                                        <input
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                            defaultValue={school.contactPhone}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {activeTab === "payments" && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Payment Configuration</CardTitle>
                                <CardDescription>Manage how you receive payments.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <label className="text-base font-medium">Accept Mobile Money</label>
                                        <p className="text-sm text-muted-foreground">Allow students to pay via MTN, Vodafone, etc.</p>
                                    </div>
                                    <input type="checkbox" className="h-4 w-4" defaultChecked />
                                </div>
                                <div className="flex items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <label className="text-base font-medium">Accept Card Payments</label>
                                        <p className="text-sm text-muted-foreground">Allow Visa and Mastercard payments.</p>
                                    </div>
                                    <input type="checkbox" className="h-4 w-4" defaultChecked />
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {activeTab === "notifications" && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Notification Preferences</CardTitle>
                                <CardDescription>Configure automated alerts.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <label className="text-base font-medium">Payment Receipts</label>
                                        <p className="text-sm text-muted-foreground">Automatically email receipts to students.</p>
                                    </div>
                                    <input type="checkbox" className="h-4 w-4" defaultChecked />
                                </div>
                                <div className="flex items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <label className="text-base font-medium">Due Date Reminders</label>
                                        <p className="text-sm text-muted-foreground">Send reminders 3 days before due date.</p>
                                    </div>
                                    <input type="checkbox" className="h-4 w-4" defaultChecked />
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {activeTab === "security" && (
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Admin Access</CardTitle>
                                    <CardDescription>Manage administrators and permissions.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <form onSubmit={handleAddAdmin} className="flex gap-2">
                                        <input
                                            type="email"
                                            placeholder="Enter email to invite admin"
                                            className="flex-1 p-2 border rounded-md"
                                            value={newAdminEmail}
                                            onChange={(e) => setNewAdminEmail(e.target.value)}
                                            required
                                        />
                                        <button type="submit" className="bg-primary text-primary-foreground px-4 py-2 rounded-md flex items-center gap-2">
                                            <UserPlus className="h-4 w-4" /> Invite
                                        </button>
                                    </form>

                                    <div className="mt-4 space-y-2">
                                        <h4 className="text-sm font-medium">Current Admins</h4>
                                        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">AD</div>
                                                <div>
                                                    <p className="text-sm font-medium">Admin User</p>
                                                    <p className="text-xs text-muted-foreground">admin@edupay.com</p>
                                                </div>
                                            </div>
                                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Super Admin</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Security Settings</CardTitle>
                                    <CardDescription>Configure password policies and 2FA.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <label className="text-base font-medium">Two-Factor Authentication</label>
                                            <p className="text-sm text-muted-foreground">Require 2FA for all admin accounts.</p>
                                        </div>
                                        <input type="checkbox" className="h-4 w-4" />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
