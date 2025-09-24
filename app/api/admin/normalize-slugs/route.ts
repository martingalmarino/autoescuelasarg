import { NextRequest, NextResponse } from 'next/server'
import { execSync } from 'child_process'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Ejecutar el script de normalización de slugs
    const output = execSync('npx tsx scripts/normalize-slugs.ts', { encoding: 'utf-8' })

    return NextResponse.json({
      success: true,
      message: 'Normalización de slugs ejecutada correctamente',
      output: output.split('\n'), // Dividir la salida en líneas para mejor lectura
    })
  } catch (error: any) {
    console.error('Error al ejecutar la normalización de slugs:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Error al ejecutar la normalización de slugs' },
      { status: 500 }
    )
  }
}
