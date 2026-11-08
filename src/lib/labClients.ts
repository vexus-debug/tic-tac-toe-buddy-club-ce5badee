// Client master for the dental lab: practice profiles, doctor roster, credit control.
// Stored in lab_records (kind "client-profiles"): title = practice name, amount = credit limit,
// status = "active" | "hold", data = ClientProfileData. Legacy name matching is kept as fallback.

export type PaymentTerms = "cod" | "net_15" | "net_30" | "net_45" | "net_60";
export type PriceTier = "standard" | "tier_a" | "tier_b" | "tier_c";
export type ContactPref = "sms" | "email" | "phone";

export const TERMS: { value: PaymentTerms; label: string; days: number }[] = [
  { value: "cod", label: "COD", days: 0 },
  { value: "net_15", label: "Net 15", days: 15 },
  { value: "net_30", label: "Net 30", days: 30 },
  { value: "net_45", label: "Net 45", days: 45 },
  { value: "net_60", label: "Net 60", days: 60 },
];
export const TIERS: { value: PriceTier; label: string }[] = [
  { value: "standard", label: "Standard" }, { value: "tier_a", label: "Tier A" },
  { value: "tier_b", label: "Tier B" }, { value: "tier_c", label: "Tier C" },
];

export type OcclusalClearance = "in_occlusion" | "light_contact" | "out_of_occlusion";
export type InterproximalContact = "firm" | "normal" | "light" | "point" | "broad";
export type MarginDesign = "feather_edge" | "chamfer" | "deep_chamfer" | "shoulder_bevel" | "knife_edge";
export type PonticDesign = "modified_ridge_lap" | "ovate" | "sanitary" | "bullet";
export type StainingGlaze = "high_glaze" | "low_luster" | "incisal_halo" | "cervical_warm" | "pit_fissure";
export type ImplantRetention = "screw" | "cement";
export type ModelPolicy = "return_physical" | "digital_only" | "articulator_return";

type Opt<T extends string> = { value: T; label: string }[];
export const OCCLUSAL: Opt<OcclusalClearance> = [
  { value: "in_occlusion", label: "In occlusion" }, { value: "light_contact", label: "Light contact (-0.1mm)" }, { value: "out_of_occlusion", label: "Out of occlusion (-0.3mm)" },
];
export const CONTACTS: Opt<InterproximalContact> = [
  { value: "firm", label: "Firm" }, { value: "normal", label: "Normal" }, { value: "light", label: "Light" }, { value: "point", label: "Point contact" }, { value: "broad", label: "Broad contact" },
];
export const MARGINS: Opt<MarginDesign> = [
  { value: "feather_edge", label: "Feather-edge" }, { value: "chamfer", label: "Chamfer" }, { value: "deep_chamfer", label: "Deep chamfer" }, { value: "shoulder_bevel", label: "Shoulder with bevel" }, { value: "knife_edge", label: "Knife edge" },
];
export const PONTICS: Opt<PonticDesign> = [
  { value: "modified_ridge_lap", label: "Modified ridge lap" }, { value: "ovate", label: "Ovate" }, { value: "sanitary", label: "Sanitary (hygienic)" }, { value: "bullet", label: "Bullet" },
];
export const GLAZES: Opt<StainingGlaze> = [
  { value: "high_glaze", label: "High glaze" }, { value: "low_luster", label: "Low luster" }, { value: "incisal_halo", label: "Incisal halo" }, { value: "cervical_warm", label: "Cervical warm" }, { value: "pit_fissure", label: "Characterized pit & fissure" },
];
export const RETENTION: Opt<ImplantRetention> = [{ value: "screw", label: "Screw-retained" }, { value: "cement", label: "Cement-retained" }];
export const MODEL_POLICIES: Opt<ModelPolicy> = [
  { value: "return_physical", label: "Return physical models" }, { value: "digital_only", label: "Digital-only" }, { value: "articulator_return", label: "Articulator return required" },
];
export const optLabel = (opts: { value: string; label: string }[], v?: string) => opts.find((o) => o.value === v)?.label;

