import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";
import { fetchRevenueByRegion } from "../../redux/slices/SalseSlice";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Typography,
  CircularProgress,
  Box,
  TextField,
  MenuItem,
} from "@mui/material";
import type { RootState, AppDispatch } from "../../redux/Store";

const COLORS = ["#9b87f5", "#7E69AB", "#0EA5E9", "#F1F0FE"];

const dummyData = [
  { region: "North", totalRevenue: 400 },
  { region: "South", totalRevenue: 300 },
  { region: "East", totalRevenue: 500 },
  { region: "West", totalRevenue: 200 },
];

// Selector to get sales data from Redux state
const selectSalesData = createSelector(
  (state: RootState) => state.salse,
  (sales) => ({
    data: sales.revenueByRegion?.data || [],
    loading: sales?.loading || false,
    error: sales?.error || null,
  })
);

const ProductSalesPieChart: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector(selectSalesData);

  const [region, setRegion] = useState("");

  useEffect(() => {
    dispatch(
      fetchRevenueByRegion({ startDate: "2024-01-01", endDate: "2024-12-31" })
    );
  }, [dispatch]);

  // ✅ Memoized filtered data
  const filteredData = useMemo(() => {
    if (!data || !Array.isArray(data)) return dummyData;

    return region
      ? data.filter(
          (item) => item._id && item._id.toLowerCase() === region.toLowerCase()
        )
      : data;
  }, [data, region]);

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
          <h3 className="chart-title">Revenue by Region</h3>
          <Box sx={{ mb: 2, display: "flex", gap: 2 }}>
            <TextField
              select
              label="Region"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              sx={{ minWidth: 150 }}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="North">North</MenuItem>
              <MenuItem value="South">South</MenuItem>
              <MenuItem value="East">East</MenuItem>
              <MenuItem value="West">West</MenuItem>
            </TextField>
          </Box>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={filteredData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="totalRevenue"
              nameKey="_id"
              label={({ name, value }) => `${name} (${value})`}
            >
              {filteredData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[entry._id] || COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default ProductSalesPieChart;
