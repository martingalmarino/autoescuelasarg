const { execSync } = require('child_process')

console.log('🚀 Setting up Neon PostgreSQL database...')

try {
  // Generate Prisma client
  console.log('📋 Generating Prisma client...')
  execSync('npx prisma generate', { stdio: 'inherit' })
  
  // Push database schema to Neon
  console.log('🗄️ Pushing database schema to Neon...')
  execSync('npx prisma db push', { stdio: 'inherit' })
  
  // Seed database with initial data
  console.log('🌱 Seeding database with initial data...')
  execSync('npm run db:seed', { stdio: 'inherit' })
  
  console.log('✅ Neon database setup completed successfully!')
  console.log('🎉 Your database is ready to use!')
  
} catch (error) {
  console.error('❌ Error setting up Neon database:', error.message)
  process.exit(1)
}
