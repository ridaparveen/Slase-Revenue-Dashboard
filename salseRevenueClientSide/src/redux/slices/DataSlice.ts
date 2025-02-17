import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import Papa from "papaparse"

interface DataState {
  data: any[]
  loading: boolean
  error: string | null
}

const initialState: DataState = {
  data: [],
  loading: false,
  error: null,
}

export const uploadFile = createAsyncThunk("data/uploadFile", async (file: File) => {
  return new Promise<any[]>((resolve, reject) => {
    Papa.parse(file, {
      complete: (results) => {
        resolve(results.data)
      },
      header: true,
      error: (error) => {
        reject(error.message)
      },
    })
  })
})

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(uploadFile.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(uploadFile.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "An error occurred"
      })
  },
})

export default dataSlice.reducer

