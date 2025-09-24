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
    console.log('☁️ Subiendo a Cloudinary:', {
      folder,
      publicId,
      fileType: typeof file,
      fileSize: file instanceof Buffer ? file.length : (file as File).size
    })

    // Convertir Buffer a stream para Cloudinary
    let uploadData: any
    if (file instanceof Buffer) {
      // Para Buffer, usar upload_stream
      uploadData = new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder,
            public_id: publicId,
            resource_type: 'auto',
            quality: 'auto',
            fetch_format: 'auto',
          },
          (error, result) => {
            if (error) reject(error)
            else resolve(result)
          }
        )
        uploadStream.end(file)
      })
    } else {
      // Para File, usar upload normal
      uploadData = cloudinary.uploader.upload(
        file as any,
        {
          folder,
          public_id: publicId,
          resource_type: 'auto',
          quality: 'auto',
          fetch_format: 'auto',
        }
      )
    }

    const result = await uploadData
    
    console.log('✅ Cloudinary upload exitoso:', {
      url: result.secure_url,
      publicId: result.public_id,
      bytes: result.bytes
    })
    
    return {
      url: result.secure_url,
      publicId: result.public_id,
    }
  } catch (error: any) {
    console.error('❌ Error detallado en Cloudinary:', {
      message: error.message,
      http_code: error.http_code,
      name: error.name,
      error: error.error
    })
    throw new Error(`Error al subir la imagen: ${error.message}`)
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
