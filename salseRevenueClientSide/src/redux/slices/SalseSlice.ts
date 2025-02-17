import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:5005/api/sales";

// Fetch Sales Trends (Line Chart Data)
export const fetchSalesTrends = createAsyncThunk(
  "sales/fetchSalesTrends",
  async ({ period, startDate, endDate }) => {
    const response = await axios.get(`${BASE_URL}/trends`, {
      params: { period, startDate, endDate },
    });
    return response.data.data;
  }
);

// Fetch Product-wise Sales (Bar Chart Data)
export const fetchProductWiseSales = createAsyncThunk(
  "sales/fetchProductWiseSales",
  async ({ startDate, endDate }) => {
    const response = await axios.get(`${BASE_URL}/products`, {
      params: { startDate, endDate },
    });
    return response.data;
  }
);

// Fetch Revenue by Region (Pie Chart Data)
export const fetchRevenueByRegion = createAsyncThunk(
  "sales/fetchRevenueByRegion",
  async ({ startDate, endDate }) => {
    const response = await axios.get(`${BASE_URL}/regions`, {
      params: { startDate, endDate },
    });
    return response.data;
  }
);

// Fetch Total Sales Summary
export const fetchSalesSummary = createAsyncThunk(
  "sales/fetchSalesSummary",
  async ({ startDate, endDate }) => {
    const response = await axios.get(`${BASE_URL}/summary`, {
      params: { startDate, endDate },
    });
    return response.data;
  }
);

// Fetch Sales with Filters (Product, Category, Region)
export const fetchFilteredSales = createAsyncThunk(
  "sales/fetchFilteredSales",
  async ({ product, category, region, startDate, endDate }) => {
    const response = await axios.get(BASE_URL, {
      params: { product, category, region, startDate, endDate },
    });
    return response.data;
  }
);

const salesSlice = createSlice({
  name: "sales",
  initialState: {
    trends: { data: [], loading: false, error: null },
    productWise: { data: [], loading: false, error: null },
    revenueByRegion: { data: [], loading: false, error: null },
    summary: { data: {}, loading: false, error: null },
    filteredSales: { data: [], loading: false, error: null },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Sales Trends
      .addCase(fetchSalesTrends.pending, (state) => {
        state.trends.loading = true;
        state.trends.error = null;
      })
      .addCase(fetchSalesTrends.fulfilled, (state, action) => {
        state.trends.loading = false;
        state.trends.data = action.payload;
      })
      .addCase(fetchSalesTrends.rejected, (state, action) => {
        state.trends.loading = false;
        state.trends.error = action.error.message;
      })

      // Product-wise Sales
      .addCase(fetchProductWiseSales.pending, (state) => {
        state.productWise.loading = true;
        state.productWise.error = null;
      })
      .addCase(fetchProductWiseSales.fulfilled, (state, action) => {
        state.productWise.loading = false;
        state.productWise.data = action.payload;
      })
      .addCase(fetchProductWiseSales.rejected, (state, action) => {
        state.productWise.loading = false;
        state.productWise.error = action.error.message;
      })

      // Revenue by Region
      .addCase(fetchRevenueByRegion.pending, (state) => {
        state.revenueByRegion.loading = true;
        state.revenueByRegion.error = null;
      })
      .addCase(fetchRevenueByRegion.fulfilled, (state, action) => {
        state.revenueByRegion.loading = false;
        state.revenueByRegion.data = action.payload;
      })
      .addCase(fetchRevenueByRegion.rejected, (state, action) => {
        state.revenueByRegion.loading = false;
        state.revenueByRegion.error = action.error.message;
      })

      // Total Sales Summary
      .addCase(fetchSalesSummary.pending, (state) => {
        state.summary.loading = true;
        state.summary.error = null;
      })
      .addCase(fetchSalesSummary.fulfilled, (state, action) => {
        state.summary.loading = false;
        state.summary.data = action.payload;
      })
      .addCase(fetchSalesSummary.rejected, (state, action) => {
        state.summary.loading = false;
        state.summary.error = action.error.message;
      })

      // Filtered Sales
      .addCase(fetchFilteredSales.pending, (state) => {
        state.filteredSales.loading = true;
        state.filteredSales.error = null;
      })
      .addCase(fetchFilteredSales.fulfilled, (state, action) => {
        state.filteredSales.loading = false;
        state.filteredSales.data = action.payload;
      })
      .addCase(fetchFilteredSales.rejected, (state, action) => {
        state.filteredSales.loading = false;
        state.filteredSales.error = action.error.message;
      });
  },
});

export default salesSlice.reducer;
