import { describe, it, expect } from "vitest";
import { LAB_PRICE_PER_CASE, LAB_MIN_TOPUP, LAB_SETUP_FEE, LAB_FREE_CREDITS, labTopupCost, isValidLabTopup, isNoCreditsError } from "@/lib/labCredits";

describe("lab credits", () => {
  it("charges ₦500 per case", () => { expect(LAB_PRICE_PER_CASE).toBe(500); expect(labTopupCost(10)).toBe(5000); });
  it("requires at least 10 credits per top-up", () => {
    expect(LAB_MIN_TOPUP).toBe(10);
    expect(isValidLabTopup(9)).toBe(false);
    expect(isValidLabTopup(10)).toBe(true);
  });
  it("setup is ₦20,000 with 10 free credits", () => { expect(LAB_SETUP_FEE).toBe(20000); expect(LAB_FREE_CREDITS).toBe(10); });
  it("detects the out-of-credits error", () => {
    expect(isNoCreditsError({ message: "NO_CASE_CREDITS: Your lab..." })).toBe(true);
    expect(isNoCreditsError({ message: "other" })).toBe(false);
  });
});
