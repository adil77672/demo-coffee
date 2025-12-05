import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { join } from 'path'

dotenv.config({ path: join(process.cwd(), '.env.local') })

async function createTestUser() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl) {
    console.error('❌ NEXT_PUBLIC_SUPABASE_URL not found in .env.local')
    process.exit(1)
  }

  if (!supabaseServiceKey) {
    console.error('❌ SUPABASE_SERVICE_ROLE_KEY not found in .env.local')
    console.error('')
    console.error('To create test users programmatically, you need:')
    console.error('  SUPABASE_SERVICE_ROLE_KEY - Get from Supabase Dashboard > Settings > API')
    console.error('')
    console.error('📝 Steps to get Service Role Key:')
    console.error('  1. Go to: https://supabase.com/dashboard/project/_/settings/api')
    console.error('  2. Find "service_role" key (keep this secret!)')
    console.error('  3. Add to .env.local: SUPABASE_SERVICE_ROLE_KEY=your_key_here')
    console.error('')
    console.error('💡 Alternative: Use the signup page at /auth/signup to create accounts manually')
    console.error('   Visit: http://localhost:3000/auth/signup')
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  // Test admin credentials
  const adminEmail = 'admin@coffeeshop.demo'
  const adminPassword = 'Admin123!@#'
  const adminName = 'Admin User'
  const cafeName = 'Demo Coffee Shop'

  console.log('🔐 Creating test admin account...')
  console.log('')

  try {
    // Check if user already exists
    const { data: existingUsers } = await supabase.auth.admin.listUsers()
    const existingUser = existingUsers?.users?.find(u => u.email === adminEmail)

    if (existingUser) {
      console.log('ℹ️  Admin user already exists:')
      console.log(`   Email: ${adminEmail}`)
      console.log(`   Password: ${adminPassword}`)
      console.log('')
      console.log('✅ You can use these credentials to log in at /auth/login')
      return
    }

    // Create admin user
    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true, // Auto-confirm email for testing
      user_metadata: {
        name: adminName,
        cafe_name: cafeName,
      },
    })

    if (userError) {
      console.error('❌ Failed to create admin user:', userError.message)
      console.error('')
      console.error('💡 Troubleshooting:')
      console.error('  1. Verify SUPABASE_SERVICE_ROLE_KEY is correct in .env.local')
      console.error('  2. Make sure you copied the full key (it\'s very long)')
      console.error('  3. Restart the script after adding the key')
      console.error('')
      console.error('💡 Alternative: Use the signup page at /auth/signup')
      console.error('   Visit: http://localhost:3000/auth/signup')
      process.exit(1)
    }

    console.log('✅ Test admin account created successfully!')
    console.log('')
    console.log('📋 Admin Credentials:')
    console.log('   Email:    ' + adminEmail)
    console.log('   Password: ' + adminPassword)
    console.log('')
    console.log('🌐 Login at: http://localhost:3000/auth/login')
    console.log('   (Will redirect to /admin after login)')
    console.log('')
    console.log('👤 Regular User:')
    console.log('   Use the signup page at /auth/signup to create regular user accounts')
    console.log('   Or create accounts manually in Supabase Dashboard > Authentication')

  } catch (error: any) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

createTestUser()

