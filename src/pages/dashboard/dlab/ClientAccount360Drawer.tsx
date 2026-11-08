import { Fragment } from "react";
import { format } from "date-fns";
import { Pencil } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { useSaveLabRecord, type LabRecord } from "@/hooks/useLabRecords";
import { normalizeStage } from "@/config/dentalLab";
import { patientOf } from "@/hooks/useDentalLab";
import { CONTACTS, GLAZES, MARGINS, MODEL_POLICIES, OCCLUSAL, PONTICS, RETENTION, SCANNERS, blocksIntake, buildLedger, optLabel, taxExemptActive, termLabel, tierLabel, toProfileRecord, type Doctor } from "@/lib/labClients";
import { money } from "./dlabMoney";
import { fromRecord } from "./ClientFormDialog";
import DlabStatementsPage from "./DlabStatementsPage";
import type { ClientRow } from "./DlabClientsPage";

function RxCard({ doc }: { doc: Doctor }) {
  const r = doc.restorative || {};
  const rows: [string, string | undefined][] = [
    ["Occlusion", optLabel(OCCLUSAL, r.occlusal)], ["Contacts", optLabel(CONTACTS, r.contact)],
    ["Margin", optLabel(MARGINS, r.margin) || doc.margin_pref], ["Pontic", optLabel(PONTICS, r.pontic)],
    ["Glaze", (r.glaze || []).map((g) => optLabel(GLAZES, g)).join(", ") || undefined], ["Shade guide", doc.shade_guide],
    ["Ti-base", r.ti_base], ["Screw angle", r.screw_angulation_max != null ? `≤ ${r.screw_angulation_max}°` : undefined],
    ["Retention", optLabel(RETENTION, r.retention)], ["Models", optLabel(MODEL_POLICIES, r.model_policy)],
  ];
  const set = rows.filter(([, v]) => v);
  return (
    <div className="rounded-md border p-3">
      <div className="flex flex-wrap items-center justify-between gap-2"><div><p className="font-medium">{doc.name}</p><p className="text-xs text-muted-foreground">{[doc.license, doc.phone || doc.email].filter(Boolean).join(" · ")}</p></div>
        <Badge variant="outline">{doc.contact_pref || "phone"}</Badge></div>
      {set.length ? <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-xs sm:grid-cols-3">{set.map(([k, v]) => <div key={k}><dt className="text-muted-foreground">{k}</dt><dd className="font-medium">{v}</dd></div>)}</dl>
        : <p className="mt-2 text-xs text-muted-foreground">No restorative preferences recorded.</p>}
      {doc.special_instructions && <p className="mt-2 rounded bg-muted p-2 text-xs">{doc.special_instructions}</p>}
    </div>
  );
}

const d = (s?: string | null) => (s ? format(new Date(s), "d MMM yyyy") : "—");

