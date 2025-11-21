export type Role = 'ADMIN' | 'STUDENT' | 'PARENT';

export interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
    schoolId?: string; // For students/parents
}

export interface School {
    id: string;
    name: string;
    logo: string;
    verified: boolean;
    address: string;
    contactEmail: string;
    contactPhone: string;
}

export interface FeeStructure {
    id: string;
    schoolId: string;
    name: string; // e.g., "Term 1 2025"
    amount: number;
    dueDate: string;
    breakdown: {
        item: string;
        amount: number;
    }[];
}

export interface Student {
    id: string;
    userId: string;
    schoolId: string;
    grade: string;
    studentIdNumber: string; // School specific ID
    campus: string;
    balance: number;
}

export interface Transaction {
    id: string;
    studentId: string;
    schoolId: string;
    amount: number;
    type: 'TUITION' | 'HOSTEL' | 'BOOKSTORE' | 'WALLET_TOPUP';
    status: 'PENDING' | 'COMPLETED' | 'FAILED';
    date: string;
    reference: string;
    method: 'MOMO' | 'CARD' | 'WALLET';
}

export interface Wallet {
    id: string;
    userId: string;
    balance: number;
}
