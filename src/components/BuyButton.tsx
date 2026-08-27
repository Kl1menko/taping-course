"use client";

import { useCheckout } from "./CheckoutModal";
import { track } from "@/lib/analytics";
import GlassButton, { type Tone } from "./GlassButton";

export default function BuyButton({
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
  const { open } = useCheckout();

  const onClick = () => {
    track("checkout_cta_click", { source });
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
