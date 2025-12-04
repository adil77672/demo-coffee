import { db, shops, coffees, pastries, pairingRules } from '@/lib/db'
import * as dotenv from 'dotenv'
import { join } from 'path'

dotenv.config({ path: join(process.cwd(), '.env.local') })

async function seed() {
  try {
    console.log('🌱 Seeding database with sample data...')

    // Insert sample shop (Gloria Jeans)
    const shopResult = await db.insert(shops).values({
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'Gloria Jeans',
      slug: 'gloria-jeans-p88f',
      qrCode: 'gloria-jeans-p88f',
      settings: {},
    }).onConflictDoNothing().returning()

    const shopId = shopResult[0]?.id || '550e8400-e29b-41d4-a716-446655440000'

    if (shopResult.length > 0) {
      console.log('✅ Sample shop created: Gloria Jeans')
    } else {
      console.log('ℹ️  Sample shop already exists')
    }

    // Insert sample coffees
    const coffeeData = [
      {
        shopId,
        name: 'Espresso',
        roast: 'Dark',
        origin: 'Colombia',
        tastingNotes: ['bold', 'chocolate', 'caramel'],
        description: 'A rich and intense espresso with notes of dark chocolate and caramel.',
        image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400',
        price: '4.50',
        active: true,
      },
      {
        shopId,
        name: 'Cappuccino',
        roast: 'Medium',
        origin: 'Ethiopia',
        tastingNotes: ['smooth', 'creamy', 'nutty'],
        description: 'A classic cappuccino with a perfect balance of espresso and steamed milk.',
        image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400',
        price: '5.00',
        active: true,
      },
      {
        shopId,
        name: 'Latte',
        roast: 'Medium',
        origin: 'Brazil',
        tastingNotes: ['sweet', 'vanilla', 'hazelnut'],
        description: 'A smooth and creamy latte with hints of vanilla and hazelnut.',
        image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400',
        price: '5.50',
        active: true,
      },
      {
        shopId,
        name: 'Americano',
        roast: 'Light',
        origin: 'Costa Rica',
        tastingNotes: ['bright', 'citrus', 'floral'],
        description: 'A smooth Americano with bright citrus notes and a floral finish.',
        image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400',
        price: '4.00',
        active: true,
      },
    ]

    const insertedCoffees = await db.insert(coffees).values(coffeeData).returning()
    console.log(`✅ Created ${insertedCoffees.length} coffees`)

    // Insert sample pastries
    const pastryData = [
      {
        shopId,
        name: 'Chocolate Croissant',
        notes: 'Buttery and flaky with rich chocolate filling',
        flavorProfile: 'sweet, buttery, chocolatey',
        image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400',
        price: '3.50',
        active: true,
      },
      {
        shopId,
        name: 'Blueberry Muffin',
        notes: 'Fresh blueberries in a tender, moist muffin',
        flavorProfile: 'sweet, fruity, tender',
        image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400',
        price: '3.00',
        active: true,
      },
      {
        shopId,
        name: 'Almond Biscotti',
        notes: 'Crisp Italian cookies perfect for dipping',
        flavorProfile: 'nutty, crunchy, slightly sweet',
        image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400',
        price: '2.50',
        active: true,
      },
      {
        shopId,
        name: 'Cinnamon Roll',
        notes: 'Warm, gooey cinnamon roll with cream cheese frosting',
        flavorProfile: 'sweet, spicy, rich',
        image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400',
        price: '4.00',
        active: true,
      },
    ]

    const insertedPastries = await db.insert(pastries).values(pastryData).returning()
    console.log(`✅ Created ${insertedPastries.length} pastries`)

    // Create pairing rules
    const espressoId = insertedCoffees.find(c => c.name === 'Espresso')?.id
    const cappuccinoId = insertedCoffees.find(c => c.name === 'Cappuccino')?.id
    const latteId = insertedCoffees.find(c => c.name === 'Latte')?.id
    const americanoId = insertedCoffees.find(c => c.name === 'Americano')?.id

    const chocolateCroissantId = insertedPastries.find(p => p.name === 'Chocolate Croissant')?.id
    const blueberryMuffinId = insertedPastries.find(p => p.name === 'Blueberry Muffin')?.id
    const almondBiscottiId = insertedPastries.find(p => p.name === 'Almond Biscotti')?.id
    const cinnamonRollId = insertedPastries.find(p => p.name === 'Cinnamon Roll')?.id

    const pairingData = [
      // Espresso pairings
      {
        shopId,
        coffeeId: espressoId!,
        pastryId: chocolateCroissantId!,
        matchScore: 95,
        reasoning: 'The bold intensity of espresso perfectly complements the rich chocolate flavor of the croissant.',
        active: true,
      },
      {
        shopId,
        coffeeId: espressoId!,
        pastryId: almondBiscottiId!,
        matchScore: 90,
        reasoning: 'Classic Italian pairing - the nutty biscotti enhances the espresso\'s bold character.',
        active: true,
      },
      // Cappuccino pairings
      {
        shopId,
        coffeeId: cappuccinoId!,
        pastryId: blueberryMuffinId!,
        matchScore: 88,
        reasoning: 'The creamy cappuccino balances beautifully with the fruity sweetness of the blueberry muffin.',
        active: true,
      },
      {
        shopId,
        coffeeId: cappuccinoId!,
        pastryId: cinnamonRollId!,
        matchScore: 85,
        reasoning: 'Warm spices in the cinnamon roll complement the smooth, creamy cappuccino.',
        active: true,
      },
      // Latte pairings
      {
        shopId,
        coffeeId: latteId!,
        pastryId: chocolateCroissantId!,
        matchScore: 92,
        reasoning: 'The sweet, creamy latte pairs wonderfully with the buttery chocolate croissant.',
        active: true,
      },
      {
        shopId,
        coffeeId: latteId!,
        pastryId: cinnamonRollId!,
        matchScore: 90,
        reasoning: 'A perfect match - the vanilla notes in the latte enhance the cinnamon roll\'s sweetness.',
        active: true,
      },
      // Americano pairings
      {
        shopId,
        coffeeId: americanoId!,
        pastryId: blueberryMuffinId!,
        matchScore: 87,
        reasoning: 'The bright, citrusy Americano cuts through the sweetness of the blueberry muffin.',
        active: true,
      },
      {
        shopId,
        coffeeId: americanoId!,
        pastryId: almondBiscottiId!,
        matchScore: 82,
        reasoning: 'Light and bright Americano pairs well with the nutty, crunchy biscotti.',
        active: true,
      },
    ]

    const insertedPairings = await db.insert(pairingRules).values(pairingData).returning()
    console.log(`✅ Created ${insertedPairings.length} pairing rules`)

    console.log('')
    console.log('✅ Seeding complete!')
    console.log('')
    console.log('📊 Summary:')
    console.log(`   - 1 shop (Gloria Jeans)`)
    console.log(`   - ${insertedCoffees.length} coffees`)
    console.log(`   - ${insertedPastries.length} pastries`)
    console.log(`   - ${insertedPairings.length} pairings`)
    console.log('')
    console.log('🌐 Visit: http://localhost:3000/shop/gloria-jeans-p88f')
  } catch (error: any) {
    console.error('❌ Seeding failed:', error.message)
    if (error.code) {
      console.error(`   Error code: ${error.code}`)
    }
    process.exit(1)
  } finally {
    process.exit(0)
  }
}

seed()
