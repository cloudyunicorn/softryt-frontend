/**
 * SoftRYT — JSON-LD Structured Data Component
 * ===============================================
 * Injects JSON-LD schema markup into the page head
 * for rich search engine results (FAQ, Article, SoftwareApplication).
 */

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data),
      }}
    />
  );
}
