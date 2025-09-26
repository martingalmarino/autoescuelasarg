import { Metadata } from "next";
import { Suspense } from "react";
import BlogPageClientSimple from "./BlogPageClientSimple";

export const metadata: Metadata = {
  title: "Blog - Autoescuelas.ar | Consejos y guías para obtener tu licencia",
  description:
    "Descubrí consejos, guías y noticias sobre autoescuelas, licencias de conducir y todo lo que necesitás saber para aprender a manejar en Argentina.",
  keywords:
    "blog autoescuelas, consejos manejo, guía licencia conducir, tips autoescuela, Argentina",
  openGraph: {
    title: "Blog - Autoescuelas.ar | Consejos y guías para obtener tu licencia",
    description:
      "Descubrí consejos, guías y noticias sobre autoescuelas, licencias de conducir y todo lo que necesitás saber para aprender a manejar en Argentina.",
    url: "https://www.autoescuelas.ar/blog",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog - Autoescuelas.ar | Consejos y guías para obtener tu licencia",
    description:
      "Descubrí consejos, guías y noticias sobre autoescuelas, licencias de conducir y todo lo que necesitás saber para aprender a manejar en Argentina.",
  },
  alternates: {
    canonical: "/blog",
  },
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Blog de Autoescuelas
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Consejos, guías y noticias para ayudarte a obtener tu licencia de
              conducir
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                Consejos de manejo
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                Guías paso a paso
              </span>
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                Noticias del sector
              </span>
              <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                Tips para el examen
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Suspense fallback={<BlogLoadingSkeleton />}>
            <BlogPageClientSimple />
          </Suspense>
        </div>
      </section>
    </div>
  );
}

function BlogLoadingSkeleton() {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Featured article skeleton */}
      <div className="mb-12">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="h-64 bg-gray-200 animate-pulse"></div>
          <div className="p-6">
            <div className="h-4 bg-gray-200 rounded w-20 mb-3 animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-3 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Articles grid skeleton */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow-sm overflow-hidden"
          >
            <div className="h-48 bg-gray-200 animate-pulse"></div>
            <div className="p-6">
              <div className="h-4 bg-gray-200 rounded w-16 mb-3 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
