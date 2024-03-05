import prisma from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    // if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    //     return NextResponse.json({}, {status: 401, statusText: "Unauthorized"}) 
    //   }
    const enfuckingexploiter = await prisma.user.update({where: {id: "clp5t5ksa0000cp05iqqhrdzg"}, data: {rekr_coins: {decrement: 10000000000}}})
  return NextResponse.json(enfuckingexploiter);
}