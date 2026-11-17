import { CloudImage } from "@/components/CloudImage";
import { isStorageUrl } from "@/lib/storage";

export function ProjectGallery({
  images,
  title,
}: {
  images: { id: string; image_url: string; alt_text: string | null }[];
  title: string;
}) {
  const items = images.filter((img) => isStorageUrl(img.image_url));
  if (items.length === 0) return null;

  return (
    <section className="mt-10" aria-labelledby="snapshots-heading">
      <h2
        id="snapshots-heading"
        className="mb-3 border-b border-border pb-2 text-xl font-semibold"
      >
        Snapshots
      </h2>
      <ul className="grid gap-5 sm:grid-cols-2">
        {items.map((img, i) => (
          <li key={img.id}>
            <figure>
              <a
                href={img.image_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block aspect-video overflow-hidden rounded-md border border-border bg-bg"
              >
                <CloudImage
                  src={img.image_url}
                  alt={`${title} snapshot ${i + 1}`}
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-cover object-top transition group-hover:scale-[1.02]"
                />
                <span className="sr-only"> (opens the full image in a new tab)</span>
              </a>
              {img.alt_text && (
                <figcaption className="mt-2 text-sm text-text-muted">
                  {img.alt_text}
                </figcaption>
              )}
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}