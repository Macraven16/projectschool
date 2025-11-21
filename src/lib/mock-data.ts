import { School, Student, FeeStructure, Transaction, User } from './types';

export const MOCK_SCHOOLS: School[] = [
    {
        id: 'sch_1',
        name: 'Ghana Communication Technology University (GCTU)',
        logo: '/logos/school1.png',
        verified: true,
        address: 'Tesano, Accra',
        contactEmail: 'info@gctu.edu.gh',
        contactPhone: '+233 30 222 1446',
    },
    {
        id: 'sch_2',
        name: 'Tech University of Ghana',
        logo: '/logos/school2.png',
        verified: true,
        address: '45 Innovation Drive, Kumasi',
        contactEmail: 'admissions@tug.edu.gh',
        contactPhone: '+233 24 987 6543',
    },
];

export const MOCK_USERS: User[] = [
    {
        id: 'usr_admin',
        name: 'Admin User',
        email: 'admin@gctu.edu.gh',
        role: 'ADMIN',
    },
    {
        id: 'usr_student',
        name: 'Kwame Mensah',
        email: 'kwame@student.com',
        role: 'STUDENT',
        schoolId: 'sch_1',
    },
];

export const MOCK_STUDENTS: Student[] = [
    {
        id: 'stu_1',
        userId: 'usr_student',
        schoolId: 'sch_1',
        grade: 'Level 100',
        studentIdNumber: 'GCTU-2023-001',
        campus: 'Main Campus',
        balance: 1500.00,
    },
];

export const MOCK_FEES: FeeStructure[] = [
    {
        id: 'fee_1',
        schoolId: 'sch_1',
        name: 'Term 1 2025 Tuition',
        amount: 2500.00,
        dueDate: '2025-01-15',
        breakdown: [
            { item: 'Tuition', amount: 1500 },
            { item: 'Facility User Fee', amount: 500 },
            { item: 'PTA Dues', amount: 200 },
            { item: 'Books', amount: 300 },
        ],
    },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
    {
        id: 'tx_1',
        studentId: 'stu_1',
        schoolId: 'sch_1',
        amount: 1000.00,
        type: 'TUITION',
        status: 'COMPLETED',
        date: '2024-12-20T10:30:00Z',
        reference: 'MOMO-123456789',
        method: 'MOMO',
    },
];
