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

interface IAreaSeedItem {
  name: string;
  bnName: string;
  slug: string;
}

interface IDistrictSeedItem {
  name: string;
  bnName: string;
  slug: string;
  areas: IAreaSeedItem[];
}

interface IDivisionSeedItem {
  name: string;
  bnName: string;
  slug: string;
  districts: IDistrictSeedItem[];
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

const initialLocations: IDivisionSeedItem[] = [
  {
    name: 'Dhaka',
    bnName: 'ঢাকা',
    slug: 'dhaka',
    districts: [
      {
        name: 'Dhaka',
        bnName: 'ঢাকা',
        slug: 'dhaka',
        areas: [
          { name: 'Dhanmondi', bnName: 'ধানমন্ডি', slug: 'dhanmondi' },
          { name: 'Mirpur', bnName: 'মিরপুর', slug: 'mirpur' },
          { name: 'Banani', bnName: 'বনানী', slug: 'banani' },
          { name: 'Uttara', bnName: 'উত্তরা', slug: 'uttara' },
          { name: 'Gulshan', bnName: 'গুলশান', slug: 'gulshan' },
          { name: 'Mohammadpur', bnName: 'মোহাম্মদপুর', slug: 'mohammadpur' },
          { name: 'Badda', bnName: 'বাড্ডা', slug: 'badda' },
          { name: 'Motijheel', bnName: 'মতিঝিল', slug: 'motijheel' },
          { name: 'Old Dhaka', bnName: 'পুরান ঢাকা', slug: 'old-dhaka' },
          { name: 'Bashundhara R/A', bnName: 'বসুন্ধরা আবাসিক এলাকা', slug: 'bashundhara-ra' },
        ],
      },
      {
        name: 'Gazipur',
        bnName: 'গাজীপুর',
        slug: 'gazipur',
        areas: [
          { name: 'Joydebpur', bnName: 'জয়দেবপুর', slug: 'joydebpur' },
          { name: 'Tongi', bnName: 'টঙ্গী', slug: 'tongi' },
          { name: 'Konabari', bnName: 'কোনাবাড়ী', slug: 'konabari' },
          { name: 'Chowrasta', bnName: 'চৌরাস্তা', slug: 'chowrasta' },
        ],
      },
      {
        name: 'Narayanganj',
        bnName: 'নারায়ণগঞ্জ',
        slug: 'narayanganj',
        areas: [
          { name: 'Chashara', bnName: 'চাষাঢ়া', slug: 'chashara' },
          { name: 'Siddhirganj', bnName: 'সিদ্ধিরগঞ্জ', slug: 'siddhirganj' },
          { name: 'Fatullah', bnName: 'ফতুল্লা', slug: 'fatullah' },
        ],
      },
    ],
  },
  {
    name: 'Chattogram',
    bnName: 'চট্টগ্রাম',
    slug: 'chattogram',
    districts: [
      {
        name: 'Chattogram',
        bnName: 'চট্টগ্রাম',
        slug: 'chattogram',
        areas: [
          { name: 'Agrabad', bnName: 'আগ্রাবাদ', slug: 'agrabad' },
          { name: 'GEC Circle', bnName: 'জিইসি মোড়', slug: 'gec-circle' },
          { name: 'Nasirabad', bnName: 'নাসিরাবাদ', slug: 'nasirabad' },
          { name: 'Halishahar', bnName: 'হালিশহর', slug: 'halishahar' },
          { name: 'Panchlaish', bnName: 'পাঁচলাইশ', slug: 'panchlaish' },
          { name: 'Chawkbazar', bnName: 'চকবাজার', slug: 'chawkbazar' },
          { name: 'Khulshi', bnName: 'খুলশী', slug: 'khulshi' },
        ],
      },
      {
        name: "Cox's Bazar",
        bnName: 'কক্সবাজার',
        slug: 'coxs-bazar',
        areas: [
          { name: 'Kolatoli', bnName: 'কলাতলী', slug: 'kolatoli' },
          { name: 'Laboni Point', bnName: 'লাবণী পয়েন্ট', slug: 'laboni-point' },
          { name: 'Teknaf', bnName: 'টেকনাফ', slug: 'teknaf' },
        ],
      },
      {
        name: 'Cumilla',
        bnName: 'কুমিল্লা',
        slug: 'cumilla',
        areas: [
          { name: 'Kandirpar', bnName: 'কান্দিরপাড়', slug: 'kandirpar' },
          { name: 'Kotbari', bnName: 'কোটবাড়ী', slug: 'kotbari' },
          { name: 'Shashongachha', bnName: 'শাসনগাছা', slug: 'shashongachha' },
        ],
      },
    ],
  },
  {
    name: 'Rajshahi',
    bnName: 'রাজশাহী',
    slug: 'rajshahi',
    districts: [
      {
        name: 'Rajshahi',
        bnName: 'রাজশাহী',
        slug: 'rajshahi',
        areas: [
          { name: 'Shaheb Bazar', bnName: 'সাহেব বাজার', slug: 'shaheb-bazar' },
          { name: 'Motihar', bnName: 'মতিহার', slug: 'motihar' },
          { name: 'Boalia', bnName: 'বোয়ালিয়া', slug: 'boalia' },
          { name: 'Kazla', bnName: 'কাজলা', slug: 'kazla' },
          { name: 'Shirothoil', bnName: 'শিরোইল', slug: 'shiroil' },
        ],
      },
      {
        name: 'Bogura',
        bnName: 'বগুড়া',
        slug: 'bogura',
        areas: [
          { name: 'Satmatha', bnName: 'সাতমাথা', slug: 'satmatha' },
          { name: 'Sherpur', bnName: 'শেরপুর', slug: 'sherpur' },
          { name: 'Jaleshitola', bnName: 'জলেশ্বরীতলা', slug: 'jaleshitola' },
        ],
      },
      {
        name: 'Pabna',
        bnName: 'পাবনা',
        slug: 'pabna',
        areas: [
          { name: 'Pabna Sadar', bnName: 'পাবনা সদর', slug: 'pabna-sadar' },
          { name: 'Ishwardi', bnName: 'ঈশ্বরদী', slug: 'ishwardi' },
        ],
      },
    ],
  },
  {
    name: 'Sylhet',
    bnName: 'সিলেট',
    slug: 'sylhet',
    districts: [
      {
        name: 'Sylhet',
        bnName: 'সিলেট',
        slug: 'sylhet',
        areas: [
          { name: 'Zindabazar', bnName: 'জিন্দাবাজার', slug: 'zindabazar' },
          { name: 'Amberkhana', bnName: 'আম্বরখানা', slug: 'amberkhana' },
          { name: 'Shibganj', bnName: 'শিবগঞ্জ', slug: 'shibganj' },
          { name: 'Upashahar', bnName: 'উপশহর', slug: 'upashahar' },
          { name: 'Subidbazar', bnName: 'সুবিদবাজার', slug: 'subidbazar' },
          { name: 'Bandar Bazar', bnName: 'বন্দর বাজার', slug: 'bandar-bazar' },
        ],
      },
      {
        name: 'Moulvibazar',
        bnName: 'মৌলভীবাজার',
        slug: 'moulvibazar',
        areas: [
          { name: 'Sreemangal', bnName: 'শ্রীমঙ্গল', slug: 'sreemangal' },
          { name: 'Kulaura', bnName: 'কুলাউড়া', slug: 'kulaura' },
          { name: 'Moulvibazar Sadar', bnName: 'মৌলভীবাজার সদর', slug: 'moulvibazar-sadar' },
        ],
      },
      {
        name: 'Habiganj',
        bnName: 'হবিগঞ্জ',
        slug: 'habiganj',
        areas: [
          { name: 'Habiganj Sadar', bnName: 'হবিগঞ্জ সদর', slug: 'habiganj-sadar' },
          { name: 'Madhabpur', bnName: 'মাধবপুর', slug: 'madhabpur' },
        ],
      },
    ],
  },
  {
    name: 'Khulna',
    bnName: 'খুলনা',
    slug: 'khulna',
    districts: [
      {
        name: 'Khulna',
        bnName: 'খুলনা',
        slug: 'khulna',
        areas: [
          { name: 'Shib Bari', bnName: 'শিব বাড়ি', slug: 'shib-bari' },
          { name: 'Daulatpur', bnName: 'দৌলতপুর', slug: 'daulatpur' },
          { name: 'Boyra', bnName: 'বয়রা', slug: 'boyra' },
        ],
      },
      {
        name: 'Jashore',
        bnName: 'যশোর',
        slug: 'jashore',
        areas: [
          { name: 'Jashore Sadar', bnName: 'যশোর সদর', slug: 'jashore-sadar' },
        ],
      },
      {
        name: 'Kushtia',
        bnName: 'কুষ্টিয়া',
        slug: 'kushtia',
        areas: [
          { name: 'Kushtia Sadar', bnName: 'কুষ্টিয়া সদর', slug: 'kushtia-sadar' },
        ],
      },
    ],
  },
  {
    name: 'Barishal',
    bnName: 'বরিশাল',
    slug: 'barishal',
    districts: [
      {
        name: 'Barishal',
        bnName: 'বরিশাল',
        slug: 'barishal',
        areas: [
          { name: 'Sadar Road', bnName: 'সদর রোড', slug: 'sadar-road' },
          { name: 'Natun Bazar', bnName: 'নতুন বাজার', slug: 'natun-bazar' },
          { name: 'Rupatali', bnName: 'রূপাতলী', slug: 'rupatali' },
        ],
      },
      {
        name: 'Patuakhali',
        bnName: 'পটুয়াখালী',
        slug: 'patuakhali',
        areas: [
          { name: 'Kuakata', bnName: 'কুয়াকাটা', slug: 'kuakata' },
        ],
      },
      {
        name: 'Bhola',
        bnName: 'ভোলা',
        slug: 'bhola',
        areas: [
          { name: 'Bhola Sadar', bnName: 'ভোলা সদর', slug: 'bhola-sadar' },
        ],
      },
    ],
  },
  {
    name: 'Rangpur',
    bnName: 'রংপুর',
    slug: 'rangpur',
    districts: [
      {
        name: 'Rangpur',
        bnName: 'রংপুর',
        slug: 'rangpur',
        areas: [
          { name: 'Jahaj Company More', bnName: 'জাহাজ কোম্পানি মোড়', slug: 'jahaj-company-more' },
          { name: 'Modern More', bnName: 'মডার্ন মোড়', slug: 'modern-more' },
          { name: 'Medical More', bnName: 'মেডিকেল মোড়', slug: 'medical-more' },
        ],
      },
      {
        name: 'Dinajpur',
        bnName: 'দিনাজপুর',
        slug: 'dinajpur',
        areas: [
          { name: 'Dinajpur Sadar', bnName: 'দিনাজপুর সদর', slug: 'dinajpur-sadar' },
        ],
      },
      {
        name: 'Kurigram',
        bnName: 'কুড়িগ্রাম',
        slug: 'kurigram',
        areas: [],
      },
    ],
  },
  {
    name: 'Mymensingh',
    bnName: 'ময়মনসিংহ',
    slug: 'mymensingh',
    districts: [
      {
        name: 'Mymensingh',
        bnName: 'ময়মনসিংহ',
        slug: 'mymensingh',
        areas: [
          { name: 'Ganginar Par', bnName: 'গাঙ্গিনার পাড়', slug: 'ganginar-par' },
          { name: 'Town Hall', bnName: 'টাউন হল', slug: 'town-hall' },
          { name: 'Charpara', bnName: 'চরপাড়া', slug: 'charpara' },
        ],
      },
      {
        name: 'Jamalpur',
        bnName: 'জামালপুর',
        slug: 'jamalpur',
        areas: [
          { name: 'Jamalpur Sadar', bnName: 'জামালপুর সদর', slug: 'jamalpur-sadar' },
        ],
      },
      {
        name: 'Netrokona',
        bnName: 'নেত্রকোণা',
        slug: 'netrokona',
        areas: [],
      },
    ],
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

  console.log('✨ Categories seeded successfully!\n');
}

async function seedLocations(): Promise<void> {
  console.log('🌱 Starting location seeding (Divisions, Districts, Areas)...');

  for (const div of initialLocations) {
    const divisionRecord = await prisma.division.upsert({
      where: { slug: div.slug },
      update: {
        name: div.name,
        bnName: div.bnName,
      },
      create: {
        name: div.name,
        bnName: div.bnName,
        slug: div.slug,
      },
    });

    console.log(`📍 Division: ${divisionRecord.name} (${divisionRecord.bnName})`);

    for (const dist of div.districts) {
      const districtRecord = await prisma.district.upsert({
        where: {
          name_divisionId: {
            name: dist.name,
            divisionId: divisionRecord.id,
          },
        },
        update: {
          bnName: dist.bnName,
          slug: dist.slug,
        },
        create: {
          name: dist.name,
          bnName: dist.bnName,
          slug: dist.slug,
          divisionId: divisionRecord.id,
        },
      });

      console.log(`  ├── District: ${districtRecord.name} (${districtRecord.bnName})`);

      for (const area of dist.areas) {
        const areaRecord = await prisma.area.upsert({
          where: {
            name_districtId: {
              name: area.name,
              districtId: districtRecord.id,
            },
          },
          update: {
            bnName: area.bnName,
            slug: area.slug,
          },
          create: {
            name: area.name,
            bnName: area.bnName,
            slug: area.slug,
            districtId: districtRecord.id,
          },
        });

        console.log(`  │    └── Area: ${areaRecord.name} (${areaRecord.bnName})`);
      }
    }
  }

  console.log('\n✨ Locations seeded successfully!');
}

async function main(): Promise<void> {
  try {
    await seedCategories();
    await seedLocations();
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
