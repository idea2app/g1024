import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ZkWasmServiceHelper } from 'zkwasm-service-helper';

import { RootState } from '../app/store';

export const resturl = 'http://129.146.114.145:8080';
export const zkwasmHelper = new ZkWasmServiceHelper(resturl, '', '');
export const storageKey = 'customURLs';

export const defaultEndpoint: Endpoint = {
  url: resturl,
  nickname: 'Default',
};

export interface Endpoint {
  url: string;
  nickname: string;
}

function customEndpoints() {
  const endpoints = localStorage[storageKey];

  return endpoints ? (JSON.parse(endpoints) as Endpoint[]) : [];
}

function getLastUsedEndpoint() {
  const { lastUsedEndpoint } = localStorage;

  if (lastUsedEndpoint) {
    console.log('last used endpoint: ' + lastUsedEndpoint + '');
    return JSON.parse(lastUsedEndpoint) as Endpoint;
  }

  return defaultEndpoint;
}

const initialState: {
  zkWasmServiceHelper: ZkWasmServiceHelper;
  currentEndpoint: Endpoint;
  endpointList: Endpoint[];
} = {
  zkWasmServiceHelper: new ZkWasmServiceHelper(
    getLastUsedEndpoint().url,
    '',
    '',
  ),
  currentEndpoint: getLastUsedEndpoint(),
  endpointList: [...customEndpoints()],
};

export const endpointSlice = createSlice({
  name: 'endpoint',
  initialState,
  reducers: {
    updateCurrentEndpoint: (
      { currentEndpoint, zkWasmServiceHelper },
      { payload }: PayloadAction<Endpoint>,
    ) => {
      localStorage.setItem('lastUsedEndpoint', JSON.stringify(payload));
      currentEndpoint = payload;
      zkWasmServiceHelper = new ZkWasmServiceHelper(payload.url, '', '');
    },
    setEndpointList: ({ endpointList }, { payload }) => {
      localStorage.setItem(storageKey, JSON.stringify(payload));
      endpointList = payload;
    },
  },
});

export const { updateCurrentEndpoint, setEndpointList } = endpointSlice.actions;

export const selectEndpointList = ({ endpoint: { endpointList } }: RootState) =>
  endpointList;
export const selectCurrentEndpoint = ({
  endpoint: { currentEndpoint },
}: RootState) => currentEndpoint;
export const selectZkWasmServiceHelper = ({
  endpoint: { zkWasmServiceHelper },
}: RootState) => zkWasmServiceHelper;

export default endpointSlice.reducer;
