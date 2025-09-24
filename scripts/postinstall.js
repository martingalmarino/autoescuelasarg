#!/usr/bin/env node

const { execSync } = require('child_process')

console.log('🚀 Running post-install setup...')

try {
  // Generate Prisma client
  console.log('📋 Generating Prisma client...')
  execSync('npx prisma generate', { stdio: 'inherit' })
  
  // Push database schema (only if DATABASE_URL is configured)
  if (process.env.DATABASE_URL && 
      process.env.DATABASE_URL.trim() !== '' && 
      process.env.DATABASE_URL.includes('postgresql://') &&
      !process.env.DATABASE_URL.includes('[YOUR-PASSWORD]')) {
    console.log('🗄️ Pushing database schema...')
    execSync('npx prisma db push', { stdio: 'inherit' })
  } else {
    console.log('⚠️ DATABASE_URL not configured or invalid, skipping database setup')
    console.log('   DATABASE_URL:', process.env.DATABASE_URL ? 'Set but invalid' : 'Not set')
  }
  
  // Seed database (only if DATABASE_URL is configured)
  if (process.env.DATABASE_URL && 
      process.env.DATABASE_URL.trim() !== '' && 
      process.env.DATABASE_URL.includes('postgresql://') &&
      !process.env.DATABASE_URL.includes('[YOUR-PASSWORD]')) {
    console.log('🌱 Seeding database...')
    execSync('npm run db:seed', { stdio: 'inherit' })
    
    // Normalize slugs after seeding
    console.log('🔄 Normalizing slugs...')
    try {
      execSync('npx tsx scripts/fix-cordoba-slug.ts', { stdio: 'inherit' })
      console.log('✅ Slug normalization completed!')
    } catch (error) {
      console.error('❌ Slug normalization failed:', error.message)
    }
    
    // Clean up inactive schools after seeding
    console.log('🧹 Cleaning up inactive schools...')
    try {
      execSync('npx tsx scripts/cleanup-seeding.ts', { stdio: 'inherit' })
      console.log('✅ Cleanup completed!')
    } catch (error) {
      console.error('❌ Cleanup failed:', error.message)
    }
  } else {
    console.log('⚠️ DATABASE_URL not configured or invalid, skipping database seeding')
  }
  
  console.log('✅ Post-install setup completed!')
} catch (error) {
  console.error('❌ Error in post-install setup:', error.message)
  // Don't fail the build if seeding fails
  console.log('⚠️ Continuing build despite seeding error...')
}
