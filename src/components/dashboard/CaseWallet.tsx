import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useOrg } from "@/hooks/useOrg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Wallet } from "lucide-react";
import { toast } from "sonner";
import { LAB_PRICE_PER_CASE, LAB_MIN_TOPUP, labTopupCost } from "@/lib/labCredits";

export const PRICE_PER_CASE = 400; // ₦ per case

const HOW_IT_WORKS: { title: string; text: string }[] = [
  { title: "What is a case?", text: "One patient visit. It costs 1 credit (₦400)." },
  { title: "When is a credit used?", text: "The first time you book, check in, or record a note, plan, chart, image, prescription, lab order or invoice for a patient with no open case." },
  { title: "What does a case cover?", text: "Everything done for that patient during one visit. Every new visit starts a new case." },
  { title: "What is never charged?", text: "Viewing records, editing open cases, registering a patient, and reports." },
  { title: "At zero credits", text: "Old records stay open, but new cases are blocked until you top up." },
  { title: "No refunds on delete", text: "Deleting or cancelling a visit does not return the credit." },
];

const EXAMPLES = [
  "Check-up and scaling today, follow-up in 2 weeks → 2 credits.",
  "Root canal: 3 visits → 3 credits. A crown visit → 1 more credit.",
  "Walk-in for pain, then returns 2 months later → 2 credits.",
  "4 visits in the same month → 4 credits.",
];

export function CaseCreditsGuide() {
  return (
    <div className="space-y-4 text-sm">
      {HOW_IT_WORKS.map((r) => (
        <div key={r.title}>
          <p className="font-semibold">{r.title}</p>
          <p className="text-muted-foreground">{r.text}</p>
        </div>
      ))}
      <div>
        <p className="font-semibold">Examples</p>
        <ul className="mt-1 list-disc space-y-1 pl-5 text-muted-foreground">
          {EXAMPLES.map((e) => <li key={e}>{e}</li>)}
        </ul>
      </div>
      <a href="/articles/how-case-credits-work" className="font-medium text-primary underline">Read the full guide</a>
    </div>
  );
}

const db = supabase as any;

function useWallet(orgId?: string) {
  return useQuery({
    queryKey: ["case-wallet", orgId],
    enabled: !!orgId,
    queryFn: async () => {
      const { data } = await db.from("clinic_wallets").select("balance").eq("org_id", orgId).maybeSingle();
      return (data?.balance as number) ?? 0;
    },
    refetchInterval: 60_000,
  });
}

/** Header badge for dental clinics: remaining case credits. */
export function CaseWalletBadge() {
  const { currentOrg } = useOrg();
  const billingOrg = currentOrg?.parent_org_id || currentOrg?.org_id;
  const isLab = currentOrg?.clinic_type === "dental_lab";
  const isDental = currentOrg?.clinic_type === "dental" || isLab;
  const { data: balance = 0 } = useWallet(isDental ? billingOrg : undefined);
  if (!isDental) return null;
  const low = balance < 5;
  if (isLab) return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={low ? "destructive" : "outline"} size="sm" className="h-8 gap-1.5 px-2.5">
          <Wallet className="h-3.5 w-3.5" />
          <span className="text-xs font-semibold">{balance}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72 space-y-2 text-sm">
        <p className="font-semibold">Case credits: {balance}</p>
        <p className="text-muted-foreground">Each new lab case uses 1 credit (₦{LAB_PRICE_PER_CASE}). Remakes are always free.</p>
        {balance === 0 ? (
          <p className="font-medium text-destructive">No credits left — new cases are blocked until you top up.</p>
        ) : low ? (
          <p className="font-medium text-destructive">Running low — top up soon.</p>
        ) : null}
        <p className="text-muted-foreground">Minimum top-up: {LAB_MIN_TOPUP} credits (₦{labTopupCost(LAB_MIN_TOPUP).toLocaleString()}). Contact Clinexus support to buy credits.</p>
      </PopoverContent>
    </Popover>
  );
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={low ? "destructive" : "outline"} size="sm" className="h-8 gap-1.5 px-2.5">
          <Wallet className="h-3.5 w-3.5" />
          <span className="text-xs font-semibold">{balance}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72 space-y-2 text-sm">
        <p className="font-semibold">Case credits: {balance}</p>
        <p className="text-muted-foreground">
          Each new patient case costs ₦{PRICE_PER_CASE.toLocaleString()} and covers one visit.
        </p>
        {balance === 0 ? (
          <p className="font-medium text-destructive">No credits left — new visits are blocked until you top up.</p>
        ) : low ? (
          <p className="font-medium text-destructive">Running low — top up soon.</p>
        ) : null}
        <p className="text-muted-foreground">To top up, contact Clinexus support to buy more credits.</p>
      </PopoverContent>
    </Popover>
  );
}

/** Super-admin card to add case credits to a clinic. */
export function AdminWalletTopup({ orgId }: { orgId: string }) {
  const qc = useQueryClient();
  const { data: balance = 0 } = useWallet(orgId);
  const { data: isLab = false } = useQuery({
    queryKey: ["org-type", orgId],
    queryFn: async () => {
      const { data } = await db.from("organizations").select("clinic_type").eq("id", orgId).maybeSingle();
      return data?.clinic_type === "dental_lab";
    },
  });
  const [credits, setCredits] = useState("10");
  const [busy, setBusy] = useState(false);
  const n = parseInt(credits, 10) || 0;
  const rate = isLab ? LAB_PRICE_PER_CASE : PRICE_PER_CASE;
  const tooFew = isLab && n < LAB_MIN_TOPUP;

  const topup = async () => {
    setBusy(true);
    const { error } = await db.rpc("admin_topup_wallet", { p_org_id: orgId, p_credits: n, p_note: `Top-up ₦${(n * rate).toLocaleString()}` });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success(`Added ${n} case credits`);
    qc.invalidateQueries({ queryKey: ["case-wallet", orgId] });
  };

  return (
    <Card className="glass-card">
      <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Wallet className="h-4 w-4" /> Case credits</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm">Balance: <span className="font-semibold">{balance}</span> cases</p>
        <div className="flex items-center gap-2">
          <Input type="number" min={1} value={credits} onChange={(e) => setCredits(e.target.value)} className="w-28" />
          <Button onClick={topup} disabled={busy || n <= 0 || tooFew}>Add credits</Button>
        </div>
        <p className="text-xs text-muted-foreground">= ₦{(n * rate).toLocaleString()} at ₦{rate} per case</p>
        {tooFew && <p className="text-xs text-destructive">Labs must buy at least {LAB_MIN_TOPUP} credits.</p>}
      </CardContent>
    </Card>
  );
}
