// Плеєр. Провайдер винесено в проп, щоб перехід з YouTube
// на Bunny/Vimeo був заміною одного case, а не переписуванням сторінок.
export default function VideoPlayer({
  provider,
  videoId,
  title,
}: {
  provider: string;
  videoId: string | null;
  title: string;
}) {
  if (!videoId) {
    return (
      <div className="flex aspect-video items-center justify-center border-y border-dashed border-ink/20 bg-ink/[0.03] sm:rounded-3xl sm:border">
        <p className="px-6 text-center text-sm text-ink/45">
          Відео цього уроку ще завантажується.
        </p>
      </div>
    );
  }

  if (provider === "youtube") {
    // rel=0 — не показувати чужі відео в кінці; modestbranding — менше брендингу.
    const src =
      `https://www.youtube-nocookie.com/embed/${videoId}` +
      `?rel=0&modestbranding=1&playsinline=1`;
    return (
      <div className="aspect-video overflow-hidden bg-black sm:rounded-3xl">
        <iframe
          src={src}
          title={title}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div className="flex aspect-video items-center justify-center bg-ink/[0.03] sm:rounded-3xl">
      <p className="text-sm text-ink/45">Невідомий провайдер відео: {provider}</p>
    </div>
  );
}
