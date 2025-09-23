# Autoescuelas.ar

Un directorio completo de escuelas de manejo en Argentina, construido con Next.js 14, TypeScript y Tailwind CSS.

## 🚀 Características

- **Búsqueda por ubicación**: Encuentra autoescuelas por provincia y ciudad
- **Geolocalización**: Usa tu ubicación actual para encontrar autoescuelas cercanas
- **Reseñas y calificaciones**: Sistema de calificaciones con reseñas de usuarios
- **Diseño responsive**: Optimizado para móviles, tablets y desktop
- **SEO optimizado**: Meta tags, JSON-LD y estructura semántica
- **Accesibilidad**: Cumple con estándares WCAG AA

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 14 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS + shadcn/ui
- **Base de datos**: PostgreSQL + Prisma ORM
- **Iconos**: Lucide React
- **Estado**: Zustand
- **Hosting**: Vercel (recomendado)

## 📦 Instalación

1. **Clona el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/autoescuelas-ar.git
   cd autoescuelas-ar
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Configura las variables de entorno**
   ```bash
   cp env.example .env.local
   ```
   
   Edita `.env.local` con tus credenciales:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/autoescuelas_ar"
   NEXTAUTH_SECRET="tu-secret-key"
   GOOGLE_ANALYTICS_ID="G-XXXXXXXXXX"
   ```

4. **Configura la base de datos**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Ejecuta el servidor de desarrollo**
   ```bash
   npm run dev
   ```

   Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🗄️ Base de Datos

El proyecto usa Prisma como ORM con PostgreSQL. El esquema incluye:

- **Provinces**: Provincias de Argentina
- **Cities**: Ciudades por provincia
- **DrivingSchools**: Autoescuelas con información completa
- **Reviews**: Reseñas y calificaciones
- **Courses**: Cursos ofrecidos por cada autoescuela

### Comandos de Prisma

```bash
# Generar cliente
npm run db:generate

# Aplicar cambios al esquema
npm run db:push

# Abrir Prisma Studio
npm run db:studio
```

## 🎨 Componentes

### Componentes Principales

- **Header**: Navegación principal con logo y enlaces
- **HeroLocation**: Sección hero con selector de ubicación
- **SchoolCard**: Tarjeta de autoescuela con información básica
- **TopRatedGrid**: Grid de autoescuelas mejor calificadas
- **FAQAccordion**: Preguntas frecuentes expandibles
- **ProvincesIndex**: Índice de provincias
- **Footer**: Pie de página con enlaces legales

### Componentes UI (shadcn/ui)

- Button, Card, Accordion, Select
- Todos los componentes son accesibles y personalizables

## 📱 Responsive Design

- **Mobile First**: Diseño optimizado para móviles
- **Breakpoints**: 
  - Mobile: < 640px
  - Tablet: ≥ 640px
  - Desktop: ≥ 1024px
- **Grids adaptativos**: 1 columna (mobile) → 2 columnas (tablet) → 4 columnas (desktop)

## 🔍 SEO y Performance

### SEO
- Meta tags optimizados
- JSON-LD para FAQ y LocalBusiness
- Estructura semántica HTML5
- URLs amigables

### Performance
- Next.js App Router con Server Components
- Optimización de imágenes con Next/Image
- Lazy loading de componentes
- ISR (Incremental Static Regeneration)

## 📊 Analytics

El proyecto incluye eventos de analytics para:

- `select_location`: Selección de ubicación
- `click_school_card`: Clic en tarjeta de autoescuela
- `cta_view_all`: Clic en botón "Ver todas"
- `faq_expand`: Expansión de FAQ
- `province_link_click`: Clic en enlace de provincia

## 🌍 Geolocalización

- Detección automática de ubicación
- Fallback a selección manual
- Geocodificación inversa (mock implementado)
- Manejo de errores y permisos

## 🚀 Deployment

### Vercel (Recomendado)

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno
3. Deploy automático en cada push

### Otras plataformas

El proyecto es compatible con cualquier plataforma que soporte Next.js:
- Netlify
- Railway
- DigitalOcean App Platform

## 📝 Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run start        # Servidor de producción
npm run lint         # Linter
npm run db:generate  # Generar cliente Prisma
npm run db:push      # Aplicar esquema a DB
npm run db:studio    # Abrir Prisma Studio
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Contacto

- **Email**: info@autoescuelas.ar
- **Website**: [autoescuelas.ar](https://autoescuelas.ar)

---

Hecho con ❤️ en Argentina 🇦🇷
