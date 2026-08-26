import Spinner from "@/components/cabinet/Spinner";

export default function LoginLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center px-5">
      <Spinner className="h-10 w-10 text-ink/30" />
    </main>
  );
}
