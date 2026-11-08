import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Check, ArrowLeft } from "lucide-react";
import clinexusLogoWhite from "@/assets/site/clinexus-logo-white.png";
import clinicInterior from "@/assets/clinic-interior.jpg";
import { supabase } from "@/integrations/supabase/client";
import { clinicTypeOptions } from "@/config/clinicTypeConfig";
import { createClinicForUser } from "@/lib/createClinic";

export default function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [clinicAddress, setClinicAddress] = useState("");
  const [clinicType, setClinicType] = useState("dental");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { session, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && session) {
      navigate("/select-clinic", { replace: true });
    }
  }, [session, authLoading, navigate]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const clinicMeta = {
        full_name: fullName,
        phone,
        clinic_name: clinicName,
        clinic_type: clinicType,
        clinic_phone: phone,
        clinic_address: clinicAddress,
        clinic_email: email,
      };

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/select-clinic`,
          data: clinicMeta,
        },
      });
      if (error) throw error;

      if (data.session && data.user) {
        await supabase
          .from("profiles")
          .update({ full_name: fullName, phone })
          .eq("id", data.user.id);

        const { slug } = await createClinicForUser(data.user.id, {
          clinic_name: clinicName,
          clinic_type: clinicType,
          clinic_phone: phone,
          clinic_address: clinicAddress,
          clinic_email: email,
        });
        toast({ title: "Clinic created", description: `${clinicName} is ready.` });
        navigate(`/clinic/${slug}/dashboard`, { replace: true });
      } else {
        toast({ title: "Check your email", description: "Confirm your address to finish setting up your clinic." });
        navigate("/login", { replace: true });
      }
    } catch (error: any) {
      toast({ title: "Sign up failed", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const c = (v: string, a = 1) => `hsl(var(--login-${v}) / ${a})`;
  const perks = ["10 free patient cases at signup", "No monthly subscription", "Setup, training and data import included"];

  return (
    <main className="login-shell relative min-h-[100svh] lg:grid lg:grid-cols-2" style={{ background: c("page") }}>
      <section className="relative overflow-hidden px-6 pb-20 pt-8 sm:px-10 lg:flex lg:flex-col lg:justify-center lg:pb-12" style={{ background: c("hero"), color: c("hero-fg") }}>
        <img src={clinicInterior} alt="" aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full scale-110 object-cover" style={{ filter: "blur(6px) saturate(0.8)" }} />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(30rem 22rem at 100% 0%, ${c("live", 0.18)}, transparent 70%), linear-gradient(180deg, ${c("hero", 0.78)}, ${c("hero", 0.9)} 60%, ${c("hero", 0.97)})` }} />
        <div className="relative mx-auto w-full max-w-md">
          <div className="flex items-center justify-between">
            <Link to="/" aria-label="Clinexus home" className="inline-flex">
              <img src={clinexusLogoWhite} alt="Clinexus" className="h-8 w-auto sm:h-9" />
            </Link>
            <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-medium opacity-70 hover:opacity-100">
              <ArrowLeft className="h-3.5 w-3.5" /> Back
            </Link>
          </div>
          <h2 className="mt-10 text-[2rem] font-semibold leading-[1.1] tracking-tight sm:text-4xl" style={{ textWrap: "balance" }}>
            Set up your clinic in minutes, not weeks.
          </h2>
          <ul className="mt-8 space-y-2 rounded-2xl border p-4" style={{ borderColor: c("hero-line"), background: c("hero-panel", 0.5) }}>
            {perks.map((p) => (
              <li key={p} className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm" style={{ background: c("hero-panel") }}>
                <Check className="h-4 w-4 shrink-0" style={{ color: c("live") }} /> {p}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="relative z-10 -mt-10 px-3 pb-24 lg:mt-0 lg:flex lg:items-center lg:justify-center lg:px-10 lg:py-10">
        <div className="mx-auto w-full max-w-md rounded-[2rem] px-6 pb-8 pt-6 shadow-xl sm:px-8 lg:shadow-none" style={{ background: c("sheet"), color: c("ink") }}>
          <h1 className="mb-1 text-2xl font-semibold tracking-tight">Create your clinic account</h1>
          <p className="mb-6 text-sm opacity-70">Start free with 10 patient cases.</p>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label>Clinic type</Label>
              <div className="grid grid-cols-2 gap-2">
                {clinicTypeOptions.map((opt) => {
                  const Icon = opt.icon;
                  const selected = clinicType === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      disabled={opt.comingSoon}
                      onClick={() => setClinicType(opt.value)}
                      className={`relative flex items-start gap-2 rounded-lg border p-3 text-left transition-colors ${
                        selected ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                      } ${opt.comingSoon ? "opacity-60 cursor-not-allowed" : ""}`}
                    >
                      <Icon className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground leading-tight">{opt.label}</p>
                        {opt.comingSoon ? (
                          <Badge variant="secondary" className="mt-1 text-[10px] px-1.5 py-0">Coming soon</Badge>
                        ) : (
                          <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">{opt.description}</p>
                        )}
                      </div>
                      {selected && <Check className="h-4 w-4 text-primary absolute top-2 right-2" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="clinicName">Clinic name</Label>
              <Input id="clinicName" placeholder="Bright Smile Dental" value={clinicName} onChange={(e) => setClinicName(e.target.value)} required maxLength={120} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clinicAddress">Clinic address</Label>
              <Textarea id="clinicAddress" placeholder="12 Marina Road, Lagos" value={clinicAddress} onChange={(e) => setClinicAddress(e.target.value)} required maxLength={300} rows={2} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fullName">Full name</Label>
              <Input id="fullName" placeholder="Dr. Jane Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} required maxLength={100} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone number</Label>
              <Input id="phone" type="tel" placeholder="+234 800 000 0000" value={phone} onChange={(e) => setPhone(e.target.value)} required maxLength={30} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@clinic.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} placeholder="At least 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full font-semibold shadow-lg shadow-primary/20" disabled={loading}>
              {loading ? "Creating clinic..." : "Create clinic account"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}
