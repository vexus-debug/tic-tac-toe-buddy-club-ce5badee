import { Fragment } from "react";
import Layout from "@/site/components/Layout";
import { DentalSandboxHero } from "@/site/components/DentalSandboxHero";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ScreenshotCarousel, type Shot } from "@/site/components/ScreenshotCarousel";
import { LocalSeo } from "@/site/components/LocalSeo";
import {
  ArrowRight,
  MessageCircle,
  Check,
  Smile,
  Armchair,
  FlaskConical,
  ShieldCheck,
  Wallet,
  Boxes,
  BarChart3,
  FileBarChart,
  Users,
  type LucideIcon,
} from "lucide-react";

const WHATSAPP = "https://wa.me/2349017758165?text=Hello%20I%20would%20like%20to%20know%20more%20about%20Clinexus";
const EASE = [0.22, 1, 0.36, 1] as const;
const reveal = {
  hidden: { opacity: 0, y: 34 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};
const viewport = { once: true, margin: "-70px" };

type Feature = { name: string; outcome: string };
type Pillar = {
  icon: LucideIcon;
  kicker: string;
  title: string;
  outcome: string;
  problem: string;
  features: Feature[];
  shots: Shot[];
};

const pillars: Pillar[] = [
  {
    icon: Smile,
    kicker: "Chairside & patient records",
    shots: [{ file: "1-1_tooth_chart.png", caption: "Interactive tooth chart" }, { file: "1-x_patient_chart.png", caption: "Patient clinical chart" }, { file: "1-3_phased_plans.png", caption: "Phased treatment plans" }, { file: "1-4_education.png", caption: "Chairside patient education" }, { file: "1-5_notes_templates.png", caption: "Clinical note templates" }, { file: "1-7_images.png", caption: "X-rays and photos" }, { file: "1-8_patient_file.png", caption: "Complete patient file" }, { file: "1-9_directory.png", caption: "Patient directory" }],
    title: "Chart in seconds. Win the yes faster. Defend every note.",
    outcome: "More case acceptance and airtight records, without slowing the chair down.",
    problem: "Paper charts, scattered X-rays and vague notes cost you accepted treatment and leave you exposed in a dispute.",
    features: [
      { name: "Interactive tooth chart", outcome: "Mark conditions on every tooth and surface, adult or child, so the next dentist sees exactly what was done where." },
      { name: "Full gum (perio) charting", outcome: "Record pocket depths, bleeding, recession and mobility, then compare visits to show patients real progress." },
      { name: "Phased treatment plans", outcome: "Break big cases into clear stages, from pain relief to final restoration, so patients understand the road and commit." },
      { name: "Chairside patient education", outcome: "Show crowns, implants and root canals on screen so hesitant patients understand and agree." },
      { name: "Clinical notes with one-click templates", outcome: "Write structured notes for common procedures in a click instead of typing from scratch." },
      { name: "Locked clinical notes", outcome: "Notes lock after sign-off, so your records hold up in audits, HMO queries and complaints." },
      { name: "X-rays and photos on the tooth", outcome: "Attach images to the exact tooth so nothing gets lost in a folder." },
      { name: "One complete patient file", outcome: "Visits, charts, plans, bills, prescriptions, lab cases, consents and documents in one profile." },
      { name: "Patient directory", outcome: "Find any patient by name, ID or phone in seconds and call or WhatsApp them in one tap." },
    ],
  },
  {
    icon: Armchair,
    kicker: "Front desk & chair flow",
    shots: [{ file: "2-1_huddle.png", caption: "Morning huddle" }, { file: "2-4_calendar.png", caption: "Multi-chair calendar" }, { file: "2-6_waiting_list.png", caption: "Waiting list" }, { file: "2-7_schedules.png", caption: "Staff schedules" }],
    title: "Keep every chair busy and the waiting room calm.",
    outcome: "Fewer empty slots, fewer double-bookings and no shouting down the corridor.",
    problem: "Idle chairs, crowded walk-ins and dentists who don't know who's next quietly drain the day's production.",
    features: [
      { name: "Morning huddle", outcome: "Start every day knowing the patients, the high-value cases and the medical alerts before the first one sits down." },
      { name: "Live chair board", outcome: "See which chair is seated, in treatment or being cleaned, so the team moves without asking." },
      { name: "Dentist's waiting room view", outcome: "Dentists see who has arrived and how long they've waited, right from their screen." },
      { name: "Multi-chair calendar", outcome: "Book by patient, dentist, treatment and chair across day, week and month, with no clashes." },
      { name: "Walk-in queue", outcome: "Turn unplanned arrivals and emergencies into an orderly queue with live wait times." },
      { name: "Waiting list", outcome: "Fill cancelled slots quickly from patients who want to come in sooner." },
      { name: "Staff schedules", outcome: "Working hours, breaks and days off are respected, so nobody is booked over lunch or leave." },
    ],
  },
  {
    icon: FlaskConical,
    kicker: "Dental lab",
    shots: [{ file: "3-1_lab_dashboard.png", caption: "Lab dashboard" }, { file: "3-2_lab_cases.png", caption: "Lab case board" }, { file: "3-4_work_orders.png", caption: "Work orders" }, { file: "3-5_technicians.png", caption: "Technician tracking" }, { file: "3-6_lab_billing.png", caption: "Lab billing" }],
    title: "Never seat a patient for a crown that hasn't arrived.",
    outcome: "Restorative work lands on time, fits first time and is billed correctly.",
    problem: "Lab orders on WhatsApp and paper slips mean late crowns, wrong shades and costly remakes.",
    features: [
      { name: "Lab dashboard", outcome: "See every case in progress, what's due and what's late in one glance." },
      { name: "Lab case board with late-case warnings", outcome: "Get flagged when a fitting appointment is close and the work isn't back yet." },
      { name: "Complete case specifications", outcome: "Tooth, shade, material and design captured once, so the lab builds it right." },
      { name: "Work orders and job tickets", outcome: "Printable tickets keep every case traceable from impression to delivery." },
      { name: "Technician tracking", outcome: "See each technician's workload and remake rate, and fix quality problems early." },
      { name: "Lab billing and remakes", outcome: "Check lab bills against delivered cases before you pay." },
    ],
  },
  {
    icon: ShieldCheck,
    kicker: "Safety & consent",
    shots: [{ file: "4-1_prescriptions.png", caption: "Smart prescribing" }, { file: "4-x_patient_rx.png", caption: "Patient prescriptions" }, { file: "4-4_consents.png", caption: "Consent forms" }, { file: "4-x_patient_consents.png", caption: "Signed patient consents" }, { file: "4-7_reviews.png", caption: "Patient reviews" }],
    title: "Safer prescriptions and consent that protects you.",
    outcome: "Fewer dosing mistakes and a signed record for every procedure.",
    problem: "Handwritten prescriptions and missing consent forms are where clinics get hurt.",
    features: [
      { name: "Smart prescribing", outcome: "Common dental antibiotics and painkillers pre-filled with dose, frequency and instructions." },
      { name: "Safety checks for children", outcome: "Weight-based dosing helps prevent accidental overdoses in young patients." },
      { name: "Printed or WhatsApp prescriptions", outcome: "Give patients a branded slip or send it straight to their phone." },
      { name: "Consent forms with digital signature", outcome: "Procedure-specific forms fill themselves in and get signed on a tablet in the chair." },
      { name: "Paper consent upload", outcome: "Snap a signed paper form and keep it on the patient's file." },
      { name: "Always-visible medical alerts", outcome: "Allergies and risks stay pinned on screen, so nobody misses them." },
      { name: "Patient reviews", outcome: "Collect ratings on cleanliness, wait time and care to see where the clinic can improve." },
    ],
  },
  {
    icon: Wallet,
    kicker: "Billing & money",
    shots: [{ file: "5-1_estimates.png", caption: "Estimates" }, { file: "5-2_billing.png", caption: "Billing and split payments" }, { file: "5-4_payment_plans.png", caption: "Payment plans" }, { file: "5-5_expenses.png", caption: "Expenses" }, { file: "5-6_commissions.png", caption: "Dentist commissions" }, { file: "5-6b_my_earnings.png", caption: "My Earnings" }, { file: "5-7_revenue_allocation.png", caption: "Revenue allocation" }, { file: "5-8_profitability.png", caption: "Profit per treatment" }],
    title: "Get paid for every procedure you do.",
    outcome: "Less leakage, faster collections and fair, automatic dentist pay.",
    problem: "Untracked balances, messy split payments and commission arguments eat into profit every month.",
    features: [
      { name: "Estimates that become invoices", outcome: "Turn an accepted plan into a quote, take a deposit and bill as treatment happens." },
      { name: "Split payments", outcome: "Take cash, card, transfer and HMO on the same invoice without manual maths." },
      { name: "HMO claims", outcome: "Track approvals, claims and co-pays so insurer money doesn't slip through." },
      { name: "Payment plans", outcome: "Offer instalments for braces and implants and close bigger cases." },
      { name: "Expenses", outcome: "Record clinic spending so you know what each month really cost." },
      { name: "Dentist commissions and My Earnings", outcome: "Commissions calculate themselves, and each dentist sees their own earnings." },
      { name: "Revenue allocation", outcome: "See exactly how income is shared between the clinic, dentists and costs." },
      { name: "Profit per treatment", outcome: "Know which procedures make money once materials and lab fees are counted." },
    ],
  },
  {
    icon: Boxes,
    kicker: "Stock & suppliers",
    shots: [{ file: "6-1_inventory.png", caption: "Live stock levels" }, { file: "6-2_materials.png", caption: "Treatment materials" }, { file: "6-3_costs.png", caption: "Stock costs" }, { file: "6-4_suppliers.png", caption: "Suppliers" }, { file: "6-5_purchase_orders.png", caption: "Purchase orders" }],
    title: "Never run out of composite or anaesthetic mid-procedure.",
    outcome: "Stock that tracks itself, and money no longer wasted on expired materials.",
    problem: "Nobody counts the shelf until something's missing, usually with a patient in the chair.",
    features: [
      { name: "Live stock levels", outcome: "See what's on the shelf, with low-stock and expiry alerts." },
      { name: "Treatment materials", outcome: "Link materials to procedures so stock goes down automatically when treatment is done." },
      { name: "Stock costs", outcome: "Know the value of your stock and the cost of each item." },
      { name: "Suppliers", outcome: "Keep every dental supplier and what they deliver in one place." },
      { name: "Purchase orders", outcome: "Reorder in a few clicks and track deliveries against what you ordered." },
    ],
  },
  {
    icon: BarChart3,
    kicker: "Growth & control",
    shots: [{ file: "7-2_reports.png", caption: "Reports" }, { file: "7-3_analytics.png", caption: "Advanced analytics" }, { file: "7-4_branches.png", caption: "Multiple branches" }, { file: "7-5_messages.png", caption: "Team messages" }, { file: "7-5b_notifications.png", caption: "Notifications" }],
    title: "Run one chair or many branches from the same screen.",
    outcome: "Decisions made on numbers, and a team that only sees what they need.",
    problem: "Owners guess at performance and lose control once the clinic grows past one location.",
    features: [
      { name: "Clinic dashboard", outcome: "Patients, revenue, pending payments and today's progress at a glance." },
      { name: "Reports", outcome: "Clinical, financial and operational reports without spreadsheet nights." },
      { name: "Advanced analytics", outcome: "See chair usage by hour and track no-shows to fill your best slots." },
      { name: "Multiple branches", outcome: "Shared patient records across locations, with each branch kept separate where it matters." },
      { name: "Team messages and notifications", outcome: "Staff message each other and get alerts on what needs action." },
      { name: "Role-based access", outcome: "Nine roles, from owner to lab assistant, each seeing only their own work." },
    ],
  },
];

const total = pillars.reduce((n, p) => n + p.features.length, 0);

const PricingCta = () => (
  <motion.div initial="hidden" whileInView="show" viewport={viewport} variants={reveal} className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/15 via-primary/5 to-transparent p-8 md:p-10">
    <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary/20 blur-3xl" />
    <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
      <div className="max-w-xl">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-primary">Pricing</p>
        <h3 className="mb-2 text-2xl font-bold text-foreground md:text-3xl">Only pay when you see patients.</h3>
        <p className="text-muted-foreground">A ₦20,000 one-time setup with 10 free cases, then ₦400 per patient visit. No monthly subscription.</p>
      </div>
      <Link to="/industries/dental-clinics/pricing" className="group inline-flex min-h-12 shrink-0 items-center gap-2 rounded-full bg-primary px-7 py-3 font-bold text-primary-foreground shadow-lg shadow-primary/30 transition hover:-translate-y-0.5 hover:shadow-xl">
        See full pricing <span className="transition group-hover:translate-x-1">→</span>
      </Link>
    </div>
  </motion.div>
);

const DentalClinicFeatures = () => {
  return (
    <Layout>
      <DentalSandboxHero
        primary={{ label: "Talk to us on WhatsApp", href: WHATSAPP, external: true }}
        secondary={{ label: "See the dental clinic overview", href: "/industries/dental-clinics" }}
        points={[
          { value: `${total}`, label: "Tools working together for your clinic" },
          { value: "1", label: "System from the chair to the books" },
          { value: "9", label: "Staff roles, each seeing only their work" },
        ]}
      />
      <div className="eye-theme">
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
        <div className="mx-auto max-w-6xl px-6 pb-24 pt-16">
          <motion.div initial="hidden" whileInView="show" viewport={viewport} variants={reveal} className="mb-16 max-w-3xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-primary">What changes for your clinic</p>
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">Seven problems every dental clinic has, solved in one place.</h2>
            <p className="text-muted-foreground">Each section starts with what usually goes wrong, then shows what you get instead.</p>
          </motion.div>

          <div className="mb-24 space-y-10">
            {pillars.map((p, i) => (
              <Fragment key={p.kicker}>
              {i === 3 && <PricingCta />}
              <motion.section
                initial="hidden"
                whileInView="show"
                viewport={viewport}
                variants={reveal}
                className="eye-panel rounded-3xl p-7 md:p-10"
              >
                <div className="mb-5 flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                        <p.icon className="h-5 w-5 text-primary" />
                      </div>
                      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                        {String(i + 1).padStart(2, "0")} · {p.kicker}
                      </span>
                    </div>
                    <h3 className="mb-6 max-w-3xl text-2xl font-bold text-card-foreground md:text-3xl">{p.title}</h3>
                <div className="mb-8">
                  <ScreenshotCarousel shots={p.shots} />
                </div>
                <div className="grid gap-8 lg:grid-cols-12">
                  <div className="lg:col-span-5">
                    <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                      <span className="font-semibold text-card-foreground">The problem: </span>
                      {p.problem}
                    </p>
                    <p className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm font-medium text-primary">
                      {p.outcome}
                    </p>
                  </div>
                  <ul className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
                    {p.features.map((f) => (
                      <li key={f.name} className="flex items-start gap-3">
                        <Check className="mt-1 h-4 w-4 shrink-0 text-primary" />
                        <div>
                          <p className="font-semibold text-card-foreground">{f.name}</p>
                          <p className="text-sm leading-relaxed text-muted-foreground">{f.outcome}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.section>
              {i === 6 && <PricingCta />}
              </Fragment>
            ))}
          </div>

          <motion.section
            initial="hidden"
            whileInView="show"
            viewport={viewport}
            variants={reveal}
            className="eye-panel rounded-[3rem] p-8 text-center md:p-12"
            style={{ borderColor: "hsl(var(--primary) / 0.3)" }}
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-primary">Next step</p>
            <h2 className="mb-5 text-3xl font-bold text-card-foreground">See what your clinic gets back</h2>
            <p className="mx-auto mb-10 max-w-2xl leading-relaxed text-muted-foreground">
              Tell us how you run charting, bookings, lab work and billing today. We'll show you exactly where Clinexus saves chair time and recovers money.
            </p>
            <div className="inline-flex flex-col gap-4 md:flex-row">
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-10 py-4 font-bold text-primary-foreground transition-colors hover:bg-foreground"
              >
                <MessageCircle className="h-5 w-5" />
                Talk to us on WhatsApp
              </a>
              <Link
                to="/signup"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-foreground px-10 py-4 font-bold text-background transition-colors hover:bg-primary"
              >
                Get started
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/login?tab=demo"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary px-10 py-4 font-bold text-primary transition-colors hover:bg-primary/10"
              >
                Try demo
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.section>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-6 pb-24">
        <LocalSeo specialty="Dental clinic features" />
      </div>
    </Layout>
  );
};

export default DentalClinicFeatures;
