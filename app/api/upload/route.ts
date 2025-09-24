import { NextRequest, NextResponse } from 'next/server'
import { uploadImage } from '@/lib/cloudinary'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    console.log('📤 Iniciando subida de imagen...')
    
    const formData = await request.formData()
    const file = formData.get('file') as File
    const folder = formData.get('folder') as string || 'autoescuelas'

    console.log('📋 Datos recibidos:', {
      fileName: file?.name,
      fileSize: file?.size,
      fileType: file?.type,
      folder
    })

    if (!file) {
      console.log('❌ No se proporcionó ningún archivo')
      return NextResponse.json(
        { success: false, error: 'No se proporcionó ningún archivo' },
        { status: 400 }
      )
    }

    // Validar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      console.log('❌ Tipo de archivo no permitido:', file.type)
      return NextResponse.json(
        { success: false, error: 'Tipo de archivo no permitido. Solo se permiten JPG, PNG y WebP' },
        { status: 400 }
      )
    }

    // Validar tamaño (máximo 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      console.log('❌ Archivo demasiado grande:', file.size, 'bytes')
      return NextResponse.json(
        { success: false, error: 'El archivo es demasiado grande. Máximo 5MB' },
        { status: 400 }
      )
    }

    console.log('✅ Validaciones pasadas, convirtiendo archivo...')

    // Convertir File a Buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    console.log('✅ Archivo convertido a buffer, subiendo a Cloudinary...')

    // Subir a Cloudinary
    const result = await uploadImage(buffer, folder)

    console.log('✅ Imagen subida exitosamente:', {
      url: result.url,
      publicId: result.publicId
    })

    return NextResponse.json({
      success: true,
      url: result.url,
      publicId: result.publicId,
    })
  } catch (error: any) {
    console.error('❌ Error detallado al subir archivo:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    })
    return NextResponse.json(
      { success: false, error: error.message || 'Error al subir el archivo' },
      { status: 500 }
    )
  }
}
