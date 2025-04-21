import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import timeEntryService from '../../api/mockTimeEntries';

export const fetchTimeEntries = createAsyncThunk(
  'timeEntries/fetchAll',
  async (params, thunkAPI) => {
    try {
      const response = await timeEntryService.getAll(params);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const saveTimeEntry = createAsyncThunk(
  'timeEntries/create',
  async (entryData, thunkAPI) => {
    try {
      const response = await timeEntryService.create(entryData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const timeEntriesSlice = createSlice({
  name: 'timeEntries',
  initialState: {
    entries: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTimeEntries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTimeEntries.fulfilled, (state, action) => {
        state.loading = false;
        state.entries = action.payload;
      })
      .addCase(fetchTimeEntries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(saveTimeEntry.fulfilled, (state, action) => {
        state.entries.unshift(action.payload);
      });
  }
});

export default timeEntriesSlice.reducer;