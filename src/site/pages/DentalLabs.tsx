import Layout from "@/site/components/Layout";
import { ClinicalHero } from "@/site/components/heroes";
import heroPhoto from "@/assets/site/hero-dental-lab.jpg";
import { motion } from "framer-motion";
import { ArrowRight, Check, ClipboardList, Cpu, ShieldCheck, Wallet, CalendarClock, Users, Truck, RotateCcw, FileBarChart } from "lucide-react";
import shotDashboard from "@/assets/dashboard-shots/dlab-dashboard.png";
import shotCases from "@/assets/dashboard-shots/dlab-cases.png";
import shotCam from "@/assets/dashboard-shots/dlab-cam.png";
import shotQc from "@/assets/dashboard-shots/dlab-qc.png";
import shotCalendar from "@/assets/dashboard-shots/dlab-calendar.png";
import shotClients from "@/assets/dashboard-shots/dlab-clients.png";
import shotBilling from "@/assets/dashboard-shots/dlab-billing.png";
import { LocalSeo } from "@/site/components/LocalSeo";
import { usePageMeta } from "@/site/components/usePageMeta";
import { ClosingBanner } from "@/site/components/industry/IndustrySections";

const WHATSAPP = "https://wa.me/2349017758165?text=Hello%20I%20would%20like%20to%20know%20more%20about%20Clinexus%20for%20dental%20labs";
const EASE = [0.23, 1, 0.32, 1] as const;
const viewport = { once: true, amount: 0.15 };
const reveal = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.34, ease: EASE, delay: Math.min(i, 6) * 0.045 } }),
};

const Screenshot = ({ src, alt }: { src: string; alt: string }) => (
  <div className="overflow-hidden rounded-2xl border border-primary/15 bg-background shadow-sm">
    <div className="flex items-center gap-1.5 border-b border-primary/10 bg-muted/40 px-3 py-2">
      <span className="h-2 w-2 rounded-full bg-primary/25" />
      <span className="h-2 w-2 rounded-full bg-primary/25" />
      <span className="h-2 w-2 rounded-full bg-primary/25" />
    </div>
    <img src={src} alt={alt} loading="lazy" className="block w-full" />
  </div>
);

const pains = [
  { t: "\"Is my crown ready?\"", d: "Clinics stop calling. They see where every case is, so your phone stops ringing mid-layering." },
  { t: "Cases slipping past due", d: "Late and rush cases jump to the top before a dentist has to reschedule a patient." },
  { t: "Remakes eating your margin", d: "Every remake is logged with a reason, so you can see who, what and why — and fix it." },
  { t: "Money stuck with clinics", d: "Know exactly which practice owes you, how long it's been, and send the statement in one tap." },
];

const modules = [
  { icon: ClipboardList, name: "Case board", shot: shotCases, alt: "Case board with cases moving from received to design and milling", benefit: "Every case, every stage, on one board.", body: "From the moment an impression or scan walks through your door to the day it ships, each case sits in its stage — tooth numbers, shade, clinic, patient and due date on the card. Move it forward with one tap. No more whiteboards, no more sticky notes falling off the wall." },
  { icon: Cpu, name: "CAD/CAM & equipment", shot: shotCam, alt: "CAD/CAM scan intake showing verified and awaiting scans", benefit: "Your digital workflow, finally organised.", body: "Check incoming scans before design starts, then batch cases onto milling discs, sintering cycles and print platforms. Your machines stay busy, and nothing gets milled from a scan nobody verified." },
  { icon: ShieldCheck, name: "Quality control", shot: shotQc, alt: "Quality control queue with a rush zirconia crown waiting for inspection", benefit: "Nothing leaves your lab without a check.", body: "Every case passes inspection before it ships. A failure goes straight back to the right bench, and your first-time pass rate tells you honestly how your lab is doing. Fewer remakes. Fewer embarrassing calls." },
  { icon: CalendarClock, name: "Production calendar", shot: shotCalendar, alt: "Production calendar with overdue cases and daily workload", benefit: "See next week's crunch before it hits.", body: "Due dates and daily workload laid out by month, week or day. Overdue cases are flagged in red at the top, so you can move people around before a dentist has to apologise to their patient." },
  { icon: Users, name: "Client accounts", shot: shotClients, alt: "Client list of dental practices with balances and credit status", benefit: "Every clinic you serve, and what they owe.", body: "Each practice with its doctors, active cases, balance, credit terms and aging. Put a slow payer on hold, set special prices for your best clients, and stop guessing who's worth chasing." },
  { icon: Wallet, name: "Billing", shot: shotBilling, alt: "Lab invoices with totals billed, collected and outstanding", benefit: "Bill the work the moment it's done.", body: "Itemised or consolidated invoices with rush fees and add-ons, printable tax invoices, and aging from current to 90 days+. You see what's billed, collected and still outstanding — without opening a single spreadsheet." },
];

