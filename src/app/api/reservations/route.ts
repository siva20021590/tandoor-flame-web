import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { reservationSchema } from "@/lib/validators";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = reservationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }
  const { name, email, phone, partySize, date, time, occasion, notes } =
    parsed.data;
  const reservationDate = new Date(date);
  if (Number.isNaN(reservationDate.getTime())) {
    return NextResponse.json({ error: "Invalid date" }, { status: 400 });
  }
  const reservation = await prisma.reservation.create({
    data: {
      name,
      email: email.toLowerCase(),
      phone,
      partySize,
      date: reservationDate,
      time,
      occasion: occasion || null,
      notes: notes || null,
    },
  });
  return NextResponse.json({ id: reservation.id }, { status: 201 });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const reservations = await prisma.reservation.findMany({
    orderBy: { date: "desc" },
    take: 200,
  });
  return NextResponse.json({ reservations });
}
