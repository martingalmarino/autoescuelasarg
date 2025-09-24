import { NextRequest, NextResponse } from 'next/server'
import { uploadImage } from '@/lib/cloudinary'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    console.log('🧪 Iniciando prueba de subida...')
    
    const formData = await request.formData()
    const file = formData.get('file') as File
    const folder = formData.get('folder') as string || 'test'

    console.log('📋 Datos de prueba:', {
      fileName: file?.name,
      fileSize: file?.size,
      fileType: file?.type,
      folder
    })

    if (!file) {
      return NextResponse.json({
        success: false,
        error: 'No se proporcionó ningún archivo'
      }, { status: 400 })
    }

    // Validar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({
        success: false,
        error: `Tipo de archivo no permitido: ${file.type}. Solo se permiten JPG, PNG y WebP`
      }, { status: 400 })
    }

    // Validar tamaño (máximo 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({
        success: false,
        error: `Archivo demasiado grande: ${file.size} bytes. Máximo 5MB`
      }, { status: 400 })
    }

    // Convertir File a Buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Subir a Cloudinary
    const result = await uploadImage(buffer, folder)

    return NextResponse.json({
      success: true,
      message: 'Prueba de subida exitosa',
      data: {
        url: result.url,
        publicId: result.publicId,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type
      }
    })
    
  } catch (error: any) {
    console.error('❌ Error en prueba de subida:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      details: {
        name: error.name,
        stack: error.stack
      }
    }, { status: 500 })
  }
}
