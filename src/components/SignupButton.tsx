"use client";

import { useSignupModal } from "./SignupModal";

/** Кнопка, що відкриває модальну форму запису. */
export default function SignupButton({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { open } = useSignupModal();
  return (
    <button type="button" onClick={open} className={className}>
      {children}
    </button>
  );
}