const flow = [
  { t: "Case arrives", d: "Pickup logged, scan or impression checked in." },
  { t: "Design & mill", d: "CAD, milling, printing and sintering tracked." },
  { t: "Finish", d: "Ceramics, staining and glazing on the right bench." },
  { t: "QC", d: "Inspected before it ever leaves the lab." },
  { t: "Ship & bill", d: "Dispatched, invoiced, and on the clinic's statement." },
];

const extras = [
  { icon: Truck, t: "Pickups & dispatch", d: "Inbound pickups, shipments and dispatch runs — no more cases lost in traffic." },
  { icon: RotateCcw, t: "Remakes & warranties", d: "Track every remake with its reason and warranty status." },
  { icon: FileBarChart, t: "Reports that matter", d: "Turnaround, on-time rate, revenue per clinic and per technician." },
];

const roles = ["Owner", "Lab manager", "CAD designer", "Technician", "Ceramist", "QC inspector", "Dispatch", "Accountant"];

const DentalLabs = () => {
  usePageMeta("Dental Lab Software | Clinexus", "Case tracking, production, CAD/CAM, QC and billing software for dental laboratories.");
  return (
  <Layout>
    <ClinicalHero
      kicker="Clinexus for dental labs"
      title="Your hands should be on crowns, not on the phone explaining where they are."
      description="Clinexus runs your whole lab — every case from pickup to dispatch, every bench, every clinic account — so you deliver on time, cut remakes, and actually get paid for the work you've done."
      primary={{ label: "Talk to us on WhatsApp", href: WHATSAPP, external: true }}
      secondary={{ label: "Try the demo", href: "/app/login?tab=demo" }}
      photo={{ src: heroPhoto, alt: "Dental technician layering ceramic on a crown at the lab bench" }}
      card={{ src: shotDashboard, alt: "Clinexus dental lab production command center", caption: "Your whole production floor, live" }}
      points={[
        { value: "6", label: "Production stages tracked case by case" },
        { value: "0", label: "Calls asking \"is it ready?\"" },
        { value: "1", label: "Screen for cases, clinics and money" },
      ]}
    />
    <div className="eye-theme overflow-x-hidden">
      <section className="bg-background py-16 lg:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="mb-3 text-sm font-semibold text-primary">Sound familiar?</p>
          <h2 className="mb-10 max-w-3xl text-2xl font-bold md:text-3xl">You run a lab, not a call centre. <span className="text-muted-foreground">Here's what changes.</span></h2>
          <div className="grid gap-px overflow-hidden rounded-2xl border border-primary/15 bg-primary/15 sm:grid-cols-2">
            {pains.map((p, i) => (
              <motion.div key={p.t} custom={i} initial="hidden" whileInView="show" viewport={viewport} variants={reveal} className="bg-background p-6 sm:p-8">
                <h3 className="mb-2 text-lg font-semibold">{p.t}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{p.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[hsl(var(--medical-navy))] py-16 lg:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="mb-3 text-sm font-semibold text-[hsl(var(--brand-light))]">A case's journey</p>
          <h2 className="mb-12 max-w-3xl text-2xl font-bold md:text-3xl">From the clinic's door back to the clinic's chair — tracked the whole way</h2>
          <ol className="relative grid gap-8 md:grid-cols-5 md:gap-4">
            <span aria-hidden="true" className="absolute left-5 top-5 bottom-5 w-px bg-[hsl(0_0%_100%/0.2)] md:bottom-auto md:left-5 md:right-5 md:h-px md:w-auto" />
            {flow.map((s, i) => (
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

      <section className="bg-primary/[0.05] py-16 lg:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="mb-3 text-sm font-semibold text-primary">Inside Clinexus</p>
          <h2 className="mb-14 max-w-3xl text-2xl font-bold md:text-3xl">Built around how a lab really works, <span className="text-muted-foreground">bench by bench</span></h2>
          <div className="space-y-16 lg:space-y-24">
            {modules.map((m, i) => (
              <motion.article key={m.name} initial="hidden" whileInView="show" viewport={viewport} variants={reveal} className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
                <div className={i % 2 ? "lg:order-2" : ""}>
                  <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-primary"><m.icon className="h-4 w-4" aria-hidden="true" />{m.name}</p>
                  <h3 className="mb-4 text-xl font-bold leading-snug sm:text-2xl">{m.benefit}</h3>
                  <p className="leading-relaxed text-muted-foreground">{m.body}</p>
                </div>
                <div className={i % 2 ? "lg:order-1" : ""}><Screenshot src={m.shot} alt={m.alt} /></div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <div className="bg-background px-4 pt-12 text-center sm:px-6">
        <a
          href="/industries/dental-labs/features"
          className="group inline-flex items-center gap-3 rounded-full bg-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30"
        >
          Explore all lab features
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </a>
      </div>

      <section className="bg-background py-16 lg:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="mb-2 text-2xl font-bold">And the parts nobody talks about</h2>
            <p className="mb-8 font-medium text-primary">The everyday mess, handled.</p>
            <dl className="divide-y divide-primary/15 border-y border-primary/15">
              {extras.map((r) => (
                <div key={r.t} className="flex gap-4 py-5">
                  <r.icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                  <div><dt className="font-semibold text-foreground">{r.t}</dt><dd className="text-sm text-muted-foreground">{r.d}</dd></div>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <h2 className="mb-2 text-2xl font-bold">Your team sees only their bench</h2>
            <p className="mb-8 font-medium text-primary">Technicians don't see your prices. You see everything.</p>
            <ul className="flex flex-wrap gap-2">{roles.map((r) => <li key={r} className="rounded-full border border-primary/25 bg-primary/[0.06] px-3.5 py-1.5 text-sm text-foreground">{r}</li>)}</ul>
            <ul className="mt-8 space-y-3">
              {["Full audit trail on every case move", "Secure cloud — no server in the back room", "Works on the bench tablet and your phone"].map((t) => (
                <li key={t} className="flex items-start gap-2.5 text-sm text-muted-foreground"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{t}</li>
              ))}
            </ul>
            <a href="/app/login?tab=demo" className="mt-8 inline-flex items-center gap-2 font-semibold text-primary hover:underline">Open the lab demo <ArrowRight className="h-4 w-4" /></a>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 pt-4 sm:px-6">
        <ClosingBanner
          title="See your own lab running on Clinexus"
          body="Tell us how cases come in, which clinics you serve and where things fall through the cracks — we'll show you Clinexus handling exactly that, not a generic demo."
          whatsapp={WHATSAPP}
          trust={["Every case tracked end to end", "Clinic accounts & aging built in", "Role-based access for your team", "Audit trail on every change"]}
        />
      </div>
    </div>
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-16 sm:px-6 lg:pb-24">
      <LocalSeo specialty="Dental labs" />
    </div>
  </Layout>
  );
};

export default DentalLabs;
