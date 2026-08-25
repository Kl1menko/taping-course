"use client";

import { useApply } from "./ApplyModal";
import { track } from "@/lib/analytics";
import GlassButton, { type Tone } from "./GlassButton";

export default function ApplyButton({
  children,
  className,
  source,
  glass,
}: {
  children: React.ReactNode;
  className?: string;
  source: string;
  /** Скляний варіант — для головних CTA. */
  glass?: Tone;
}) {
  const { open } = useApply();

  const onClick = () => {
    track("application_start", { source });
    open();
  };

  if (glass) {
    return (
      <GlassButton tone={glass} className={className} onClick={onClick}>
        {children}
      </GlassButton>
    );
  }

  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  );
}
