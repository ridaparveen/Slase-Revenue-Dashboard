const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Sales = require('../models/Sales');
const connectDB = require('../config/db');

dotenv.config(); // Load environment variables

const seedSalesData = async () => {
  try {
    await connectDB(); // Connect to MongoDB

    console.log("Seeding sales data...");

    // Clear existing sales data
    await Sales.deleteMany();

    // Static Sales Data
    const salesData = [
      { product: "Laptop", category: "Electronics", amount: 1000, quantity: 50, total: 50000, date: "2024-01-31", region: "North" },
      { product: "Smartphone", category: "Electronics", amount: 700, quantity: 120, total: 84000, date: "2024-02-29", region: "South" },
      { product: "Headphones", category: "Accessories", amount: 100, quantity: 200, total: 20000, date: "2024-03-31", region: "East" },
      { product: "Tablet", category: "Electronics", amount: 500, quantity: 80, total: 40000, date: "2024-04-30", region: "West" },
      { product: "Monitor", category: "Electronics", amount: 300, quantity: 60, total: 18000, date: "2024-05-31", region: "North" },
      { product: "Keyboard", category: "Accessories", amount: 50, quantity: 150, total: 7500, date: "2024-06-30", region: "South" },
      { product: "Mouse", category: "Accessories", amount: 30, quantity: 180, total: 5400, date: "2024-07-31", region: "East" },
      { product: "Smartwatch", category: "Wearables", amount: 200, quantity: 90, total: 18000, date: "2024-08-31", region: "West" }
    ];

    // Insert data into MongoDB
    await Sales.insertMany(salesData);

    console.log("Sales data seeded successfully!");
    process.exit();
  } catch (error) {
    console.error("Error seeding sales data:", error);
    process.exit(1);
  }
};

// Run seeder script
seedSalesData();
