import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center px-4">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Artículo no encontrado
          </h2>
          <p className="text-gray-600 mb-8">
            El artículo que estás buscando no existe o ha sido eliminado.
          </p>
        </div>

        <div className="space-y-4">
          <Link href="/blog">
            <Button className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al blog
            </Button>
          </Link>

          <Link href="/">
            <Button variant="outline" className="w-full">
              <Home className="w-4 h-4 mr-2" />
              Ir al inicio
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
