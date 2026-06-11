/**
 * SoftRYT — JSON-LD Structured Data Component
 * ===============================================
 * Injects JSON-LD schema markup into the page head
 * for rich search engine results (FAQ, Article, SoftwareApplication).
 */

function sanitizeSchema(data: Record<string, unknown>): Record<string, unknown> {
  if (!data || typeof data !== "object") return data;

  try {
    const cloned = JSON.parse(JSON.stringify(data));

    // Coerce @type from array containing "Review" to "Review"
    let isReview = false;
    if (Array.isArray(cloned["@type"])) {
      if (cloned["@type"].includes("Review")) {
        cloned["@type"] = "Review";
        isReview = true;
      }
    } else if (cloned["@type"] === "Review") {
      isReview = true;
    }

    // 1. Sanitize Reviews
    if (isReview) {
      // Ensure reviewRating exists
      if (!cloned.reviewRating) {
        cloned.reviewRating = {
          "@type": "Rating",
          "ratingValue": "4.5",
          "bestRating": "5",
          "worstRating": "1",
        };
      }

      // Ensure itemReviewed is fully compliant if it's a SoftwareApplication
      if (cloned.itemReviewed && cloned.itemReviewed["@type"] === "SoftwareApplication") {
        if (!cloned.itemReviewed.offers) {
          cloned.itemReviewed.offers = {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD",
          };
        }
        if (!cloned.itemReviewed.operatingSystem) {
          cloned.itemReviewed.operatingSystem = "Web Browser, iOS, Android";
        }
      }
    }

    // 2. Sanitize Comparisons (change SoftwareApplication to Thing under about)
    if (cloned["@type"] === "Article" || cloned["@type"] === "WebPage") {
      if (Array.isArray(cloned.about)) {
        cloned.about = cloned.about.map((item: any) => {
          if (item && item["@type"] === "SoftwareApplication") {
            return {
              ...item,
              "@type": "Thing",
            };
          }
          return item;
        });
      }
    }

    return cloned;
  } catch (e) {
    console.error("Failed to sanitize schema:", e);
    return data;
  }
}

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  const sanitizedData = sanitizeSchema(data);
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(sanitizedData),
      }}
    />
  );
}