export interface RestorativeProfile {
  occlusal?: OcclusalClearance; contact?: InterproximalContact; margin?: MarginDesign; pontic?: PonticDesign;
  glaze?: StainingGlaze[]; ti_base?: string; screw_angulation_max?: number; retention?: ImplantRetention; model_policy?: ModelPolicy;
}

export interface Doctor {
  id: string; name: string; license?: string; email?: string; phone?: string;
  /** Legacy free-text fields, kept for older records. */
  shade_guide?: string; margin_pref?: string;
  contact_pref?: ContactPref; special_instructions?: string;
  restorative?: RestorativeProfile;
}

export type ScannerKey = "three_shape_id" | "itero_id" | "medit_id" | "sirona_id";
export const SCANNERS: { key: ScannerKey; label: string; short: string }[] = [
  { key: "three_shape_id", label: "3Shape Communicate ID", short: "3Shape" },
  { key: "itero_id", label: "Align iTero Lab ID", short: "iTero" },
  { key: "medit_id", label: "Medit Link Company ID", short: "Medit" },
  { key: "sirona_id", label: "Dentsply Sirona Connect ID", short: "Sirona" },
];
export type ScannerIds = Partial<Record<ScannerKey, string>>;
export const activeScanners = (ids?: ScannerIds) => SCANNERS.filter((s) => ids?.[s.key]?.trim());

export interface ClientProfileData {
  client_id: string;
  contact_name?: string; email?: string; phone?: string;
  address?: string; delivery_address?: string; tax_id?: string;
  terms: PaymentTerms; tier: PriceTier; courier_notes?: string;
  doctors: Doctor[];
  scanners?: ScannerIds;
  /** DSO / group hierarchy */
  is_parent_account?: boolean; parent_account?: string; centralized_billing?: boolean;
  /** Credit policy & tax exemption */
  hard_credit_stop?: boolean; tax_exempt_number?: string; tax_exempt_expiry?: string;
}

/** Tax exemption counts only with a certificate number that has not expired. */
export function taxExemptActive(p?: Partial<ClientProfileData>, today = new Date()): boolean {
  if (!p?.tax_exempt_number?.trim()) return false;
  if (!p.tax_exempt_expiry) return true;
  return new Date(p.tax_exempt_expiry + "T23:59:59") >= today;
}

export interface ClientProfileInput extends Partial<ClientProfileData> {
  name: string; credit_limit?: number; on_hold?: boolean;
}

export const termDays = (t?: string) => TERMS.find((x) => x.value === t)?.days ?? 30;
export const termLabel = (t?: string) => TERMS.find((x) => x.value === t)?.label ?? "Net 30";
export const tierLabel = (t?: string) => TIERS.find((x) => x.value === t)?.label ?? "Standard";

export const newId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0; return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
      });

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Returns a list of human-readable problems; empty means valid. */
export function validateClient(input: ClientProfileInput): string[] {
  const errs: string[] = [];
  if (!input.name?.trim()) errs.push("Practice name is required.");
  if (input.email && !EMAIL.test(input.email.trim())) errs.push("Billing email looks invalid.");
  if (input.credit_limit != null && (isNaN(input.credit_limit) || input.credit_limit < 0)) errs.push("Credit limit cannot be negative.");
  if (input.terms && !TERMS.some((t) => t.value === input.terms)) errs.push("Unknown payment terms.");
  (input.doctors || []).forEach((d, i) => {
    if (!d.name?.trim()) errs.push(`Doctor ${i + 1} needs a name.`);
    const a = d.restorative?.screw_angulation_max;
    if (a != null && (isNaN(a) || a < 0 || a > 30)) errs.push(`Doctor ${i + 1}: screw channel angulation must be 0–30°.`);
  });
  SCANNERS.forEach((sc) => { const v = input.scanners?.[sc.key]; if (v && !/^[A-Za-z0-9._@-]{2,64}$/.test(v.trim())) errs.push(`${sc.label} has invalid characters.`); });
  if (input.parent_account && input.is_parent_account) errs.push("A parent group account cannot itself belong to another group.");
  if (input.parent_account && input.name && input.parent_account.trim().toLowerCase() === input.name.trim().toLowerCase()) errs.push("A practice cannot be its own parent group.");
  if (input.tax_exempt_expiry && !input.tax_exempt_number?.trim()) errs.push("Add the resale certificate number for the tax exemption.");
  if (input.hard_credit_stop && !input.credit_limit) errs.push("Hard credit stop needs a credit limit above 0.");
  return errs;
}

