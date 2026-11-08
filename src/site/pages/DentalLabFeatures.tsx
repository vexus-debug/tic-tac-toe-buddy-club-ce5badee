import { Fragment } from "react";
import Layout from "@/site/components/Layout";
import { ClinicalHero } from "@/site/components/heroes";
import heroPhoto from "@/assets/site/hero-dental-lab.jpg";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ScreenshotCarousel, type Shot } from "@/site/components/ScreenshotCarousel";
import { usePageMeta } from "@/site/components/usePageMeta";
import {
  ArrowRight, MessageCircle, Check, ClipboardList, Cpu, ShieldCheck, Boxes, Wallet, Truck, Wrench, BarChart3,
  type LucideIcon,
} from "lucide-react";

const assets = import.meta.glob("@/assets/dlab-features/*.asset.json", { eager: true, import: "default" }) as Record<string, { url: string }>;
const img = (name: string) => Object.entries(assets).find(([k]) => k.endsWith(`/${name}.png.asset.json`))?.[1].url ?? "";
const shot = (name: string, caption: string): Shot => ({ file: img(name), caption });

const WHATSAPP = "https://wa.me/2349017758165?text=Hello%20I%20would%20like%20to%20know%20more%20about%20Clinexus%20for%20dental%20labs";
const EASE = [0.22, 1, 0.36, 1] as const;
const reveal = { hidden: { opacity: 0, y: 34 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } } };
const viewport = { once: true, margin: "-70px" };

type Feature = { name: string; outcome: string };
type Pillar = { icon: LucideIcon; kicker: string; title: string; outcome: string; problem: string; features: Feature[]; shots: Shot[] };