export function ClientAccount360Drawer({ row, onClose, onEdit }: { row: ClientRow | null; onClose: () => void; onEdit: (r: ClientRow) => void }) {
  const save = useSaveLabRecord("client-profiles");
  if (!row) return null;
  const p = row.profile;
  const ledger = buildLedger([
    ...row.invoices.map((i) => ({ date: i.invoice_date || i.created_at, kind: "invoice" as const, ref: i.invoice_number, amount: Number(i.total_amount || 0) })),
    ...row.payments.map((x) => ({ date: x.record_date || x.created_at, kind: "payment" as const, ref: x.data?.reference || "Payment", amount: Number(x.amount || 0) })),
    ...row.credits.map((x) => ({ date: x.record_date || x.created_at, kind: "credit" as const, ref: x.data?.reason || "Credit note", amount: Number(x.amount || 0) })),
  ]);
  const toggleHold = (v: boolean) => {
    const input = p ? fromRecord(p) : { name: row.name };
    save.mutate({ id: p?.id, ...toProfileRecord({ ...input, on_hold: v }, p?.data?.client_id) });
  };

  return (
    <Sheet open onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle className="flex flex-wrap items-center gap-2">{row.name}{row.onHold && <Badge variant="destructive">Credit hold</Badge>}
            {p?.data?.is_parent_account && <Badge>DSO group</Badge>}{p?.data?.parent_account && <Badge variant="secondary">{p.data.parent_account}</Badge>}
            {taxExemptActive(p?.data) && <Badge variant="outline">Tax exempt</Badge>}</SheetTitle>
          <SheetDescription>{p ? `${termLabel(p.data?.terms)} · ${tierLabel(p.data?.tier)}${p.data?.tax_id ? ` · TIN ${p.data.tax_id}` : ""}` : "No account profile yet — create one to set terms and credit limit."}</SheetDescription>
        </SheetHeader>
        <div className="mt-3"><Button size="sm" variant="outline" onClick={() => onEdit(row)}><Pencil className="mr-1 h-3.5 w-3.5" />{p ? "Edit account" : "Create account"}</Button></div>
        <Tabs defaultValue="summary" className="mt-4">
          <TabsList className="grid w-full grid-cols-5"><TabsTrigger value="summary">Summary</TabsTrigger><TabsTrigger value="setup">Setup</TabsTrigger><TabsTrigger value="doctors">Doctors</TabsTrigger><TabsTrigger value="cases">Cases</TabsTrigger><TabsTrigger value="ledger">Statement</TabsTrigger></TabsList>

          <TabsContent value="summary" className="space-y-4">
            <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
              {[["Billed", row.billed], ["Paid", row.paid], ["Credits", row.creditsTotal], ["Balance", row.balance]].map(([l, v]) => (
                <div key={l as string} className="rounded-md bg-muted p-2"><p className="text-xs text-muted-foreground">{l}</p><p className="font-semibold tabular-nums">{money(v as number)}</p></div>
              ))}
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm"><span>Credit used</span><span className="tabular-nums">{row.credit.limit ? `${money(row.credit.used)} of ${money(row.credit.limit)}` : "No limit set"}</span></div>
              {row.credit.limit > 0 && <Progress value={row.credit.utilization * 100} />}
              {row.credit.overLimit && <p className="text-xs text-destructive">Over credit limit — new work is held automatically.</p>}
              {blocksIntake(p?.data?.hard_credit_stop, row.credit) && <p className="text-xs font-medium text-destructive">Hard stop active — new cases are blocked until a payment is received.</p>}
            </div>
            <div className="flex items-center gap-2"><Switch checked={p?.status === "hold"} onCheckedChange={toggleHold} disabled={save.isPending} /><span className="text-sm">Manual credit hold</span></div>
            {p && <dl className="grid grid-cols-[auto,1fr] gap-x-4 gap-y-1 text-sm">
              {[["Contact", p.data?.contact_name], ["Phone", p.data?.phone], ["Email", p.data?.email], ["Billing address", p.data?.address], ["Delivery", p.data?.delivery_address], ["Courier notes", p.data?.courier_notes]].filter(([, v]) => v).map(([k, v]) => (
                <Fragment key={k as string}><dt className="text-muted-foreground">{k}</dt><dd>{v}</dd></Fragment>
              ))}
            </dl>}
          </TabsContent>

          <TabsContent value="setup" className="space-y-4 text-sm">
            <div><p className="mb-1 font-semibold">Digital scanners</p>
              <div className="grid gap-1 sm:grid-cols-2">{SCANNERS.map((sc) => { const v = p?.data?.scanners?.[sc.key]; return (
                <div key={sc.key} className="flex items-center justify-between rounded-md border px-2 py-1.5"><span>{sc.short}</span>{v ? <span className="font-mono text-xs">{v}</span> : <span className="text-xs text-muted-foreground">Not linked</span>}</div>); })}</div></div>
            <div><p className="mb-1 font-semibold">Group & billing</p>
              <p>{p?.data?.is_parent_account ? "DSO / group parent account" : p?.data?.parent_account ? `Branch of ${p.data.parent_account}` : "Independent practice"}
                {p?.data?.centralized_billing ? " · centralised billing" : ""}</p></div>
            <div><p className="mb-1 font-semibold">Credit & tax</p>
              <p>{termLabel(p?.data?.terms)} · {row.credit.limit ? `limit ${money(row.credit.limit)}` : "no limit"}{p?.data?.hard_credit_stop ? " · hard stop on" : ""}</p>
              <p>{p?.data?.tax_exempt_number ? `Resale cert ${p.data.tax_exempt_number}${p.data.tax_exempt_expiry ? ` · expires ${d(p.data.tax_exempt_expiry)}` : ""}${taxExemptActive(p.data) ? "" : " (expired)"}` : "Not tax exempt"}</p></div>
          </TabsContent>

          <TabsContent value="doctors" className="space-y-2">
            {!(p?.data?.doctors || []).length ? <p className="py-6 text-center text-sm text-muted-foreground">No doctors on the roster yet.</p> :
              (p!.data.doctors as Doctor[]).map((doc) => <RxCard key={doc.id} doc={doc} />)}
          </TabsContent>

          <TabsContent value="cases">
            <table className="w-full text-sm"><thead><tr className="border-b text-left text-xs text-muted-foreground"><th className="py-1">Case</th><th>Patient</th><th>Stage</th><th>Due</th><th>Billing</th></tr></thead>
              <tbody>{row.cases.map((c: any) => (
                <tr key={c.id} className="border-b"><td className="py-1.5 font-mono text-xs">{c.case_number || c.id.slice(0, 8)}</td><td>{patientOf(c)}</td><td className="capitalize">{normalizeStage(c.status)}</td><td>{d(c.due_date)}</td>
                  <td>{row.invoices.some((i) => i.lab_case_id === c.id) ? <Badge variant="secondary">Invoiced</Badge> : <Badge variant="outline">Uninvoiced</Badge>}</td></tr>
              ))}</tbody></table>
            {!row.cases.length && <p className="py-6 text-center text-sm text-muted-foreground">No cases.</p>}
          </TabsContent>

          <TabsContent value="ledger">
            <DlabStatementsPage client={row.name} />
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
