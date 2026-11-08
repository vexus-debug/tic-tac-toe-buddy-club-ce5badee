import { useQuery } from "@tanstack/react-query";
import { Wallet } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useOrg } from "@/hooks/useOrg";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LAB_PRICE_PER_CASE, LAB_MIN_TOPUP, labTopupCost } from "@/lib/labCredits";

const db = supabase as any;
const WHATSAPP = "https://wa.me/2349017758165?text=Hello%20I%20would%20like%20to%20buy%20case%20credits%20for%20my%20lab";

/** Lab's platform case-credit wallet: balance, how it works, recent activity. */
export default function LabCreditsPanel() {
  const { currentOrg } = useOrg();
  const orgId = currentOrg?.parent_org_id || currentOrg?.org_id;
  const { data } = useQuery({
    queryKey: ["case-wallet-detail", orgId],
    enabled: !!orgId,
    queryFn: async () => {
      const [w, t] = await Promise.all([
        db.from("clinic_wallets").select("balance").eq("org_id", orgId).maybeSingle(),
        db.from("wallet_transactions").select("id, amount, type, note, created_at").eq("org_id", orgId).order("created_at", { ascending: false }).limit(20),
      ]);
      return { balance: (w.data?.balance as number) ?? 0, rows: (t.data as any[]) ?? [] };
    },
  });
  const balance = data?.balance ?? 0;

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Wallet className="h-4 w-4" /> Case credits</CardTitle></CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p className="text-3xl font-bold">{balance} <span className="text-base font-normal text-muted-foreground">credits left</span></p>
          {balance === 0 && <p className="font-medium text-destructive">New cases are blocked until you top up. Existing cases stay open.</p>}
          <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
            <li>1 new case = 1 credit (₦{LAB_PRICE_PER_CASE}).</li>
            <li>Remakes and re-works are free.</li>
            <li>Minimum top-up: {LAB_MIN_TOPUP} credits (₦{labTopupCost(LAB_MIN_TOPUP).toLocaleString()}). Credits never expire.</li>
          </ul>
          <a href={WHATSAPP} target="_blank" rel="noreferrer" className="inline-flex rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground hover:opacity-90">Buy credits</a>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-base">Recent activity</CardTitle></CardHeader>
        <CardContent>
          {!data?.rows.length ? <p className="text-sm text-muted-foreground">No activity yet.</p> : (
            <ul className="divide-y text-sm">
              {data.rows.map((r) => (
                <li key={r.id} className="flex justify-between py-2">
                  <span>{r.amount > 0 ? (r.note || "Top-up") : "New case"}<span className="ml-2 text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</span></span>
                  <span className={r.amount > 0 ? "font-semibold text-primary" : "text-muted-foreground"}>{r.amount > 0 ? `+${r.amount}` : r.amount}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
