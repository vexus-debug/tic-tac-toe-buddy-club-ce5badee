import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Settings, Plus, Save, Pencil, KeyRound } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

function usePlatformSettings() {
  return useQuery({
    queryKey: ["admin-platform-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("platform_settings")
        .select("*")
        .order("category", { ascending: true });
      if (error) throw error;
      return data || [];
    },
  });
}

const SECRET_KEYS = [
  { key: "openrouter_api_key", label: "OpenRouter (Blog AI)", hint: "sk-or-v1-…", help: "Used by Blog Studio and the daily autopilot." },
  { key: "resend_api_key", label: "Resend (Outreach email)", hint: "re_…", help: "Used to send outreach campaigns." },
];

function ApiKeysCard({ saved, userId }: { saved: Set<string>; userId?: string }) {
  const qc = useQueryClient();
  const [values, setValues] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<string | null>(null);
  const save = async (key: string, remove = false) => {
    const v = (values[key] ?? "").trim();
    if (!remove && v.length < 10) { toast({ title: "Paste the full key first", variant: "destructive" }); return; }
    setBusy(key);
    const { error } = remove
      ? await supabase.from("platform_settings").delete().eq("key", key)
      : await supabase.from("platform_settings").upsert(
          { key, value: { key: v }, category: "api_keys", description: "Secret API key (hidden)", updated_by: userId },
          { onConflict: "key" },
        );
    setBusy(null);
    if (error) { toast({ title: "Couldn't save", description: error.message, variant: "destructive" }); return; }
    setValues((s) => ({ ...s, [key]: "" }));
    qc.invalidateQueries({ queryKey: ["admin-platform-settings"] });
    toast({ title: remove ? "Key removed" : "Key saved" });
  };
  return (
    <Card className="glass-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm uppercase tracking-wider text-muted-foreground"><KeyRound className="h-4 w-4" /> API keys</CardTitle>
        <p className="text-xs text-muted-foreground">Stored privately in your database and only readable by super admins. Saved keys are never shown again — paste a new one to replace.</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {SECRET_KEYS.map((k) => (
          <div key={k.key} className="space-y-1.5 rounded-lg bg-muted/30 p-3">
            <div className="flex items-center justify-between gap-2">
              <Label>{k.label}</Label>
              {saved.has(k.key) ? <Badge>Saved</Badge> : <Badge variant="secondary">Not set</Badge>}
            </div>
            <p className="text-xs text-muted-foreground">{k.help}</p>
            <div className="flex flex-wrap gap-2">
              <Input type="password" autoComplete="off" className="min-w-0 flex-1 font-mono text-xs" placeholder={saved.has(k.key) ? "Paste a new key to replace" : k.hint}
                value={values[k.key] ?? ""} onChange={(e) => setValues((s) => ({ ...s, [k.key]: e.target.value }))} />
              <Button size="sm" disabled={busy === k.key} onClick={() => save(k.key)}>Save</Button>
              {saved.has(k.key) && <Button size="sm" variant="outline" disabled={busy === k.key} onClick={() => save(k.key, true)}>Remove</Button>}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default function AdminPlatformSettings() {
  const { data: settings = [], isLoading } = usePlatformSettings();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ key: "", value: "", category: "general", description: "" });

  const upsert = useMutation({
    mutationFn: async () => {
      let parsedValue: any;
      try { parsedValue = JSON.parse(form.value); } catch { parsedValue = form.value; }

      if (editId) {
        const { error } = await supabase.from("platform_settings").update({
          value: parsedValue,
          category: form.category,
          description: form.description,
          updated_by: user?.id,
        }).eq("id", editId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("platform_settings").insert({
          key: form.key,
          value: parsedValue,
          category: form.category,
          description: form.description,
          updated_by: user?.id,
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-platform-settings"] });
      toast({ title: editId ? "Setting updated" : "Setting created" });
      setOpen(false);
      setEditId(null);
      setForm({ key: "", value: "", category: "general", description: "" });
    },
  });

  const openEdit = (s: any) => {
    setEditId(s.id);
    setForm({
      key: s.key,
      value: typeof s.value === "string" ? s.value : JSON.stringify(s.value, null, 2),
      category: s.category,
      description: s.description || "",
    });
    setOpen(true);
  };

  const secretKeys = new Set(SECRET_KEYS.map((k) => k.key));
  const savedSecrets = new Set((settings as any[]).filter((s) => secretKeys.has(s.key)).map((s) => s.key));
  const grouped = (settings as any[]).filter((s) => !secretKeys.has(s.key)).reduce((acc: Record<string, any[]>, s: any) => {
    const cat = s.category || "general";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(s);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Platform Settings</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Global configuration for the platform.</p>
        </div>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) { setEditId(null); setForm({ key: "", value: "", category: "general", description: "" }); } }}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1"><Plus className="h-4 w-4" /> Add Setting</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editId ? "Edit" : "Add"} Setting</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Key</Label><Input value={form.key} onChange={(e) => setForm({ ...form, key: e.target.value })} disabled={!!editId} placeholder="e.g. default_trial_days" /></div>
              <div><Label>Value (JSON or string)</Label><Textarea value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} rows={3} /></div>
              <div><Label>Category</Label><Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></div>
              <div><Label>Description</Label><Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
              <Button onClick={() => upsert.mutate()} disabled={!form.key} className="w-full gap-1">
                <Save className="h-4 w-4" /> {editId ? "Update" : "Create"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <ApiKeysCard saved={savedSecrets} userId={user?.id} />

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : Object.keys(grouped).length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Settings className="h-8 w-8 mx-auto mb-2 opacity-50" /><p>No settings configured</p>
        </div>
      ) : Object.entries(grouped).map(([category, items]) => (
        <Card key={category} className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">{category}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(items as any[]).map((s) => (
              <div key={s.id} className="flex items-start justify-between gap-4 p-3 rounded-lg bg-muted/30">
                <div className="flex-1 min-w-0">
                  <code className="text-sm font-mono font-medium">{s.key}</code>
                  {s.description && <p className="text-xs text-muted-foreground mt-0.5">{s.description}</p>}
                  <pre className="text-xs text-muted-foreground mt-1 bg-muted/50 p-2 rounded max-h-20 overflow-y-auto">
                    {typeof s.value === "string" ? s.value : JSON.stringify(s.value, null, 2)}
                  </pre>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => openEdit(s)}>
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
