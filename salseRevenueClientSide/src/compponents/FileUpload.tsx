"use client";

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Box, Typography, CircularProgress } from "@mui/material";
import axios from "axios";
import { uploadFile } from "../redux/slices/DataSlice"; // Redux action for parsing CSV

const FileUpload: React.FC = () => {
  const dispatch = useDispatch();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadMessage(null);

    // ✅ Step 1: Parse file with Redux (optional, for previewing data)
    try {
      await dispatch(uploadFile(file));

      // ✅ Step 2: Upload to backend API
      const formData = new FormData();
      formData.append("file", file);
      console.log("===response1234",formData);

      const response = await axios.post("http://localhost:5005/api/import", formData, {

        headers: { "Content-Type": "multipart/form-data" },
      });
console.log("===response",response);
      setUploadMessage(response.data.message);
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadMessage("Error uploading file. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Box sx={{ mb: 2 }}>
      <input
        accept=".csv,.xlsx"
        style={{ display: "none" }}
        id="raised-button-file"
        type="file"
        onChange={handleFileUpload}
      />
      <label htmlFor="raised-button-file">
        <Button variant="contained" component="span" disabled={isUploading}>
          {isUploading ? <CircularProgress size={24} /> : "Upload CSV/Excel"}
        </Button>
      </label>
      {isUploading && (
        <Typography variant="body2" sx={{ mt: 1 }}>
          Uploading...
        </Typography>
      )}
      {uploadMessage && (
        <Typography variant="body2" color={uploadMessage.includes("Error") ? "error" : "success"} sx={{ mt: 1 }}>
          {uploadMessage}
        </Typography>
      )}
    </Box>
  );
};

export default FileUpload;
