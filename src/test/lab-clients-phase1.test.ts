import { describe, it, expect } from "vitest";
import { validateClient, toProfileRecord, taxExemptActive, blocksIntake, creditState, activeScanners } from "@/lib/labClients";

describe("client phase 1", () => {
  it("rejects screw angle over 30°", () => {
    expect(validateClient({ name: "A", doctors: [{ id: "1", name: "Dr X", restorative: { screw_angulation_max: 35 } }] }).length).toBe(1);
  });
  it("parent group cannot belong to a group", () => {
    expect(validateClient({ name: "A", is_parent_account: true, parent_account: "B" })).toContain("A parent group account cannot itself belong to another group.");
  });
  it("hard stop needs a credit limit", () => {
    expect(validateClient({ name: "A", hard_credit_stop: true, credit_limit: 0 }).length).toBe(1);
  });
  it("hard stop blocks intake at the limit only", () => {
    expect(blocksIntake(true, creditState(1000, 1000))).toBe(true);
    expect(blocksIntake(true, creditState(1000, 999))).toBe(false);
    expect(blocksIntake(false, creditState(1000, 5000))).toBe(false);
  });
  it("expired tax certificate is not active", () => {
    const today = new Date("2026-10-31");
    expect(taxExemptActive({ tax_exempt_number: "R1", tax_exempt_expiry: "2026-10-30" }, today)).toBe(false);
    expect(taxExemptActive({ tax_exempt_number: "R1", tax_exempt_expiry: "2026-11-01" }, today)).toBe(true);
  });
  it("saves only filled scanner IDs", () => {
    const r = toProfileRecord({ name: "A", scanners: { itero_id: " 123 ", medit_id: "" } });
    expect(activeScanners(r.data.scanners).map((s) => s.short)).toEqual(["iTero"]);
  });
});
