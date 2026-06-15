import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Course from '../models/Course.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect to database
    await connectDB();

    console.log('--- Database Seeding Started ---');

    // 1. Seed Default Users
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('Seeding default users...');
      await User.create([
        {
          name: 'System Admin',
          email: 'admin@aurabuy.com',
          password: 'admin123', // Trigger save pre-hook to hash
          role: 'ADMIN'
        },
        {
          name: 'Jane Doe',
          email: 'user@aurabuy.com',
          password: 'user123', // Trigger save pre-hook to hash
          role: 'USER'
        }
      ]);
      console.log('Default users seeded successfully.');
    } else {
      console.log('Users collection already contains data. Skipping user seeding.');
    }

    // 2. Seed Default Categories
    const categoryCount = await Category.countDocuments();
    if (categoryCount === 0) {
      console.log('Seeding default categories...');
      await Category.create([
        { categoryName: 'Electronics' },
        { categoryName: 'Fashion' },
        { categoryName: 'Home & Garden' },
        { categoryName: 'Sports' },
        { categoryName: 'Beauty' }
      ]);
      console.log('Default categories seeded successfully.');
    } else {
      console.log('Categories collection already contains data. Skipping category seeding.');
    }

    // 3. Seed Default Products
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log('Seeding default products...');
      await Product.create([
        {
          name: 'Premium Wireless Headphones',
          description: 'Experience crystal-clear audio with our industry-leading noise cancellation technology. Designed for comfort and long battery life.',
          price: 299.99,
          rating: 4.8,
          category: 'Electronics',
          imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600'
        },
        {
          name: 'Minimalist Smartwatch Series X',
          description: 'Stay connected and track your fitness with this sleek, modern smartwatch featuring a brilliant OLED display.',
          price: 399.00,
          rating: 4.9,
          category: 'Electronics',
          imageUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=600'
        },
        {
          name: 'Designer Leather Backpack',
          description: 'Crafted from genuine leather, this backpack combines style and functionality with multiple compartments for your essentials.',
          price: 159.50,
          rating: 4.6,
          category: 'Fashion',
          imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=600'
        },
        {
          name: 'Professional Camera Lens',
          description: 'Capture stunning photos with incredible depth and clarity using this professional-grade prime lens.',
          price: 899.99,
          rating: 4.7,
          category: 'Electronics',
          imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=600'
        },
        {
          name: 'Classic Aviator Sunglasses',
          description: 'Timeless aviator design with polarized lenses for ultimate UV protection and style.',
          price: 125.00,
          rating: 4.5,
          category: 'Fashion',
          imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=600'
        },
        {
          name: 'Smart Home Speaker',
          description: 'Control your smart home and enjoy room-filling sound with this intuitive voice-controlled speaker.',
          price: 149.99,
          rating: 4.4,
          category: 'Home & Garden',
          imageUrl: 'https://images.unsplash.com/photo-1543512214-318c7553f230?auto=format&fit=crop&q=80&w=600'
        },
        {
          name: 'Ergonomic Office Chair',
          description: 'Work in comfort all day with our fully adjustable ergonomic office chair with lumbar support.',
          price: 249.00,
          rating: 4.8,
          category: 'Home & Garden',
          imageUrl: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&q=80&w=600'
        },
        {
          name: 'Performance Running Shoes',
          description: 'Lightweight and responsive running shoes engineered for maximum speed and comfort.',
          price: 129.99,
          rating: 4.7,
          category: 'Sports',
          imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600'
        }
      ]);
      console.log('Default products seeded successfully.');
    } else {
      console.log('Products collection already contains data. Skipping product seeding.');
    }

    // 4. Seed Default Courses
    const courseCount = await Course.countDocuments();
    if (courseCount === 0) {
      console.log('Seeding default courses...');
      await Course.create([
        {
          courseName: 'Java Programming Masterclass',
          description: 'Learn Java from scratch to advanced topics, including OOP, database integration, and concurrency.',
          difficulty: 'Beginner',
          category: 'Programming'
        },
        {
          courseName: 'React Frontend Development',
          description: 'Build modern, responsive single-page applications with React, Redux, and TailwindCSS.',
          difficulty: 'Intermediate',
          category: 'Frontend'
        },
        {
          courseName: 'Advanced PostgreSQL Database Administration',
          description: 'Master indexing, query tuning, replication, and performance optimization in PostgreSQL.',
          difficulty: 'Advanced',
          category: 'Database'
        }
      ]);
      console.log('Default courses seeded successfully.');
    } else {
      console.log('Courses collection already contains data. Skipping course seeding.');
    }

    console.log('--- Database Seeding Completed Successfully ---');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedDatabase();
