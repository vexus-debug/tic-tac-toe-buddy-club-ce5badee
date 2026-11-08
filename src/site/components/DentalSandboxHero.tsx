import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Check, MessageCircle, ClipboardList, Smile, Plus, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

type Tooth = { n: number; name: string; condition: string; surfaces: string[]; code: string; fee: number; tone: "caries" | "endo" | "ok" | "missing" };

const UPPER: Tooth[] = [
  { n: 17, name: "Upper right 2nd molar", condition: "Healthy", surfaces: [], code: "—", fee: 0, tone: "ok" },
  { n: 16, name: "Upper right 1st molar", condition: "MOD caries", surfaces: ["M", "O", "D"], code: "D2393 · Composite, 3 surfaces", fee: 35000, tone: "caries" },
  { n: 15, name: "Upper right 2nd premolar", condition: "Healthy", surfaces: [], code: "—", fee: 0, tone: "ok" },
  { n: 14, name: "Upper right 1st premolar", condition: "Occlusal caries", surfaces: ["O"], code: "D2391 · Composite, 1 surface", fee: 18000, tone: "caries" },
  { n: 13, name: "Upper right canine", condition: "Healthy", surfaces: [], code: "—", fee: 0, tone: "ok" },
  { n: 12, name: "Upper right lateral incisor", condition: "Healthy", surfaces: [], code: "—", fee: 0, tone: "ok" },
  { n: 11, name: "Upper right central incisor", condition: "Root canal needed", surfaces: ["P"], code: "D3310 · Anterior root canal", fee: 85000, tone: "endo" },
  { n: 21, name: "Upper left central incisor", condition: "Healthy", surfaces: [], code: "—", fee: 0, tone: "ok" },
];
const LOWER: Tooth[] = [
  { n: 47, name: "Lower right 2nd molar", condition: "Healthy", surfaces: [], code: "—", fee: 0, tone: "ok" },
  { n: 46, name: "Lower right 1st molar", condition: "Missing — implant option", surfaces: [], code: "D6010 · Implant placement", fee: 450000, tone: "missing" },
  { n: 45, name: "Lower right 2nd premolar", condition: "Healthy", surfaces: [], code: "—", fee: 0, tone: "ok" },
  { n: 44, name: "Lower right 1st premolar", condition: "Healthy", surfaces: [], code: "—", fee: 0, tone: "ok" },
  { n: 43, name: "Lower right canine", condition: "Healthy", surfaces: [], code: "—", fee: 0, tone: "ok" },
  { n: 42, name: "Lower right lateral incisor", condition: "Healthy", surfaces: [], code: "—", fee: 0, tone: "ok" },
  { n: 41, name: "Lower right central incisor", condition: "Healthy", surfaces: [], code: "—", fee: 0, tone: "ok" },
  { n: 31, name: "Lower left central incisor", condition: "Healthy", surfaces: [], code: "—", fee: 0, tone: "ok" },
];
const ALL = [...UPPER, ...LOWER];

const toneClass: Record<Tooth["tone"], string> = {
  ok: "border-border bg-card text-muted-foreground",
  caries: "border-destructive/60 bg-destructive/10 text-destructive",
  endo: "border-primary/60 bg-primary/10 text-primary",
  missing: "border-dashed border-muted-foreground/50 bg-muted text-muted-foreground",
};
const naira = (n: number) => `₦${n.toLocaleString("en-NG")}`;

type Tab = "chart" | "plan" | "recall";
const TABS: { id: Tab; label: string; icon: typeof Smile }[] = [
  { id: "chart", label: "Tooth chart", icon: Smile },
  { id: "plan", label: "Treatment plan", icon: ClipboardList },
  { id: "recall", label: "WhatsApp recall", icon: MessageCircle },
];

