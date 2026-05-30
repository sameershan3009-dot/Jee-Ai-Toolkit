type PaymentStatus = "created" | "verified" | "failed";

export type PaymentRecord = {
  orderId: string;
  paymentId?: string;
  guestId: string;
  packId: string;
  amount: number;
  currency: string;
  credits: number;
  status: PaymentStatus;
};

type MemoryStore = {
  payments: Map<string, PaymentRecord>;
  creditedPayments: Set<string>;
};

const memoryStore = (globalThis as typeof globalThis & { __jeePaymentStore?: MemoryStore })
  .__jeePaymentStore ?? {
  payments: new Map<string, PaymentRecord>(),
  creditedPayments: new Set<string>()
};

(globalThis as typeof globalThis & { __jeePaymentStore?: MemoryStore }).__jeePaymentStore =
  memoryStore;

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function hasSupabase() {
  return Boolean(supabaseUrl && supabaseServiceRoleKey);
}

async function supabaseFetch(path: string, init: RequestInit = {}) {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error("Supabase is not configured.");
  }

  const headers = new Headers(init.headers);
  headers.set("apikey", supabaseServiceRoleKey);
  headers.set("Authorization", `Bearer ${supabaseServiceRoleKey}`);
  headers.set("Content-Type", "application/json");
  headers.set("Prefer", "return=representation");

  return fetch(`${supabaseUrl}/rest/v1/${path}`, {
    ...init,
    headers
  });
}

export async function saveCreatedOrder(record: PaymentRecord) {
  if (hasSupabase()) {
    await supabaseFetch("payment_records", {
      method: "POST",
      body: JSON.stringify({
        order_id: record.orderId,
        guest_id: record.guestId,
        pack_id: record.packId,
        amount: record.amount,
        currency: record.currency,
        credits: record.credits,
        status: record.status
      })
    });
    return;
  }

  memoryStore.payments.set(record.orderId, record);
}

export async function markPaymentVerified(record: PaymentRecord) {
  if (hasSupabase()) {
    const existing = await supabaseFetch(
      `credit_ledger?payment_id=eq.${encodeURIComponent(record.paymentId ?? "")}&select=id`,
      { method: "GET" }
    );
    const existingRows = (await existing.json()) as Array<{ id: string }>;

    if (existingRows.length > 0) {
      return;
    }

    await supabaseFetch(`payment_records?order_id=eq.${encodeURIComponent(record.orderId)}`, {
      method: "PATCH",
      body: JSON.stringify({
        payment_id: record.paymentId,
        status: "verified"
      })
    });

    await supabaseFetch("credit_ledger", {
      method: "POST",
      body: JSON.stringify({
        guest_id: record.guestId,
        payment_id: record.paymentId,
        order_id: record.orderId,
        delta: record.credits,
        reason: `Purchased ${record.packId} credit pack`
      })
    });
    return;
  }

  if (record.paymentId && memoryStore.creditedPayments.has(record.paymentId)) {
    return;
  }

  memoryStore.payments.set(record.orderId, { ...record, status: "verified" });

  if (record.paymentId) {
    memoryStore.creditedPayments.add(record.paymentId);
  }
}

export async function getCreditBalance(guestId: string) {
  if (hasSupabase()) {
    const response = await supabaseFetch(
      `credit_ledger?guest_id=eq.${encodeURIComponent(guestId)}&select=delta`,
      { method: "GET" }
    );
    const rows = (await response.json()) as Array<{ delta: number }>;

    return rows.reduce((total, row) => total + Number(row.delta || 0), 0);
  }

  let balance = 0;

  memoryStore.payments.forEach((record) => {
    if (record.guestId === guestId && record.status === "verified") {
      balance += record.credits;
    }
  });

  return balance;
}

export async function getPaymentByOrder(orderId: string) {
  if (hasSupabase()) {
    const response = await supabaseFetch(
      `payment_records?order_id=eq.${encodeURIComponent(orderId)}&select=*`,
      { method: "GET" }
    );
    const rows = (await response.json()) as Array<{
      order_id: string;
      payment_id?: string;
      guest_id: string;
      pack_id: string;
      amount: number;
      currency: string;
      credits: number;
      status: PaymentStatus;
    }>;
    const row = rows[0];

    if (!row) {
      return null;
    }

    return {
      orderId: row.order_id,
      paymentId: row.payment_id,
      guestId: row.guest_id,
      packId: row.pack_id,
      amount: row.amount,
      currency: row.currency,
      credits: row.credits,
      status: row.status
    } satisfies PaymentRecord;
  }

  return memoryStore.payments.get(orderId) ?? null;
}

export function getStorageMode() {
  return hasSupabase() ? "supabase" : "memory";
}
