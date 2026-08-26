"use client";

import { useFormStatus } from "react-dom";
import Spinner from "@/components/cabinet/Spinner";

// Вихід через form action лишається серверним — useFormStatus лише
// показує спінер, поки браузер чекає на відповідь.
function Button() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-label="Вийти з кабінету"
      className="flex min-h-11 items-center gap-2 rounded-full border border-ink/15 px-4 text-[11px] font-bold uppercase tracking-widest transition disabled:opacity-60 active:bg-ink active:text-white sm:hover:bg-ink sm:hover:text-white"
    >
      {pending ? (
        <Spinner className="h-4 w-4" label="Виходимо" />
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
             strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 sm:hidden">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <path d="m16 17 5-5-5-5" /><path d="M21 12H9" />
        </svg>
      )}
      <span className="hidden sm:inline">{pending ? "виходимо…" : "вийти"}</span>
    </button>
  );
}

export default function SignOutButton() {
  return (
    <form action="/auth/signout" method="post">
      <Button />
    </form>
  );
}
