import { NextResponse } from "next/server";
import { getCreditPack } from "@/lib/credit-packs";
import { saveCreatedOrder } from "@/lib/payment-store";
import { getRazorpayClient } from "@/lib/razorpay";

type CreateOrderRequest = {
  amount?: number;
  currency?: string;
  guestId?: string;
  packId?: string;
  receipt?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateOrderRequest;
    const pack = getCreditPack(body.packId);
    const amount = Number(body.amount);
    const currency = body.currency || "INR";
    const receipt = body.receipt || `jee-ai-${Date.now()}`;
    const guestId = body.guestId?.trim();

    if (!guestId) {
      return NextResponse.json({ error: "Guest id is required." }, { status: 400 });
    }

    if (!pack) {
      return NextResponse.json({ error: "Invalid credit pack." }, { status: 400 });
    }

    if (!Number.isInteger(amount) || amount < 100 || amount !== pack.amount) {
      return NextResponse.json(
        { error: "Amount must match a valid credit pack and be at least 100 paise." },
        { status: 400 }
      );
    }

    const razorpay = getRazorpayClient();
    const order = await razorpay.orders.create({
      amount,
      currency,
      receipt,
      notes: {
        guest_id: guestId,
        pack_id: pack.id,
        credits: String(pack.credits)
      }
    });

    await saveCreatedOrder({
      orderId: order.id,
      guestId,
      packId: pack.id,
      amount: Number(order.amount),
      currency: order.currency,
      credits: pack.credits,
      status: "created"
    });

    return NextResponse.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      credits: pack.credits
    });
  } catch (error) {
    const statusCode =
      typeof error === "object" &&
      error !== null &&
      "statusCode" in error &&
      typeof error.statusCode === "number"
        ? error.statusCode
        : 500;

    return NextResponse.json(
      {
        error:
          statusCode === 401
            ? "Razorpay authentication failed."
            : "Unable to create Razorpay order."
      },
      { status: statusCode === 401 ? 401 : 500 }
    );
  }
}
