"use client";

import { useEffect, useMemo, useState } from "react";
import Script from "next/script";
import { creditPacks } from "@/lib/credit-packs";

function formatRupees(amountInPaise: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amountInPaise / 100);
}

export default function RazorpayCheckout() {
  const [selectedPackId, setSelectedPackId] = useState(creditPacks[0].id);
  const [guestId, setGuestId] = useState("");
  const [credits, setCredits] = useState(0);
  const [storageMode, setStorageMode] = useState("memory");
  const [status, setStatus] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const selectedPack = useMemo(
    () => creditPacks.find((pack) => pack.id === selectedPackId) ?? creditPacks[0],
    [selectedPackId]
  );

  useEffect(() => {
    const currentGuestId =
      window.localStorage.getItem("jee-ai-guest-id") ||
      `guest_${crypto.randomUUID()}`;

    window.localStorage.setItem("jee-ai-guest-id", currentGuestId);
    setGuestId(currentGuestId);
  }, []);

  useEffect(() => {
    if (!guestId) {
      return;
    }

    fetch(`/api/credits/balance?guestId=${encodeURIComponent(guestId)}`)
      .then((response) => response.json())
      .then((result) => {
        if (typeof result.credits === "number") {
          setCredits(result.credits);
        }

        if (result.storage) {
          setStorageMode(result.storage);
        }
      })
      .catch(() => {
        setStatus("Could not load credit balance yet.");
      });
  }, [guestId]);

  async function startCheckout() {
    setStatus("");

    if (!window.Razorpay) {
      setStatus("Checkout is still loading. Please try again in a moment.");
      return;
    }

    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
      setStatus("Razorpay public key is not configured.");
      return;
    }

    if (!guestId) {
      setStatus("Preparing your guest session. Please try again in a moment.");
      return;
    }

    setIsLoading(true);

    try {
      const orderResponse = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: selectedPack.amount,
          currency: "INR",
          guestId,
          packId: selectedPack.id,
          receipt: `jee-ai-${selectedPack.id}-${Date.now()}`
        })
      });

      const order = await orderResponse.json();

      if (!orderResponse.ok) {
        throw new Error(order.error || "Unable to create order.");
      }

      const checkout = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
        amount: order.amount,
        currency: order.currency,
        name: "JEE AI Toolkit",
        description: `${selectedPack.credits} AI credits - ${selectedPack.label}`,
        order_id: order.order_id,
        handler: async (response) => {
          try {
            setIsLoading(true);
            setStatus("Verifying payment...");

            const verifyResponse = await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...response,
                guestId
              })
            });

            const result = await verifyResponse.json();

            if (!verifyResponse.ok) {
              throw new Error(result.error || "Payment verification failed.");
            }

            setCredits(result.credits ?? credits + selectedPack.credits);
            setStatus(`Payment verified. ${selectedPack.credits} credits added.`);
          } catch (error) {
            setStatus(
              error instanceof Error ? error.message : "Payment verification failed."
            );
          } finally {
            setIsLoading(false);
          }
        },
        prefill: {
          name: "JEE Aspirant",
          email: "student@example.com"
        },
        notes: {
          product: "jee-ai-credits",
          pack: selectedPack.id
        },
        theme: {
          color: "#111111"
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false);
            setStatus("Payment cancelled before completion.");
          }
        }
      });

      checkout.on("payment.failed", (response) => {
        setIsLoading(false);
        setStatus(
          response.error?.description ||
            response.error?.reason ||
            "Payment failed. Please try another method."
        );
      });

      checkout.open();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="rounded-[2rem] border border-black/10 bg-white/80 p-5 shadow-soft backdrop-blur md:p-7">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
      <div className="flex flex-col gap-6">
        <div>
          <p className="text-sm font-medium text-neutral-500">Credits wallet</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950">
            Buy AI credits
          </h2>
          <p className="mt-3 text-sm leading-6 text-neutral-600">
            Razorpay Standard Checkout creates orders server-side, verifies signatures, and credits
            this guest session after successful payment.
          </p>
        </div>

        <div className="grid gap-3 rounded-2xl bg-neutral-950 p-4 text-white sm:grid-cols-2">
          <div>
            <p className="text-xs text-white/60">Current balance</p>
            <p className="mt-1 text-3xl font-semibold">{credits}</p>
          </div>
          <div>
            <p className="text-xs text-white/60">Storage</p>
            <p className="mt-2 text-sm font-medium">
              {storageMode === "supabase" ? "Supabase connected" : "Local dev memory"}
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {creditPacks.map((pack) => (
            <button
              key={pack.id}
              type="button"
              onClick={() => setSelectedPackId(pack.id)}
              className={`rounded-2xl border p-4 text-left transition ${
                selectedPackId === pack.id
                  ? "border-neutral-950 bg-neutral-950 text-white"
                  : "border-black/10 bg-white text-neutral-950 hover:border-black/30"
              }`}
            >
              <span className="block text-sm font-medium">{pack.label}</span>
              <span className="mt-2 block text-2xl font-semibold">
                {formatRupees(pack.amount)}
              </span>
              <span
                className={`mt-1 block text-xs ${
                  selectedPackId === pack.id ? "text-white/70" : "text-neutral-500"
                }`}
              >
                {pack.credits} credits
              </span>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={startCheckout}
          disabled={isLoading}
          className="inline-flex h-12 items-center justify-center rounded-full bg-neutral-950 px-6 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Opening checkout..." : `Pay ${formatRupees(selectedPack.amount)}`}
        </button>

        {status ? (
          <p className="rounded-2xl bg-neutral-100 px-4 py-3 text-sm text-neutral-700">
            {status}
          </p>
        ) : null}
      </div>
    </section>
  );
}
