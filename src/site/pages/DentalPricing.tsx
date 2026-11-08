import Layout from "@/site/components/Layout";
import { ClinicalHero } from "@/site/components/heroes";
import heroPhoto from "@/assets/site/hero-dental-desk.jpg";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import CaseCalculator from "@/site/components/CaseCalculator";

const WHATSAPP = "https://wa.me/2349017758165?text=Hello%20I%20would%20like%20to%20know%20more%20about%20Clinexus%20dental%20pricing";

const tiers = [
  { name: "Setup", cases: "One-time, to get your clinic live", price: "₦20,000", unit: "one time", points: ["10 free cases included", "Setup, training and data import", "Every feature, no add-ons"] },
  { name: "Per case", cases: "After your 10 free cases", price: "₦400", unit: "per case · 1 visit", points: ["One patient, one visit", "Pay in advance with credits", "Credits never expire"], featured: true },
  { name: "Multi-branch", cases: "Groups and large clinics", price: "Custom", unit: "volume rate", points: ["Multiple branches", "Shared case wallet", "Dedicated onboarding"] },
];

const DentalPricing = () => (
  <Layout>
    <ClinicalHero
      kicker="Dental clinic pricing"
      title="Pay for the patients you see."
      description="A ₦20,000 one-time setup with 10 free cases, then ₦400 per patient visit. No monthly subscription."
      primary={{ label: "Talk to us on WhatsApp", href: WHATSAPP, external: true }}
      secondary={{ label: "How a case works", href: "/industries/dental-clinics/how-cases-work" }}
      photo={{ src: heroPhoto, alt: "Patient paying at a dental clinic front desk" }}
    />
    <div className="mx-auto max-w-5xl space-y-12 px-4 py-12 sm:px-6">
      <section className="grid gap-6 md:grid-cols-3">
        {tiers.map((t) => (
          <div key={t.name} className={`rounded-2xl border p-6 ${t.featured ? "border-primary bg-primary/5" : "border-border bg-background"}`}>
            <h2 className="text-lg font-semibold text-foreground">{t.name}</h2>
            <p className="mb-4 text-xs text-muted-foreground">{t.cases}</p>
            <p className="text-3xl font-bold text-primary">{t.price}</p>
            <p className="mb-4 text-xs text-muted-foreground">{t.unit}</p>
            <ul className="space-y-2">
              {t.points.map((p) => (
                <li key={p} className="flex items-center gap-2 text-[13px] text-muted-foreground"><Check className="h-3.5 w-3.5 text-primary" />{p}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>
      <p className="text-center text-xs text-muted-foreground">One case = one patient visit. No monthly subscription.</p>

      <section className="mx-auto max-w-3xl">
        <h2 className="mb-1 text-lg font-semibold text-foreground">Try it with one patient</h2>
        <p className="mb-4 text-[13px] text-muted-foreground">Enter visit dates to see how many cases they use.</p>
        <CaseCalculator />
      </section>

      <section className="rounded-3xl border border-primary/20 bg-primary/5 p-6 text-center sm:p-8">
        <h2 className="mb-2 text-xl font-bold text-foreground">Get your clinic live this week</h2>
        <p className="mb-2 text-sm text-muted-foreground">Start with 10 free cases.</p>
        <div className="mt-4 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to="/signup" className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground hover:opacity-90">Get started</Link>
          <Link to="/industries/dental-clinics/features" className="inline-flex items-center justify-center rounded-xl border border-primary px-6 py-3 font-semibold text-primary hover:bg-primary/10">See all features</Link>
          <Link to="/login?tab=demo" className="inline-flex items-center justify-center rounded-xl border border-border px-6 py-3 font-semibold text-foreground hover:bg-muted">Try demo</Link>
        </div>
      </section>

      <Link to="/industries/dental-clinics/how-cases-work" className="inline-block text-sm font-medium text-primary underline-offset-4 hover:underline">How does ₦400 per case work? →</Link>
    </div>
  </Layout>
);

export default DentalPricing;
