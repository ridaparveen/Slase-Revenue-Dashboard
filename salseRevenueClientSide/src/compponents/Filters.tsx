// import React, { useEffect, useState } from "react";
// import { Box, TextField, MenuItem, Button } from "@mui/material";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// import { useDispatch } from "react-redux";
// import type { AppDispatch } from "../redux/Store";
// import { fetchFilteredSales } from "../redux/slices/SalseSlice";

// const Filters: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();

//   // ✅ State for filters
//   const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
//   const [category, setCategory] = useState<string>("");
//   const [region, setRegion] = useState<string>("");

//   // ✅ Handle filter changes
//   const handleFetchData = () => {
//     dispatch(
//       fetchFilteredSales({
//         product: "", // You can add product filter if needed
//         category,
//         region,
//         startDate: dateRange[0] ? dateRange[0].toISOString().split("T")[0] : undefined,
//         endDate: dateRange[1] ? dateRange[1].toISOString().split("T")[0] : undefined,
//       })
//     );
//   };

//   return (
//     <Box sx={{ mb: 2, display: "flex", gap: 2, alignItems: "center" }}>
//       <LocalizationProvider dateAdapter={AdapterDateFns}>
//         <DatePicker
//           label="Start Date"
//           value={dateRange[0]}
//           onChange={(newValue) => setDateRange([newValue, dateRange[1]])}
//         />
//         <DatePicker
//           label="End Date"
//           value={dateRange[1]}
//           onChange={(newValue) => setDateRange([dateRange[0], newValue])}
//         />
//       </LocalizationProvider>
//       <TextField
//         select
//         label="Category"
//         value={category}
//         onChange={(e) => setCategory(e.target.value)}
//         sx={{ minWidth: 120 }}
//       >
//         <MenuItem value="">All</MenuItem>
//         <MenuItem value="electronics">Electronics</MenuItem>
//         <MenuItem value="clothing">Clothing</MenuItem>
//         <MenuItem value="furniture">Furniture</MenuItem>
//       </TextField>
//       <TextField
//         select
//         label="Region"
//         value={region}
//         onChange={(e) => setRegion(e.target.value)}
//         sx={{ minWidth: 120 }}
//       >
//         <MenuItem value="">All</MenuItem>
//         <MenuItem value="north">North</MenuItem>
//         <MenuItem value="south">South</MenuItem>
//         <MenuItem value="east">East</MenuItem>
//         <MenuItem value="west">West</MenuItem>
//       </TextField>
//       <Button variant="contained" color="primary" onClick={handleFetchData}>
//         Apply Filters
//       </Button>
//     </Box>
//   );
// };

// export default Filters;
