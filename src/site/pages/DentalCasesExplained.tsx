import Layout from "@/site/components/Layout";
import { ClinicalHero, FigurePanel } from "@/site/components/heroes";
import heroPhoto from "@/assets/site/hero-dental-desk.jpg";
import { CheckCircle2, XCircle } from "lucide-react";

const WHATSAPP = "https://wa.me/2349017758165?text=Hello%20I%20have%20a%20question%20about%20Clinexus%20per-case%20pricing";

const steps = [
  { n: "1", t: "Start with 10 free cases, then buy credits in advance", d: "The ₦20,000 setup includes 10 free cases. After that, 1 credit = 1 case = ₦400. Credits never expire. Your balance shows on the wallet button in your dashboard." },
  { n: "2", t: "A credit is used on first clinical work in a visit", d: "Booking, checking in, or adding a note, plan, chart, X-ray, prescription, lab order or invoice for a patient's visit." },
  { n: "3", t: "One case covers one visit", d: "Everything done for that patient during the visit is covered. The next visit opens a new case." },
];

const counts = [
  "First clinical work in a patient visit",
  "Every new visit, even for the same patient",
  "Moving an appointment to a new visit date",
];
const notCounts = [
  "Registering a new patient",
  "Viewing old records, charts and reports",
  "Editing anything inside an open case",
];

const examples = [
  { who: "Patient A: Scaling today, review in 2 weeks", calc: "2 cases — each visit is its own case.", cost: "₦800" },
  { who: "Patient B: Root canal (3 visits), then a crown visit", calc: "4 cases — one for each of the 4 visits.", cost: "₦1,600" },
  { who: "Patient C: Emergency visit in January, filling in March", calc: "2 cases — one for each visit.", cost: "₦800" },
  { who: "Patient D: Single check-up", calc: "1 case — one visit.", cost: "₦400" },
];

const faqs = [
  { q: "When do I pay?", a: "In advance. You start with 10 free cases at signup, then buy credits that are used as you go. To top up, contact Clinexus support." },
  { q: "Do credits expire?", a: "No. Credits last indefinitely until you use them." },
  { q: "What happens at zero credits?", a: "Old records stay open, but new cases are blocked until you top up. The wallet turns red below 5 credits." },
  { q: "Do I get a credit back if I delete a visit?", a: "No. Deleting or cancelling a visit does not return the credit." },
  { q: "Is there a monthly subscription too?", a: "No. Only the one-time ₦20,000 setup fee and ₦400 per case." },
];

const DentalCasesExplained = () => (
  <Layout>
    <ClinicalHero
      kicker="How per-case pricing works"
      title="₦400 per patient case, explained simply."
      description="One case covers one patient visit — everything done in that visit is included."
      primary={{ label: "Ask us on WhatsApp", href: WHATSAPP, external: true }}
      secondary={{ label: "Back to pricing", href: "/industries/dental-clinics/pricing" }}
      photo={{ src: heroPhoto, alt: "Patient paying at a dental clinic front desk" }}
      aside={<FigurePanel figure="₦400" unit="per case" ledger={[
        { term: "Covers", detail: "One patient" },
        { term: "Visits", detail: "One visit per case" },
        { term: "Included", detail: "Everything done in that visit" },
      ]} />}
    />
    <div className="mx-auto max-w-3xl space-y-12 px-4 py-12 sm:px-6">
      <section>
        <h2 className="mb-5 text-lg font-semibold text-foreground">What is a case?</h2>
        <ol className="relative space-y-6 border-l border-border pl-6">
          {steps.map((s) => (
            <li key={s.n} className="relative">
              <span className="absolute -left-[33px] top-0 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">{s.n}</span>
              <p className="text-sm font-medium text-foreground">{s.t}</p>
              <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{s.d}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="grid gap-8 sm:grid-cols-2">
        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary">Uses a credit</h3>
          <ul className="divide-y divide-border">{counts.map((c) => <li key={c} className="flex gap-2 py-2 text-[13px] text-muted-foreground"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />{c}</li>)}</ul>
        </div>
        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Free</h3>
          <ul className="divide-y divide-border">{notCounts.map((c) => <li key={c} className="flex gap-2 py-2 text-[13px] text-muted-foreground"><XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />{c}</li>)}</ul>
        </div>
      </section>

      <section>
        <h2 className="mb-1 text-lg font-semibold text-foreground">Examples</h2>
        <p className="mb-4 text-[13px] text-muted-foreground">Cases are counted per patient. One patient's visits never share or use up another patient's case.</p>
        <div className="divide-y divide-border border-y border-border">
          {examples.map((e) => (
            <div key={e.who} className="flex items-start justify-between gap-4 py-4">
              <div><p className="text-sm font-medium text-foreground">{e.who}</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{e.calc}</p></div>
              <p className="shrink-0 text-sm font-semibold text-primary">{e.cost}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-foreground">Quick answers</h2>
        <div className="divide-y divide-border border-y border-border">
          {faqs.map((f) => (
            <details key={f.q} className="group py-3">
              <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-foreground">{f.q}<span className="text-primary transition-transform group-open:rotate-45">+</span></summary>
              <p className="mt-2 text-[13px] text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  </Layout>
);

export default DentalCasesExplained;
