import crypto from "crypto";
import { NextResponse } from "next/server";
import { getPaymentByOrder, markPaymentVerified } from "@/lib/payment-store";

function verifyWebhookSignature(body: string, signature: string, secret: string) {
  const expected = crypto.createHmac("sha256", secret).update(body).digest("hex");
  const left = Buffer.from(expected);
  const right = Buffer.from(signature);

  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

export async function POST(request: Request) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!secret) {
    return NextResponse.json(
      { error: "Razorpay webhook secret is not configured." },
      { status: 500 }
    );
  }

  const signature = request.headers.get("x-razorpay-signature");
  const body = await request.text();

  if (!signature || !verifyWebhookSignature(body, signature, secret)) {
    return NextResponse.json({ error: "Invalid webhook signature." }, { status: 400 });
  }

  const event = JSON.parse(body) as {
    event?: string;
    payload?: {
      payment?: {
        entity?: {
          id?: string;
          order_id?: string;
        };
      };
    };
  };

  if (event.event === "payment.captured") {
    const paymentId = event.payload?.payment?.entity?.id;
    const orderId = event.payload?.payment?.entity?.order_id;

    if (paymentId && orderId) {
      const payment = await getPaymentByOrder(orderId);

      if (payment) {
        await markPaymentVerified({
          ...payment,
          paymentId,
          status: "verified"
        });
      }
    }
  }

  return NextResponse.json({
    received: true,
    event: event.event ?? "unknown"
  });
}
