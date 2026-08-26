import Spinner from "@/components/cabinet/Spinner";

// Перехід із Telegram: обмін токена на сесію займає секунду-дві.
// Без цього екрана людина бачить білу сторінку і думає, що зламалось.
export default function TgLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center px-5">
      <div className="flex flex-col items-center text-center">
        <Spinner className="h-11 w-11 text-ink/40" label="Входимо в кабінет" />
        <p className="mt-5 text-sm font-semibold text-ink/60">
          Відкриваємо кабінет…
        </p>
      </div>
    </main>
  );
}
