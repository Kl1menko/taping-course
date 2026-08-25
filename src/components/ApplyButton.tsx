"use client";

import { useApply } from "./ApplyModal";
import { track } from "@/lib/analytics";

export default function ApplyButton({
  children,
  className,
  source,
}: {
  children: React.ReactNode;
  className?: string;
  source: string;
}) {
  const { open } = useApply();

  return (
    <button
      className={className}
      onClick={() => {
        track("application_start", { source });
        open();
      }}
    >
      {children}
    </button>
  );
}
