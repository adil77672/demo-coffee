// Simple JavaScript migration script (alternative to TypeScript version)
const { Client } = require('pg')
const fs = require('fs')
const path = require('path')
require('dotenv').config({ path: path.join(process.cwd(), '.env.local') })

async function runMigration() {
  const databaseUrl = process.env.DIRECT_URL || process.env.DATABASE_URL

  if (!databaseUrl) {
    console.error('❌ Error: DATABASE_URL or DIRECT_URL not found in .env.local')
    console.error('Please set DIRECT_URL in your .env.local file')
    process.exit(1)
  }

  console.log('📦 Starting database migration...')
  console.log('📖 Reading schema file...')

  // Read the schema file
  const schemaPath = path.join(process.cwd(), 'supabase', 'schema.sql')
  let schema

  try {
    schema = fs.readFileSync(schemaPath, 'utf-8')
    console.log('✅ Schema file loaded')
  } catch (error) {
    console.error('❌ Error reading schema file:', error.message)
    process.exit(1)
  }

  // Create PostgreSQL client
  const client = new Client({
    connectionString: databaseUrl,
  })

  try {
    console.log('🔌 Connecting to database...')
    await client.connect()
    console.log('✅ Connected to database')

    console.log('🚀 Running migration...')
    
    // Execute the schema
    await client.query(schema)
    
    console.log('✅ Migration completed successfully!')
    console.log('')
    console.log('📊 Verifying tables...')
    
    // Verify tables were created
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `)

    console.log('✅ Tables created:')
    result.rows.forEach((row) => {
      console.log(`   - ${row.table_name}`)
    })

    // Check if sample shop was created
    const shopResult = await client.query('SELECT name, slug FROM shops LIMIT 1')
    if (shopResult.rows.length > 0) {
      console.log('')
      console.log('✅ Sample shop created:')
      console.log(`   - ${shopResult.rows[0].name} (${shopResult.rows[0].slug})`)
    }

  } catch (error) {
    console.error('❌ Migration failed:')
    console.error(error.message)
    if (error.code) {
      console.error(`   Error code: ${error.code}`)
    }
    process.exit(1)
  } finally {
    await client.end()
    console.log('')
    console.log('🔌 Database connection closed')
  }
}

// Run the migration
runMigration()
  .then(() => {
    console.log('')
    console.log('🎉 Migration complete! You can now start your dev server.')
    console.log('   Run: npm run dev')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Unexpected error:', error)
    process.exit(1)
  })

