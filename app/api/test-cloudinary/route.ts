import { NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Verificar variables de entorno
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET
    
    const envStatus = {
      CLOUDINARY_CLOUD_NAME: cloudName ? '✅ Configurada' : '❌ No configurada',
      CLOUDINARY_API_KEY: apiKey ? '✅ Configurada' : '❌ No configurada',
      CLOUDINARY_API_SECRET: apiSecret ? '✅ Configurada' : '❌ No configurada',
    }
    
    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json({
        success: false,
        error: 'Variables de entorno de Cloudinary no configuradas',
        envStatus,
        instructions: [
          'Ve a tu dashboard de Vercel',
          'Selecciona tu proyecto',
          'Ve a Settings > Environment Variables',
          'Agrega las siguientes variables:',
          '- CLOUDINARY_CLOUD_NAME: tu-cloud-name',
          '- CLOUDINARY_API_KEY: tu-api-key',
          '- CLOUDINARY_API_SECRET: tu-api-secret',
          'Haz un nuevo deploy después de agregar las variables'
        ]
      })
    }
    
    // Configurar Cloudinary
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    })
    
    // Probar la conexión
    const pingResult = await cloudinary.api.ping()
    
    return NextResponse.json({
      success: true,
      message: 'Cloudinary configurado correctamente',
      envStatus,
      pingResult,
      instructions: [
        'Cloudinary está funcionando correctamente',
        'Puedes subir imágenes desde el panel de administración'
      ]
    })
    
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      envStatus: {
        CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME ? '✅ Configurada' : '❌ No configurada',
        CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? '✅ Configurada' : '❌ No configurada',
        CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? '✅ Configurada' : '❌ No configurada',
      }
    }, { status: 500 })
  }
}
