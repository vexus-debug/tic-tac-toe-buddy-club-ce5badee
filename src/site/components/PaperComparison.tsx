import { FileX, Globe, ShieldCheck, Zap } from "lucide-react";

type Point = { title: string; body: string };

const icons = [Globe, ShieldCheck, Zap];

const PaperComparison = ({ title, body, priceLine, points }: { title: string; body: string; priceLine: string; points: Point[] }) => (
  <section className="rounded-3xl border border-primary/20 bg-primary/5 p-6 sm:p-8">
    <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
      <FileX className="h-4 w-4" /> Paper vs Clinexus
    </div>
    <h2 className="mb-3 text-2xl font-bold leading-tight text-foreground md:text-3xl">{title}</h2>
    <p className="mb-6 max-w-2xl text-sm text-muted-foreground">{body}</p>
    <p className="mb-4 text-sm font-semibold text-foreground">{priceLine}</p>
    <div className="grid gap-4 md:grid-cols-3">
      {points.map((p, i) => {
        const Icon = icons[i % icons.length];
        return (
          <div key={p.title} className="rounded-2xl border border-border bg-background p-5">
            <Icon className="mb-3 h-5 w-5 text-primary" />
            <h3 className="mb-1 text-sm font-semibold text-foreground">{p.title}</h3>
            <p className="text-[13px] text-muted-foreground">{p.body}</p>
          </div>
        );
      })}
    </div>
  </section>
);

export default PaperComparison;
