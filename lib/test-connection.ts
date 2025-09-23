// Script para probar la conexión con Supabase
import { supabase } from './supabase'

export async function testSupabaseConnection() {
  try {
    console.log('🔍 Testing Supabase connection...')
    
    // Test básico de conexión
    const { data, error } = await supabase
      .from('provinces')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('❌ Error connecting to Supabase:', error)
      return false
    }
    
    console.log('✅ Supabase connection successful!')
    return true
  } catch (error) {
    console.error('❌ Connection test failed:', error)
    return false
  }
}

// Función para verificar si las variables de entorno están configuradas
export function checkEnvironmentVariables() {
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'DATABASE_URL'
  ]
  
  const missing = requiredVars.filter(varName => !process.env[varName])
  
  if (missing.length > 0) {
    console.error('❌ Missing environment variables:', missing)
    return false
  }
  
  console.log('✅ All environment variables are set')
  return true
}
