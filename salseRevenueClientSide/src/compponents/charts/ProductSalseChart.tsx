import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";
import { fetchProductWiseSales } from "../../redux/slices/SalseSlice";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
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

// Dummy data for fallback
const dummyData = [
  { product: "Product A", totalSales: 400 },
  { product: "Product B", totalSales: 300 },
  { product: "Product C", totalSales: 500 },
  { product: "Product D", totalSales: 200 },
];

// Selector to get sales data
const selectSalesData = createSelector(
  (state: RootState) => state.salse,
  (sales) => ({
    data: sales.productWise?.data || [],
    loading: sales.productWise?.loading || false,
    error: sales.productWise?.error || null,
  })
);

const ProductSalesChart: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector(selectSalesData);
  const [product, setProduct] = useState("");

  useEffect(() => {
    dispatch(
      fetchProductWiseSales({ startDate: "2024-01-01", endDate: "2024-12-31" })
    );
  }, [dispatch]);

  const chartData = useMemo(() => (data.length ? data : dummyData), [data]);
  console.log("===ooo", chartData);
  const filteredData = useMemo(() => {
    if (!data || !Array.isArray(data)) return dummyData;

    return product
      ? data.filter(
          (item) => item._id && item._id.toLowerCase() === product.toLowerCase()
        )
      : data;
  }, [data, product]);
  console.log("===data=======", filteredData);
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
          <h3 className="chart-title">Product Sales</h3>
          <Box sx={{ mb: 2, display: "flex", gap: 2, alignItems: "center" }}>
            <TextField
              select
              label="Product"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              sx={{ minWidth: 150 }}
            >
              <MenuItem value="">All</MenuItem>
              {filteredData
                .map((item) => item._id)
                .filter((value, index, self) => self.indexOf(value) === index)
                .map((productName) => (
                  <MenuItem key={productName} value={productName}>
                    {productName}
                  </MenuItem>
                ))}
            </TextField>
          </Box>
        </div>
        <ResponsiveContainer height={300}>
          <BarChart data={filteredData}>
            <CartesianGrid strokeDasharray="5 5" />
            <XAxis dataKey="_id" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total" fill="#9b87f5" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default ProductSalesChart;
