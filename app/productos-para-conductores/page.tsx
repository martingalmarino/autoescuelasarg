import { Info, ShoppingBag } from "lucide-react";
import JsonLd from "@/components/SEO/JsonLd";
import ProductCatalog from "@/components/products/ProductCatalog";
import { PRICES_CHECKED_ON } from "@/lib/products";
import { SITE_URL, buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  titleVariants: ["Productos recomendados para conductores", "Productos para conductores"],
  description:
    "Infladores de neumáticos, arrancadores de batería, kits de lavado y otros productos útiles para tener en el auto, seleccionados en Mercado Libre.",
  path: "/productos-para-conductores",
});

const pricesCheckedOn = new Intl.DateTimeFormat("es-AR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
}).format(new Date(`${PRICES_CHECKED_ON}T00:00:00Z`));

export default function DriverProductsPage() {
  return (
    <div className="min-h-screen bg-background">
      <JsonLd
        type="BreadcrumbList"
        data={[
          { name: "Inicio", url: SITE_URL },
          { name: "Productos para conductores", url: `${SITE_URL}/productos-para-conductores` },
        ]}
      />

      <section className="page-hero py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-signal shadow-sm">
              <ShoppingBag className="h-6 w-6 text-navy" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4">
              Productos recomendados para conductores
            </h1>
            <p className="text-lg sm:text-xl text-white/85">
              Accesorios útiles para tener en el auto: inflá neumáticos, arrancá con la batería descargada y mantené
              tu vehículo impecable.
            </p>
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-14">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mb-8 flex items-start gap-3 rounded-xl border border-signal/50 bg-signal/10 p-4 text-sm text-foreground">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-navy" aria-hidden="true" />
            <p>
              <span className="font-semibold">Enlaces de afiliado.</span> Si comprás a través de estos enlaces de
              Mercado Libre podemos recibir una comisión, sin costo extra para vos. Nos ayuda a mantener el sitio
              gratuito.
            </p>
          </div>

          <ProductCatalog />

          <p className="mt-8 text-xs text-muted-foreground">
            Precios de referencia revisados el {pricesCheckedOn}. El precio final, las cuotas, el stock y el envío los
            define Mercado Libre y pueden cambiar sin aviso. La compra se realiza directamente en Mercado Libre.
          </p>
        </div>
      </section>
    </div>
  );
}
