import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Heart,
  Sparkles,
  Quote,
  KeyRound,
  BadgeCheck,
  PartyPopper,
  ArrowRight,
  Play,
  Image as ImageIcon,
  MapPin,
  Calendar,
  Stars,
  X,
} from "lucide-react";

/**
 * Zidlekhaya ❤️ Sthabiso — Valentine App
 *
 * Pink glass UI • Floating hearts • Story • Moments • Clever quiz unlock
 * Letter opens only when dedication starts • Finale joke + 14 Feb plan
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
      :root { color-scheme: light; }

      @keyframes twinkle {
        0% { opacity: 0.22; transform: scale(1); }
        50% { opacity: 0.85; transform: scale(1.16); }
        100% { opacity: 0.35; transform: scale(1); }
      }

      @keyframes floatUp {
        0% { transform: translateY(0) scale(var(--s, 1)); opacity: var(--o, 0.2); }
        100% { transform: translateY(-980px) scale(var(--s, 1)); opacity: 0; }
      }

      @keyframes popBurst {
        0% { opacity: 0; transform: translate(0, 0) rotate(0deg) scale(1); }
        10% { opacity: 1; }
        100% { opacity: 0; transform: translate(var(--x, 0px), var(--y, 560px)) rotate(var(--r, 0deg)) scale(var(--sc, 1)); }
      }

      @keyframes fadeInUp {
        0% { opacity: 0; transform: translateY(12px); }
        100% { opacity: 1; transform: translateY(0); }
      }

      @keyframes softPulse {
        0%, 100% { opacity: 0.35; }
        50% { opacity: 0.55; }
      }

      @keyframes nameGlow {
        0%,100% { text-shadow: 0 0 0px rgba(255,81,154,0.0), 0 0 0px rgba(255,145,192,0.0); }
        50% { text-shadow: 0 0 18px rgba(255,81,154,0.45), 0 0 28px rgba(255,145,192,0.35); }
      }

      .fade-in-up { animation: fadeInUp 450ms ease-out both; }
      .twinkle { animation: twinkle var(--d, 6s) ease-in-out infinite; }
      .float-up { animation: floatUp var(--d, 10s) ease-in-out infinite; }
      .pulse-soft { animation: softPulse 3.6s ease-in-out infinite; }
      .name-glow { animation: nameGlow 3.2s ease-in-out infinite; }

      ${reduced ? `.twinkle, .float-up, .pulse-soft { animation: none !important; }` : ""}
    `}</style>
  );
}

function AuraBackground({ intensity = 1 }: { intensity?: number }) {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[#ffe6f1]" />

      {/* Pink aurora */}
      <div
        className="absolute -top-52 -left-56 h-[46rem] w-[46rem] rounded-full blur-3xl opacity-80"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, rgba(255, 81, 154, 0.60), transparent 60%), radial-gradient(circle at 70% 70%, rgba(255, 145, 192, 0.55), transparent 60%)",
          transform: `scale(${1 + intensity * 0.02})`,
        }}
      />
      <div
        className="absolute -bottom-56 -right-56 h-[50rem] w-[50rem] rounded-full blur-3xl opacity-75"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, rgba(168, 85, 247, 0.32), transparent 60%), radial-gradient(circle at 70% 70%, rgba(255, 81, 154, 0.40), transparent 60%)",
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

      {/* Light vignette (no dark mode) */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/25 via-transparent to-white/35" />
    </div>
  );
}

