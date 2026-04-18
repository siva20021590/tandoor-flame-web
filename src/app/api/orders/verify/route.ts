import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { prisma } from "@/lib/prisma";

interface VerifyBody {
  orderId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as VerifyBody | null;
  if (
    !body?.orderId ||
    !body.razorpayOrderId ||
    !body.razorpayPaymentId ||
    !body.razorpaySignature
  ) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    return NextResponse.json(
      { error: "Razorpay not configured" },
      { status: 500 },
    );
  }

  const existing = await prisma.order.findUnique({
    where: { id: body.orderId },
    select: { id: true, razorpayOrderId: true },
  });

  if (!existing) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (
    !existing.razorpayOrderId ||
    existing.razorpayOrderId !== body.razorpayOrderId
  ) {
    return NextResponse.json(
      { error: "Order/payment mismatch" },
      { status: 400 },
    );
  }

  const expected = crypto
    .createHmac("sha256", keySecret)
    .update(`${body.razorpayOrderId}|${body.razorpayPaymentId}`)
    .digest("hex");

  if (expected !== body.razorpaySignature) {
    await prisma.order.updateMany({
      where: { id: body.orderId },
      data: { paymentStatus: "failed" },
    });
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const order = await prisma.order.update({
    where: { id: body.orderId, razorpayOrderId: body.razorpayOrderId },
    data: {
      paymentStatus: "paid",
      status: "paid",
      razorpayPaymentId: body.razorpayPaymentId,
    },
  });

  return NextResponse.json({ ok: true, orderId: order.id });
}
