import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ChevronDown,
  Eye,
  EyeOff,
  FlaskConical,
  LogIn,
  Lock,
  Mail,
  KeyRound,
  Microscope,
  PlayCircle,
  Stethoscope,
  UserRound,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import clinexusLogoWhite from "@/assets/site/clinexus-logo-white.png";
import clinicInterior from "@/assets/clinic-interior.jpg";
import { FloatingWhatsAppButton } from "@/components/FloatingWhatsAppButton";

const DEMO_CLINICS = [
  { label: "Dental Clinic Demo", icon: Stethoscope, slug: "demo", email: "demo@clinexus.com.ng", password: "Thepassword@48" },
  { label: "Eye Clinic Demo", icon: Eye, slug: "eye", email: "demo@clinexus.com.ng", password: "Thepassword@48" },
  { label: "Diagnostic Centre Demo", icon: Microscope, slug: "diagnostic-demo", email: "demo@clinexus.com.ng", password: "Thepassword@48" },
  { label: "Dental Lab Demo", icon: FlaskConical, slug: "dental-lab", email: "demo@clinexus.com.ng", password: "Thepassword@48" },
];

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState<string | null>(null);
  const demoActive = useRef(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { session, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && session && !demoActive.current) {
      navigate("/app/select-clinic", { replace: true });
    }
  }, [session, authLoading, navigate]);

  const handleDemo = async (clinic: (typeof DEMO_CLINICS)[number]) => {
    demoActive.current = true;
    setDemoLoading(clinic.slug);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: clinic.email,
        password: clinic.password,
      });
      if (error) throw error;
      navigate(`/clinic/${clinic.slug}/dashboard`, { replace: true });
    } catch (error: any) {
      demoActive.current = false;
      toast({ title: "Demo unavailable", description: error.message, variant: "destructive" });
    } finally {
      setDemoLoading(null);
    }
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      // Keep the button busy; the auth listener effect above navigates once
      // the session and memberships have fully loaded.
    } catch (error: any) {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
      setLoading(false);
    }
  };

  const [tab, setTab] = useState<"staff" | "demo">("staff");
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("tab") === "demo") setTab("demo");
  }, []);
  const c = (v: string, a = 1) => `hsl(var(--login-${v}) / ${a})`;
  const tabs = [
    { id: "staff" as const, label: "Login", icon: LogIn },
    { id: "demo" as const, label: "Demo", icon: PlayCircle },
  ];
  const chairs = [
    { name: "Chair 1", work: "Scaling and polishing", status: "In chair", live: true },
    { name: "Chair 2", work: "Root canal review", status: "Waiting", live: false },
  ];
  const fieldStyle = { background: c("field"), borderColor: c("field-line"), color: c("ink") };

  return (
    <main className="login-shell relative min-h-[100svh] lg:grid lg:grid-cols-2" style={{ background: c("page") }}>
      <section
        className="relative overflow-hidden px-6 pb-20 pt-8 sm:px-10 lg:flex lg:flex-col lg:justify-center lg:pb-12"
        style={{
          background: c("hero"),
          color: c("hero-fg"),
        }}
      >
        <img
          src={clinicInterior}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full scale-110 object-cover"
          style={{ filter: "blur(6px) saturate(0.8)" }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(30rem 22rem at 100% 0%, ${c("live", 0.18)}, transparent 70%), linear-gradient(180deg, ${c("hero", 0.78)}, ${c("hero", 0.9)} 60%, ${c("hero", 0.97)})`,
          }}
        />
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
            Every chair, every patient, one calm workspace.
          </h2>

          <div className="mt-8 rounded-2xl border p-4" style={{ borderColor: c("hero-line"), background: c("hero-panel", 0.5) }}>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold">Today's chairs</p>
              <span className="inline-flex items-center gap-1.5 text-xs" style={{ color: c("hero-muted") }}>
                <span className="h-2 w-2 animate-pulse rounded-full" style={{ background: c("live") }} /> Live
              </span>
            </div>
            <ul className="space-y-2">
              {chairs.map((ch) => (
                <li key={ch.name} className="flex items-center justify-between rounded-xl px-4 py-3" style={{ background: c("hero-panel") }}>
                  <div>
                    <p className="text-sm font-medium">{ch.name}</p>
                    <p className="text-xs" style={{ color: c("hero-muted") }}>{ch.work}</p>
                  </div>
                  <span
                    className="rounded-full border px-3 py-1 text-xs"
                    style={
                      ch.live
                        ? { color: c("live"), borderColor: c("live", 0.4), background: c("live", 0.12) }
                        : { color: c("hero-muted"), borderColor: c("hero-line") }
                    }
                  >
                    {ch.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="relative z-10 -mt-10 px-3 pb-24 lg:mt-0 lg:flex lg:items-center lg:justify-center lg:px-10">
        <div
          className="mx-auto w-full max-w-md rounded-[2rem] px-6 pb-8 pt-5 shadow-xl sm:px-8 lg:shadow-none"
          style={{ background: c("sheet"), color: c("ink") }}
        >
          <div role="tablist" aria-label="Sign-in type" className="grid grid-cols-2 gap-1 rounded-2xl p-1" style={{ background: c("tabs") }}>
            {tabs.map((t) => {
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setTab(t.id)}
                  className="flex min-h-12 items-center justify-center gap-1.5 rounded-xl text-sm font-medium transition-colors"
                  style={active ? { background: c("sheet"), boxShadow: "0 1px 3px hsl(var(--login-ink) / 0.12)" } : { color: c("ink-muted") }}
                >
                  <t.icon className="h-4 w-4" /> {t.label}
                </button>
              );
            })}
          </div>

          {tab === "demo" ? (
            <div className="mt-8">
              <h1 className="text-3xl font-semibold tracking-tight">Try a demo clinic</h1>
              <p className="mt-1 text-sm" style={{ color: c("ink-muted") }}>Open a sample workspace with test data. No account needed.</p>
              <div className="mt-6 space-y-2">
                {DEMO_CLINICS.map((clinic) => (
                  <button
                    key={clinic.slug}
                    type="button"
                    disabled={Boolean(demoLoading)}
                    onClick={() => handleDemo(clinic)}
                    className="flex min-h-14 w-full items-center gap-3 rounded-xl border px-4 text-left text-sm font-medium transition-colors hover:brightness-95 disabled:opacity-60"
                    style={fieldStyle}
                  >
                    <clinic.icon className="h-4 w-4" style={{ color: c("ink-muted") }} />
                    <span className="flex-1">{clinic.label}</span>
                    {demoLoading === clinic.slug && <span className="text-xs" style={{ color: c("ink-muted") }}>Opening...</span>}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              <h1 className="mt-8 text-3xl font-semibold tracking-tight">Welcome back</h1>
              <p className="mt-1 text-sm" style={{ color: c("ink-muted") }}>
                Sign in to your Clinexus workspace.
              </p>

              <form onSubmit={handleLogin} className="mt-7 space-y-5">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">Email</label>
                  <div className="flex h-12 items-center gap-3 rounded-xl border px-4 focus-within:ring-2" style={fieldStyle}>
                    <Mail className="h-4 w-4 shrink-0" style={{ color: c("ink-muted") }} />
                    <Input
                      id="email" type="email" inputMode="email" autoComplete="email"
                      placeholder="you@yourclinic.com"
                      value={email} onChange={(e) => setEmail(e.target.value)} required
                      className="h-full rounded-none border-0 bg-transparent px-0 text-base shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">Password</label>
                  <div className="flex h-12 items-center gap-3 rounded-xl border px-4 focus-within:ring-2" style={fieldStyle}>
                    <KeyRound className="h-4 w-4 shrink-0" style={{ color: c("ink-muted") }} />
                    <Input
                      id="password" type={showPassword ? "text" : "password"} autoComplete="current-password"
                      placeholder="Enter your password" value={password}
                      onChange={(e) => setPassword(e.target.value)} required minLength={6}
                      className="h-full rounded-none border-0 bg-transparent px-0 text-base shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                    <button
                      type="button" onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="flex h-10 w-10 shrink-0 items-center justify-center" style={{ color: c("ink-muted") }}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit" disabled={loading}
                  className="h-12 w-full rounded-xl text-base font-semibold shadow-lg transition-transform active:scale-[0.99] disabled:opacity-70"
                  style={{ background: c("ink"), color: c("sheet"), boxShadow: "0 10px 24px -12px hsl(var(--login-ink) / 0.6)" }}
                >
                  {loading ? "Signing in..." : "Sign in"}
                </button>
              </form>

              <p className="mt-6 rounded-xl px-4 py-3 text-sm" style={{ background: c("tabs"), color: c("ink-muted") }}>
                Don't have an account?{" "}
                <Link
                  to="/app/signup"
                  className="font-medium underline underline-offset-4" style={{ color: c("ink") }}
                >
                  Sign up
                </Link>
              </p>
            </>
          )}
        </div>
      </section>
      <FloatingWhatsAppButton />
    </main>
  );
}
