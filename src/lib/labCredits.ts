// Dental lab case-credit pricing rules.
export const LAB_PRICE_PER_CASE = 500; // ₦ per credit (1 credit = 1 new lab case)
export const LAB_MIN_TOPUP = 10; // minimum credits per purchase
export const LAB_SETUP_FEE = 20000; // ₦ one-time setup
export const LAB_FREE_CREDITS = 10; // free credits included with setup

export const labTopupCost = (credits: number) => credits * LAB_PRICE_PER_CASE;
export const isValidLabTopup = (credits: number) => Number.isInteger(credits) && credits >= LAB_MIN_TOPUP;

export const NO_CREDITS_MESSAGE =
  "Your lab has run out of case credits. Top up (minimum 10 credits at ₦500 each) to register new cases. Remakes stay free.";

export function isNoCreditsError(e: unknown) {
  return String((e as any)?.message ?? e ?? "").includes("NO_CASE_CREDITS");
}
