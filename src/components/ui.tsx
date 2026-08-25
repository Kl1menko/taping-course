"use client";

import { useEffect, useRef, useState } from "react";
import { HighlightText } from "@/components/animate-ui/primitives/texts/highlight";

export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${seen ? "is-visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export function SectionTitle({
  highlight,
  rest,
  sub,
}: {
  highlight: string;
  rest?: string;
  sub?: string;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <h2 className="text-3xl font-extrabold uppercase leading-tight tracking-tight sm:text-4xl md:text-5xl">
        <HighlightText
          text={highlight}
          inView
          transition={{ duration: 1.1, ease: "easeInOut" }}
          className="rounded-full px-4 py-1 sm:px-6"
          style={{
            backgroundImage: "linear-gradient(#F4A8F2, #F4A8F2)",
          }}
        />
        {rest ? <span> {rest}</span> : null}
      </h2>
      {sub ? (
        <p className="mt-5 text-base text-ink/60 sm:text-lg">{sub}</p>
      ) : null}
    </div>
  );
}

export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={`h-4 w-4 ${className}`} aria-hidden="true">
      <path
        d="M7 17 17 7M17 7H8M17 7v9"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TelegramIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M21.94 4.6 18.9 19.2c-.23 1.02-.84 1.27-1.7.79l-4.7-3.47-2.27 2.19c-.25.25-.46.46-.94.46l.33-4.79 8.7-7.86c.38-.34-.08-.52-.59-.19L6.98 13.1l-4.63-1.45c-1.01-.31-1.03-1 .21-1.49L20.63 3.1c.84-.31 1.57.19 1.31 1.5Z" />
    </svg>
  );
}

export function InstagramIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.9" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.9" />
      <circle cx="17.4" cy="6.6" r="1.2" fill="currentColor" />
    </svg>
  );
}
