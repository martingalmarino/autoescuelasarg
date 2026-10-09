import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { prisma } from "@/lib/database";
import BlogContent from "@/components/BlogContent";
import JsonLd from "@/components/SEO/JsonLd";
import { BlogArticle } from "@/lib/types";
import { buildMetadata, notFoundMetadata } from "@/lib/seo";

// ISR: 24 h. Los artículos se generan en la primera visita; el admin invalida la caché al editar.
export const revalidate = 86400;

export async function generateStaticParams() {
  return [];
}

interface BlogPostPageProps {
  params: { slug: string };
}

const getArticle = cache(async (
  slug: string
): Promise<{ article: BlogArticle; relatedArticles: Omit<BlogArticle, "content">[] } | null> => {
  try {
    const article = await prisma.blogArticle.findUnique({
      where: {
        slug,
        isPublished: true,
      },
    });

    if (!article) {
      return null;
    }

    // Obtener artículos relacionados
    const relatedArticles = await prisma.blogArticle.findMany({
      where: {
        isPublished: true,
        category: article.category,
        id: { not: article.id },
      },
      orderBy: { publishedAt: "desc" },
      take: 3,
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          featuredImage: true,
          category: true,
          author: true,
          readingTime: true,
          publishedAt: true,
          createdAt: true,
          tags: true,
          isFeatured: true,
          sortOrder: true,
          metaTitle: true,
          metaDescription: true,
          isPublished: true,
          updatedAt: true,
        },
    });

    return { article, relatedArticles };
  } catch (error) {
    console.error("Error fetching article:", error);
    return null;
  }
});

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const data = await getArticle(params.slug);

  if (!data) {
    return notFoundMetadata;
  }

  const { article } = data;
  const summary = (article.metaDescription || article.excerpt || "").trim();
  const withStop = (text: string) => (/[.?!]$/.test(text) ? text : `${text}.`);
  const fullTitle = (article.metaTitle || article.title).trim();
  const titleSegments = fullTitle
    .split(/(?<=[?:])\s+/)
    .map((segment) => segment.replace(/:$/, "").trim())
    .filter((segment) => segment.length >= 25)
    .sort((a, b) => b.length - a.length);
  const base = buildMetadata({
    titleVariants: [fullTitle, ...titleSegments],
    description:
      summary.length >= 110
        ? summary
        : `${withStop(summary || article.title.trim())} Guía del blog de Autoescuelas.ar para aprender a manejar y sacar tu registro de conducir.`,
    path: `/blog/${article.slug}`,
    images: article.featuredImage ? [article.featuredImage] : undefined,
    type: "article",
  });

  return {
    ...base,
    authors: [{ name: article.author }],
    openGraph: {
      ...base.openGraph,
      type: "article",
      publishedTime: article.publishedAt?.toISOString(),
      modifiedTime: article.updatedAt.toISOString(),
      authors: [article.author],
      tags: article.tags,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const data = await getArticle(params.slug);

  if (!data) {
    notFound();
  }

  const { article, relatedArticles } = data;

  // Schema JSON-LD para el artículo
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.excerpt,
    image: article.featuredImage,
    author: {
      "@type": "Organization",
      name: article.author,
      url: "https://www.autoescuelas.ar",
    },
    publisher: {
      "@type": "Organization",
      name: "Autoescuelas.ar",
      url: "https://www.autoescuelas.ar",
      logo: {
        "@type": "ImageObject",
        url: "https://www.autoescuelas.ar/logo.png",
      },
    },
    datePublished: article.publishedAt?.toISOString(),
    dateModified: article.updatedAt.toISOString(),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://www.autoescuelas.ar/blog/${article.slug}`,
    },
    keywords: article.tags.join(", "),
    articleSection: article.category,
    wordCount: article.content.split(" ").length,
    timeRequired: article.readingTime ? `PT${article.readingTime}M` : undefined,
  };

  // Schema JSON-LD para breadcrumb
  const breadcrumbSchema = [
    { name: "Inicio", url: "https://www.autoescuelas.ar" },
    { name: "Blog", url: "https://www.autoescuelas.ar/blog" },
    {
      name: article.title,
      url: `https://www.autoescuelas.ar/blog/${article.slug}`,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="text-sm text-muted-foreground">
            <a href="/" className="hover:text-primary">
              Inicio
            </a>
            <span className="mx-2">/</span>
            <a href="/blog" className="hover:text-primary">
              Blog
            </a>
            <span className="mx-2">/</span>
            <span className="font-medium text-foreground">{article.title}</span>
          </nav>
        </div>
      </div>

      {/* Contenido del artículo */}
      <div className="py-12">
        <div className="container mx-auto px-4">
          <BlogContent article={article} relatedArticles={relatedArticles} />
        </div>
      </div>

      {/* Schema JSON-LD */}
      <JsonLd type="BlogPosting" data={articleSchema} />
      <JsonLd type="BreadcrumbList" data={breadcrumbSchema} />
    </div>
  );
}
