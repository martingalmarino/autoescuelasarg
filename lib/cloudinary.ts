import { v2 as cloudinary } from 'cloudinary'

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export { cloudinary }

// Función para subir imagen
export async function uploadImage(
  file: File | Buffer,
  folder: string = 'autoescuelas',
  publicId?: string
): Promise<{ url: string; publicId: string }> {
  try {
    const result = await cloudinary.uploader.upload(
      file as any,
      {
        folder,
        public_id: publicId,
        resource_type: 'auto',
        quality: 'auto',
        fetch_format: 'auto',
      }
    )
    
    return {
      url: result.secure_url,
      publicId: result.public_id,
    }
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error)
    throw new Error('Error al subir la imagen')
  }
}

// Función para eliminar imagen
export async function deleteImage(publicId: string): Promise<boolean> {
  try {
    await cloudinary.uploader.destroy(publicId)
    return true
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error)
    return false
  }
}

// Función para generar URL de imagen optimizada
export function getOptimizedImageUrl(
  publicId: string,
  options: {
    width?: number
    height?: number
    quality?: string | number
    format?: string
    crop?: string
  } = {}
): string {
  const {
    width,
    height,
    quality = 'auto',
    format = 'auto',
    crop = 'fill',
  } = options

  return cloudinary.url(publicId, {
    width,
    height,
    quality,
    format,
    crop,
    secure: true,
  })
}
