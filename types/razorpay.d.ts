export {};

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayCheckoutOptions) => RazorpayCheckout;
  }
}

type RazorpayCheckout = {
  open: () => void;
  on: (
    event: "payment.failed",
    callback: (response: RazorpayPaymentFailedResponse) => void
  ) => void;
};

type RazorpayCheckoutOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpaySuccessResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
};

type RazorpaySuccessResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

type RazorpayPaymentFailedResponse = {
  error?: {
    code?: string;
    description?: string;
    metadata?: {
      order_id?: string;
      payment_id?: string;
    };
    reason?: string;
    source?: string;
    step?: string;
  };
};
