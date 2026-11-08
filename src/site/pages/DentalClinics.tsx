import { useState } from "react";
import Layout from "@/site/components/Layout";
import { ClinicalHero } from "@/site/components/heroes";
import heroPhoto from "@/assets/site/hero-dental.jpg";
import { motion, MotionConfig } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Boxes,
  CalendarClock,
  Check,
  ClipboardList,
  FileBarChart,
  MessageCircle,
  ShieldCheck,
  Smile,
  Users,
  Wallet,
  Sparkles,
  FileText,
  Pill,
  Receipt,
} from "lucide-react";
import shotPatients from "@/assets/dashboard-shots/dental-patients.png";
import shotAppointments from "@/assets/dashboard-shots/dental-appointments.png";
import shotCharts from "@/assets/dashboard-shots/dental-charts.png";
import shotBilling from "@/assets/dashboard-shots/dental-billing.png";
import shotInventory from "@/assets/dashboard-shots/dental-inventory.png";
import shotDashboard from "@/assets/dashboard-shots/dental-dashboard.png";
import shotTreatments from "@/assets/dashboard-shots/dental-treatments.png";
import { LocalSeo } from "@/site/components/LocalSeo";
import { CapabilityMatrix, ClosingBanner, PricingEstimator, type CapabilityGroup } from "@/site/components/industry/IndustrySections";
import { DentalSavings, DentalTrust } from "@/site/components/industry/DentalSavings";

const matrixGroups: CapabilityGroup[] = [
  { tab: "Clinical", icon: Smile, tag: "Clinical & Charting", title: "Chart by tooth, plan by patient", benefit: "Everything you record in the chair stays attached to the same patient.", points: ["Tooth-by-tooth charting", "Treatment plans", "SOAP notes", "Prescriptions", "Digital consent forms", "Tooth-tagged imaging"] },
  { tab: "Admin", icon: CalendarClock, tag: "Front Desk & Scheduling", title: "A front desk that finally breathes", benefit: "Fewer no-shows, shorter waits, no double-booked chairs.", points: ["Chair & dentist booking", "Live waiting list", "Walk-in queue", "Invoices & estimates", "Payment plans"] },
  { tab: "Operations", icon: Boxes, tag: "Back Office & Inventory", title: "Facts, not guesswork", benefit: "Stock, staff and money reconciled from the work itself.", points: ["Stock linked to treatments", "Suppliers & purchase orders", "Commissions & expenses", "Profit per treatment", "Audit trail"] },
];

const WHATSAPP = "https://wa.me/2349017758165?text=Hello%20I%20would%20like%20to%20know%20more%20about%20Clinexus";
// Fluid motion: short vertical lifts, strong ease-out, gentle stagger by index.
const EASE = [0.23, 1, 0.32, 1] as const;
const viewport = { once: true, amount: 0.15 };
const reveal = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.34, ease: EASE, delay: Math.min(i, 6) * 0.045 } }),
};
const slide = (_dir: "left" | "right" | "up") => reveal;

const Screenshot = ({ src, alt }: { src: string; alt: string }) => (
  <div className="mb-6 overflow-hidden rounded-2xl border border-primary/15 bg-background">
    <div className="flex items-center gap-1.5 border-b border-primary/10 bg-muted/40 px-3 py-2">
      <span className="h-2 w-2 rounded-full bg-primary/25" />
      <span className="h-2 w-2 rounded-full bg-primary/25" />
      <span className="h-2 w-2 rounded-full bg-primary/25" />
    </div>
    <img src={src} alt={alt} loading="lazy" className="block w-full" />
  </div>
);

