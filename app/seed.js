import mongoose from 'mongoose';
import dotenv from 'dotenv';
import MenuItem from './models/MenuItem.js';

dotenv.config();

const menuItems = [
  // Donuts
  { name: "Glazed Donut", description: "Classic glazed perfection", image: "🍩", price: 3.50, category: "donuts" },
  { name: "Chocolate Donut", description: "Rich chocolate glazed", image: "🍩", price: 3.75, category: "donuts" },
  { name: "Boston Cream", description: "Cream filled with chocolate", image: "🍩", price: 4.00, category: "donuts" },
  { name: "Jelly Donut", description: "Filled with raspberry jam", image: "🍩", price: 3.75, category: "donuts" },
  
  // Croissants
  { name: "Butter Croissant", description: "Flaky and buttery layers", image: "🥐", price: 4.50, category: "croissants" },
  { name: "Chocolate Croissant", description: "Filled with dark chocolate", image: "🥐", price: 5.00, category: "croissants" },
  { name: "Almond Croissant", description: "With almond cream filling", image: "🥐", price: 5.50, category: "croissants" },
  { name: "Ham & Cheese Croissant", description: "Savory croissant", image: "🥐", price: 6.00, category: "croissants" },
  
  // Bread
  { name: "Sourdough Loaf", description: "Artisan sourdough bread", image: "🍞", price: 6.00, category: "bread" },
  { name: "Baguette", description: "Classic French baguette", image: "🥖", price: 4.50, category: "bread" },
  { name: "Whole Wheat Bread", description: "Healthy whole grain", image: "🍞", price: 5.50, category: "bread" },
  { name: "Focaccia", description: "Italian herb focaccia", image: "🍞", price: 7.00, category: "bread" }
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
    console.log('\n✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