const ToothBtn = ({ t, active, inPlan, onClick }: { t: Tooth; active: boolean; inPlan: boolean; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    aria-label={`Tooth ${t.n}, ${t.condition}`}
    className={`relative flex h-11 min-w-0 flex-1 items-center justify-center rounded-md border px-0 text-[10px] font-semibold tabular-nums transition-all sm:h-12 sm:text-xs ${toneClass[t.tone]} ${active ? "scale-110 ring-2 ring-primary ring-offset-2 ring-offset-background" : "hover:-translate-y-0.5"}`}
  >
    {t.n}
    {inPlan && <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-primary-foreground"><Check className="h-2.5 w-2.5" /></span>}
  </button>
);

const Sandbox = () => {
  const [tab, setTab] = useState<Tab>("chart");
  const [sel, setSel] = useState(16);
  const [plan, setPlan] = useState<number[]>([11]);
  const [sent, setSent] = useState(false);
  const tooth = ALL.find((t) => t.n === sel)!;
  const planItems = ALL.filter((t) => plan.includes(t.n));
  const urgent = planItems.filter((t) => t.tone !== "missing");
  const later = planItems.filter((t) => t.tone === "missing");
  const total = planItems.reduce((s, t) => s + t.fee, 0);
  const inPlan = plan.includes(sel);
  const toggle = () => setPlan((p) => (p.includes(sel) ? p.filter((x) => x !== sel) : [...p, sel]));

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-2xl shadow-primary/10">
      <div className="flex items-center justify-between border-b border-border bg-muted/50 px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-muted-foreground/30" />
          <span className="h-2 w-2 rounded-full bg-muted-foreground/30" />
          <span className="h-2 w-2 rounded-full bg-muted-foreground/30" />
        </div>
        <span className="text-[11px] text-muted-foreground">Chair 2 · Adaeze O., 34</span>
      </div>
      <div className="flex gap-1 border-b border-border p-1.5">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`flex min-w-0 flex-1 items-center justify-center gap-1 rounded-md px-1.5 py-2 text-[11px] sm:gap-1.5 sm:px-2 sm:text-xs font-medium transition-colors ${tab === t.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
          >
            <t.icon className="h-3.5 w-3.5" />
            <span className="truncate">{t.label}</span>
          </button>
        ))}
      </div>

      <div className="min-h-[340px] p-4 sm:p-5">
        <AnimatePresence mode="wait">
          {tab === "chart" && (
            <motion.div key="chart" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
              <p className="mb-2 text-[11px] text-muted-foreground">Tap a tooth</p>
              <div className="space-y-2">
                <div className="flex gap-1 sm:gap-1.5">{UPPER.map((t) => <ToothBtn key={t.n} t={t} active={sel === t.n} inPlan={plan.includes(t.n)} onClick={() => setSel(t.n)} />)}</div>
                <div className="flex gap-1 sm:gap-1.5">{LOWER.map((t) => <ToothBtn key={t.n} t={t} active={sel === t.n} inPlan={plan.includes(t.n)} onClick={() => setSel(t.n)} />)}</div>
              </div>
              <AnimatePresence mode="wait">
                <motion.div key={sel} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="mt-4 rounded-lg border border-border bg-background p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground">#{tooth.n} · {tooth.name}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{tooth.condition}</p>
                    </div>
                    <div className="flex gap-1">
                      {["M", "O", "D", "B", "L"].map((s) => (
                        <span key={s} className={`flex h-6 w-6 items-center justify-center rounded text-[10px] font-semibold ${tooth.surfaces.includes(s) ? "bg-destructive text-destructive-foreground" : "bg-muted text-muted-foreground"}`}>{s}</span>
                      ))}
                    </div>
                  </div>
                  <dl className="mt-3 grid grid-cols-2 gap-3 border-t border-border pt-3 text-xs">
                    <div><dt className="text-muted-foreground">Procedure</dt><dd className="mt-0.5 font-medium text-foreground">{tooth.code}</dd></div>
                    <div><dt className="text-muted-foreground">Fee</dt><dd className="mt-0.5 font-medium text-foreground">{tooth.fee ? naira(tooth.fee) : "No treatment"}</dd></div>
                  </dl>
                  <Button size="sm" disabled={!tooth.fee} onClick={toggle} variant={inPlan ? "outline" : "default"} className="mt-3 w-full gap-1.5">
                    {inPlan ? <><Check className="h-3.5 w-3.5" /> Added to plan</> : <><Plus className="h-3.5 w-3.5" /> Add to treatment plan</>}
                  </Button>
                </motion.div>
              </AnimatePresence>
              <p className="mt-3 text-right text-xs text-muted-foreground">Plan total: <span className="font-semibold text-foreground">{naira(total)}</span></p>
            </motion.div>
          )}

          {tab === "plan" && (
            <motion.div key="plan" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }} className="space-y-3">
              {planItems.length === 0 && <p className="py-10 text-center text-sm text-muted-foreground">Add teeth from the tooth chart to build a plan.</p>}
              {[{ title: "Phase 1 · Pain relief & decay", items: urgent }, { title: "Phase 2 · Restore & replace", items: later }].filter((p) => p.items.length).map((ph) => (
                <div key={ph.title} className="rounded-lg border border-border bg-background">
                  <p className="border-b border-border px-4 py-2 text-xs font-semibold text-foreground">{ph.title}</p>
                  <ul className="divide-y divide-border">
                    {ph.items.map((t) => (
                      <li key={t.n} className="flex items-center justify-between px-4 py-2.5 text-xs">
                        <span className="text-foreground">#{t.n} · {t.code.split(" · ")[1]}</span>
                        <span className="font-medium text-foreground">{naira(t.fee)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              {planItems.length > 0 && (
                <div className="flex items-center justify-between rounded-lg bg-primary/10 px-4 py-3">
                  <span className="text-xs font-medium text-foreground">Total estimate</span>
                  <span className="text-lg font-semibold text-primary">{naira(total)}</span>
                </div>
              )}
              <p className="text-[11px] text-muted-foreground">Patients sign the plan on screen. Billing follows each phase automatically.</p>
            </motion.div>
          )}

          {tab === "recall" && (
            <motion.div key="recall" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
              <div className="rounded-lg border border-border bg-muted/40 p-4">
                <p className="mb-3 text-center text-[10px] uppercase tracking-wider text-muted-foreground">WhatsApp · Adaeze O.</p>
                <div className="ml-auto max-w-[88%] rounded-lg rounded-tr-none bg-primary/15 p-3 text-xs leading-relaxed text-foreground">
                  Hello Adaeze 👋 It's been 6 months since your last cleaning at Bright Smile Dental. Reply <b>1</b> to book Thursday 10am, or <b>2</b> for another time.
                  <p className="mt-1 text-right text-[10px] text-muted-foreground">{sent ? "Delivered ✓✓" : "Draft"}</p>
                </div>
                <AnimatePresence>
                  {sent && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="mt-2 max-w-[60%] rounded-lg rounded-tl-none bg-card p-3 text-xs text-foreground shadow-sm">
                      1
                      <p className="mt-1 text-[10px] text-muted-foreground">Booked automatically · Thu 10:00</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <Button size="sm" onClick={() => setSent(true)} disabled={sent} className="mt-4 w-full gap-1.5">
                {sent ? <><Check className="h-3.5 w-3.5" /> Sent · 59 more recalls due this week</> : <><Send className="h-3.5 w-3.5" /> Send recall</>}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

type Cta = { label: string; href: string; external?: boolean };

export const DentalSandboxHero = ({ primary, points }: { primary: Cta; secondary?: Cta; points: { value: string; label: string }[] }) => (
  <section
    className="relative isolate overflow-hidden"
    style={{ background: "linear-gradient(135deg, hsl(var(--brand-deep)) 0%, hsl(var(--brand-teal)) 100%)" }}
  >
    <div aria-hidden className="absolute inset-0 -z-10 opacity-20 [background-image:radial-gradient(hsl(0_0%_100%/0.5)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]" />
    <div aria-hidden className="absolute -right-32 top-10 -z-10 h-96 w-96 rounded-full bg-[hsl(var(--stage-live)/0.35)] blur-3xl" />
    <div className="container grid items-center gap-12 py-14 md:py-20 lg:grid-cols-12 lg:gap-10">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="lg:col-span-5">
        <p className="inline-flex items-center gap-2 rounded-full border border-hero-on px-3 py-1 text-xs font-medium text-hero-on">
          <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[hsl(var(--stage-live))] opacity-60" /><span className="relative inline-flex h-2 w-2 rounded-full bg-[hsl(var(--stage-live))]" /></span>
          Live demo · no signup needed
        </p>
        <h1 className="mt-5 text-[2rem] leading-[1.08] !text-hero-on sm:text-4xl md:text-[2.75rem]" style={{ textWrap: "balance" }}>
          More chairs filled. Fewer things lost. Every procedure paid for.
        </h1>
        <p className="mt-5 max-w-lg text-base leading-relaxed text-hero-on-muted">
          Try it right here. Tap a tooth, add it to a treatment plan, then send a WhatsApp recall — the same way your team will at the chair.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link to="/signup" className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-card px-6 text-sm font-semibold text-[hsl(var(--brand-deep))] shadow-lg transition-opacity hover:opacity-90">
            Get started <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/login?tab=demo" className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-hero-on px-6 text-sm font-semibold text-hero-on transition-colors hover:bg-[hsl(0_0%_100%/0.1)]">
            See demo <ArrowUpRight className="h-4 w-4" />
          </Link>
          <a href={primary.href} target="_blank" rel="noopener noreferrer" className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[hsl(var(--whatsapp))] px-6 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90">
            <MessageCircle className="h-4 w-4" /> {primary.label}
          </a>
        </div>
        <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-hero-on pt-6">
          {points.map((p) => (
            <div key={p.label}>
              <dt className="text-2xl font-semibold tracking-tight text-hero-on">{p.value}</dt>
              <dd className="mt-1 text-[11px] leading-tight text-hero-on-muted sm:text-xs">{p.label}</dd>
            </div>
          ))}
        </dl>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15 }} className="lg:col-span-7">
        <Sandbox />
      </motion.div>
    </div>
  </section>
);
