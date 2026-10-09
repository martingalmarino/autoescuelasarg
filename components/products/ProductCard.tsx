import Image from "next/image";
import { BatteryCharging, ExternalLink, Gauge, ShieldCheck, Smartphone, Sparkles, type LucideIcon } from "lucide-react";
import { discountPercentage, type Product, type ProductBadge, type ProductCategoryId } from "@/lib/products";
import { cn, formatPrice } from "@/lib/utils";

const categoryIcons: Record<ProductCategoryId, LucideIcon> = {
  neumaticos: Gauge,
  bateria: BatteryCharging,
  limpieza: Sparkles,
  seguridad: ShieldCheck,
  accesorios: Smartphone,
};

const badgeStyles: Record<ProductBadge, string> = {
  "Más vendido": "bg-[#ff7733] text-white",
  Recomendado: "bg-signal text-signal-foreground",
  Oferta: "bg-[#00a650] text-white",
};

export default function ProductCard({ product }: { product: Product }) {
  const discount = discountPercentage(product);
  const Icon = categoryIcons[product.category];

  return (
    <a
      href={product.url}
      target="_blank"
      rel="sponsored nofollow noopener"
      className="group surface-card surface-card-hover flex h-full overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:flex-col"
    >
      <div className="relative aspect-square w-28 shrink-0 self-start bg-white min-[380px]:w-32 sm:w-auto sm:self-auto sm:border-b sm:border-border/60">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.title}
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-contain p-2 transition-transform duration-300 group-hover:scale-[1.03] sm:p-5"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Icon className="h-10 w-10 text-muted-foreground/40 sm:h-16 sm:w-16" strokeWidth={1.5} />
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col p-3 pl-1 min-[380px]:p-4 min-[380px]:pl-2 sm:p-5">
        {product.badge && (
          <span
            className={cn(
              "mb-2 self-start rounded px-1.5 py-0.5 text-[11px] font-bold uppercase leading-tight tracking-wide",
              badgeStyles[product.badge]
            )}
          >
            {product.badge}
          </span>
        )}

        <h3 className="line-clamp-2 text-[15px] leading-snug text-foreground group-hover:text-primary transition-colors">
          {product.title}
        </h3>
        {product.seller && <p className="mt-1 text-xs text-muted-foreground">Por {product.seller}</p>}

        {product.price !== undefined && (
          <div className="mt-3">
            {discount !== null && product.originalPrice && (
              <p className="text-sm leading-none text-muted-foreground">
                <span className="sr-only">Antes: </span>
                <s>{formatPrice(product.originalPrice)}</s>
              </p>
            )}
            <p className="mt-1 flex flex-wrap items-baseline gap-x-2">
              <span className="text-xl font-normal leading-tight text-foreground sm:text-2xl">{formatPrice(product.price)}</span>
              {discount !== null && <span className="text-sm font-medium text-[#00a650]">{discount}% OFF</span>}
            </p>
            {product.installments && (
              <p className="mt-0.5 text-sm text-foreground">
                {product.installments.count} cuotas de {formatPrice(product.installments.amount)}
              </p>
            )}
          </div>
        )}

        {product.note && (
          <p className="mt-3 rounded-lg bg-muted/60 p-3 text-xs leading-relaxed text-muted-foreground">
            <span className="font-semibold text-foreground">Por qué lo recomendamos: </span>
            {product.note}
          </p>
        )}

        <span className="mt-4 flex flex-1 items-end">
          <span className="inline-flex h-10 w-full items-center justify-center gap-2 whitespace-nowrap rounded-md bg-signal px-2 text-sm font-semibold text-signal-foreground shadow-sm transition-all group-hover:bg-signal/90 group-hover:shadow-md min-[380px]:px-4">
            Ver en Mercado Libre
            <ExternalLink className="hidden h-4 w-4 min-[380px]:block" aria-hidden="true" />
            <span className="sr-only">(se abre en una pestaña nueva)</span>
          </span>
        </span>
      </div>
    </a>
  );
}