const pillars: Pillar[] = [
  {
    icon: ClipboardList,
    kicker: "Production & case tracking",
    shots: [shot("dlab-dashboard", "Production overview"), shot("dlab-cases", "Case board"), shot("dlab-bench", "My Bench"), shot("dlab-calendar", "Production calendar")],
    title: "Know where every case is, and when it must leave.",
    outcome: "Fewer late cases, no lost job bags and clinics that stop calling to ask.",
    problem: "Paper slips, WhatsApp orders and memory mean cases go missing, rush jobs get forgotten and deadlines slip.",
    features: [
      { name: "Production overview", outcome: "Cases in progress, due today, late and ready to ship on one screen." },
      { name: "Case board by stage", outcome: "Received, design, milling, ceramics, QC, ready and delivered, moved with one tap." },
      { name: "Full case intake", outcome: "Clinic, dentist, patient, work type, teeth, shade, due date and notes captured once." },
      { name: "Tooth picker", outcome: "Select the exact teeth on a chart so the technician builds the right units." },
      { name: "Multi-zone shade mapping", outcome: "Record cervical, body and incisal shades so colour matches first time." },
      { name: "Case files and scans", outcome: "Attach prescriptions, photos and STL scans, and preview 3D files in the browser." },
      { name: "Hold with a reason", outcome: "Pause a case for a missing impression or approval and see what's blocking it." },
      { name: "Printable traveler", outcome: "A job ticket that follows the case through every bench." },
      { name: "My Bench with timers", outcome: "Each technician sees their own work and times each step." },
      { name: "Production calendar", outcome: "Plan by due date, spot rush and late cases and balance the workload." },
    ],
  },
  {
    icon: Cpu,
    kicker: "CAD/CAM & digital lab",
    shots: [shot("dlab-cam", "Scan intake"), shot("dlab-cam-mill", "Milling runs"), shot("dlab-cam-furnace", "Sintering runs"), shot("dlab-cam-printer", "3D printing runs")],
    title: "Run your digital workflow next to the rest of production.",
    outcome: "Machines stay busy, blanks are traced and nothing waits in the design queue.",
    problem: "Scans arrive by email, mill jobs live on a sticky note and nobody knows which disc a crown came from.",
    features: [
      { name: "Scan intake", outcome: "Log digital impressions from clinics and link them to the right case." },
      { name: "Milling runs", outcome: "Group cases on a disc, track the machine and the blank lot used." },
      { name: "Sintering runs", outcome: "Record each furnace cycle and which cases were inside." },
      { name: "3D printing runs", outcome: "Track models, guides and splints per print job and resin lot." },
      { name: "Case files on every run", outcome: "Open the scan or design straight from the machine queue." },
    ],
  },
  {
    icon: ShieldCheck,
    kicker: "Quality, remakes & warranties",
    shots: [shot("dlab-qc", "QC station"), shot("dlab-warranties", "Remakes & warranties")],
    title: "Catch problems before they reach the chair.",
    outcome: "Fewer remakes, clear responsibility and proof of quality for every case.",
    problem: "Remakes eat your margin, and without records you can't tell whose fault it was or stop it happening again.",
    features: [
      { name: "QC inspection station", outcome: "Check margins, occlusion, contacts, shade and finish before dispatch." },
      { name: "Pass, rework or fail", outcome: "Failed cases go back to the bench with notes, and only passed work ships." },
      { name: "Remake tracking", outcome: "Spawn a remake from the original case with the reason and who's responsible." },
      { name: "Warranty register", outcome: "Know which restorations are still covered and for how long." },
      { name: "Certificate of conformity", outcome: "Give clinics a quality record with materials and lots used." },
    ],
  },
  {
    icon: Boxes,
    kicker: "Catalogue, materials & shades",
    shots: [shot("dlab-catalogue", "Catalogue"), shot("dlab-store", "Material store"), shot("dlab-shades", "Shade library")],
    title: "Price every job right and never run out of zirconia.",
    outcome: "Consistent pricing, traced materials and stock that warns you before it's gone.",
    problem: "Prices change per technician, nobody knows what's left on the shelf and expired materials go into cases.",
    features: [
      { name: "Restoration catalogue", outcome: "Every work type with its price and turnaround days." },
      { name: "Work types", outcome: "Set up crowns, bridges, dentures, aligners and more the way your lab works." },
      { name: "Surcharges", outcome: "Add rush, extra unit or special material fees automatically." },
      { name: "Material store", outcome: "Live stock levels with low-stock and expiry alerts." },
      { name: "Materials and lots", outcome: "Trace which batch went into which case." },
      { name: "Shade library", outcome: "Keep standard and custom shades ready to pick at intake." },
    ],
  },
  {
    icon: Wallet,
    kicker: "Clients & billing",
    shots: [shot("dlab-clients", "Client accounts"), shot("dlab-recurring", "Recurring orders"), shot("dlab-billing", "Billing & aging")],
    title: "Bill every case and know exactly what each clinic owes.",
    outcome: "Faster collections, fewer disputes and no case delivered without an invoice.",
    problem: "Unbilled cases, mixed-up payments and unclear balances quietly cost labs money every month.",
    features: [
      { name: "Client clinic accounts", outcome: "Every clinic with its dentists, contacts, cases and balance in one place." },
      { name: "Client 360 view", outcome: "Open a clinic to see orders, invoices, payments and what's overdue." },
      { name: "Custom prices and tiers", outcome: "Give each clinic its own price list or tier, applied automatically." },
      { name: "Recurring orders", outcome: "Set up standing orders and generate them on schedule." },
      { name: "Invoices from cases", outcome: "Build invoices from delivered work with the right fee already filled in." },
      { name: "Payments and allocation", outcome: "Record payments and apply them to one or many invoices, with receipts." },
      { name: "Credit notes", outcome: "Correct an invoice properly instead of editing old figures." },
      { name: "Aging and statements", outcome: "See balances by 30, 60 and 90+ days and send monthly statements." },
    ],
  },
  {
    icon: Truck,
    kicker: "Logistics & outsourcing",
    shots: [shot("dlab-pickups", "Inbound pickups"), shot("dlab-shipments", "Shipments"), shot("dlab-dispatch", "Dispatch runs"), shot("dlab-outsourcing", "Outsourcing hub"), shot("dlab-external-labs", "External labs")],
    title: "Get cases in and out on time, even the ones you send away.",
    outcome: "Every pickup, delivery and outsourced case accounted for.",
    problem: "Riders lose impressions, deliveries go to the wrong clinic and outsourced work disappears for weeks.",
    features: [
      { name: "Inbound pickups", outcome: "Schedule and log collections from clinics." },
      { name: "Shipments", outcome: "Track what left, with whom and when it arrived." },
      { name: "Dispatch runs", outcome: "Plan delivery routes so one trip covers many clinics." },
      { name: "Outsourcing hub", outcome: "Send cases to partner labs and track them until they come back." },
      { name: "Receiving QC", outcome: "Check outsourced work before it goes to your client." },
      { name: "External labs and payments", outcome: "Keep partner labs, their bills and what you owe them in one place." },
    ],
  },
  {
    icon: Wrench,
    kicker: "Team & workshop",
    shots: [shot("dlab-skills", "Skills matrix"), shot("dlab-salary", "Salary & piece-rate"), shot("dlab-equipment", "Equipment")],
    title: "Route work to the right hands and pay people fairly.",
    outcome: "The right technician on each case and pay that matches the work done.",
    problem: "Work goes to whoever is free, pay arguments come every month and machines break without warning.",
    features: [
      { name: "Staff and roles", outcome: "Technicians, intake, accounts and lead each see only their own work." },
      { name: "Skills matrix", outcome: "Know who is certified or training on each work type." },
      { name: "Salary and piece-rate", outcome: "Track pay per unit or per stage for each technician." },
      { name: "Equipment register", outcome: "Log machines, service dates and downtime." },
    ],
  },
  {
    icon: BarChart3,
    kicker: "Reports & insights",
    shots: [shot("dlab-reports", "Reports")],
    title: "Run the lab on numbers, not guesses.",
    outcome: "See which clinics, work types and technicians drive your profit.",
    problem: "Owners only find out about late cases, remakes and unpaid balances when it's too late.",
    features: [
      { name: "Lab reports", outcome: "Revenue, cases delivered and outstanding balances by clinic." },
      { name: "Technician throughput", outcome: "Units completed and remakes per technician." },
      { name: "Expenses", outcome: "Record lab spending to know what each month really cost." },
    ],
  },
];

