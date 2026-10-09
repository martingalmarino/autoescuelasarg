"use client";

import { useState } from "react";
import ProductCard from "@/components/products/ProductCard";
import { productCategories, products, type ProductCategoryId } from "@/lib/products";
import { cn } from "@/lib/utils";

type Filter = ProductCategoryId | "todos";

export default function ProductCatalog() {
  const [filter, setFilter] = useState<Filter>("todos");

  const categories = productCategories.filter(category => products.some(p => p.category === category.id));
  const visible = filter === "todos" ? products : products.filter(p => p.category === filter);
  const chips: { id: Filter; name: string; count: number }[] = [
    { id: "todos", name: "Todos", count: products.length },
    ...categories.map(c => ({ id: c.id, name: c.name, count: products.filter(p => p.category === c.id).length })),
  ];

  return (
    <div>
      {categories.length > 1 && (
        <div className="-mx-4 mb-6 overflow-x-auto px-4 sm:mx-0 sm:px-0" role="group" aria-label="Filtrar por categoría">
          <div className="flex w-max gap-2 sm:w-auto sm:flex-wrap">
            {chips.map(chip => {
              const active = chip.id === filter;
              return (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => setFilter(chip.id)}
                  aria-pressed={active}
                  className={cn(
                    "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    active
                      ? "border-navy bg-navy text-white"
                      : "border-border bg-card text-foreground hover:border-primary/40 hover:text-primary"
                  )}
                >
                  {chip.name}
                  <span className={cn("text-xs", active ? "text-white/70" : "text-muted-foreground")}>{chip.count}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
        {visible.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