const modules = [
  { icon: ClipboardList, name: "Patient records", shot: shotPatients, shotAlt: "Patient list with contact details, visit history and status", benefit: "Every patient's whole story, right where you need it.", body: "Picture the patient who walks back in after a year. Instead of flipping through a tired folder, you open their name and their whole story is there — treatments, prescriptions, X-rays, notes. Allergies and emergency contacts sit right at the top, so you can walk into that chair knowing you've missed nothing." },
  { icon: CalendarClock, name: "Scheduling", shot: shotAppointments, shotAlt: "Monthly appointment calendar showing booked patients per day", benefit: "Your day runs itself, instead of running you.", body: "You'll never look up mid-procedure to find the front desk has double-booked a chair again. Book by patient, dentist and chair without clashes. Day, week and month views, a live chair grid, a walk-in queue and a waiting list keep your day moving, even when it's hectic." },
  { icon: Smile, name: "Dental charting", shot: shotCharts, shotAlt: "Interactive adult tooth chart with per-tooth condition colours", benefit: "Chart by tooth, not by memory.", body: "Tap the tooth, record what you found, and turn back to the person in front of you. Treatment plans, prescriptions and consent forms stay attached to the same patient — so six months from now, you'll know exactly what you saw without guessing." },
  { icon: Wallet, name: "Billing", shot: shotBilling, shotAlt: "Billing screen with invoices, amounts owed and payment status", benefit: "You worked for that money. Watch it come home.", body: "There's nothing worse than a month-end total that doesn't match the work you put in. See who owes you, who's on a payment plan, and what each treatment really costs you to deliver — so your numbers finally reflect the care you give." },
  { icon: Boxes, name: "Inventory", shot: shotInventory, shotAlt: "Inventory list showing stock levels and low-stock alerts", benefit: "Never reach for something that isn't there.", body: "You're mid-procedure. The last thing you should be doing is wondering whether that material ran out yesterday. Know what's on the shelf before the patient sits down, not while they're in the chair. Low-stock alerts, suppliers and purchase orders, all in one place." },
  { icon: ShieldCheck, name: "Oversight & access", shot: shotDashboard, shotAlt: "Clinic dashboard with patient count, revenue and today's schedule", benefit: "You see everything. Your staff see only their part.", body: "Patient numbers, today's schedule, pending payments and monthly revenue on one screen — the whole clinic in a single glance, before you even take off your coat. Each person on your team only sees what their job needs, so you can let go without losing control." },
];

const aiFeatures = [
  { icon: FileText, name: "AI SOAP notes", shot: shotCharts, shotAlt: "Dental chart whose findings feed the AI-drafted SOAP note", benefit: "Your notes, drafted before the patient leaves the chair.", points: ["Drafts Subjective, Objective, Assessment and Plan from today's chart", "Flags anything missing as \"clinician to confirm\"", "You edit and sign — nothing saves on its own"] },
  { icon: Pill, name: "Prescription safety", shot: shotTreatments, shotAlt: "Treatment screen where prescriptions are checked by AI", benefit: "A second pair of eyes on every prescription.", points: ["Checks drug interactions against current medications", "Catches allergy conflicts, including cross-reactions", "Rates each concern high, moderate or low with an alternative"] },
  { icon: Receipt, name: "Missed-billing check", shot: shotBilling, shotAlt: "Billing screen where AI suggests unbilled treatments", benefit: "Work you did today doesn't slip off the bill.", points: ["Compares today's charted work against the invoice", "Only suggests items from your own treatment list", "Conservative by design — no guesses, no duplicates"] },
  { icon: CalendarClock, name: "Fast-fill & aftercare", shot: shotAppointments, shotAlt: "Appointment calendar where AI suggests patients for an open slot", benefit: "Empty chairs filled, patients sent home informed.", points: ["Ranks patients with pending treatment for a cancelled slot", "Writes simple post-op instructions from today's procedures", "Tailors consent forms with patient-specific risks"] },
];


