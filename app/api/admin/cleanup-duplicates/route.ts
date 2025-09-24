import { NextRequest, NextResponse } from 'next/server'
import { execSync } from 'child_process'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    console.log('🧹 Iniciando limpieza de autoescuelas duplicadas...')
    
    // Ejecutar el script de limpieza de duplicados
    const output = execSync('npx tsx scripts/cleanup-duplicate-schools.ts', { encoding: 'utf-8' })

    return NextResponse.json({
      success: true,
      message: 'Limpieza de duplicados ejecutada correctamente',
      output: output.split('\n'), // Dividir la salida en líneas para mejor lectura
    })
  } catch (error: any) {
    console.error('Error al ejecutar la limpieza de duplicados:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Error al ejecutar la limpieza de duplicados' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Verificando autoescuelas duplicadas...')
    
    // Ejecutar el script de verificación de duplicados
    const output = execSync('npx tsx scripts/check-duplicate-schools.ts', { encoding: 'utf-8' })

    return NextResponse.json({
      success: true,
      message: 'Verificación de duplicados ejecutada correctamente',
      output: output.split('\n'), // Dividir la salida en líneas para mejor lectura
    })
  } catch (error: any) {
    console.error('Error al ejecutar la verificación de duplicados:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Error al ejecutar la verificación de duplicados' },
      { status: 500 }
    )
  }
}
