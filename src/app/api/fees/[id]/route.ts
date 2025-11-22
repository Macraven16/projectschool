import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { name, amount, dueDate, schoolId, breakdown } = body;

        const fee = await prisma.feeStructure.update({
            where: { id },
            data: {
                name,
                amount: parseFloat(amount),
                dueDate: new Date(dueDate),
                schoolId,
                breakdown: breakdown || [],
            },
        });

        return NextResponse.json(fee);
    } catch (error) {
        console.error('Update fee error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await prisma.feeStructure.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete fee error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
