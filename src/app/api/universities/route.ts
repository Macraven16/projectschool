import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const universities = await prisma.university.findMany({
            orderBy: { name: 'asc' },
        });
        return NextResponse.json(universities);
    } catch (error) {
        console.error('Get universities error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, code, address, contactEmail, contactPhone, logo } = body;

        if (!name || !code) {
            return NextResponse.json({ error: 'Name and Code are required' }, { status: 400 });
        }

        const existingSchool = await prisma.university.findFirst({
            where: { OR: [{ name }, { code }] }
        });

        if (existingSchool) {
            return NextResponse.json({ error: 'School with this name or code already exists' }, { status: 409 });
        }

        const school = await prisma.university.create({
            data: {
                name,
                code,
                address,
                contactEmail,
                contactPhone,
                logo,
                verified: true // Auto-verify for now
            }
        });

        return NextResponse.json(school, { status: 201 });
    } catch (error) {
        console.error('Create university error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
