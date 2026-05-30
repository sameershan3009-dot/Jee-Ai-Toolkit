import crypto from "crypto";
import { NextResponse } from "next/server";
import { getCreditBalance, getPaymentByOrder, markPaymentVerified } from "@/lib/payment-store";

type VerifyPaymentRequest = {
  guestId?: string;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
};

function safeCompare(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);

  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

export async function POST(request: Request) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      guestId
    } = (await request.json()) as VerifyPaymentRequest;

    if (!guestId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Missing payment verification fields." },
        { status: 400 }
      );
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keySecret) {
      return NextResponse.json(
        { error: "Razorpay secret is not configured." },
        { status: 500 }
      );
    }

    const generatedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (!safeCompare(generatedSignature, razorpay_signature)) {
      return NextResponse.json(
        { error: "Payment signature verification failed." },
        { status: 400 }
      );
    }

    const payment = await getPaymentByOrder(razorpay_order_id);

    if (!payment || payment.guestId !== guestId) {
      return NextResponse.json(
        { error: "Payment order was not found for this guest session." },
        { status: 400 }
      );
    }

    await markPaymentVerified({
      ...payment,
      paymentId: razorpay_payment_id,
      status: "verified"
    });

    const credits = await getCreditBalance(guestId);

    return NextResponse.json({
      success: true,
      payment_id: razorpay_payment_id,
      order_id: razorpay_order_id,
      credits
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to verify payment." },
      { status: 500 }
    );
  }
}
