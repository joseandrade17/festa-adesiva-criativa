/** Shared purchase rules; payment handlers must resolve prices from this catalog. */
export const CREDIT_PACKAGES = [
  { id: "stickers-20", credits: 20, amountCents: 1990, currency: "BRL" },
  { id: "stickers-40", credits: 40, amountCents: 2990, currency: "BRL" },
] as const;

export const FREE_STICKERS_PER_ACCOUNT = 1;

export function findCreditPackage(id: string) {
  return CREDIT_PACKAGES.find((pack) => pack.id === id);
}

/** Eligibility only: actual reservations must be enforced atomically in the database. */
export function nextStickerFunding(freeStickersUsed: number, availableCredits: number) {
  if (!Number.isSafeInteger(freeStickersUsed) || freeStickersUsed < 0 ||
      !Number.isSafeInteger(availableCredits) || availableCredits < 0) {
    return "blocked" as const;
  }
  if (freeStickersUsed < FREE_STICKERS_PER_ACCOUNT) return "free" as const;
  return availableCredits > 0 ? "credit" as const : "blocked" as const;
}