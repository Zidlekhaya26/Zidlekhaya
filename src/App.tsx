import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Heart,
  Sparkles,
  Coffee,
  BookOpen,
  Music2,
  Film,
  Globe2,
  Stars,
  PartyPopper,
  KeyRound,
  BadgeCheck,
  Quote,
  MapPin,
  Timer,
  Wand2,
  Gift,
  ArrowRight,
  Play,
} from "lucide-react";

/**
 * 💗 Sabelo → Peggy — Valentine’s Day Gift (Single-file React)
 *
 * IMPORTANT (debug fix):
 * Your project threw a React hook context error inside framer-motion.
 * To make this project stable/easy to host, this version removes framer-motion entirely
 * and uses lightweight CSS animations instead.
 */

const clamp = (n: number, a: number, b: number) => Math.max(a, Math.min(b, n));

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(!!mq.matches);
    onChange();
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);
  return reduced;
}

function useMouseParallax(enabled = true) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [xy, setXy] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      const y = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      setXy({ x: clamp(x, -1, 1), y: clamp(y, -1, 1) });
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [enabled]);

  return { ref, xy };
}

function GlobalStyles({ reduced }: { reduced: boolean }) {
  return (
    <style>{`
      @keyframes twinkle {
        0% { opacity: 0.25; transform: scale(1); }
        50% { opacity: 0.9; transform: scale(1.15); }
        100% { opacity: 0.4; transform: scale(1); }
      }
      @keyframes floatUp {
        0% { transform: translateY(0); opacity: var(--o, 0.2); }
        100% { transform: translateY(-980px); opacity: 0; }
      }
      @keyframes popBurst {
        0% { opacity: 0; transform: translate(0, 0) rotate(0deg) scale(1); }
        10% { opacity: 1; }
        100% { opacity: 0; transform: translate(var(--x, 0px), var(--y, 560px)) rotate(var(--r, 0deg)) scale(var(--s, 1)); }
      }
      @keyframes fadeInUp {
        0% { opacity: 0; transform: translateY(12px); }
        100% { opacity: 1; transform: translateY(0); }
      }
      @keyframes softPulse {
        0%, 100% { opacity: 0.35; }
        50% { opacity: 0.55; }
      }

      .fade-in-up { animation: fadeInUp 450ms ease-out both; }
      .twinkle { animation: twinkle var(--d, 6s) ease-in-out infinite; }
      .float-up { animation: floatUp var(--d, 10s) ease-in-out infinite; }
      .pulse-soft { animation: softPulse 3.6s ease-in-out infinite; }

      ${reduced ? `.twinkle, .float-up, .pulse-soft { animation: none !important; }` : ""}
    `}</style>
  );
}

