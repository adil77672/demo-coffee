import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as dotenv from 'dotenv'
import { join } from 'path'
import * as schema from './schema'

dotenv.config({ path: join(process.cwd(), '.env.local') })

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL || ''

if (!connectionString) {
  throw new Error('DATABASE_URL or DIRECT_URL must be set in .env.local')
}

const pool = new Pool({
  connectionString,
})

export const db = drizzle(pool, { schema })

// Export schema for use in other files
export * from './schema'