/** Normalise form input into a lab_records payload, keeping an existing client UUID. */
export function toProfileRecord(input: ClientProfileInput, existingId?: string) {
  const data: ClientProfileData = {
    client_id: input.client_id || existingId || newId(),
    contact_name: input.contact_name?.trim() || undefined,
    email: input.email?.trim().toLowerCase() || undefined,
    phone: input.phone?.trim() || undefined,
    address: input.address?.trim() || undefined,
    delivery_address: input.delivery_address?.trim() || undefined,
    tax_id: input.tax_id?.trim() || undefined,
    terms: input.terms || "net_30",
    tier: input.tier || "standard",
    courier_notes: input.courier_notes?.trim() || undefined,
    doctors: (input.doctors || []).filter((d) => d.name?.trim()).map((d) => ({ ...d, id: d.id || newId(), name: d.name.trim() })),
    scanners: Object.fromEntries(SCANNERS.map((sc) => [sc.key, input.scanners?.[sc.key]?.trim()]).filter(([, v]) => v)) as ScannerIds,
    is_parent_account: !!input.is_parent_account || undefined,
    parent_account: input.is_parent_account ? undefined : input.parent_account?.trim() || undefined,
    centralized_billing: input.parent_account?.trim() || input.is_parent_account ? !!input.centralized_billing : undefined,
    hard_credit_stop: !!input.hard_credit_stop || undefined,
    tax_exempt_number: input.tax_exempt_number?.trim() || undefined,
    tax_exempt_expiry: input.tax_exempt_number?.trim() ? input.tax_exempt_expiry || undefined : undefined,
  };
  return {
    title: input.name.trim(),
    status: input.on_hold ? "hold" : "active",
    amount: Math.max(0, Number(input.credit_limit || 0)),
    data,
  };
}

export interface CreditState { limit: number; used: number; available: number; utilization: number; overLimit: boolean; }

/** Credit utilisation; a limit of 0 means "no limit set". */
export function creditState(limit: number, balance: number): CreditState {
  const used = Math.max(0, balance);
  if (!limit) return { limit: 0, used, available: Infinity, utilization: 0, overLimit: false };
  return { limit, used, available: Math.max(0, limit - used), utilization: Math.min(1, used / limit), overLimit: used > limit };
}

export type AgingRisk = "current" | "overdue" | "high_risk";

/** Risk from the age (days past due) of the oldest unpaid invoice. */
export function agingRisk(oldestDaysPastDue: number | null, balance: number): AgingRisk {
  if (balance <= 0 || oldestDaysPastDue == null || oldestDaysPastDue <= 0) return "current";
  return oldestDaysPastDue > 60 ? "high_risk" : "overdue";
}

/** Whether new work should be held: manual hold, or over limit. */
export const shouldHold = (manualHold: boolean, credit: CreditState) => manualHold || credit.overLimit;

/** Hard stop blocks new case intake when the account is at or over its limit. */
export const blocksIntake = (hardStop: boolean | undefined, credit: CreditState) => !!hardStop && credit.limit > 0 && credit.used >= credit.limit;

export interface LedgerEntry { date: string; kind: "invoice" | "payment" | "credit"; ref: string; debit: number; credit: number; balance: number; }

/** Chronological running ledger: invoices debit, payments and credit notes credit. */
export function buildLedger(rows: { date: string; kind: LedgerEntry["kind"]; ref: string; amount: number }[]): LedgerEntry[] {
  let bal = 0;
  return [...rows].sort((a, b) => a.date.localeCompare(b.date)).map((r) => {
    const debit = r.kind === "invoice" ? Number(r.amount || 0) : 0;
    const credit = r.kind === "invoice" ? 0 : Number(r.amount || 0);
    bal = Math.round((bal + debit - credit) * 100) / 100;
    return { date: r.date, kind: r.kind, ref: r.ref, debit, credit, balance: bal };
  });
}
