import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  CircularProgress,
  Typography,
  TextField,
  Box,
  MenuItem,
} from "@mui/material";
import type { AppDispatch, RootState } from "../../redux/Store";
import { createSelector } from "@reduxjs/toolkit";
import { fetchSalesTrends } from "../../redux/slices/SalseSlice";

// Dummy Data for Fallback
const dummyData = [
  { date: "2024-01-01", totalRevenue: 4000 },
  { date: "2024-01-02", totalRevenue: 3000 },
  { date: "2024-01-03", totalRevenue: 5000 },
  { date: "2024-01-04", totalRevenue: 2000 },
];

// Selector to get sales data
const selectSalesData = createSelector(
  (state: RootState) => state.sales,
  (sales) => ({
    data: sales?.trends?.data || [],
    loading: sales?.trends?.loading || false,
    error: sales?.trends?.error || null,
  })
);

const RevenueChart: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector(selectSalesData);

  // ✅ State for Date Range Selection (For Period: Week, Month, Year)
  const [startDate, setStartDate] = useState("2024-01-01");
  const [endDate, setEndDate] = useState("2024-12-31");
  const [dateRange, setDateRange] = useState("month"); // Default to "month"

  // ✅ Fetch API Data on Mount or when Date Range or Period changes
  useEffect(() => {
    dispatch(fetchSalesTrends({ period: dateRange, startDate, endDate }));
  }, [dispatch, dateRange, startDate, endDate]);

  // ✅ Helper function to group data by Week, Month, or Year
  const groupDataByPeriod = (data, dateRange) => {
    return data.reduce((acc, item) => {
      const date = new Date(item.date);
      let key;

      if (dateRange === "week") {
        const weekNumber = getISOWeekNumber(date);
        key = `W${weekNumber}`;
      } else if (dateRange === "month") {
        const monthName = date.toLocaleString("default", { month: "short" });
        key = monthName;
      } else if (dateRange === "year") {
        key = date.getFullYear();
      }

      // Group and accumulate data
      if (!acc[key]) {
        acc[key] = { date: key, totalRevenue: 0 };
      }

      acc[key].totalRevenue += item.totalRevenue;
      return acc;
    }, {});
  };

  // Utility function to get ISO week number
  const getISOWeekNumber = (date) => {
    const jan1 = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor((date - jan1) / (24 * 60 * 60 * 1000));
    const weekNumber = Math.ceil((days + 1) / 7);
    return weekNumber;
  };

  // ✅ Group data based on selected date range
  const groupedData = useMemo(() => {
    if (!data || data.length === 0) return dummyData;

    const grouped = groupDataByPeriod(data, dateRange);

    // Convert grouped data back to an array for Recharts
    return Object.values(grouped);
  }, [data, dateRange]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  return (
    <>
      <div className="chart-card">
        <div
          className="chart-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <h3 className="chart-title" style={{ margin: 0 }}>
            Revenue Trends
          </h3>

          {/* Date Range Filter Section */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              select
              label="Date Range"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)} // Update the selected period
              style={{ minWidth: 120 }}
            >
              <MenuItem value="week">Week</MenuItem>
              <MenuItem value="month">Month</MenuItem>
              <MenuItem value="year">Year</MenuItem>
            </TextField>
          </Box>
        </div>

        <ResponsiveContainer  height={300}>
          <LineChart data={groupedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              label={{ value: "Date", position: "insideBottom", offset: -5 }}
            />
            <YAxis
              label={{
                value: "Revenue ($)",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="totalRevenue"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default RevenueChart;
