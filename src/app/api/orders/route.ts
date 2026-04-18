import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { orderSchema } from "@/lib/validators";
import { getRazorpayClient, isRazorpayConfigured } from "@/lib/razorpay";
import { brand } from "@/lib/brand";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = orderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid order" },
      { status: 400 },
    );
  }
  const data = parsed.data;

  if (data.orderType === "delivery" && !data.deliveryAddress) {
    return NextResponse.json(
      { error: "Delivery address is required" },
      { status: 400 },
    );
  }

  const menuIds = data.items.map((i) => i.menuItemId);
  const menuItems = await prisma.menuItem.findMany({
    where: { id: { in: menuIds }, isAvailable: true },
  });
  if (menuItems.length !== menuIds.length) {
    return NextResponse.json(
      { error: "One or more items are no longer available" },
      { status: 400 },
    );
  }
  const menuMap = new Map(menuItems.map((m) => [m.id, m]));

  const orderItemsData = data.items.map((i) => {
    const m = menuMap.get(i.menuItemId);
    if (!m) throw new Error("Menu item not found");
    return {
      menuItemId: m.id,
      menuItemName: m.name,
      quantity: i.quantity,
      unitPricePaise: m.priceInPaise,
      totalPricePaise: m.priceInPaise * i.quantity,
    };
  });

  const subtotalPaise = orderItemsData.reduce(
    (s, i) => s + i.totalPricePaise,
    0,
  );
  const taxPaise = Math.round(subtotalPaise * brand.taxRate);
  const totalPaise = subtotalPaise + taxPaise;

  const order = await prisma.order.create({
    data: {
      customerName: data.customerName,
      customerEmail: data.customerEmail.toLowerCase(),
      customerPhone: data.customerPhone,
      orderType: data.orderType,
      deliveryAddress: data.deliveryAddress || null,
      notes: data.notes || null,
      subtotalPaise,
      taxPaise,
      totalPaise,
      items: { create: orderItemsData },
    },
  });

  const razorpayClient = getRazorpayClient();
  if (!isRazorpayConfigured() || !razorpayClient) {
    return NextResponse.json({
      orderId: order.id,
      totalPaise,
      paymentRequired: false,
    });
  }

  try {
    const rzpOrder = await razorpayClient.orders.create({
      amount: totalPaise,
      currency: "INR",
      receipt: order.id,
      notes: { orderId: order.id },
    });
    await prisma.order.update({
      where: { id: order.id },
      data: { razorpayOrderId: rzpOrder.id },
    });
    return NextResponse.json({
      orderId: order.id,
      totalPaise,
      paymentRequired: true,
      razorpay: {
        orderId: rzpOrder.id,
        amount: Number(rzpOrder.amount),
        currency: rzpOrder.currency,
      },
    });
  } catch (err) {
    console.error("Razorpay order create failed", err);
    return NextResponse.json({
      orderId: order.id,
      totalPaise,
      paymentRequired: false,
    });
  }
}