const included = ["Full patient records, SOAP notes and tooth-tagged imaging", "Scheduling with chair and clinician conflict prevention", "Dental charting, treatment planning and consent forms", "Billing, payment plans, commissions and profitability reporting", "Inventory linked to treatments, suppliers and purchase orders", "Reports, analytics and role-based access control"];
const roles = ["Owner", "Admin", "Dentist", "Receptionist", "Hygienist", "Assistant", "Accountant", "Lab technician", "Lab assistant"];

const coreGroups = [
  {
    icon: Users,
    title: "Patients & appointments",
    benefit: "Fewer no-shows. Shorter waits. A front desk that finally breathes.",
    points: [
"Every patient's history, files and allergies in one profile",
"Appointments, dentist schedules and a live waiting list",
"Notes, treatment plans, prescriptions and consent forms, all digital",
"Treatments link to the materials they use, so stock and notes agree",
    ],
  },
  {
    icon: Wallet,
    title: "Money & billing",
    benefit: "Know what you earned, what it cost you and who still owes you — without opening a notebook.",
    points: [
"Invoices and estimates before the patient commits to treatment",
"Payment plans for big work like implants and braces",
"Expenses and staff commissions tracked as they happen",
"See profit per treatment and per dentist, not just month-end totals",
    ],
  },
  {
    icon: Boxes,
    title: "Stock & suppliers",
    benefit: "Never have to cancel a procedure because something ran out on your watch.",
    points: [
"Every material tracked with its real cost and value",
"Treatments link straight to the materials they consume",
"Suppliers and purchase orders stay with the items they deliver",
"Check what's on the shelf in seconds, before the next patient",
    ],
  },
  {
    icon: FileBarChart,
    title: "Reports & admin",
    benefit: "Run your clinic on facts, not on the nagging feeling that something's slipping.",
    points: [
"Clear reports on patients, money and daily activity",
"Staff records, documents and clinic settings in one place",
"An audit trail showing who changed what, and when",
"A live feed, so you always know what's happening without asking",
    ],
  },
];

const visitSteps = [
  { t: "Booked", d: "Chair and dentist reserved, reminder sent." },
  { t: "Checked in", d: "Front desk sees them join the queue." },
  { t: "In the chair", d: "Tooth chart, notes and X-rays open together." },
  { t: "Materials used", d: "Stock updates from the treatment itself." },
  { t: "Paid", d: "Invoice or payment plan, on the same file." },
];

const roleGroups = [
  { label: "Clinical", roles: ["Dentist", "Hygienist", "Assistant", "Lab technician", "Lab assistant"] },
  { label: "Front desk", roles: ["Receptionist", "Admin"] },
  { label: "Owner & finance", roles: ["Owner", "Accountant"] },
];

