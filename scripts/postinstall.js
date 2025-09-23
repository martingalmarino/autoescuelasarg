#!/usr/bin/env node

const { execSync } = require('child_process')

console.log('🚀 Running post-install setup...')

try {
  // Generate Prisma client
  console.log('📋 Generating Prisma client...')
  execSync('npx prisma generate', { stdio: 'inherit' })
  
  // Push database schema
  console.log('🗄️ Pushing database schema...')
  execSync('npx prisma db push', { stdio: 'inherit' })
  
  // Seed database
  console.log('🌱 Seeding database...')
  execSync('npm run db:seed', { stdio: 'inherit' })
  
  console.log('✅ Post-install setup completed!')
} catch (error) {
  console.error('❌ Error in post-install setup:', error.message)
  // Don't fail the build if seeding fails
  console.log('⚠️ Continuing build despite seeding error...')
}
