import mongoose from 'mongoose';
import dotenv from 'dotenv';
import MenuItem from './models/MenuItem.js';

dotenv.config();


const menuItems = [
  // Donuts
  { name: "Glazed Donut", description: "Classic glazed perfection", image: "/images/donuts.png", price: 3.50, category: "donuts" },
  
  // Croissants
  { name: "Butter Croissant", description: "Flaky and buttery layers", image: "/images/croissants.png", price: 4.50, category: "croissants" },
  
  // Bread
  { name: "Sourdough Loaf", description: "Artisan sourdough bread", image: "/images/bread.png", price: 6.00, category: "bread" },

   // Dessert
  { name: "Macarons", description: "Classic French macarons", image: "/images/macarons.png", price: 4.50, category: "dessert" },

  { name: "Chocolate Chip Cookie", description: "Buttery cookies", image: "/images/cookie.png", price: 5.50, category: "dessert" },
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing menu items
    await MenuItem.deleteMany({});
    console.log('🗑️  Cleared existing menu items');

    // Insert new menu items
    const inserted = await MenuItem.insertMany(menuItems);
    console.log(`✅ Inserted ${inserted.length} menu items`);

    console.log('\nMenu items seeded:');
    inserted.forEach(item => {
      console.log(`  ${item.image} ${item.name} - $${item.price} (${item.category})`);
    });

    await mongoose.connection.close();
    console.log('\n Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error(' Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
