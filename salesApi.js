const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const Sales = require("./models/Sales");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());

app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

const upload = multer({ dest: "uploads/" });

// Import sales data via CSV
app.post("/api/import", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const filePath = req.file.path; // Save file path
    const results = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push({ ...data, revenue_file: filePath }))
      .on("end", async () => {
        try {
          await Sales.insertMany(results);
          res.json({ message: "Sales data imported successfully", filePath });
        } catch (error) {
          res.status(500).json({ error: "Database insert failed" });
        }
      });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Filter sales by product, category, and region
app.get("/api/sales", async (req, res) => {
  try {
    const { product, category, region, startDate, endDate } = req.query;

    let filter = {};

    if (product) filter.product = product;
    if (category) {
      const categoryMap = {
        electronics: ["Laptop", "Tablet", "Smartphone"],
        accessories: ["Smartwatch", "Headphones", "Chargers"],
        wearables: ["Smartwatch", "Fitness Band"],
      };

      filter.product = { $in: categoryMap[category] || [] };
    }
    if (region) filter.region = region; // ✅ Ensure region is properly filtered
    if (startDate && endDate) {
      filter.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const sales = await Sales.find(filter);

    const revenueByRegion = sales.reduce((acc, sale) => {
      if (!acc[sale.region]) acc[sale.region] = 0;
      acc[sale.region] += sale.total;
      return acc;
    }, {});

    const responseData = Object.keys(revenueByRegion).map((region) => ({
      region,
      totalRevenue: revenueByRegion[region],
    }));

    res.json(responseData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch total sales and revenue for a given period
app.get("/api/sales/summary", async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    const sales = await Sales.aggregate([
      {
        $match: {
          date: { $gte: new Date(startDate), $lte: new Date(endDate) },
        },
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: 1 },
          totalRevenue: { $sum: "$amount" },
        },
      },
    ]);
    res.json(sales[0] || { totalSales: 0, totalRevenue: 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate sales trend data

app.get("/api/sales/trends", async (req, res) => {
  const { startDate, endDate, period } = req.query;

  try {
    // Validate query parameters
    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ message: "Start date and end date are required." });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Check if startDate and endDate are valid dates
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res
        .status(400)
        .json({ message: "Invalid date format. Please use 'YYYY-MM-DD'." });
    }

    // Initialize filter conditions
    const filterConditions = {
      date: { $gte: start, $lte: end },
    };

    // Default aggregation (monthly)
    let dateGroupFormat = {
      year: { $year: "$date" },
      month: { $month: "$date" },
    };

    if (period === "daily") {
      // Group by day
      dateGroupFormat = {
        year: { $year: "$date" },
        month: { $month: "$date" },
        day: { $dayOfMonth: "$date" },
      };
    } else if (period === "weekly") {
      // Group by week (MongoDB uses ISO week date system)
      dateGroupFormat = {
        year: { $year: "$date" },
        week: { $isoWeek: "$date" },
      };
    }

    const salesData = await Sales.aggregate([
      { $match: filterConditions },
      {
        $group: {
          _id: dateGroupFormat,
          totalRevenue: { $sum: "$total" },
          totalSales: { $sum: "$quantity" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    if (!salesData || salesData.length === 0) {
      return res
        .status(404)
        .json({
          message: "No sales data found for the given date range",
          data: [],
        });
    }

    // Return success response with grouped data
    return res.status(200).json({ message: "Success", data: salesData });
  } catch (error) {
    console.error("Error fetching sales data:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

// Fetch product-wise sales data
app.get("/api/sales/products", async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    const sales = await Sales.aggregate([
      {
        $match: {
          date: { $gte: new Date(startDate), $lte: new Date(endDate) },
        },
      },
      {
        $group: {
          _id: "$product",
          total: { $sum: "$quantity" },
        },
      },
      { $sort: { total: -1 } },
    ]);

    res.json(sales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch revenue by region
app.get("/api/sales/regions", async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    const sales = await Sales.aggregate([
      {
        $match: {
          date: { $gte: new Date(startDate), $lte: new Date(endDate) },
        },
      },
      {
        $group: {
          _id: "$region",
          totalRevenue: { $sum: "$total" },
        },
      },
    ]);
    res.json(sales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// app.get("/api/get-all-sales-data", async (req, res) => {
//   const { startDate, endDate } = req.query;
//   try {
//     const salesData = await Sales.find();

//     if (!salesData || salesData.length === 0) {
//       return res.status(404).json({ message: "No sales data found", data: [] });
//     }

//     return res.status(200).json({ message: "Success", data: salesData });
//   } catch (error) {
//     console.error("Error fetching sales data:", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// });
// app.get("/api/sales/get-all-sales-revenue-period", async (req, res) => {
//   const { startDate, endDate, trend } = req.query;

//   try {
//     // Initialize filter conditions
//     const filterConditions = {};

//     // Check for valid startDate and endDate
//     if (startDate) {
//       const start = new Date(startDate);
//       if (isNaN(start)) {
//         return res.status(400).json({ message: "Invalid startDate format" });
//       }
//       filterConditions.date = { ...filterConditions.date, $gte: start };
//     }

//     if (endDate) {
//       const end = new Date(endDate);
//       if (isNaN(end)) {
//         return res.status(400).json({ message: "Invalid endDate format" });
//       }
//       if (!filterConditions.date) filterConditions.date = {}; // Ensure date exists
//       filterConditions.date.$lte = end;
//     }

//     // Default aggregation (monthly)
//     let dateGroupFormat = {
//       year: { $year: "$date" },
//       month: { $month: "$date" },
//     };

//     if (trend === 'daily') {
//       // Group by day
//       dateGroupFormat = {
//         year: { $year: "$date" },
//         month: { $month: "$date" },
//         day: { $dayOfMonth: "$date" },
//       };
//     } else if (trend === 'weekly') {
//       // Group by week (MongoDB uses ISO week date system)
//       dateGroupFormat = {
//         year: { $year: "$date" },
//         week: { $isoWeek: "$date" },
//       };
//     }

//     // MongoDB Aggregation Pipeline
//     const salesData = await Sales.aggregate([
//       { $match: filterConditions },
//       { $group: {
//           _id: dateGroupFormat,  // Grouping by day, week, or month
//           totalRevenue: { $sum: "$total" }, // Sum of revenue for each group
//           totalSales: { $sum: "$quantity" }, // Sum of sales quantity for each group
//         }
//       },
//       { $sort: { "_id": 1 } },  // Sort by date (ascending)
//     ]);

//     if (!salesData || salesData.length === 0) {
//       return res.status(404).json({ message: "No sales data found for the given date range", data: [] });
//     }

//     // Return success response with grouped data
//     return res.status(200).json({ message: "Success", data: salesData });

//   } catch (error) {
//     console.error("Error fetching sales data:", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// });

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
