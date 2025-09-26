import { FAQ } from "@/lib/types";

interface JsonLdProps {
  type:
    | "FAQPage"
    | "LocalBusiness"
    | "Organization"
    | "BlogPosting"
    | "BreadcrumbList"
    | "WebSite";
  data: any;
}

export default function JsonLd({ type, data }: JsonLdProps) {
  const getStructuredData = () => {
    switch (type) {
      case "FAQPage":
        return {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: data.map((faq: FAQ) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        };

      case "LocalBusiness":
        return {
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "Autoescuelas.ar",
          description: "Directorio de escuelas de manejo en Argentina",
          url: "https://autoescuelas.ar",
          telephone: "+54 11 1234-5678",
          email: "info@autoescuelas.ar",
          address: {
            "@type": "PostalAddress",
            addressCountry: "AR",
            addressLocality: "Buenos Aires",
            addressRegion: "CABA",
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: -34.6037,
            longitude: -58.3816,
          },
          openingHours: "Mo-Fr 09:00-18:00",
          sameAs: [
            "https://facebook.com/autoescuelas.ar",
            "https://twitter.com/autoescuelas_ar",
          ],
        };

      case "Organization":
        return {
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Autoescuelas.ar",
          description:
            "El directorio más completo de escuelas de manejo en Argentina",
          url: "https://autoescuelas.ar",
          logo: "https://autoescuelas.ar/logo.png",
          contactPoint: {
            "@type": "ContactPoint",
            telephone: "+54 11 1234-5678",
            contactType: "customer service",
            availableLanguage: "Spanish",
          },
          sameAs: [
            "https://facebook.com/autoescuelas.ar",
            "https://twitter.com/autoescuelas_ar",
          ],
        };

      case "BlogPosting":
        return data;

      case "BreadcrumbList":
        return {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: data.map((item: any, index: number) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: item.url,
          })),
        };

      case "WebSite":
        return {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Autoescuelas.ar",
          description:
            "El directorio más completo de escuelas de manejo en Argentina",
          url: "https://autoescuelas.ar",
          potentialAction: {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate:
                "https://autoescuelas.ar/autoescuelas?search={search_term_string}",
            },
            "query-input": "required name=search_term_string",
          },
        };

      default:
        return data || {};
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(getStructuredData()),
      }}
    />
  );
}
