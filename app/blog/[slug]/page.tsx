import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/database";
import BlogContent from "@/components/BlogContent";
import JsonLd from "@/components/SEO/JsonLd";
import { BlogArticle } from "@/lib/types";

interface BlogPostPageProps {
  params: { slug: string };
}

async function getArticle(
  slug: string
): Promise<{ article: BlogArticle; relatedArticles: BlogArticle[] } | null> {
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
          content: true,
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
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const data = await getArticle(params.slug);

  if (!data) {
    return {
      title: "Artículo no encontrado",
    };
  }

  const { article } = data;
  const title = article.metaTitle || article.title;
  const description =
    article.metaDescription ||
    article.excerpt ||
    `Lee sobre ${article.title} en Autoescuelas.ar`;

  return {
    title: `${title} - Blog Autoescuelas.ar`,
    description,
    keywords: article.tags.join(", "),
    authors: [{ name: article.author }],
    openGraph: {
      title: `${title} - Blog Autoescuelas.ar`,
      description,
      url: `https://www.autoescuelas.ar/blog/${article.slug}`,
      type: "article",
      publishedTime: article.publishedAt?.toISOString(),
      modifiedTime: article.updatedAt.toISOString(),
      authors: [article.author],
      tags: article.tags,
      images: article.featuredImage
        ? [
            {
              url: article.featuredImage,
              width: 1200,
              height: 630,
              alt: article.title,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} - Blog Autoescuelas.ar`,
      description,
      images: article.featuredImage ? [article.featuredImage] : [],
    },
    alternates: {
      canonical: `/blog/${article.slug}`,
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
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="text-sm text-gray-500">
            <a href="/" className="hover:text-primary">
              Inicio
            </a>
            <span className="mx-2">/</span>
            <a href="/blog" className="hover:text-primary">
              Blog
            </a>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{article.title}</span>
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
