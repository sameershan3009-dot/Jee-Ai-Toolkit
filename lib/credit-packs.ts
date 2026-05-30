export type CreditPack = {
  id: string;
  label: string;
  credits: number;
  amount: number;
};

export const creditPacks: CreditPack[] = [
  { id: "live-test", label: "Live Test", credits: 2, amount: 200 },
  { id: "live-test-10", label: "Live Test 10", credits: 10, amount: 1000 },
  { id: "starter", label: "Starter", credits: 100, amount: 9900 },
  { id: "focus", label: "Focus", credits: 250, amount: 19900 },
  { id: "exam", label: "Exam Sprint", credits: 700, amount: 49900 }
];

export function getCreditPack(packId: string | undefined) {
  return creditPacks.find((pack) => pack.id === packId);
}
