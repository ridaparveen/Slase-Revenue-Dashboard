import type React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Box, Container, Grid, Paper, Typography } from "@mui/material";
import FileUpload from "./FileUpload";
import RevenueChart from "./charts/RevenueChart";
import ProductSalesChart from "./charts/ProductSalseChart";
import RegionRevenueChart from "./charts/RegionRevenueChart";
import type { RootState } from "../redux/Store";
import {
  setDateRange,
  setCategory,
  setRegion,
} from "../redux/slices/FilterSlice";

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { dateRange, category, region } = useSelector(
    (state: RootState) => state.filters
  );

  const handleDateRangeChange = (newDateRange: [Date | null, Date | null]) => {
    dispatch(setDateRange(newDateRange));
  };

  const handleCategoryChange = (newCategory: string) => {
    dispatch(setCategory(newCategory));
  };

  const handleRegionChange = (newRegion: string) => {
    dispatch(setRegion(newRegion));
  };

  return (
    <Container maxWidth="lg" style={{ display: "flex", marginLeft:300 }}>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Sales Dashboard
        </Typography>
        <FileUpload />

        <Grid container spacing={3}>
          {/* Each chart takes up 4 columns in the 12-column grid */}
          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 2 }}>
              <RevenueChart />
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 2 }}>
              <ProductSalesChart />
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 2 }}>
              <RegionRevenueChart />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard;