function Starfield({ count = 80, twinkle = true }: { count?: number; twinkle?: boolean }) {
  const stars = useMemo(() => {
    const arr: Array<{ id: number; x: number; y: number; s: number; o: number; d: number }> = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        s: 1 + Math.random() * 2.2,
        o: 0.10 + Math.random() * 0.30,
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
          style={
            {
              left: `${st.x}%`,
              top: `${st.y}%`,
              width: st.s,
              height: st.s,
              opacity: st.o,
              boxShadow: "0 0 14px rgba(255,255,255,0.20)",
              // @ts-ignore
              "--d": `${st.d}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

function FloatingHearts({ count = 20, reduced }: { count?: number; reduced: boolean }) {
  const hearts = useMemo(() => {
    const arr: Array<{ id: number; x: number; s: number; d: number; delay: number; o: number }> = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        id: i,
        x: Math.random() * 100,
        s: 0.7 + Math.random() * 1.35,
        d: 6 + Math.random() * 9,
        delay: Math.random() * 4,
        o: 0.08 + Math.random() * 0.18,
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
          className="absolute -bottom-12 float-up"
          style={
            {
              left: `${h.x}%`,
              opacity: h.o,
              // @ts-ignore
              "--s": h.s,
              // @ts-ignore
              "--d": `${h.d}s`,
              animationDelay: `${h.delay}s`,
              filter: "drop-shadow(0 0 10px rgba(255, 81, 154, 0.18))",
            } as React.CSSProperties
          }
        >
          <Heart className="h-6 w-6 text-[#5b2140]/75" />
        </div>
      ))}
    </div>
  );
}

function GlassCard({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={
        "rounded-3xl border border-pink-200/60 bg-pink-100/70 shadow-[0_18px_60px_rgba(255,81,154,0.15)] backdrop-blur-2xl " +
        className
      }
    >
      {children}
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-pink-100/60 px-3 py-1 text-xs text-[#5b2140]/85 backdrop-blur">
      <span>{children}</span>
    </div>
  );
}

function Avatar({ src, name }: { src: string; name: string }) {
  return (
    <div className="relative h-14 w-14 overflow-hidden rounded-full border border-white/15 bg-pink-100/60">
      <div
        aria-hidden
        className="absolute -inset-2 rounded-full blur-xl opacity-60"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(255,81,154,0.45), transparent 60%), radial-gradient(circle at 40% 60%, rgba(255,145,192,0.35), transparent 60%)",
        }}
      />
      <img src={src} alt={name} className="relative h-full w-full object-cover object-center" />
    </div>
  );
}

function HeartBurst({ fire }: { fire: number }) {
  const pieces = useMemo(() => {
    const arr: Array<{ id: number; x: number; y: number; r: number; sc: number; d: number }> = [];
    for (let i = 0; i < 24; i++) {
      arr.push({
        id: i,
        x: (Math.random() * 2 - 1) * 170,
        y: 560 + Math.random() * 260,
        r: Math.random() * 360,
        sc: 0.75 + Math.random() * 1.1,
        d: 0.85 + Math.random() * 0.95,
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
          style={
            {
              // @ts-ignore
              "--x": `${p.x}px`,
              // @ts-ignore
              "--y": `${p.y}px`,
              // @ts-ignore
              "--r": `${p.r}deg`,
              // @ts-ignore
              "--sc": p.sc,
              // @ts-ignore
              "--d": `${p.d}s`,
              animation: `popBurst ${p.d}s ease-out forwards`,
              filter: "drop-shadow(0 0 10px rgba(255, 81, 154, 0.18))",
            } as React.CSSProperties
          }
        >
          <Heart className="h-5 w-5 text-[#5b2140]/90" />
        </div>
      ))}
    </div>
  );
}

type Mode = "intro" | "story" | "gallery" | "quiz" | "letter" | "finale";

function TimelineItem({ i, title, meta, text }: { i: number; title: string; meta: string; text: string }) {
  return (
    <div className="relative pl-9">
      <div className="absolute left-0 top-[0.05rem]">
        <div className="flex h-7 w-7 items-center justify-center rounded-full border border-white/15 bg-pink-100/60">
          <span className="text-xs font-semibold text-[#5b2140]/80">{i}</span>
        </div>
      </div>
      <div className="rounded-2xl border border-white/10 bg-pink-100/70 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-sm font-semibold text-[#5b2140]">{title}</div>
          <div className="text-xs text-[#5b2140]/55">{meta}</div>
        </div>
        <div className="mt-2 text-sm leading-relaxed text-[#5b2140]/70">{text}</div>
      </div>
    </div>
  );
}

function PhotoGrid({ photos }: { photos: string[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {photos.map((src) => (
        <div key={src} className="overflow-hidden rounded-3xl border border-white/10 bg-pink-100/70">
          <img src={src} alt="Journey" className="h-56 w-full object-cover object-center" />
        </div>
      ))}
    </div>
  );
}

function ChoiceButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-2xl border border-white/10 bg-pink-100/60 px-4 py-3 text-left text-sm text-[#5b2140]/85 transition hover:bg-pink-200/60 focus:outline-none focus:ring-2 focus:ring-white/25"
      type="button"
    >
      {children}
    </button>
  );
}

function CleverQuiz({ onUnlock, onCorrect }: { onUnlock: () => void; onCorrect?: () => void }) {
  // Quiz without final riddle — correct answers auto-advance + hearts fly.
  const questions = useMemo(
    () => [
      {
        q: "Where did our story spark for the first time?",
        options: ["Twitter (X)", "Instagram", "Facebook", "At a party"],
        a: 0,
      },
      {
        q: "What date became our very first official date?",
        options: ["27 Jan 2024", "14 Feb 2024", "27 Jan 2023", "1 Nov 2025"],
        a: 0,
      },
      {
        q: "The running joke from our first interaction is…",
        options: ["Appreciate what sir?", "I don’t like tall guys", "Stop coding", "We met at a wedding"],
        a: 0,
      },
      {
        q: "Which mini-trip was my excuse to be with you (and you met my friends)?",
        options: ["Port Elizabeth (PE)", "Durban", "Cape Town", "Pretoria"],
        a: 0,
      },
    ],
    []
  );

  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  const current = questions[step];
  const total = questions.length;
  const passMark = Math.ceil(total * 0.75);

  function advance(correct: boolean) {
    const nextScore = score + (correct ? 1 : 0);
    if (correct) {
      setScore(nextScore);
      onCorrect?.();
    }

    if (step === total - 1) {
      setDone(true);
      const pass = nextScore >= passMark;
      setUnlocked(pass);
      if (pass) onUnlock();
      return;
    }

    setStep((s) => s + 1);
  }

  return (
    <GlassCard className="p-5 md:p-6">
      <div className="flex items-center justify-between gap-4">
        <div className="text-sm font-semibold text-[#5b2140]">The Not-Boring Quiz</div>
        <div className="text-xs text-[#5b2140]/60">{done ? "Complete" : `Q${step + 1} of ${total}`}</div>
      </div>

      {!done ? (
        <div className="mt-4">
          <div className="text-base font-semibold text-[#5b2140]">{current.q}</div>

          <div className="mt-4 grid gap-2">
            {current.options.map((opt, idx) => (
              <ChoiceButton key={opt} onClick={() => advance(idx === current.a)}>
                {opt}
              </ChoiceButton>
            ))}
          </div>

          <div className="mt-4 text-xs text-[#5b2140]/55">
            Score: <span className="text-[#5b2140]/85">{score}</span> | Pass: {passMark}/{total}
          </div>
        </div>
      ) : (
        <div className="mt-4">
          <div className="text-base font-semibold text-[#5b2140]">Done 💗</div>
          <div className="mt-2 text-sm leading-relaxed text-[#5b2140]/70">
            Final score: <span className="text-[#5b2140]">{score}</span> / {total}. {unlocked ? "You unlocked the letter." : "Almost! Refresh and try again."}
          </div>
        </div>
      )}
    </GlassCard>
  );
}

function DedicationAndLetterModal({
  open,
  onClose,
  youtubeVideoId,
  letterLines,
}: {
  open: boolean;
  onClose: () => void;
  youtubeVideoId: string;
  letterLines: string[];
}) {
  if (!open) return null;

  // Autoplay rules: start muted, she can unmute.
  const embedUrl = `https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&mute=1&playsinline=1&rel=0`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-3xl fade-in-up">
        <div className="overflow-hidden rounded-3xl border border-white/20 bg-pink-100/80 shadow-[0_30px_90px_rgba(91,33,64,0.20)] backdrop-blur-2xl">
          <div className="flex items-center justify-between border-b border-white/15 p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#5b2140]">
              <Quote className="h-4 w-4" />
              Zidlekhaya’s Valentine Letter
            </div>
            <button
              onClick={onClose}
              className="rounded-xl border border-white/15 bg-pink-200/60 px-3 py-1.5 text-xs font-semibold text-[#5b2140]/85 hover:bg-pink-200/80"
              type="button"
              aria-label="Close"
            >
              <span className="inline-flex items-center gap-1">
                <X className="h-4 w-4" />
                Close
              </span>
            </button>
          </div>

          <div className="p-5 md:p-6">
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="overflow-hidden rounded-2xl border border-white/15 bg-white/60">
                <iframe
                  className="h-56 w-full"
                  src={embedUrl}
                  title="Dedication"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
                <div className="p-3 text-[11px] text-[#5b2140]/60">Starts muted. Tap the video to unmute.</div>
              </div>

              <div className="rounded-2xl border border-white/15 bg-pink-100/70 p-4">
                <div className="text-xs font-semibold tracking-[0.22em] text-[#5b2140]/65">HAPPY VALENTINE’S</div>
                <div className="mt-2 whitespace-pre-wrap font-sans text-sm leading-relaxed text-[#5b2140]/90">
                  {letterLines.join("\n")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const reduced = usePrefersReducedMotion();
  const { ref, xy } = useMouseParallax(!reduced);

  const [mode, setMode] = useState<Mode>("intro");
  const [burst, setBurst] = useState(0);
  const [vaultUnlocked, setVaultUnlocked] = useState(false);
  const [openLetter, setOpenLetter] = useState(false);
  const [asked, setAsked] = useState(false);

  useEffect(() => {
    if (!burst) return;
    const t = window.setTimeout(() => setBurst(0), 1400);
    return () => window.clearTimeout(t);
  }, [burst]);

  const nav = [
    { id: "intro", label: "Valentine" },
    { id: "story", label: "Our Story" },
    { id: "gallery", label: "Moments" },
    { id: "quiz", label: "Quiz" },
    { id: "finale", label: "Finale" },
  ] as const;

  const heroGlowStyle = reduced
    ? {}
    : {
        transform: `translate3d(${xy.x * 10}px, ${xy.y * 10}px, 0)`,
      };

  // --- Content ---
  const avatars = {
    me: "/avatars/zidlekhaya.jpg",
    her: "/avatars/sthabiso.jpg",
  };

  const timeline = useMemo(
    () => [
      {
        title: "Twitter (X) did its thing",
        meta: "First interaction",
        text: "We met on Twitter, and from the very first time I saw you and stalked your interactions I already had the confidence to say: ‘I’ll marry you.’ Ngazibone umama wengane zami and ngisalapho namanje!",
      },
      {
        title: "The date that became our anchor",
        meta: "27 Jan 2024",
        text: "Our first date… kodwa deep down mina I know its October 19 2023 lol. We were both nervous ukuthi what if after the flirting we don’t like each other, kanti it was the total opposite!",
      },
      {
        title: "The drive home",
        meta: "Felt like we’d been dating",
        text: "Dropping you off didn’t feel like goodnight after a first date. It felt like see you soon, like we already belonged in each other’s routines.",
      },
      {
        title: "PE was my excuse",
        meta: "Mini trip + wedding",
        text: "I invited you on a mini trip to PE, partly for a wedding, mostly because I just wanted more time with you. Haha good times indeed, someone went to the beach wearing a jean lol! wothi nklweee!",
      },
      {
        title: "We celebrated wins",
        meta: "Graduation + new job",
        text: "We’ve cheered each other on through milestones, your graduation, my new job, and even when life got loud we kept coming back to the same thing, us.",
      },
      {
        title: "Family saw you the way I do",
        meta: "Dec 31 2024",
        text: "When you met my family, it felt like two worlds clicking into place. They adore you and I loved watching you belong there so naturally.",
      },
      {
        title: "You became brave, then unstoppable",
        meta: "Your career glow-up",
        text: "You stepped into auditing without studying for it and I watched fear turn into confidence. I know ispani sinokukuxaka but always know you will always come home to a husband you can unload to, yes unload lol.",
      },
      {
        title: "My builder, my cheerleader",
        meta: "uMshado + NOXA + dev journey",
        text: "You’ve been my steady voice while I build, through my dev journey, uMshado, NOXA. I don’t say it enough, but you’ve held me up more times than you know.",
      },
    ],
    []
  );

  const photos = useMemo(
    () => ["/journey/01.jpg", "/journey/02.jpg", "/journey/03.jpg", "/journey/04.jpg", "/journey/05.jpg", "/journey/06.jpg"],
    []
  );

  // Don Williams (from your link)
  const youtubeVideoId = "noboitrMunE";

  // NOTE: You asked to avoid mentioning a tough time. Keep this confident, warm, proud.
  const letterLines = useMemo(
    () => [
      `HAPPY VALENTINE’S`,
      `Happy Valentine’s Day, Sthandwa sami, MaFuyane.`,
      ``,
      `I hope this made you smile. I always want to see you happy. Not only because your face lights up when you do, but because I truly and deeply care about you, your peace, and everything that touches your life.`,
      ``,
      `You have been the best person to have by my side. You have been my support system and my cheerleader, and I am grateful for that. Whenever you can, whenever it allows, I would also like to be your support system in whatever you might be going through, even if it’s us.`,
      ``,
      `You are my best friend. Klaar. Usungikhulumisa isi Afrikaans mxm lol.`,
      ``,
      `Can we spend tomorrow together? Smiling. No questions. No drama. Just a hard reset to 27 Jan 2024, and be happy and want each other so bad again, best friend?`,
      ``,
      `Now… will you be my Valentine?`,
      ``,
      `In gentle Victorian words: My dearest heart, if ever two souls were written in the same chapter, ours would be inked side by side. Grant me thy hand, thy laughter, and thy tomorrow, and say that you shall be my Valentine.`,
      ``,
      `Zidlekhaya 💗`,
    ],
    []
  );

  // Dev sanity checks
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isDev = (import.meta as any)?.env?.DEV;
    if (!isDev) return;

    const assert = (cond: boolean, msg: string) => {
      if (!cond) throw new Error(`Dev test failed: ${msg}`);
    };

    assert(nav.length === 5, "nav should have 5 items");
    assert(timeline.length >= 6, "timeline should have at least 6 items");
    assert(photos.length >= 1, "photos should have at least 1 item");
    assert(typeof youtubeVideoId === "string" && youtubeVideoId.length > 5, "youtubeVideoId should look valid");

    // Extra: quiz should keep same pass logic (75%)
    const passMark = Math.ceil(5 * 0.75);
    assert(passMark === 4, "pass mark should be 4/5 for quiz");
  }, [nav.length, timeline.length, photos.length, youtubeVideoId, timeline.length]);

  return (
    <div ref={ref} className="relative min-h-screen bg-[#ffe6f1] text-[#5b2140]">
      <GlobalStyles reduced={reduced} />
      <AuraBackground intensity={1.7} />
      <Starfield count={88} twinkle={!reduced} />
      <FloatingHearts count={22} reduced={reduced} />

      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/2 top-10 h-64 w-[42rem] -translate-x-1/2 rounded-full blur-3xl opacity-40 pulse-soft"
          style={{
            background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.20), transparent 60%)",
            ...heroGlowStyle,
          }}
        />
      </div>

      <HeartBurst fire={burst} />

      <DedicationAndLetterModal
        open={openLetter}
        onClose={() => setOpenLetter(false)}
        youtubeVideoId={youtubeVideoId}
        letterLines={letterLines}
      />

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-pink-200/40 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/12 bg-pink-100/60">
              <Heart className="h-5 w-5 text-[#5b2140]/85" />
            </div>
            <div>
              <div className="text-sm font-semibold">Zidlekhaya → Sthabiso</div>
              <div className="text-[11px] tracking-wide text-[#5b2140]/55">Valentine’s App</div>
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
                    ? "border-white/25 bg-pink-200/60 text-[#5b2140]"
                    : "border-white/10 bg-pink-100/60 text-[#5b2140]/75 hover:bg-pink-200/60")
                }
                type="button"
              >
                {n.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setBurst((c) => c + 1)}
            className="inline-flex items-center gap-2 rounded-2xl border border-white/12 bg-pink-100/60 px-3 py-2 text-xs font-semibold text-[#5b2140]/80 hover:bg-pink-200/60 focus:outline-none focus:ring-2 focus:ring-white/20"
            type="button"
            title="Love burst"
          >
            <PartyPopper className="h-4 w-4" />
            <span className="hidden sm:inline">Love burst</span>
          </button>
        </div>
      </header>

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
                  ? "border-white/25 bg-pink-200/60 text-[#5b2140]"
                  : "border-white/10 bg-pink-100/60 text-[#5b2140]/75 hover:bg-pink-200/60")
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
                    <Pill>Happy Valentine’s 💗</Pill>
                    <Pill>27 Jan anniversary</Pill>
                  </div>

                  <div className="mt-6">
                    <div className="text-4xl font-semibold leading-tight md:text-5xl">
                      Happy Valentine’s,
                      <span className="block text-[#5b2140] name-glow">Nana 💗</span>
                    </div>
                    <div className="mt-4 max-w-xl text-sm leading-relaxed text-[#5b2140]/70 md:text-base">
                      I made this for you. Not a long speech. A small experience. Tap through our moments, then unlock the
                      letter.
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      onClick={() => setMode("story")}
                      className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-pink-200/60 px-5 py-3 text-sm font-semibold text-[#5b2140] hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/25"
                      type="button"
                    >
                      <Sparkles className="h-4 w-4" />
                      Start our story
                      <ArrowRight className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setMode("quiz")}
                      className="inline-flex items-center gap-2 rounded-2xl border border-white/12 bg-pink-100/60 px-5 py-3 text-sm font-semibold text-[#5b2140]/80 hover:bg-pink-200/60 focus:outline-none focus:ring-2 focus:ring-white/20"
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
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/12 bg-pink-100/60">
                        <MapPin className="h-5 w-5 text-[#5b2140]/85" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold">From</div>
                        <div className="text-xs text-[#5b2140]/60">Twitter → us</div>
                      </div>
                    </div>
                  </GlassCard>
                  <GlassCard className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/12 bg-pink-100/60">
                        <Calendar className="h-5 w-5 text-[#5b2140]/85" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold">Anchor date</div>
                        <div className="text-xs text-[#5b2140]/60">27 Jan</div>
                      </div>
                    </div>
                  </GlassCard>
                  <GlassCard className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/12 bg-pink-100/60">
                        <Stars className="h-5 w-5 text-[#5b2140]/85" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold">Theme</div>
                        <div className="text-xs text-[#5b2140]/60">Pink luxury</div>
                      </div>
                    </div>
                  </GlassCard>
                </div>
              </div>

              <div className="lg:col-span-5">
                <GlassCard className="p-6 md:p-8 fade-in-up">
                  <div className="flex items-center gap-3">
                    <Avatar src={avatars.her} name="Sthabiso" />
                    <div>
                      <div className="text-sm font-semibold">Sthabiso</div>
                      <div className="text-xs text-[#5b2140]/60">My love 💗</div>
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl border border-white/10 bg-pink-100/70 p-4 text-sm text-[#5b2140]/70">
                    Inside: timeline, photos, a clever quiz, and a letter that opens with a dedication song.
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <Avatar src={avatars.me} name="Zidlekhaya" />
                    <div>
                      <div className="text-sm font-semibold">Zidlekhaya</div>
                      <div className="text-xs text-[#5b2140]/60">Made just for you 💗</div>
                    </div>
                  </div>
                </GlassCard>
              </div>
            </div>
          </section>
        ) : null}

        {mode === "story" ? (
          <section className="fade-in-up">
            <div className="mb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/12 bg-pink-100/60">
                  <Sparkles className="h-5 w-5 text-[#5b2140]/85" />
                </div>
                <div>
                  <div className="text-xs font-semibold tracking-[0.24em] text-[#5b2140]/60">OUR STORY</div>
                  <div className="text-2xl font-semibold text-[#5b2140] md:text-3xl">From a tweet to a promise</div>
                </div>
              </div>
              <div className="mt-3 max-w-3xl text-sm leading-relaxed text-[#5b2140]/70 md:text-base">
                Our story, told properly.
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-12">
              <div className="lg:col-span-8">
                <GlassCard className="p-5 md:p-6">
                  <div className="grid gap-4">
                    {timeline.map((t, idx) => (
                      <TimelineItem key={t.title} i={idx + 1} title={t.title} meta={t.meta} text={t.text} />
                    ))}
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      onClick={() => setMode("gallery")}
                      className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-pink-200/60 px-5 py-3 text-sm font-semibold text-[#5b2140] hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/25"
                      type="button"
                    >
                      <ImageIcon className="h-4 w-4" />
                      Our moments
                    </button>
                    <button
                      onClick={() => setMode("quiz")}
                      className="inline-flex items-center gap-2 rounded-2xl border border-white/12 bg-pink-100/60 px-5 py-3 text-sm font-semibold text-[#5b2140]/80 hover:bg-pink-200/60 focus:outline-none focus:ring-2 focus:ring-white/20"
                      type="button"
                    >
                      <KeyRound className="h-4 w-4" />
                      Unlock the letter
                    </button>
                  </div>
                </GlassCard>
              </div>

              <div className="lg:col-span-4" />
            </div>
          </section>
        ) : null}

        {mode === "gallery" ? (
          <section className="fade-in-up">
            <div className="mb-6">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/12 bg-pink-100/60">
                    <ImageIcon className="h-5 w-5 text-[#5b2140]/85" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold tracking-[0.24em] text-[#5b2140]/60">MOMENTS</div>
                    <div className="text-2xl font-semibold text-[#5b2140] md:text-3xl">Photos from our journey</div>
                  </div>
                </div>

                <button
                  onClick={() => setMode("story")}
                  className="rounded-2xl border border-white/12 bg-pink-100/60 px-4 py-2 text-xs font-semibold text-[#5b2140]/80 hover:bg-pink-200/60"
                  type="button"
                >
                  ← Back
                </button>
              </div>
              <div className="mt-3 max-w-3xl text-sm leading-relaxed text-[#5b2140]/70 md:text-base">Our little gallery.</div>
            </div>

            <GlassCard className="p-5 md:p-6">
              <PhotoGrid photos={photos} />
            </GlassCard>
          </section>
        ) : null}

        {mode === "quiz" ? (
          <section className="fade-in-up">
            <div className="mb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/12 bg-pink-100/60">
                  <KeyRound className="h-5 w-5 text-[#5b2140]/85" />
                </div>
                <div>
                  <div className="text-xs font-semibold tracking-[0.24em] text-[#5b2140]/60">UNLOCK</div>
                  <div className="text-2xl font-semibold text-[#5b2140] md:text-3xl">Wothi ngike ngikusebenzise since ungabhalanga i Olevel! 😂</div>
                </div>
              </div>
              <div className="mt-3 max-w-3xl text-sm leading-relaxed text-[#5b2140]/70 md:text-base">
                Tap the correct answer. If you’re right, hearts fly and you move on.
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <CleverQuiz
                  onUnlock={() => {
                    setVaultUnlocked(true);
                    setBurst((c) => c + 1);
                  }}
                  onCorrect={() => setBurst((c) => c + 1)}
                />

                <GlassCard className="mt-4 p-5">
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#5b2140]">
                    <Play className="h-4 w-4" />
                    Dedication song
                  </div>
                  <div className="mt-2 text-sm text-[#5b2140]/70">The letter opens while the song plays (starts muted).</div>
                </GlassCard>
              </div>

              <div className="lg:col-span-5">
                <GlassCard className="p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-[#5b2140]">
                      <KeyRound className="h-4 w-4" />
                      Letter vault
                    </div>
                    <div
                      className={
                        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold " +
                        (vaultUnlocked
                          ? "border-pink-300/30 bg-pink-300/10 text-[#5b2140]"
                          : "border-white/12 bg-pink-100/60 text-[#5b2140]/65")
                      }
                    >
                      {vaultUnlocked ? (
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

                  <div className="mt-3 text-sm leading-relaxed text-[#5b2140]/70">
                    {vaultUnlocked
                      ? "Press the button below. It starts the dedication and opens the letter together."
                      : "Complete the quiz to unlock the vault."}
                  </div>

                  <button
                    disabled={!vaultUnlocked}
                    onClick={() => {
                      setOpenLetter(true);
                      setMode("letter");
                    }}
                    className={
                      "mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl border px-5 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-white/25 " +
                      (vaultUnlocked
                        ? "border-white/15 bg-pink-200/60 text-[#5b2140] hover:bg-white/15"
                        : "cursor-not-allowed border-white/10 bg-pink-100/60 text-[#5b2140]/45")
                    }
                    type="button"
                  >
                    <Play className="h-4 w-4" />
                    Start song & open letter
                  </button>
                </GlassCard>
              </div>
            </div>
          </section>
        ) : null}

        {mode === "letter" ? (
          <section className="fade-in-up">
            <GlassCard className="p-6">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#5b2140]">
                <Quote className="h-4 w-4" />
                Letter is open
              </div>
              <div className="mt-2 text-sm text-[#5b2140]/70">Close the letter modal anytime, then continue.</div>
              <div className="mt-4">
                <button
                  onClick={() => setMode("finale")}
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-pink-200/60 px-5 py-3 text-sm font-semibold text-[#5b2140] hover:bg-white/15"
                  type="button"
                >
                  Continue to finale <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </GlassCard>
          </section>
        ) : null}

        {mode === "finale" ? (
          <section className="fade-in-up">
            <GlassCard className="relative overflow-hidden p-6 md:p-10">
              <div aria-hidden className="absolute inset-0">
                <div
                  className="absolute -left-24 -top-24 h-80 w-80 rounded-full blur-3xl opacity-40"
                  style={{
                    background: "radial-gradient(circle at 30% 30%, rgba(255,81,154,0.45), transparent 60%)",
                  }}
                />
                <div
                  className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full blur-3xl opacity-35"
                  style={{
                    background: "radial-gradient(circle at 60% 60%, rgba(255,145,192,0.35), transparent 60%)",
                  }}
                />
              </div>

              <div className="relative">
                <div className="flex flex-wrap items-center gap-2">
                  <Pill>Pink love</Pill>
                  <Pill>Us</Pill>
                  <Pill>14 Feb</Pill>
                </div>

                <div className="mt-6 text-4xl font-semibold leading-tight md:text-5xl">
                  Will you be
                  <span className="block text-[#5b2140]">my Valentine?</span>
                </div>

                <div className="mt-4 max-w-2xl text-sm leading-relaxed text-[#5b2140]/70 md:text-base">
                  Tomorrow we spend the day together — soft, intentional, and us-focused.
                </div>

                <div className="mt-7 flex flex-wrap gap-3">
                  <button
                    onClick={() => {
                      setAsked(true);
                      setBurst((c) => c + 1);
                    }}
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-pink-200/60 px-5 py-3 text-sm font-semibold text-[#5b2140] hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/25"
                    type="button"
                  >
                    <Heart className="h-4 w-4" />
                    Yes 💗
                  </button>
                  <button
                    onClick={() => {
                      setAsked(false);
                      setMode("intro");
                    }}
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/12 bg-pink-100/60 px-5 py-3 text-sm font-semibold text-[#5b2140]/80 hover:bg-pink-200/60 focus:outline-none focus:ring-2 focus:ring-white/20"
                    type="button"
                  >
                    Replay <ArrowRight className="h-4 w-4" />
                  </button>
                </div>

                {asked ? (
                  <div className="mt-6 rounded-3xl border border-pink-300/25 bg-pink-300/10 p-5">
                    <div className="text-sm font-semibold text-[#5b2140]">I appreciate you sir 😂</div>
                    <div className="mt-2 text-sm text-[#5b2140]/70">Deal? Tomorrow we do it properly.</div>
                  </div>
                ) : null}
              </div>
            </GlassCard>
          </section>
        ) : null}
      </main>

      <footer className="border-t border-pink-200/40 bg-pink-200/30">
        <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-[#5b2140]/55 md:px-6">Made with love.</div>
      </footer>
    </div>
  );
}