const total = pillars.reduce((n, p) => n + p.features.length, 0);

const PricingCta = () => (
  <motion.div initial="hidden" whileInView="show" viewport={viewport} variants={reveal} className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/15 via-primary/5 to-transparent p-8 md:p-10">
    <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
      <div className="max-w-xl">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-primary">Pricing</p>
        <h3 className="mb-2 text-2xl font-bold text-foreground md:text-3xl">Pay per case, not per seat.</h3>
        <p className="text-sm text-muted-foreground">See lab plans and case-volume pricing.</p>
      </div>
      <Link to="/industries/dental-labs/pricing" className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 font-bold text-primary-foreground hover:opacity-90">
        See pricing <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  </motion.div>
);

const DentalLabFeatures = () => {
  usePageMeta(
    "Dental Lab Features | Clinexus",
    "Production, case tracking, CAD/CAM, QC, materials, billing, logistics, outsourcing and reports for dental laboratories.",
  );
  return (
    <Layout>
      <ClinicalHero
        kicker="Dental lab features"
        title="Everything your lab needs, from pickup to payment."
        description={`${total} features across ${pillars.length} areas, built for dental labs.`}
        primary={{ label: "Talk to us on WhatsApp", href: WHATSAPP, external: true }}
        secondary={{ label: "See pricing", href: "/industries/dental-labs/pricing" }}
        photo={{ src: heroPhoto, alt: "Dental lab technician at work" }}
      />
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-24 space-y-10">
          {pillars.map((p, i) => (
            <Fragment key={p.kicker}>
              {i === 4 && <PricingCta />}
              <motion.section initial="hidden" whileInView="show" viewport={viewport} variants={reveal} className="eye-panel rounded-3xl p-7 md:p-10">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10"><p.icon className="h-5 w-5 text-primary" /></div>
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{String(i + 1).padStart(2, "0")} · {p.kicker}</span>
                </div>
                <h3 className="mb-6 max-w-3xl text-2xl font-bold text-card-foreground md:text-3xl">{p.title}</h3>
                <div className="mb-8"><ScreenshotCarousel shots={p.shots} /></div>
                <div className="grid gap-8 lg:grid-cols-12">
                  <div className="lg:col-span-5">
                    <p className="mb-4 text-sm leading-relaxed text-muted-foreground"><span className="font-semibold text-card-foreground">The problem: </span>{p.problem}</p>
                    <p className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm font-medium text-primary">{p.outcome}</p>
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
              {i === pillars.length - 1 && <PricingCta />}
            </Fragment>
          ))}
        </div>

        <motion.section initial="hidden" whileInView="show" viewport={viewport} variants={reveal} className="eye-panel rounded-[3rem] p-8 text-center md:p-12">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-primary">Next step</p>
          <h2 className="mb-5 text-3xl font-bold text-card-foreground">See what your lab gets back</h2>
          <p className="mx-auto mb-10 max-w-2xl leading-relaxed text-muted-foreground">Tell us how you run intake, production, delivery and billing today. We'll show you where Clinexus saves time and recovers money.</p>
          <div className="inline-flex flex-col gap-4 md:flex-row">
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-10 py-4 font-bold text-primary-foreground hover:bg-foreground">
              <MessageCircle className="h-5 w-5" /> Talk to us on WhatsApp
            </a>
            <Link to="/login?tab=demo" className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary px-10 py-4 font-bold text-primary hover:bg-primary/10">
              Try demo <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/industries/dental-labs" className="inline-flex items-center justify-center gap-2 rounded-xl bg-foreground px-10 py-4 font-bold text-background hover:bg-primary">
              Lab overview <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.section>
      </div>
    </Layout>
  );
};

export default DentalLabFeatures;
