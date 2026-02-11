import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { resolve } from 'path'

// Parse .env manually
const envPath = resolve(process.cwd(), '.env')
const envContent = readFileSync(envPath, 'utf-8')
const envVars: Record<string, string> = {}
for (const line of envContent.split('\n')) {
  const match = line.match(/^([^#=]+)=(.*)$/)
  if (match) envVars[match[1].trim()] = match[2].trim()
}

const supabaseUrl = envVars['NEXT_PUBLIC_SUPABASE_URL']
const serviceRoleKey = envVars['SUPABASE_SERVICE_ROLE_KEY']

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey)

const events = [
  {
    title: "Duke × UNC: The Day After Valentine's",
    description:
      "Valentine's Day is overrated. Celebrate the day after with us instead. Blue Devils and Tar Heels unite for one night. Bring your rivalry energy and your best self. Free drinks for the first 50.",
    date: new Date('2025-02-15T21:00:00-05:00').toISOString(), // Sat Feb 15, 9PM EST
    location: 'Lower East Side, NYC',
    price: 0,
    image_url: null,
  },
  {
    title: 'Anchor Spring Mixer',
    description:
      "Winter's over. Come meet the people you'll be going on dates with all spring. Live DJ, good drinks, and zero swiping required. This is how you meet someone.",
    date: new Date('2025-03-22T20:00:00-04:00').toISOString(), // Sat Mar 22, 8PM EDT
    location: 'Williamsburg, Brooklyn',
    price: 0,
    image_url: null,
  },
]

async function seed() {
  console.log('Deleting all existing events...')
  const { error: deleteError } = await supabase.from('events').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  if (deleteError) {
    console.error('Delete error:', deleteError.message)
    // Continue anyway — table might be empty
  }

  console.log('Inserting 2 events...')
  const { data, error } = await supabase.from('events').insert(events).select()

  if (error) {
    console.error('Insert error:', error.message)
    process.exit(1)
  }

  console.log('✅ Seeded events:')
  for (const e of data!) {
    console.log(`  - ${e.title} (id: ${e.id})`)
  }
}

seed()
