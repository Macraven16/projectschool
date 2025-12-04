"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { School, Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { GHANA_UNIVERSITIES } from "@/lib/constants";

export default function AddSchoolPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        contactEmail: "",
        contactPhone: "",
        logo: "", // Optional URL
    });
    const [selectedSchool, setSelectedSchool] = useState("");
    const [customSchool, setCustomSchool] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const finalName = selectedSchool === "Other" ? customSchool : selectedSchool;

        if (!finalName) {
            alert("Please select or enter a school name");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/universities", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, name: finalName }),
            });

            if (res.ok) {
                alert("School added successfully!");
                router.push("/admin"); // Redirect to dashboard or schools list
            } else {
                const error = await res.json();
                alert(`Error: ${error.error || "Failed to add school"}`);
            }
        } catch (error) {
            console.error("Failed to add school", error);
            alert("Failed to add school");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Add School</h1>
                <p className="text-muted-foreground">Register a new school in the system.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <School className="h-5 w-5" />
                        School Details
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">School Name</label>
                            <select
                                required
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                value={selectedSchool}
                                onChange={(e) => setSelectedSchool(e.target.value)}
                            >
                                <option value="">Select School</option>
                                {GHANA_UNIVERSITIES.map((uni) => (
                                    <option key={uni} value={uni}>
                                        {uni}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {selectedSchool === "Other" && (
                            <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                <label className="text-sm font-medium">Enter School Name</label>
                                <input
                                    required
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    placeholder="e.g. Achimota School"
                                    value={customSchool}
                                    onChange={(e) => setCustomSchool(e.target.value)}
                                />
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Address</label>
                            <textarea
                                required
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                placeholder="School location address"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Contact Email</label>
                                <input
                                    type="email"
                                    required
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    placeholder="admin@school.edu"
                                    value={formData.contactEmail}
                                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Contact Phone</label>
                                <input
                                    type="tel"
                                    required
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    placeholder="+233..."
                                    value={formData.contactPhone}
                                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Logo URL (Optional)</label>
                            <input
                                type="url"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                placeholder="https://..."
                                value={formData.logo}
                                onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                            />
                        </div>

                        <div className="pt-4 flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                            >
                                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                                Save School
                            </button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
