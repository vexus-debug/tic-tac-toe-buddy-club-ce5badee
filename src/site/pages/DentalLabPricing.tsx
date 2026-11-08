import Layout from "@/site/components/Layout";
import { ClinicalHero } from "@/site/components/heroes";
import heroPhoto from "@/assets/site/hero-dental-lab.jpg";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { usePageMeta } from "@/site/components/usePageMeta";
import { LAB_PRICE_PER_CASE, LAB_MIN_TOPUP, LAB_SETUP_FEE, LAB_FREE_CREDITS, labTopupCost } from "@/lib/labCredits";

const WHATSAPP = "https://wa.me/2349017758165?text=Hello%20I%20would%20like%20to%20know%20more%20about%20Clinexus%20dental%20lab%20pricing";

const cards = [
  { name: "One-time setup", price: `₦${LAB_SETUP_FEE.toLocaleString()}`, unit: "paid once", points: [`${LAB_FREE_CREDITS} free case credits included`, "Full onboarding", "All features unlocked"] },
  { name: "Case credits", price: `₦${LAB_PRICE_PER_CASE}`, unit: "per case", points: [`Buy from ${LAB_MIN_TOPUP} credits (₦${labTopupCost(LAB_MIN_TOPUP).toLocaleString()})`, "Remakes are always free", "Credits never expire"], featured: true },
];

const DentalLabPricing = () => {
  usePageMeta(
    "Dental Lab Pricing | Clinexus",
    `₦${LAB_SETUP_FEE.toLocaleString()} setup with ${LAB_FREE_CREDITS} free cases, then ₦${LAB_PRICE_PER_CASE} per case. No monthly subscription.`,
  );
  return (
    <Layout>
      <ClinicalHero
        kicker="Dental lab pricing"
        title="Pay only for the cases you register."
        description={`A one-time ₦${LAB_SETUP_FEE.toLocaleString()} setup with ${LAB_FREE_CREDITS} free cases, then ₦${LAB_PRICE_PER_CASE} per case. No monthly fees.`}
        primary={{ label: "Talk to us on WhatsApp", href: WHATSAPP, external: true }}
        secondary={{ label: "See features", href: "/industries/dental-labs/features" }}
        photo={{ src: heroPhoto, alt: "Dental lab technician at work" }}
      />
      <div className="mx-auto max-w-4xl space-y-12 px-4 py-12 sm:px-6">
        <section className="grid gap-6 md:grid-cols-2">
          {cards.map((t) => (
            <div key={t.name} className={`rounded-2xl border p-6 ${t.featured ? "border-primary bg-primary/5" : "border-border bg-background"}`}>
              <h2 className="mb-4 text-lg font-semibold text-foreground">{t.name}</h2>
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
        <p className="text-center text-xs text-muted-foreground">1 new case = 1 credit. When credits run out, existing cases stay open; new cases wait until you top up.</p>
        <section className="rounded-3xl border border-primary/20 bg-primary/5 p-6 text-center sm:p-8">
          <h2 className="mb-2 text-xl font-bold text-foreground">Get your lab live this week</h2>
          <div className="mt-4 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/signup" className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground hover:opacity-90">Get started</Link>
            <Link to="/industries/dental-labs/features" className="inline-flex items-center justify-center rounded-xl border border-primary px-6 py-3 font-semibold text-primary hover:bg-primary/10">See all features</Link>
            <Link to="/industries/dental-labs" className="inline-flex items-center justify-center rounded-xl border border-border px-6 py-3 font-semibold text-foreground hover:bg-muted">Lab overview</Link>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default DentalLabPricing;
