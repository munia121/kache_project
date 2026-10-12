import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const connectionString = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

interface ICategorySeedItem {
  name: string;
  slug: string;
  icon?: string;
  description?: string;
  order: number;
}

const initialCategories: ICategorySeedItem[] = [
  {
    name: 'Mobiles & Gadgets',
    slug: 'mobiles-gadgets',
    icon: 'smartphone',
    description: 'Smartphones, feature phones, tablets, chargers, power banks, and accessories.',
    order: 1,
  },
  {
    name: 'Electronics & Home Appliances',
    slug: 'electronics',
    icon: 'tv',
    description: 'TVs, refrigerators, ACs, washing machines, computers, laptops, and home electronics.',
    order: 2,
  },
  {
    name: 'Vehicles & Bikes',
    slug: 'vehicles',
    icon: 'bike',
    description: 'Motorcycles, scooters, bicycles, cars, and vehicle spare parts.',
    order: 3,
  },
  {
    name: 'Property & Rentals',
    slug: 'property-rentals',
    icon: 'home',
    description: 'Apartments, flats, sublets, bachelor/family home rentals, land, and commercial spaces.',
    order: 4,
  },
  {
    name: 'Fashion & Lifestyle',
    slug: 'fashion',
    icon: 'shirt',
    description: 'Trendy clothing for men, women, and kids, shoes, watches, bags, and lifestyle items.',
    order: 5,
  },
  {
    name: 'Home & Furniture',
    slug: 'furniture',
    icon: 'armchair',
    description: 'Beds, wardrobes, sofas, dining tables, office furniture, and home decor.',
    order: 6,
  },
  {
    name: 'Daily Essentials & Groceries',
    slug: 'essentials',
    icon: 'shopping-cart',
    description: 'Groceries, fresh fruits, vegetables, rice, lentils, oil, and daily essential goods.',
    order: 7,
  },
  {
    name: 'Local Services',
    slug: 'services',
    icon: 'wrench',
    description: 'AC & fridge repair, electricians, plumbers, home cleaning, and other local services.',
    order: 8,
  },
];

async function seedCategories(): Promise<void> {
  console.log('🌱 Starting category seeding for "Kache" local marketplace...');

  for (const category of initialCategories) {
    const upsertedCategory = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        icon: category.icon,
        description: category.description,
        order: category.order,
        isActive: true,
      },
      create: {
        name: category.name,
        slug: category.slug,
        icon: category.icon,
        description: category.description,
        order: category.order,
        isActive: true,
      },
    });

    console.log(
      `✅ Upserted Category: [${upsertedCategory.slug}] -> ${upsertedCategory.name} (ID: ${upsertedCategory.id})`
    );
  }

  console.log('✨ Categories seeded successfully!');
}

async function main(): Promise<void> {
  try {
    await seedCategories();
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
