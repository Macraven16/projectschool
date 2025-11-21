"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/lib/types";
import { MOCK_USERS } from "@/lib/mock-data";
import { useRouter } from "next/navigation";

interface AuthContextType {
    user: User | null;
    login: (email: string, role: User["role"], name?: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Check local storage for persisted user
        const storedUser = localStorage.getItem("school_fintech_user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, role: User["role"], name?: string) => {
        setIsLoading(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Find mock user or create a temporary one
        const foundUser = MOCK_USERS.find((u) => u.email === email && u.role === role);

        const userToSet = foundUser || {
            id: `usr_${Date.now()}`,
            name: name || email.split("@")[0],
            email,
            role,
        };

        setUser(userToSet);
        localStorage.setItem("school_fintech_user", JSON.stringify(userToSet));
        setIsLoading(false);

        // Redirect based on role
        if (role === "ADMIN") {
            router.push("/admin");
        } else {
            router.push("/student");
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("school_fintech_user");
        router.push("/login");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
