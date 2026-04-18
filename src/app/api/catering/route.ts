import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { cateringSchema } from "@/lib/validators";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = cateringSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }
  const {
    name,
    email,
    phone,
    eventType,
    eventDate,
    guestCount,
    venue,
    budget,
    message,
  } = parsed.data;
  const date = new Date(eventDate);
  if (Number.isNaN(date.getTime())) {
    return NextResponse.json({ error: "Invalid event date" }, { status: 400 });
  }
  const inquiry = await prisma.cateringInquiry.create({
    data: {
      name,
      email: email.toLowerCase(),
      phone,
      eventType,
      eventDate: date,
      guestCount,
      venue: venue || null,
      budget: budget || null,
      message: message || null,
    },
  });
  return NextResponse.json({ id: inquiry.id }, { status: 201 });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const inquiries = await prisma.cateringInquiry.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  return NextResponse.json({ inquiries });
}
