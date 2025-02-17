import { useEffect, useMemo, useState } from "react";
import { CircularProgress, Button, TextField, MenuItem } from "@mui/material";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import * as XLSX from "xlsx";
import "../styles/Dashboard.css";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../redux/Store";
import { fetchSalesData } from "../redux/slices/DataSlice";

const sampleData = {
  revenueData: [
    { month: "Jan", revenue: 4000 },
    { month: "Feb", revenue: 3000 },
    { month: "Mar", revenue: 5000 },
    { month: "Apr", revenue: 4500 },
    { month: "May", revenue: 6000 },
  ],
  productData: [
    { name: "Product A", sales: 4000 },
    { name: "Product B", sales: 3000 },
    { name: "Product C", sales: 2000 },
    { name: "Product D", sales: 2780 },
  ],
  regionData: [
    { name: "North", value: 400 },
    { name: "South", value: 300 },
    { name: "East", value: 300 },
    { name: "West", value: 200 },
  ],
};

const Index = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [product, setProduct] = useState("");

  // ✅ Corrected Redux Selector
  // const { data, loading, error } = useSelector((state) => state.sales.productWise);
  const { data, loading, error } = useSelector((state) => state.data);
  console.log("Full Redux State:", data);

  useEffect(() => {
    dispatch(fetchSalesData());
  }, [dispatch]);

  // ✅ Transform Data for Bar Chart
  // Ensure that 'data' is an array before calling map
  const barChartData = Array.isArray(data)
    ? data &&
      data.map((item) => {
        console.log("----chartData1234", item);
        if (item && item.product && item.quantity) {
          return {
            name: item.product,
            sales: item.quantity,
          };
        }
      })
    : [];
    const pieChartData = Array.isArray(data)
    ? data &&
      data.map((item) => {
        console.log("----chartData1234", item);
          return {
            region: item.region,
            revenue: item.total,
        }
      })
    : [];

  console.log("----chartData", pieChartData);

  const [dateRange, setDateRange] = useState("month");
  const [category, setCategory] = useState("all");
  const [region, setRegion] = useState("all");

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError("");

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          console.log("Processed data:", jsonData);
          // Here you would process the data and update your charts
        } catch (err) {
          setError(
            "Error processing file. Please ensure it's a valid Excel/CSV file."
          );
        }
      };
      reader.readAsArrayBuffer(file);
    } catch (err) {
      setError("Error uploading file. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ["#9b87f5", "#7E69AB", "#0EA5E9", "#F1F0FB"];

  return (
    <div className="dashboard">
      {/* {loading && (
        <div className="loading-overlay">
          <CircularProgress />
        </div>
      )} */}

      <div className="dashboard-header">
        <h1>Sales Dashboard</h1>
      </div>

      <div className="upload-section">
        <Button
          variant="contained"
          component="label"
          style={{ backgroundColor: "#9b87f5" }}
        >
          Upload Sales Data
          <input
            type="file"
            hidden
            accept=".csv,.xlsx,.xls"
            onChange={handleFileUpload}
          />
        </Button>
        {error && <div className="error-message">{error}</div>}
      </div>

      <div className="filter-section">
        <TextField
          select
          label="Date Range"
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          style={{ minWidth: 120 }}
        >
          <MenuItem value="week">Week</MenuItem>
          <MenuItem value="month">Month</MenuItem>
          <MenuItem value="year">Year</MenuItem>
        </TextField>

        <TextField
          select
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ minWidth: 120 }}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="electronics">Electronics</MenuItem>
          <MenuItem value="clothing">Clothing</MenuItem>
        </TextField>

        <TextField
          select
          label="Region"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          style={{ minWidth: 120 }}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="north">North</MenuItem>
          <MenuItem value="south">South</MenuItem>
          <MenuItem value="east">East</MenuItem>
          <MenuItem value="west">West</MenuItem>
        </TextField>
      </div>

      <div className="dashboard-grid">
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Revenue Trends</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={sampleData.revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#9b87f5"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h2>Product Sales Chart</h2>

          {/* Product Selection */}
          <input
            type="text"
            placeholder="Enter Product Name"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
          />

          {/* Loading Indicator */}
          {loading && <p>Loading...</p>}

          {/* Error Handling */}
          {error && <p style={{ color: "red" }}>Error: {error}</p>}

          {/* Chart Display */}
          {!loading && !error && barChartData.length > 0 ? (
            <div className="chart-card">
              <div className="chart-header">
                <h3 className="chart-title">Product Sales</h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sales" fill="#7E69AB" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            !loading && <p>No sales data available</p>
          )}
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Revenue by Region</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="revenue"
              >
                  {pieChartData.map((entry, index) => (
          <Cell
            key={`cell-${index}`}
            fill={COLORS[index % COLORS.length]}
            name={entry.region}  // This will store the region name
          />
        ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Index;