function AuraBackground({ intensity = 1 }: { intensity?: number }) {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[#07040b]" />

      {/* Valentine aurora blobs */}
      <div
        className="absolute -top-44 -left-44 h-[42rem] w-[42rem] rounded-full blur-3xl opacity-75"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, rgba(244,63,94,0.55), transparent 60%), radial-gradient(circle at 70% 70%, rgba(236,72,153,0.55), transparent 60%)",
          transform: `scale(${1 + intensity * 0.02})`,
        }}
      />
      <div
        className="absolute -bottom-52 -right-52 h-[46rem] w-[46rem] rounded-full blur-3xl opacity-75"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, rgba(168,85,247,0.42), transparent 60%), radial-gradient(circle at 70% 70%, rgba(251,113,133,0.45), transparent 60%)",
          transform: `scale(${1 + intensity * 0.02})`,
        }}
      />

      {/* Fine grain */}
      <div
        className="absolute inset-0 opacity-[0.14] mix-blend-overlay"
        style={{
          backgroundImage:
            "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"160\" height=\"160\"><filter id=\"n\"><feTurbulence type=\"fractalNoise\" baseFrequency=\"0.85\" numOctaves=\"3\" stitchTiles=\"stitch\"/></filter><rect width=\"160\" height=\"160\" filter=\"url(%23n)\" opacity=\"0.5\"/></svg>')",
        }}
      />

      {/* Soft vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/75" />
    </div>
  );
}

function Starfield({ count = 70, twinkle = true }: { count?: number; twinkle?: boolean }) {
  const stars = useMemo(() => {
    const arr: Array<{ id: number; x: number; y: number; s: number; o: number; d: number }> = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        s: 1 + Math.random() * 2.4,
        o: 0.22 + Math.random() * 0.62,
        d: 3 + Math.random() * 7,
      });
    }
    return arr;
  }, [count]);

  return (
    <div aria-hidden className="absolute inset-0">
      {stars.map((st) => (
        <span
          key={st.id}
          className={"absolute rounded-full bg-white " + (twinkle ? "twinkle" : "")}
          style={{
            left: `${st.x}%`,
            top: `${st.y}%`,
            width: st.s,
            height: st.s,
            opacity: st.o,
            boxShadow: "0 0 14px rgba(255,255,255,0.22)",
            // CSS vars for animation duration
            // @ts-ignore
            "--d": `${st.d}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

function FloatingHearts({ count = 18, reduced }: { count?: number; reduced: boolean }) {
  const hearts = useMemo(() => {
    const arr: Array<{ id: number; x: number; s: number; d: number; delay: number; o: number }> = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        id: i,
        x: Math.random() * 100,
        s: 0.6 + Math.random() * 1.2,
        d: 6 + Math.random() * 8,
        delay: Math.random() * 4,
        o: 0.12 + Math.random() * 0.22,
      });
    }
    return arr;
  }, [count]);

  if (reduced) return null;

  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      {hearts.map((h) => (
        <div
          key={h.id}
          className="absolute -bottom-10 float-up"
          style={{
            left: `${h.x}%`,
            opacity: h.o,
            transform: `scale(${h.s})`,
            // @ts-ignore
            "--d": `${h.d}s`,
            animationDelay: `${h.delay}s`,
          } as React.CSSProperties}
        >
          <Heart className="h-6 w-6 text-white/80" />
        </div>
      ))}
    </div>
  );
}

function Pill({ icon: Icon, children }: { icon: any; children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/85 backdrop-blur">
      <Icon className="h-3.5 w-3.5" />
      <span>{children}</span>
    </div>
  );
}

function GlassCard({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={
        "rounded-3xl border border-white/10 bg-white/[0.07] shadow-[0_18px_70px_rgba(0,0,0,0.5)] backdrop-blur-xl " +
        className
      }
    >
      {children}
    </div>
  );
}

function SectionTitle({
  kicker,
  title,
  subtitle,
  icon: Icon,
}: {
  kicker: string;
  title: string;
  subtitle?: string;
  icon: any;
}) {
  return (
    <div className="mb-6 fade-in-up">
      <div className="flex flex-wrap items-center gap-3">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/12 bg-white/5">
          <Icon className="h-5 w-5 text-white/85" />
        </div>
        <div>
          <div className="text-xs font-semibold tracking-[0.24em] text-white/60">{kicker}</div>
          <div className="text-2xl font-semibold text-white md:text-3xl">{title}</div>
        </div>
      </div>
      {subtitle ? (
        <div className="mt-3 max-w-3xl text-sm leading-relaxed text-white/70 md:text-base">{subtitle}</div>
      ) : null}
    </div>
  );
}

function TimelineItem({
  i,
  title,
  text,
  meta,
}: {
  i: number;
  title: string;
  text: string;
  meta?: string;
}) {
  return (
    <div className="relative pl-9">
      <div className="absolute left-0 top-[0.05rem]">
        <div className="flex h-7 w-7 items-center justify-center rounded-full border border-white/15 bg-white/5">
          <span className="text-xs font-semibold text-white/80">{i}</span>
        </div>
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-sm font-semibold text-white">{title}</div>
          {meta ? <div className="text-xs text-white/55">{meta}</div> : null}
        </div>
        <div className="mt-2 text-sm leading-relaxed text-white/70">{text}</div>
      </div>
    </div>
  );
}

function ChoiceButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={
        "w-full rounded-2xl border px-4 py-3 text-left text-sm transition focus:outline-none focus:ring-2 focus:ring-white/25 " +
        (active
          ? "border-white/30 bg-white/12 text-white"
          : "border-white/10 bg-white/5 text-white/80 hover:bg-white/10")
      }
      type="button"
    >
      {children}
    </button>
  );
}

function Quiz({ onUnlock }: { onUnlock?: (data: { score: number; total: number }) => void }) {
  const questions = useMemo(
    () => [
      {
        q: "Where did we first meet?",
        options: ["Facebook Dating", "Instagram", "At a brunch café", "Through a friend"],
        a: 0,
      },
      {
        q: "What was your mood about dating apps that day?",
        options: [
          "You were excited to swipe",
          "You had basically sworn them off — but tried one last time",
          "You were making a profile for someone else",
          "You were only there for memes",
        ],
        a: 1,
      },
      {
        q: "What did I say on our first date?",
        options: [
          "Let’s just be friends",
          "I’m going to put a ring on your finger",
          "I don’t like music",
          "I’m moving tomorrow",
        ],
        a: 1,
      },
      {
        q: "You’re basically the queen of…",
        options: ["Fantasy books + brunch", "Car collecting", "Skydiving", "Pro gaming"],
        a: 0,
      },
      {
        q: "My vibe is best described as…",
        options: [
          "One genre only",
          "Eclectic playlists (jazz, gospel, Afrobeat & more)",
          "No music ever",
          "Only podcasts",
        ],
        a: 1,
      },
    ],
    []
  );

  const [step, setStep] = useState(0);
  const [pick, setPick] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const current = questions[step];

  function submit() {
    if (pick === null) return;
    const correct = pick === current.a;
    const nextScore = score + (correct ? 1 : 0);
    setScore(nextScore);

    if (step === questions.length - 1) {
      setDone(true);
      const pass = nextScore >= Math.ceil(questions.length * 0.7);
      if (pass) onUnlock?.({ score: nextScore, total: questions.length });
    } else {
      setStep((s) => s + 1);
      setPick(null);
    }
  }

  return (
    <GlassCard className="p-5 md:p-6">
      <div className="flex items-center justify-between gap-4">
        <div className="text-sm font-semibold text-white">Love Memory Quiz</div>
        <div className="text-xs text-white/60">{done ? "Complete" : `Q${step + 1} of ${questions.length}`}</div>
      </div>

      {!done ? (
        <div className="mt-4">
          <div className="text-base font-semibold text-white">{current.q}</div>
          <div className="mt-4 grid gap-2">
            {current.options.map((opt, idx) => (
              <ChoiceButton key={opt} active={pick === idx} onClick={() => setPick(idx)}>
                {opt}
              </ChoiceButton>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="text-xs text-white/55">
              Score: <span className="text-white/85">{score}</span>
            </div>
            <button
              onClick={submit}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/25"
              type="button"
            >
              <BadgeCheck className="h-4 w-4" />
              Submit
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-4">
          <div className="text-base font-semibold text-white">You did it 💗</div>
          <div className="mt-2 text-sm leading-relaxed text-white/70">
            Final score: <span className="text-white">{score}</span> / {questions.length}.{" "}
            {score >= Math.ceil(questions.length * 0.7)
              ? "You unlocked my letter below."
              : "Almost! Refresh and try again to unlock the letter."}
          </div>
        </div>
      )}
    </GlassCard>
  );
}

function SecretLetter({ open, onClose }: { open: boolean; onClose: () => void }) {
  const letter = `Peggy,

Happy Valentine’s Day, my love. 💗

No coincidence — just God’s hand and good Wi-Fi.

I know you had sworn off dating apps. And somehow, on that one last try, you found me… and I found you.

From our first conversation, I knew there was something different. You felt like home in a world that moves too fast.

On our first date I said it out loud — I’m going to put a ring on your finger. I meant it then, and I mean it now.

Thank you for choosing me, for trusting the timing, and for turning a ‘why not?’ into the best ‘how could it not be us?’

Forever starts now.

—Your husband, Sabelo`;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-2xl fade-in-up">
        <div className="overflow-hidden rounded-3xl border border-white/15 bg-[#110813]/90 shadow-[0_30px_90px_rgba(0,0,0,0.65)] backdrop-blur-2xl">
          <div className="flex items-center justify-between border-b border-white/10 p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Quote className="h-4 w-4" />
              Sabelo’s Valentine Letter
            </div>
            <button
              onClick={onClose}
              className="rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/80 hover:bg-white/10"
              type="button"
            >
              Close
            </button>
          </div>
          <div className="p-5 md:p-6">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-white/90">{letter}</pre>
            </div>
            <div className="mt-4 text-xs text-white/55">
              Tip: Add a real date/place by editing the text inside{" "}
              <span className="text-white/75">SecretLetter</span>.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HeartBurst({ fire }: { fire: number }) {
  const pieces = useMemo(() => {
    const arr: Array<{ id: number; x: number; y: number; r: number; s: number; d: number }> = [];
    for (let i = 0; i < 22; i++) {
      arr.push({
        id: i,
        x: (Math.random() * 2 - 1) * 160,
        y: 560 + Math.random() * 260,
        r: Math.random() * 360,
        s: 0.75 + Math.random() * 1.1,
        d: 0.8 + Math.random() * 0.9,
      });
    }
    return arr;
  }, [fire]);

  if (!fire) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-40 flex items-start justify-center pt-20">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="absolute"
          style={{
            // @ts-ignore
            "--x": `${p.x}px`,
            // @ts-ignore
            "--y": `${p.y}px`,
            // @ts-ignore
            "--r": `${p.r}deg`,
            // @ts-ignore
            "--s": p.s,
            // @ts-ignore
            "--d": `${p.d}s`,
            animation: `popBurst ${p.d}s ease-out forwards`,
            filter: "drop-shadow(0 0 10px rgba(255,255,255,0.18))",
          } as React.CSSProperties}
        >
          <Heart className="h-5 w-5 text-white/90" />
        </div>
      ))}
    </div>
  );
}

function YouTubeDedicationCard({ embedUrl, openUrl }: { embedUrl: string; openUrl: string }) {
  return (
    <GlassCard className="p-5">
      <div className="flex items-center gap-2 text-sm font-semibold text-white">
        <Music2 className="h-4 w-4" />
        A dedication song for you 💗
      </div>
      <div className="mt-2 text-sm text-white/70">
        Take your time. Listen closely — it’s not just a song. It’s how I say “I love you” without interrupting the music.
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
        <iframe
          className="h-56 w-full"
          src={embedUrl}
          title="Dedication song"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <a
          href={openUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15"
        >
          <Play className="h-4 w-4" />
          Open on YouTube
          <ArrowRight className="h-4 w-4" />
        </a>
        <div className="text-xs text-white/50 self-center">(Placeholder for now — we’ll swap in Sabelo’s real dedication link later.)</div>
      </div>
    </GlassCard>
  );
}

export default function App() {
  const reduced = usePrefersReducedMotion();
  const { ref, xy } = useMouseParallax(!reduced);

  const [mode, setMode] = useState<"intro" | "story" | "quiz" | "finale">("intro");
  const [unlocked, setUnlocked] = useState(false);
  const [openLetter, setOpenLetter] = useState(false);
  const [burst, setBurst] = useState(0);

  // auto-hide burst for stability
  useEffect(() => {
    if (!burst) return;
    const t = window.setTimeout(() => setBurst(0), 1400);
    return () => window.clearTimeout(t);
  }, [burst]);

  const story = useMemo(
    () => [
      {
        title: "One last try",
        meta: "Facebook Dating",
        text: "You had sworn off dating apps — no more swiping, no more weird bios. Then, on a ‘why not?’ moment, you gave Facebook Dating one last chance… and I’m grateful you did.",
      },
      {
        title: "I messaged you",
        meta: "First chat",
        text: "From my very first message, I wanted to be different — thoughtful, funny, and real. One chat became two, and suddenly talking to you felt easy.",
      },
      {
        title: "Our rhythm",
        meta: "Tea + music + dreams",
        text: "We swapped stories, shared dreams, bonded over our favorite music, and somehow even the simplest things — like a good cup of tea — became a moment I looked forward to.",
      },
      {
        title: "I said it out loud",
        meta: "First date",
        text: "On our first date, I told you confidently: I’m going to put a ring on your finger. (Spoiler: I meant it.)",
      },
      {
        title: "When you know, you know",
        meta: "The turning point",
        text: "What started as a ‘why not?’ became ‘how could it not be us?’ Because some love stories don’t take long — they just feel written.",
      },
    ],
    []
  );

  const characterCards = useMemo(
    () => [
      {
        name: "Peggy Ndlovu",
        role: "My Wife 💍",
        avatar: "/peggy.jpg", // 👉 replace with Peggy's real photo in /public folder
        icon: BookOpen,
        chips: [
          { icon: Coffee, text: "Coffee always" },
          { icon: Sparkles, text: "Finds beauty" },
          { icon: BookOpen, text: "Fantasy novels" },
        ],
        text: "Book lover, brunch enthusiast, and the heart behind this whole celebration — creative, warm, and able to find beauty in the little things (especially if they sparkle).",
      },
      {
        name: "Sabelo Ndlovu",
        role: "Your Husband 💗",
        avatar: "/sabelo.jpg", // 👉 replace with Sabelo's real photo in /public folder
        icon: Music2,
        chips: [
          { icon: Film, text: "Documentaries" },
          { icon: Music2, text: "Eclectic playlists" },
          { icon: Wand2, text: "Now loves wizards" },
        ],
        text: "Documentary lover, music enthusiast, and always learning. Loving you added Harry Potter and Lord of the Rings to my favorites — because love really does lead you to magical places.",
      },
    ],
    []
  );

  const nav = [
    { id: "intro", label: "Valentine" },
    { id: "story", label: "Our Story" },
    { id: "quiz", label: "Quiz" },
    { id: "finale", label: "Forever" },
  ] as const;

  // Dev-only sanity tests
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isDev = (import.meta as any)?.env?.DEV;
    if (!isDev) return;

    const assert = (cond: boolean, msg: string) => {
      if (!cond) throw new Error(`Dev test failed: ${msg}`);
    };

    assert(Array.isArray(story) && story.length >= 3, "story should have at least 3 items");
    assert(Array.isArray(characterCards) && characterCards.length === 2, "characterCards should be 2");
    assert(nav.length === 4, "nav should have 4 items");
  }, [story, characterCards, nav]);

  const youtubeEmbedUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ";
  const youtubeOpenUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

  const heroGlowStyle = reduced
    ? {}
    : {
        transform: `translate3d(${xy.x * 10}px, ${xy.y * 10}px, 0)`,
      };

  return (
    <div ref={ref} className="relative min-h-screen bg-[#07040b] text-white">
      <GlobalStyles reduced={reduced} />
      <AuraBackground intensity={1.7} />
      <Starfield count={86} twinkle={!reduced} />
      <FloatingHearts count={18} reduced={reduced} />

      {/* Top glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/2 top-10 h-64 w-[42rem] -translate-x-1/2 rounded-full blur-3xl opacity-40 pulse-soft"
          style={{
            background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.18), transparent 60%)",
            ...heroGlowStyle,
          }}
        />
      </div>

      <HeartBurst fire={burst} />
      <SecretLetter open={openLetter} onClose={() => setOpenLetter(false)} />

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/12 bg-white/5">
              <Heart className="h-5 w-5 text-white/85" />
            </div>
            <div>
              <div className="text-sm font-semibold">Sabelo → Peggy</div>
              <div className="text-[11px] tracking-wide text-white/55">Valentine’s Day gift</div>
            </div>
          </div>

          <div className="hidden items-center gap-2 md:flex">
            {nav.map((n) => (
              <button
                key={n.id}
                onClick={() => setMode(n.id)}
                className={
                  "rounded-2xl border px-3 py-1.5 text-xs font-semibold transition focus:outline-none focus:ring-2 focus:ring-white/20 " +
                  (mode === n.id
                    ? "border-white/25 bg-white/10 text-white"
                    : "border-white/10 bg-white/5 text-white/75 hover:bg-white/10")
                }
                type="button"
              >
                {n.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setBurst((c) => c + 1)}
            className="inline-flex items-center gap-2 rounded-2xl border border-white/12 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
            type="button"
            title="Love burst"
          >
            <PartyPopper className="h-4 w-4" />
            <span className="hidden sm:inline">Love burst</span>
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-6xl px-4 pb-20 pt-10 md:px-6">
        {/* Mobile nav */}
        <div className="mb-6 flex gap-2 overflow-x-auto md:hidden">
          {nav.map((n) => (
            <button
              key={n.id}
              onClick={() => setMode(n.id)}
              className={
                "shrink-0 rounded-2xl border px-3 py-2 text-xs font-semibold transition focus:outline-none focus:ring-2 focus:ring-white/20 " +
                (mode === n.id
                  ? "border-white/25 bg-white/10 text-white"
                  : "border-white/10 bg-white/5 text-white/75 hover:bg-white/10")
              }
              type="button"
            >
              {n.label}
            </button>
          ))}
        </div>

        {mode === "intro" ? (
          <section className="fade-in-up">
            <div className="grid gap-6 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <GlassCard className="p-6 md:p-8">
                  <div className="flex flex-wrap items-center gap-2">
                    <Pill icon={Heart}>Happy Valentine’s</Pill>
                    <Pill icon={Globe2}>ZW → Florida, USA</Pill>
                    <Pill icon={Coffee}>Tea + music</Pill>
                  </div>

                  <div className="mt-6">
                    <div className="text-4xl font-semibold leading-tight md:text-5xl">
                      Happy Valentine’s Day,
                      <span className="block bg-gradient-to-r from-white via-white/90 to-white/60 bg-clip-text text-transparent">
                        Peggy. 💗
                      </span>
                    </div>
                    <div className="mt-4 max-w-xl text-sm leading-relaxed text-white/70 md:text-base">
                      I made this just for you. Not a big speech — a small experience. Our story, told by me, for you.
                      Tap through the memories… then take the quiz to unlock my letter.
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      onClick={() => setMode("story")}
                      className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/25"
                      type="button"
                    >
                      <Sparkles className="h-4 w-4" />
                      Start our story
                      <ArrowRight className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setMode("quiz")}
                      className="inline-flex items-center gap-2 rounded-2xl border border-white/12 bg-white/5 px-5 py-3 text-sm font-semibold text-white/80 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
                      type="button"
                    >
                      <KeyRound className="h-4 w-4" />
                      Jump to quiz
                    </button>
                  </div>
                </GlassCard>

                <div className="mt-4 grid gap-4 md:grid-cols-3 fade-in-up">
                  <GlassCard className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/12 bg-white/5">
                        <MapPin className="h-5 w-5 text-white/85" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold">Distance</div>
                        <div className="text-xs text-white/60">became destiny</div>
                      </div>
                    </div>
                  </GlassCard>
                  <GlassCard className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/12 bg-white/5">
                        <Timer className="h-5 w-5 text-white/85" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold">Timing</div>
                        <div className="text-xs text-white/60">perfectly placed</div>
                      </div>
                    </div>
                  </GlassCard>
                  <GlassCard className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/12 bg-white/5">
                        <Gift className="h-5 w-5 text-white/85" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold">A gift</div>
                        <div className="text-xs text-white/60">from Sabelo</div>
                      </div>
                    </div>
                  </GlassCard>
                </div>
              </div>

              <div className="lg:col-span-5">
                <GlassCard className="p-6 md:p-8 fade-in-up">
                  <div className="flex items-center gap-2 text-sm font-semibold text-white">
                    <Stars className="h-4 w-4" />
                    What you’ll find inside
                  </div>
                  <div className="mt-3 space-y-3 text-sm text-white/70">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                      <div className="font-semibold text-white">Cinematic Valentine UI</div>
                      <div className="mt-1">Pink aurora, floating hearts, glass cards.</div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                      <div className="font-semibold text-white">Our story (first-person)</div>
                      <div className="mt-1">Told by me — not a narrator.</div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                      <div className="font-semibold text-white">A quiz unlock</div>
                      <div className="mt-1">Answer 70%+ to open my letter.</div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                      <div className="font-semibold text-white">A perfect finale</div>
                      <div className="mt-1">A clean ending screen you can replay.</div>
                    </div>
                  </div>

                  <div className="mt-5 text-xs text-white/55">Made with love by Sabelo.</div>
                </GlassCard>
              </div>
            </div>
          </section>
        ) : null}

        {mode === "story" ? (
          <section className="fade-in-up">
            <SectionTitle kicker="CHAPTER ONE" title="How we met" subtitle="No coincidence. Just God’s hand and good Wi-Fi." icon={Sparkles} />

            <div className="grid gap-6 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <GlassCard className="p-5 md:p-6">
                  <div className="grid gap-4">
                    {story.map((s, idx) => (
                      <TimelineItem key={s.title} i={idx + 1} title={s.title} meta={s.meta} text={s.text} />
                    ))}
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      onClick={() => setMode("quiz")}
                      className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/25"
                      type="button"
                    >
                      <KeyRound className="h-4 w-4" />
                      Take the quiz
                    </button>
                    <button
                      onClick={() => setMode("finale")}
                      className="inline-flex items-center gap-2 rounded-2xl border border-white/12 bg-white/5 px-5 py-3 text-sm font-semibold text-white/80 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
                      type="button"
                    >
                      <Heart className="h-4 w-4" />
                      Skip to finale
                    </button>
                  </div>
                </GlassCard>
              </div>

              <div className="lg:col-span-5">
                <SectionTitle kicker="THE DUO" title="Us" subtitle="Tiny snapshots of you and me." icon={Heart} />

                <div className="grid gap-4">
                  {characterCards.map((c) => (
                    <GlassCard key={c.name} className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="text-sm font-semibold text-white">{c.name}</div>
                          <div className="text-xs text-white/60">{c.role}</div>
                        </div>
                        <div className="h-12 w-12 overflow-hidden rounded-full border border-white/15 bg-white/5">
                          <img src={c.avatar} alt={c.name} className="h-full w-full object-cover" />
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {c.chips.map((ch) => (
                          <Pill key={ch.text} icon={ch.icon}>
                            {ch.text}
                          </Pill>
                        ))}
                      </div>
                      <div className="mt-3 text-sm leading-relaxed text-white/70">{c.text}</div>
                    </GlassCard>
                  ))}

                  <GlassCard className="p-5">
                    <div className="flex items-center gap-2 text-sm font-semibold text-white">
                      <Coffee className="h-4 w-4" />
                      Our vibe
                    </div>
                    <div className="mt-2 text-sm text-white/70">
                      In one line:{" "}
                      <span className="font-semibold text-white">
                        “A good cup, a great playlist, and a conversation that never feels forced.”
                      </span>
                    </div>
                  </GlassCard>
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {mode === "quiz" ? (
          <section className="fade-in-up">
            <SectionTitle
              kicker="CHAPTER TWO"
              title="Unlock my letter"
              subtitle="Answer the memory questions. Score 70%+ to unlock my Valentine letter."
              icon={KeyRound}
            />

            <div className="grid gap-6 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <Quiz
                  onUnlock={() => {
                    setUnlocked(true);
                    setBurst((c) => c + 1);
                  }}
                />

                <div className="mt-4">
                  <YouTubeDedicationCard embedUrl={youtubeEmbedUrl} openUrl={youtubeOpenUrl} />
                </div>
              </div>

              <div className="lg:col-span-5">
                <GlassCard className="p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-white">
                      <KeyRound className="h-4 w-4" />
                      Letter vault
                    </div>
                    <div
                      className={
                        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold " +
                        (unlocked
                          ? "border-rose-300/30 bg-rose-300/10 text-rose-100"
                          : "border-white/12 bg-white/5 text-white/65")
                      }
                    >
                      {unlocked ? (
                        <>
                          <BadgeCheck className="h-4 w-4" />
                          Unlocked
                        </>
                      ) : (
                        <>
                          <KeyRound className="h-4 w-4" />
                          Locked
                        </>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 text-sm leading-relaxed text-white/70">
                    {unlocked ? "Tap to open my Valentine letter." : "Complete the quiz to unlock my letter."}
                  </div>

                  <button
                    disabled={!unlocked}
                    onClick={() => setOpenLetter(true)}
                    className={
                      "mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl border px-5 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-white/25 " +
                      (unlocked
                        ? "border-white/15 bg-white/10 text-white hover:bg-white/15"
                        : "cursor-not-allowed border-white/10 bg-white/5 text-white/45")
                    }
                    type="button"
                  >
                    <Quote className="h-4 w-4" />
                    Open the letter
                  </button>

                  <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-white">
                      <Globe2 className="h-4 w-4" />
                      Next upgrade
                    </div>
                    <div className="mt-2 text-sm text-white/70">
                      Later we’ll add Sabelo’s voice note reading the letter — a play button right here.
                    </div>
                  </div>
                </GlassCard>
              </div>
            </div>
          </section>
        ) : null}

        {mode === "finale" ? (
          <section className="fade-in-up">
            <SectionTitle
              kicker="FINAL CHAPTER"
              title="Forever starts now"
              subtitle="A clean, cinematic ending slide — perfect to show on a laptop/TV."
              icon={Heart}
            />

            <div className="grid gap-6 lg:grid-cols-12">
              <div className="lg:col-span-8">
                <GlassCard className="relative overflow-hidden p-6 md:p-10">
                  <div aria-hidden className="absolute inset-0">
                    <div
                      className="absolute -left-20 -top-20 h-72 w-72 rounded-full blur-3xl opacity-40"
                      style={{
                        background: "radial-gradient(circle at 30% 30%, rgba(244,63,94,0.45), transparent 60%)",
                      }}
                    />
                    <div
                      className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full blur-3xl opacity-40"
                      style={{
                        background: "radial-gradient(circle at 60% 60%, rgba(168,85,247,0.35), transparent 60%)",
                      }}
                    />
                  </div>

                  <div className="relative">
                    <div className="flex flex-wrap items-center gap-2">
                      <Pill icon={Heart}>Peggy</Pill>
                      <Pill icon={Heart}>Sabelo</Pill>
                      <Pill icon={Sparkles}>Valentine’s</Pill>
                    </div>

                    <div className="mt-6 text-4xl font-semibold leading-tight md:text-5xl">
                      Here’s to the chapter
                      <span className="block bg-gradient-to-r from-white via-white/90 to-white/60 bg-clip-text text-transparent">
                        we waited our whole lives to read.
                      </span>
                    </div>

                    <div className="mt-4 max-w-2xl text-sm leading-relaxed text-white/70 md:text-base">
                      Some stories are short in time but infinite in meaning. And you, Peggy, are my favorite part of every day.
                    </div>

                    <div className="mt-7 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                        <div className="flex items-center gap-2 text-sm font-semibold">
                          <Coffee className="h-4 w-4" />
                          Vibe
                        </div>
                        <div className="mt-2 text-sm text-white/70">Good cups. Great talks. Real laughter.</div>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                        <div className="flex items-center gap-2 text-sm font-semibold">
                          <Music2 className="h-4 w-4" />
                          Soundtrack
                        </div>
                        <div className="mt-2 text-sm text-white/70">Jazz → Gospel → Afrobeat → and a little magic.</div>
                      </div>
                    </div>

                    <div className="mt-7 flex flex-wrap gap-3">
                      <button
                        onClick={() => setBurst((c) => c + 1)}
                        className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/25"
                        type="button"
                      >
                        <PartyPopper className="h-4 w-4" />
                        Celebrate us
                      </button>
                      <button
                        onClick={() => setMode("intro")}
                        className="inline-flex items-center gap-2 rounded-2xl border border-white/12 bg-white/5 px-5 py-3 text-sm font-semibold text-white/80 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
                        type="button"
                      >
                        <Stars className="h-4 w-4" />
                        Replay
                      </button>
                    </div>

                    <div className="mt-6 text-xs text-white/55">— with love, always. 💗</div>
                  </div>
                </GlassCard>
              </div>

              <div className="lg:col-span-4">
                <GlassCard className="p-6">
                  <div className="flex items-center gap-2 text-sm font-semibold text-white">
                    <Film className="h-4 w-4" />
                    Easy upgrades
                  </div>
                  <ul className="mt-3 space-y-3 text-sm text-white/70">
                    <li className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                      <div className="font-semibold text-white">Add photos</div>
                      <div className="mt-1">Swap the “Us” cards for a carousel.</div>
                    </li>
                    <li className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                      <div className="font-semibold text-white">Add a Florida moment</div>
                      <div className="mt-1">We can add a glowing ZW → Florida line animation.</div>
                    </li>
                    <li className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                      <div className="font-semibold text-white">Add the voice note</div>
                      <div className="mt-1">We’ll embed Sabelo reading the letter (later).</div>
                    </li>
                  </ul>

                  <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-white">
                      <Gift className="h-4 w-4" />
                      Gift note
                    </div>
                    <div className="mt-2 text-sm text-white/70">
                      Peggy, I hope this makes you smile — and reminds you I’m always choosing you.
                    </div>
                  </div>
                </GlassCard>
              </div>
            </div>
          </section>
        ) : null}
      </main>

      <footer className="border-t border-white/10 bg-black/20">
        <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-white/55 md:px-6">
          Valentine’s Gift — Sabelo → Peggy. Edit story, quiz, and letter inside this file.
        </div>
      </footer>
    </div>
  );
}
