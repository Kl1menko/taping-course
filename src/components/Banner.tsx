import Image from "next/image";
import { Arrow } from "./ui";

type BannerData = {
  title: string;
  text: string;
  cta: { label: string; href: string };
  image: string | null;
  imageAlt: string;
  accent: "pink" | "lime";
};

export default function Banner({
  data,
  reverse = false,
}: {
  data: BannerData;
  reverse?: boolean;
}) {
  const accent = data.accent === "lime" ? "#DEFF3C" : "#F4A8F2";

  return (
    <section className="px-[10px] py-10 sm:py-14">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        {/* ── чорна картка ── */}
        <div
          className={`relative flex min-h-[380px] flex-col justify-end overflow-hidden rounded-[2.5rem] bg-ink p-8 sm:min-h-[440px] sm:p-11 ${
            reverse ? "lg:order-2" : ""
          }`}
        >
          {/* завиток — фонова лінія на всю висоту картки */}
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full opacity-90"
            viewBox="0 0 420 620"
            preserveAspectRatio="xMidYMid slice"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M420 -10C330 40 250 60 190 110c-70 58-52 132 6 138 44 5 66-42 34-66-34-25-90-2-118 44-40 66-30 158 22 226 44 58 118 96 196 118"
              stroke={accent}
              strokeWidth="3.2"
              strokeLinecap="round"
              opacity="0.85"
            />
            <path
              d="M-20 40C60 96 128 150 150 226c22 76-24 140-88 150"
              stroke={accent}
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.35"
            />
          </svg>

          <div className="relative z-10">
            <h2 className="max-w-md text-3xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-4xl lg:text-[2.75rem]">
              {data.title}
            </h2>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/55 sm:text-base">
              {data.text}
            </p>

            <a
              href={data.cta.href}
              className="group mt-9 inline-flex items-center gap-3 rounded-full bg-white p-1.5 pl-7 transition hover:bg-white/90"
            >
              <span className="text-sm font-bold sm:text-base">{data.cta.label}</span>
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-ink transition group-hover:rotate-45"
                style={{ background: accent }}
              >
                <Arrow className="h-4 w-4" />
              </span>
            </a>
          </div>
        </div>

        {/* ── фото ── */}
        <div
          className={`relative min-h-[280px] overflow-hidden rounded-[2.5rem] sm:min-h-[440px] ${
            reverse ? "lg:order-1" : ""
          }`}
        >
          {data.image ? (
            <Image
              src={data.image}
              alt={data.imageAlt}
              fill
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="object-cover"
            />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center p-8"
              style={{
                background:
                  data.accent === "lime"
                    ? "linear-gradient(135deg,#DEFF3C,#8AA8FF)"
                    : "linear-gradient(135deg,#F4A8F2,#C8B6FF)",
              }}
            >
              <span className="max-w-xs text-center text-sm font-semibold text-ink/45">
                Місце для фото — поклади файл у <code>public/</code> і вкажи
                шлях у <code>banners</code> ({data.imageAlt.toLowerCase()})
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
