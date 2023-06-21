import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  ProvingParams,
  QueryParams,
  StatusState,
  WithSignature,
} from 'zkwasm-service-helper';

import { RootState } from '../app/store';

const initialState: StatusState = {
  tasks: [],
  loaded: false,
  statistics: {
    totalImages: 0,
    totalProofs: 0,
    totalDeployed: 0,
    totalTasks: 0,
  },
  config: {
    receiver_address: '',
    deployer_address: '',
    task_fee_list: {
      setup_fee: '',
      prove_fee: '',
    },
    chain_info_list: [],
  },
};

export const loadStatus = createAsyncThunk(
  'status/fetchStatus',
  async (query: QueryParams, thunkApi) => {
    const { endpoint } = thunkApi.getState() as RootState;
    const { data } = await endpoint.zkWasmServiceHelper.loadTasks(query);

    return data;
  },
);

export const addProvingTask = createAsyncThunk(
  'status/addProveTask',
  (task: WithSignature<ProvingParams>, thunkApi) => {
    const { endpoint } = thunkApi.getState() as RootState;

    return endpoint.zkWasmServiceHelper.addProvingTask(task);
  },
);

export const statusSlice = createSlice({
  name: 'status',
  initialState,
  reducers: {
    updateState: (state, { payload: { tasks, loaded } }) => {
      state.tasks = tasks;
      state.loaded = loaded;
    },
  },
  extraReducers: builder => {
    builder.addCase(loadStatus.fulfilled, (state, { payload }) => {
      state.tasks = payload;
      state.loaded = true;
    });
  },
});

export const { updateState } = statusSlice.actions;
export const selectTasks = ({ status }: RootState) => status.tasks;
export const tasksLoaded = ({ status }: RootState) => status.loaded;
export default statusSlice.reducer;
