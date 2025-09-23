#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function setupDatabase() {
  console.log('🚀 Setting up database...')
  
  try {
    // Test connection
    console.log('🔍 Testing database connection...')
    await prisma.$connect()
    console.log('✅ Database connection successful!')
    
    // Push schema
    console.log('📋 Pushing database schema...')
    const { execSync } = require('child_process')
    execSync('npx prisma db push', { stdio: 'inherit' })
    console.log('✅ Database schema pushed!')
    
    // Seed database
    console.log('🌱 Seeding database...')
    execSync('npm run db:seed', { stdio: 'inherit' })
    console.log('✅ Database seeded!')
    
    // Get stats
    const [provincesCount, schoolsCount, citiesCount] = await Promise.all([
      prisma.province.count(),
      prisma.drivingSchool.count(),
      prisma.city.count()
    ])
    
    console.log('\n📊 Database Statistics:')
    console.log(`   Provinces: ${provincesCount}`)
    console.log(`   Cities: ${citiesCount}`)
    console.log(`   Schools: ${schoolsCount}`)
    
    console.log('\n🎉 Database setup completed successfully!')
    
  } catch (error) {
    console.error('❌ Error setting up database:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

setupDatabase()
