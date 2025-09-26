"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, Eye, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import RichTextEditor from "@/components/RichTextEditor";
import ImageUpload from "@/components/ImageUpload";
import { BlogArticle } from "@/lib/types";

interface EditBlogArticlePageProps {
  params: { id: string };
}

export default function EditBlogArticlePage({
  params,
}: EditBlogArticlePageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [article, setArticle] = useState<BlogArticle | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    featuredImage: "",
    metaTitle: "",
    metaDescription: "",
    isPublished: false,
    category: "",
    tags: "",
    author: "Autoescuelas.ar",
    readingTime: "",
    isFeatured: false,
  });

  const categories = [
    "Consejos",
    "Guías",
    "Noticias",
    "Tips",
    "Exámenes",
    "Regulaciones",
  ];

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`/api/admin/blog/${params.id}`);
        if (!response.ok) {
          if (response.status === 404) {
            router.push("/admin/blog");
            return;
          }
          throw new Error("Error al cargar el artículo");
        }

        const articleData: BlogArticle = await response.json();
        setArticle(articleData);
        setFormData({
          title: articleData.title,
          slug: articleData.slug,
          excerpt: articleData.excerpt || "",
          content: articleData.content,
          featuredImage: articleData.featuredImage || "",
          metaTitle: articleData.metaTitle || "",
          metaDescription: articleData.metaDescription || "",
          isPublished: articleData.isPublished,
          category: articleData.category || "",
          tags: articleData.tags.join(", "),
          author: articleData.author,
          readingTime: articleData.readingTime?.toString() || "",
          isFeatured: articleData.isFeatured,
        });
      } catch (error) {
        console.error("Error fetching article:", error);
        alert("Error al cargar el artículo");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [params.id, router]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const tagsArray = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const response = await fetch(`/api/admin/blog/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          tags: tagsArray,
          readingTime: formData.readingTime
            ? parseInt(formData.readingTime)
            : null,
        }),
      });

      if (response.ok) {
        router.push("/admin/blog");
      } else {
        const error = await response.json();
        alert(error.error || "Error al actualizar el artículo");
      }
    } catch (error) {
      console.error("Error updating article:", error);
      alert("Error al actualizar el artículo");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p>Cargando artículo...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p>Artículo no encontrado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <h1 className="text-3xl font-bold">Editar artículo</h1>
        </div>

        {article.isPublished && (
          <Button
            variant="outline"
            onClick={() => window.open(`/blog/${article.slug}`, "_blank")}
          >
            <Eye className="w-4 h-4 mr-2" />
            Ver artículo
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulario principal */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Contenido</h2>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Título *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Título del artículo"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, slug: e.target.value }))
                    }
                    placeholder="url-del-articulo"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="excerpt">Resumen</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        excerpt: e.target.value,
                      }))
                    }
                    placeholder="Breve descripción del artículo"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="content">Contenido *</Label>
                  <RichTextEditor
                    value={formData.content}
                    onChange={(content) =>
                      setFormData((prev) => ({ ...prev, content }))
                    }
                    placeholder="Escribe el contenido del artículo..."
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">SEO</h2>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="metaTitle">Meta título</Label>
                  <Input
                    id="metaTitle"
                    value={formData.metaTitle}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        metaTitle: e.target.value,
                      }))
                    }
                    placeholder="Título para motores de búsqueda"
                  />
                </div>

                <div>
                  <Label htmlFor="metaDescription">Meta descripción</Label>
                  <Textarea
                    id="metaDescription"
                    value={formData.metaDescription}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        metaDescription: e.target.value,
                      }))
                    }
                    placeholder="Descripción para motores de búsqueda"
                    rows={3}
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Configuración</h2>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="category">Categoría</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, category: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="tags">Etiquetas</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, tags: e.target.value }))
                    }
                    placeholder="tag1, tag2, tag3"
                  />
                </div>

                <div>
                  <Label htmlFor="author">Autor</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        author: e.target.value,
                      }))
                    }
                    placeholder="Nombre del autor"
                  />
                </div>

                <div>
                  <Label htmlFor="readingTime">
                    Tiempo de lectura (minutos)
                  </Label>
                  <Input
                    id="readingTime"
                    type="number"
                    value={formData.readingTime}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        readingTime: e.target.value,
                      }))
                    }
                    placeholder="5"
                    min="1"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isPublished"
                      checked={formData.isPublished}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          isPublished: e.target.checked,
                        }))
                      }
                      className="rounded"
                      aria-label="Publicado"
                    />
                    <Label htmlFor="isPublished">Publicado</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isFeatured"
                      checked={formData.isFeatured}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          isFeatured: e.target.checked,
                        }))
                      }
                      className="rounded"
                      aria-label="Artículo destacado"
                    />
                    <Label htmlFor="isFeatured">Artículo destacado</Label>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Imagen destacada</h2>
              <ImageUpload
                value={formData.featuredImage}
                onChange={(url) =>
                  setFormData((prev) => ({ ...prev, featuredImage: url }))
                }
                folder="blog"
              />
            </Card>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end space-x-4 mt-8">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button type="submit" disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Guardando..." : "Guardar cambios"}
          </Button>
        </div>
      </form>
    </div>
  );
}
