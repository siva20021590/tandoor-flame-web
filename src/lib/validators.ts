import { z } from "zod";

export const reservationSchema = z.object({
  name: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(7, "Enter a valid phone number"),
  partySize: z
    .number({ invalid_type_error: "Party size is required" })
    .int()
    .min(1, "At least 1 guest")
    .max(30, "For parties larger than 30, please call us"),
  date: z.string().min(1, "Pick a date"),
  time: z.string().min(1, "Pick a time"),
  occasion: z.string().optional().or(z.literal("")),
  notes: z.string().max(500).optional().or(z.literal("")),
});
export type ReservationInput = z.infer<typeof reservationSchema>;

export const cateringSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  eventType: z.string().min(2),
  eventDate: z.string().min(1),
  guestCount: z
    .number({ invalid_type_error: "Guest count is required" })
    .int()
    .min(10, "Catering starts from 10 guests")
    .max(2000),
  venue: z.string().optional().or(z.literal("")),
  budget: z.string().optional().or(z.literal("")),
  message: z.string().max(1000).optional().or(z.literal("")),
});
export type CateringInput = z.infer<typeof cateringSchema>;

export const orderItemSchema = z.object({
  menuItemId: z.string().min(1),
  quantity: z.number().int().min(1).max(50),
});

export const orderSchema = z.object({
  customerName: z.string().min(2),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(7),
  orderType: z.enum(["delivery", "pickup"]),
  deliveryAddress: z.string().optional().or(z.literal("")),
  notes: z.string().max(500).optional().or(z.literal("")),
  items: z.array(orderItemSchema).min(1, "Your cart is empty"),
});
export type OrderInput = z.infer<typeof orderSchema>;
