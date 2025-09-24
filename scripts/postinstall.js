#!/usr/bin/env node

const { execSync } = require('child_process')

console.log('🚀 Running post-install setup...')

try {
  // Generate Prisma client
  console.log('📋 Generating Prisma client...')
  execSync('npx prisma generate', { stdio: 'inherit' })
  
  // Push database schema (only if DATABASE_URL is configured)
  if (process.env.DATABASE_URL && process.env.DATABASE_URL.includes('postgresql://')) {
    console.log('🗄️ Pushing database schema...')
    execSync('npx prisma db push', { stdio: 'inherit' })
  } else {
    console.log('⚠️ DATABASE_URL not configured, skipping database setup')
  }
  
  // Seed database (only if DATABASE_URL is configured)
  if (process.env.DATABASE_URL && process.env.DATABASE_URL.includes('postgresql://')) {
    console.log('🌱 Seeding database...')
    execSync('npm run db:seed', { stdio: 'inherit' })
  } else {
    console.log('⚠️ DATABASE_URL not configured, skipping database seeding')
  }
  
  console.log('✅ Post-install setup completed!')
} catch (error) {
  console.error('❌ Error in post-install setup:', error.message)
  // Don't fail the build if seeding fails
  console.log('⚠️ Continuing build despite seeding error...')
}