const FeatureTabs = () => {
  const [active, setActive] = useState(0);
  const m = modules[active];
  return (
    <div>
      <div role="tablist" aria-label="Clinic modules" className="-mx-4 mb-8 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        {modules.map((item, i) => (
          <button key={item.name} role="tab" aria-selected={i === active} onClick={() => setActive(i)} className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${i === active ? "border-primary bg-primary text-primary-foreground" : "border-primary/25 text-foreground hover:bg-primary/[0.06]"}`}>
            <item.icon className="h-4 w-4" aria-hidden="true" />{item.name}
          </button>
        ))}
      </div>
      <div role="tabpanel" className="grid items-center gap-8 lg:grid-cols-[1.25fr_1fr] lg:gap-12">
        <Screenshot src={m.shot} alt={m.shotAlt} />
        <div>
          <p className="mb-2 text-sm font-semibold text-primary">{m.name}</p>
          <h3 className="mb-4 text-2xl font-bold leading-snug">{m.benefit}</h3>
          <p className="leading-relaxed text-muted-foreground">{m.body}</p>
        </div>
      </div>
    </div>
  );
};

const DentalClinics = () => {
  return (
    <Layout>
      <ClinicalHero
        kicker="Clinexus for dental clinics"
        title="You didn't spend years learning to heal teeth so you could chase folders all evening."
        description="You know the feeling — a full waiting room, a patient in the chair who needs all of you, and a stack of files daring you to fall behind. We built Clinexus sitting with dental clinics like yours, listening to the days you actually have."
        primary={{ label: "Talk to us on WhatsApp", href: WHATSAPP, external: true }}
        secondary={{ label: "See pricing", href: "/industries/dental-clinics/pricing" }}
        photo={{ src: heroPhoto, alt: "Dentist treating a smiling patient in a modern dental operatory" }}
        card={{ src: shotDashboard, alt: "Clinexus dental dashboard with today's schedule and revenue", caption: "Today's schedule and revenue, live" }}
        points={[
          { value: "3–4 hrs", label: "Admin time given back each day" },
          { value: "40%", label: "Fewer no-shows with automatic reminders" },
          { value: "9", label: "Staff roles with their own access" },
        ]}
      />
      <div className="eye-theme overflow-x-hidden">
        {/* Trust ribbon — solid ice-teal band, no boxes */}
        <section aria-label="Industry-standard, enterprise-grade" className="border-y border-primary/15 bg-primary/[0.06]">
          <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
            <ul className="grid grid-cols-1 divide-y divide-primary/15 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
              {[
                { icon: Smile, t: "Standard dental nomenclature", d: "FDI & Universal numbering, MODBL surfaces." },
                { icon: Users, t: "Enterprise role security", d: "9 access tiers — each sees only their part." },
                { icon: FileBarChart, t: "Full audit trail", d: "Timestamped logs on clinical and billing edits." },
                { icon: ShieldCheck, t: "Secure cloud", d: "Encrypted, backed up, no local server to fail." },
              ].map((b) => (
                <li key={b.t} className="flex items-start gap-3 py-3 lg:px-5 lg:first:pl-0">
                  <b.icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold">{b.t}</h3>
                    <p className="text-xs leading-snug text-muted-foreground">{b.d}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
        <DentalTrust />

        {/* Layout 1: tabbed showcase — white */}
        <section id="features" className="scroll-mt-24 bg-background py-16 lg:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="mb-4 text-2xl font-bold md:text-3xl">What you get, <span className="text-muted-foreground">in plain words</span></h2>
            <p className="mb-8 max-w-2xl text-muted-foreground">One simple place for your patients, your appointments, your money and your stock — instead of the folders, notebooks and endless chats that eat your evenings.</p>
            <FeatureTabs />
            <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-primary/15 pt-6 sm:flex-row sm:items-center">
              <p className="text-muted-foreground"><span className="font-semibold text-foreground">Want the full picture?</span> Explore every feature built for dental clinics.</p>
              <Button asChild size="lg" className="w-full shrink-0 rounded-xl sm:w-auto">
                <Link to="/industries/dental-clinics/features">See all features <ArrowRight className="h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Layout 2: connected pipeline — solid navy */}
        <section className="bg-[hsl(var(--medical-navy))] py-16 lg:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="mb-3 text-sm font-semibold text-[hsl(var(--brand-light))]">A patient's visit</p>
            <h2 className="mb-12 max-w-3xl text-2xl font-bold md:text-3xl">From the front door to the payment, one record the whole way</h2>
            <ol className="relative grid gap-8 md:grid-cols-5 md:gap-4">
              <span aria-hidden="true" className="absolute left-5 top-5 bottom-5 w-px bg-[hsl(0_0%_100%/0.2)] md:bottom-auto md:left-5 md:right-5 md:h-px md:w-auto" />
              {visitSteps.map((s, i) => (
                <motion.li key={s.t} custom={i} initial="hidden" whileInView="show" viewport={viewport} variants={reveal} className="relative flex gap-4 md:flex-col">
                  <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold">{i + 1}</span>
                  <div>
                    <h3 className="mb-1 text-base font-semibold">{s.t}</h3>
                    <p className="text-sm leading-snug">{s.d}</p>
                  </div>
                </motion.li>
              ))}
            </ol>
          </div>
        </section>

        {/* Layout 3: zig-zag — ice teal */}
        <section id="ai" className="scroll-mt-24 bg-primary/[0.05] py-16 lg:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="mb-3 text-sm font-semibold text-primary">AI in your clinical workflow</p>
            <h2 className="mb-4 text-2xl font-bold md:text-3xl">An assistant beside the chair, <span className="text-muted-foreground">not another screen to learn</span></h2>
            <p className="mb-14 max-w-2xl text-muted-foreground">Clinexus AI reads the patient's own history and chart — it never invents facts, and it never changes a record without you. You review, edit and approve every suggestion.</p>
            <div className="space-y-16 lg:space-y-24">
              {aiFeatures.map((f, i) => (
                <motion.article key={f.name} initial="hidden" whileInView="show" viewport={viewport} variants={reveal} className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
                  <div className={i % 2 ? "lg:order-2" : ""}>
                    <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-primary"><f.icon className="h-4 w-4" aria-hidden="true" />{f.name}</p>
                    <h3 className="mb-4 text-xl font-bold leading-snug sm:text-2xl">{f.benefit}</h3>
                    <ul className="space-y-3">{f.points.map((p) => <li key={p} className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" /><span>{p}</span></li>)}</ul>
                  </div>
                  <div className={i % 2 ? "lg:order-1" : ""}><Screenshot src={f.shot} alt={f.shotAlt} /></div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* Layout 4: oversight list + role clusters — white */}
        <section className="bg-background py-16 lg:py-24">
          <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="mb-2 text-2xl font-bold">Know what's happening, every day</h2>
              <p className="mb-8 font-medium text-primary">Without chasing anyone for an update.</p>
              <dl className="divide-y divide-primary/15 border-y border-primary/15">
                {[
                  { icon: Wallet, t: "Money at a glance", d: "Patient count, pending payments and this month's revenue, right up front." },
                  { icon: CalendarClock, t: "Today, live", d: "Today's schedule and who's next, plus a live activity feed." },
                  { icon: FileBarChart, t: "Useful reports", d: "Reports that answer the questions you actually ask." },
                ].map((r) => (
                  <div key={r.t} className="flex gap-4 py-5">
                    <r.icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                    <div><dt className="font-semibold text-foreground">{r.t}</dt><dd className="text-sm text-muted-foreground">{r.d}</dd></div>
                  </div>
                ))}
              </dl>
            </div>
            <div>
              <h2 className="mb-2 text-2xl font-bold">Everyone sees only what they should</h2>
              <p className="mb-8 font-medium text-primary">Reception doesn't see your finances. Simple.</p>
              <div className="space-y-6">
                {roleGroups.map((g) => (
                  <div key={g.label}>
                    <p className="mb-3 text-sm font-semibold text-foreground">{g.label}</p>
                    <ul className="flex flex-wrap gap-2">{g.roles.map((role) => <li key={role} className="rounded-full border border-primary/25 bg-primary/[0.06] px-3.5 py-1.5 text-sm text-foreground">{role}</li>)}</ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Layout 5: savings + pricing — muted band */}
        <section className="bg-muted/50 py-16 lg:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <DentalSavings />
            <PricingEstimator included={included} pricingHref="/industries/dental-clinics/pricing" casesHref="/industries/dental-clinics/how-cases-work" />
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-4 pt-16 sm:px-6">
          <ClosingBanner
            title="See it with your own patients"
            body="Tell us how your clinic handles booking, charting and billing — and the part that frustrates you most — and we'll show you Clinexus doing exactly that, not a generic demo."
            whatsapp={WHATSAPP}
            trust={["Every feature included", "No monthly subscription", "Role-based access for 9 staff roles", "Audit trail on every change"]}
          />
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:pb-24">
        <LocalSeo specialty="Dental clinics" />
      </div>
    </Layout>
  );
};

export default DentalClinics;
