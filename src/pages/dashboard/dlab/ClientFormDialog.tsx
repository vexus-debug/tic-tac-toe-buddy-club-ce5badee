import { useEffect, useState } from "react";
import { ChevronDown, Plus, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLabRecords, useSaveLabRecord, type LabRecord } from "@/hooks/useLabRecords";
import {
  CONTACTS, GLAZES, MARGINS, MODEL_POLICIES, OCCLUSAL, PONTICS, RETENTION, SCANNERS, TERMS, TIERS,
  newId, toProfileRecord, validateClient, type ClientProfileInput, type Doctor, type RestorativeProfile,
} from "@/lib/labClients";

const blank = (name = ""): ClientProfileInput => ({ name, terms: "net_30", tier: "standard", credit_limit: 0, doctors: [], scanners: {} });

export function fromRecord(r?: LabRecord | null, fallbackName = ""): ClientProfileInput {
  if (!r) return blank(fallbackName);
  return { ...(r.data || {}), name: r.title, credit_limit: Number(r.amount || 0), on_hold: r.status === "hold", doctors: r.data?.doctors || [], scanners: r.data?.scanners || {} };
}

function Chips<T extends string>({ opts, value, onChange, multi }: { opts: { value: T; label: string }[]; value?: T | T[]; onChange: (v: any) => void; multi?: boolean }) {
  const has = (v: T) => (multi ? ((value as T[]) || []).includes(v) : value === v);
  const toggle = (v: T) => {
    if (multi) { const cur = (value as T[]) || []; onChange(cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v]); }
    else onChange(value === v ? undefined : v);
  };
  return (
    <div className="flex flex-wrap gap-1.5">
      {opts.map((o) => (
        <button key={o.value} type="button" aria-pressed={has(o.value)} onClick={() => toggle(o.value)}
          className={`rounded-full border px-2.5 py-1 text-xs transition-colors ${has(o.value) ? "border-primary bg-primary text-primary-foreground" : "bg-background hover:bg-muted"}`}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

function DoctorCard({ d, onChange, onRemove }: { d: Doctor; onChange: (p: Partial<Doctor>) => void; onRemove: () => void }) {
  const [open, setOpen] = useState(!d.name);
  const r = d.restorative || {};
  const setR = (p: Partial<RestorativeProfile>) => onChange({ restorative: { ...r, ...p } });
  return (
    <div className="rounded-md border">
      <div className="grid gap-2 p-2 sm:grid-cols-6">
        <Input className="sm:col-span-2" placeholder="Dr. name *" value={d.name} onChange={(e) => onChange({ name: e.target.value })} />
        <Input placeholder="License" value={d.license || ""} onChange={(e) => onChange({ license: e.target.value })} />
        <Input placeholder="Phone" value={d.phone || ""} onChange={(e) => onChange({ phone: e.target.value })} />
        <Input placeholder="Email" value={d.email || ""} onChange={(e) => onChange({ email: e.target.value })} />
        <Select value={d.contact_pref || "phone"} onValueChange={(v) => onChange({ contact_pref: v as any })}><SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="phone">Phone</SelectItem><SelectItem value="sms">SMS</SelectItem><SelectItem value="email">Email</SelectItem></SelectContent></Select>
      </div>
      <div className="flex items-center justify-between border-t px-2 py-1">
        <Button size="sm" variant="ghost" onClick={() => setOpen(!open)}><ChevronDown className={`mr-1 h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />Restorative preferences</Button>
        <Button size="icon" variant="ghost" aria-label="Remove doctor" onClick={onRemove}><Trash2 className="h-4 w-4" /></Button>
      </div>
      {open && (
        <div className="space-y-3 border-t p-3">
          <div><Label className="text-xs">Occlusal clearance</Label><Chips opts={OCCLUSAL} value={r.occlusal} onChange={(v) => setR({ occlusal: v })} /></div>
          <div><Label className="text-xs">Interproximal contact</Label><Chips opts={CONTACTS} value={r.contact} onChange={(v) => setR({ contact: v })} /></div>
          <div><Label className="text-xs">Margin design</Label><Chips opts={MARGINS} value={r.margin} onChange={(v) => setR({ margin: v })} /></div>
          <div><Label className="text-xs">Pontic design</Label><Chips opts={PONTICS} value={r.pontic} onChange={(v) => setR({ pontic: v })} /></div>
          <div><Label className="text-xs">Staining & glaze (pick any)</Label><Chips multi opts={GLAZES} value={r.glaze} onChange={(v) => setR({ glaze: v })} /></div>
          <div><Label className="text-xs">Model & bite policy</Label><Chips opts={MODEL_POLICIES} value={r.model_policy} onChange={(v) => setR({ model_policy: v })} /></div>
          <div className="grid gap-2 sm:grid-cols-3">
            <div><Label className="text-xs">Preferred Ti-base system</Label><Input placeholder="e.g. Straumann Variobase" value={r.ti_base || ""} onChange={(e) => setR({ ti_base: e.target.value })} /></div>
            <div><Label className="text-xs">Max screw channel angle (°)</Label><Input type="number" min={0} max={30} value={r.screw_angulation_max ?? ""} onChange={(e) => setR({ screw_angulation_max: e.target.value === "" ? undefined : Number(e.target.value) })} /></div>
            <div><Label className="text-xs">Implant retention</Label><Chips opts={RETENTION} value={r.retention} onChange={(v) => setR({ retention: v })} /></div>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div><Label className="text-xs">Shade guide</Label><Input placeholder="e.g. VITA 3D-Master" value={d.shade_guide || ""} onChange={(e) => onChange({ shade_guide: e.target.value })} /></div>
            <div><Label className="text-xs">Special instructions</Label><Input value={d.special_instructions || ""} onChange={(e) => onChange({ special_instructions: e.target.value })} /></div>
          </div>
          {d.margin_pref && !r.margin && <p className="text-xs text-muted-foreground">Older margin note: “{d.margin_pref}” — pick a margin design above to replace it.</p>}
        </div>
      )}
    </div>
  );
}

export function ClientFormDialog({ open, onOpenChange, record, defaultName }: {
  open: boolean; onOpenChange: (o: boolean) => void; record?: LabRecord | null; defaultName?: string;
}) {
  const save = useSaveLabRecord("client-profiles");
  const profiles = useLabRecords("client-profiles");
  const groups = (profiles.data || []).filter((p) => p.data?.is_parent_account && p.id !== record?.id);
  const [f, setF] = useState<ClientProfileInput>(blank());
  const [errs, setErrs] = useState<string[]>([]);
  useEffect(() => { if (open) { setF(fromRecord(record, defaultName)); setErrs([]); } }, [open, record, defaultName]);
  const set = <K extends keyof ClientProfileInput>(k: K, v: ClientProfileInput[K]) => setF((p) => ({ ...p, [k]: v }));
  const setDoc = (i: number, patch: Partial<Doctor>) => set("doctors", (f.doctors || []).map((d, j) => (j === i ? { ...d, ...patch } : d)));

  const submit = async () => {
    const e = validateClient(f);
    setErrs(e);
    if (e.length) return;
    await save.mutateAsync({ id: record?.id, ...toProfileRecord(f, record?.data?.client_id) });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader><DialogTitle>{record ? "Edit client account" : "New client account"}</DialogTitle></DialogHeader>
        <Tabs defaultValue="practice">
          <TabsList className="flex h-auto w-full flex-wrap justify-start">
            <TabsTrigger value="practice">Practice</TabsTrigger><TabsTrigger value="group">DSO / Group</TabsTrigger>
            <TabsTrigger value="scanners">Scanners</TabsTrigger><TabsTrigger value="credit">Credit & Tax</TabsTrigger>
            <TabsTrigger value="doctors">Doctors ({(f.doctors || []).length})</TabsTrigger>
          </TabsList>

          <TabsContent value="practice" className="grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2"><Label>Practice name *</Label><Input value={f.name} onChange={(e) => set("name", e.target.value)} autoFocus /></div>
            <div><Label>Primary contact</Label><Input value={f.contact_name || ""} onChange={(e) => set("contact_name", e.target.value)} /></div>
            <div><Label>Phone</Label><Input value={f.phone || ""} onChange={(e) => set("phone", e.target.value)} /></div>
            <div><Label>Billing email</Label><Input type="email" value={f.email || ""} onChange={(e) => set("email", e.target.value)} /></div>
            <div><Label>Tax ID / TIN</Label><Input value={f.tax_id || ""} onChange={(e) => set("tax_id", e.target.value)} /></div>
            <div><Label>Billing address</Label><Textarea rows={2} value={f.address || ""} onChange={(e) => set("address", e.target.value)} /></div>
            <div><Label>Courier delivery address</Label><Textarea rows={2} value={f.delivery_address || ""} onChange={(e) => set("delivery_address", e.target.value)} /></div>
            <div className="sm:col-span-2"><Label>Courier / logistics notes</Label><Input placeholder="e.g. Afternoon pickup only, gate code #4912" value={f.courier_notes || ""} onChange={(e) => set("courier_notes", e.target.value)} /></div>
          </TabsContent>

          <TabsContent value="group" className="space-y-3">
            <div className="flex items-center gap-2"><Switch checked={!!f.is_parent_account} onCheckedChange={(v) => set("is_parent_account", v)} /><Label>This is a DSO / group parent account</Label></div>
            {!f.is_parent_account && (
              <div><Label>Belongs to group</Label>
                <Select value={f.parent_account || "__none"} onValueChange={(v) => set("parent_account", v === "__none" ? undefined : v)}><SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="__none">Independent practice</SelectItem>{groups.map((g) => <SelectItem key={g.id} value={g.title}>{g.title}</SelectItem>)}</SelectContent></Select>
                {!groups.length && <p className="mt-1 text-xs text-muted-foreground">No group accounts yet. Create one and switch on “parent account”.</p>}
              </div>
            )}
            {(f.is_parent_account || f.parent_account) && (
              <div className="flex items-center gap-2"><Switch checked={!!f.centralized_billing} onCheckedChange={(v) => set("centralized_billing", v)} />
                <Label>{f.is_parent_account ? "Bill all branches centrally to this group" : "Invoices go to the group (centralised billing)"}</Label></div>
            )}
          </TabsContent>

          <TabsContent value="scanners" className="grid gap-3 sm:grid-cols-2">
            <p className="text-xs text-muted-foreground sm:col-span-2">Scanner account IDs let incoming digital cases match this practice automatically.</p>
            {SCANNERS.map((sc) => (
              <div key={sc.key}><Label>{sc.label}</Label><Input value={f.scanners?.[sc.key] || ""} onChange={(e) => set("scanners", { ...(f.scanners || {}), [sc.key]: e.target.value })} /></div>
            ))}
          </TabsContent>

          <TabsContent value="credit" className="grid gap-3 sm:grid-cols-2">
            <div><Label>Payment terms</Label>
              <Select value={f.terms} onValueChange={(v) => set("terms", v as any)}><SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{TERMS.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent></Select></div>
            <div><Label>Default price tier</Label>
              <Select value={f.tier} onValueChange={(v) => set("tier", v as any)}><SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{TIERS.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent></Select></div>
            <div><Label>Credit limit (₦, 0 = none)</Label><Input type="number" min={0} value={f.credit_limit ?? 0} onChange={(e) => set("credit_limit", Number(e.target.value))} /></div>
            <div className="flex items-end gap-2 pb-2"><Switch checked={!!f.on_hold} onCheckedChange={(v) => set("on_hold", v)} /><Label>Manual credit hold</Label></div>
            <div className="flex items-center gap-2 sm:col-span-2"><Switch checked={!!f.hard_credit_stop} onCheckedChange={(v) => set("hard_credit_stop", v)} /><Label>Hard stop: block new cases once the credit limit is reached</Label></div>
            <div><Label>Tax-exempt resale certificate #</Label><Input value={f.tax_exempt_number || ""} onChange={(e) => set("tax_exempt_number", e.target.value)} /></div>
            <div><Label>Certificate expiry</Label><Input type="date" value={f.tax_exempt_expiry || ""} onChange={(e) => set("tax_exempt_expiry", e.target.value)} /></div>
          </TabsContent>

          <TabsContent value="doctors" className="space-y-2">
            <div className="flex justify-end"><Button size="sm" variant="outline" onClick={() => set("doctors", [...(f.doctors || []), { id: newId(), name: "", contact_pref: "phone" }])}><Plus className="mr-1 h-3.5 w-3.5" />Add doctor</Button></div>
            {!(f.doctors || []).length && <p className="py-4 text-center text-sm text-muted-foreground">No doctors yet.</p>}
            {(f.doctors || []).map((d, i) => (
              <DoctorCard key={d.id} d={d} onChange={(p) => setDoc(i, p)} onRemove={() => set("doctors", (f.doctors || []).filter((_, j) => j !== i))} />
            ))}
          </TabsContent>
        </Tabs>

        {errs.length > 0 && <ul className="list-disc pl-5 text-sm text-destructive">{errs.map((e) => <li key={e}>{e}</li>)}</ul>}
        <DialogFooter><Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button><Button onClick={submit} disabled={save.isPending}>Save account</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
