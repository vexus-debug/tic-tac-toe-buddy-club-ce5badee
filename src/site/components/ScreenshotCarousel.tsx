import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

export type Shot = { file: string; caption: string };

// Images are served from the connected Supabase project's public storage bucket.
const BASE = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/dental-features`;

export function ScreenshotCarousel({ shots }: { shots: Shot[] }) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    onSelect();
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <div className="relative">
      <Carousel setApi={setApi} opts={{ loop: true, align: "start" }} className="w-full">
        <CarouselContent>
          {shots.map((s) => (
            <CarouselItem key={s.file}>
              <figure className="overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
                <div className="flex items-center gap-1.5 border-b border-border bg-muted/60 px-4 py-2.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
                  <span className="h-2.5 w-2.5 rounded-full bg-primary/40" />
                  <span className="h-2.5 w-2.5 rounded-full bg-primary/70" />
                  <span className="ml-3 truncate text-xs text-muted-foreground">{s.caption}</span>
                </div>
                <img
                  src={/^(https?:|\/)/.test(s.file) ? s.file : `${BASE}/${s.file}`}
                  alt={s.caption}
                  loading="lazy"
                  className="aspect-[16/10] w-full bg-background object-contain object-top"
                />
              </figure>
            </CarouselItem>
          ))}
        </CarouselContent>
        {shots.length > 1 && (
          <>
            <CarouselPrevious className="left-3 top-1/2 h-10 w-10 border-border bg-background/90 shadow-md backdrop-blur" />
            <CarouselNext className="right-3 top-1/2 h-10 w-10 border-border bg-background/90 shadow-md backdrop-blur" />
          </>
        )}
      </Carousel>
      {shots.length > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          {shots.map((s, i) => (
            <button
              key={s.file}
              type="button"
              aria-label={`Show ${s.caption}`}
              onClick={() => api?.scrollTo(i)}
              className={`h-2 rounded-full transition-all ${i === current ? "w-6 bg-primary" : "w-2 bg-primary/25 hover:bg-primary/50"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
