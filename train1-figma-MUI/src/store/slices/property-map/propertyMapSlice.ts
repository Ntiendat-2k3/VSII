import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { propertyMapQueryApi } from '@/features/property-map/requests/propertyMapQuery';
import { propertyMapMutationApi } from '@/features/property-map/requests/propertyMapMutation';
import { masterDataQueryApi } from '@/features/property-map/requests/masterDataQuery';
import type { UnitItem } from '@/features/property-map/types/PropertyMapModel';
import type { MapGetResponse } from '@/features/property-map/types/PropertyMapDto';
import type { FilterType } from '@/features/property-map/constants/propertyMapStatus';
import { UNIT_STATUS } from '@/features/property-map/constants/propertyMapStatus';

/* ===== State ===== */

interface PropertyMapState {
  mapData: MapGetResponse | null;
  units: UnitItem[];
  filteredUnits: UnitItem[];
  filterTypes: FilterType[];
  searchKeyword: string;
  searchedUnit: UnitItem | null;
  zoom: number;
  focusCoords: { x: number; y: number; xPixel?: number; yPixel?: number; rotation?: number; pageWidth?: number; pageHeight?: number } | null;
  isLoadingMap: boolean;
  isLoadingUnits: boolean;
  error: string | null;
  masterData: {
    unitTypes: Record<string, string>;
    inquiryStatuses: Record<string, string>;
    unitStatuses: Record<string, string>;
  };
}

const initialState: PropertyMapState = {
  mapData: null,
  units: [],
  filteredUnits: [],
  filterTypes: ['HOT'],
  searchKeyword: '',
  searchedUnit: null,
  zoom: 1,
  focusCoords: null,
  isLoadingMap: false,
  isLoadingUnits: false,
  error: null,
  masterData: {
    unitTypes: {},
    inquiryStatuses: {},
    unitStatuses: {},
  },
};

/* ===== Thunks ===== */

export const fetchMapData = createAsyncThunk(
  'propertyMap/fetchMapData',
  async (projectId: number, { rejectWithValue }) => {
    try {
      const result = await propertyMapQueryApi.getMapData(projectId);
      return result;
    } catch (error: unknown) {
      return rejectWithValue((error as Error).message || 'Lỗi khi lấy dữ liệu bản đồ');
    }
  },
);

export const fetchUnits = createAsyncThunk(
  'propertyMap/fetchUnits',
  async (params: { projectId: number; keyword?: string }, { rejectWithValue }) => {
    try {
      const result = await propertyMapMutationApi.searchUnits(params.projectId, params.keyword);
      return result;
    } catch (error: unknown) {
      return rejectWithValue((error as Error).message || 'Lỗi khi lấy danh sách quỹ căn');
    }
  },
);

export const fetchMasterData = createAsyncThunk(
  'propertyMap/fetchMasterData',
  async (groupCode: string, { rejectWithValue }) => {
    try {
      const list = await masterDataQueryApi.getList({ groupCode });
      return { groupCode, list };
    } catch (error: unknown) {
      return rejectWithValue((error as Error).message || 'Lỗi khi lấy dữ liệu master data');
    }
  },
);

/* ===== Filter Helper ===== */

function applyFilters(units: UnitItem[], activeFilters: FilterType[]): UnitItem[] {
  if (activeFilters.length === 0) return [];

  // Mặc định chỉ hiển thị các căn ở trạng thái "Còn hàng" (AVAILABLE) trên bản đồ
  const availableUnits = units.filter((unit) => unit.statusCode === UNIT_STATUS.AVAILABLE);

  return availableUnits.filter((unit) => {
    // 1. Hot filter
    if (unit.isHot && activeFilters.includes('HOT')) {
      return true;
    }
    
    // 2. If no unitTypeCode, show it by default so it's not hidden
    if (!unit.unitTypeCode) {
      return true;
    }

    // 3. Match backend unitTypeCode directly against activeFilters!
    if (activeFilters.includes(unit.unitTypeCode)) {
      return true;
    }
    
    return false;
  });
}

/* ===== Slice ===== */

const propertyMapSlice = createSlice({
  name: 'propertyMap',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<FilterType[]>) => {
      state.filterTypes = action.payload;
      state.filteredUnits = applyFilters(state.units, state.filterTypes);
    },
    setSearchKeyword: (state, action: PayloadAction<string>) => {
      state.searchKeyword = action.payload;
    },
    forceShowUnit: (state, action: PayloadAction<UnitItem>) => {
      state.searchedUnit = action.payload;
    },
    clearSearchedUnit: (state) => {
      state.searchedUnit = null;
    },
    setFocusUnit: (
      state,
      action: PayloadAction<{ x: number; y: number; xPixel?: number; yPixel?: number; zoomLevel?: number; rotation?: number; pageWidth?: number; pageHeight?: number } | null>,
    ) => {
      if (action.payload) {
        state.focusCoords = {
          x: action.payload.x,
          y: action.payload.y,
          xPixel: action.payload.xPixel,
          yPixel: action.payload.yPixel,
          rotation: action.payload.rotation,
          pageWidth: action.payload.pageWidth,
          pageHeight: action.payload.pageHeight,
        };
        state.zoom = action.payload.zoomLevel ?? state.zoom;
      } else {
        state.focusCoords = null;
      }
    },

  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMapData.pending, (state) => {
        state.isLoadingMap = true;
        state.error = null;
      })
      .addCase(fetchMapData.fulfilled, (state, action) => {
        state.isLoadingMap = false;
        state.mapData = action.payload;
      })
      .addCase(fetchMapData.rejected, (state, action) => {
        state.isLoadingMap = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUnits.pending, (state) => {
        state.isLoadingUnits = true;
        state.error = null;
      })
      .addCase(fetchUnits.fulfilled, (state, action) => {
        state.isLoadingUnits = false;
        state.units = action.payload;
        
        // Extract unique unit type codes from the loaded units
        const uniqueUnitTypes = Array.from(
          new Set(
            action.payload
              .map((u) => u.unitTypeCode)
              .filter((code): code is string => !!code)
          )
        );
        
        // Default to all filters active (HOT + all unique unit types)
        state.filterTypes = ['HOT', ...uniqueUnitTypes];
        state.filteredUnits = applyFilters(state.units, state.filterTypes);
      })
      .addCase(fetchUnits.rejected, (state, action) => {
        state.isLoadingUnits = false;
        state.error = action.payload as string;
      })
      .addCase(fetchMasterData.fulfilled, (state, action) => {
        const { groupCode, list } = action.payload;
        if (!list || list.length === 0) return;

        const mapping: Record<string, string> = {};
        list.forEach((item) => {
          if (item.code && item.value) {
            mapping[item.code] = item.value;
          }
        });

        if (groupCode === 'UNIT_TYPE') {
          state.masterData.unitTypes = {
            ...state.masterData.unitTypes,
            ...mapping,
          };
        } else if (groupCode === 'INQUIRY_STATUS') {
          state.masterData.inquiryStatuses = {
            ...state.masterData.inquiryStatuses,
            ...mapping,
          };
        } else if (groupCode === 'UNIT_STATUS') {
          state.masterData.unitStatuses = {
            ...state.masterData.unitStatuses,
            ...mapping,
          };
        }
      });
  },
});

export const { setFilters, setSearchKeyword, forceShowUnit, clearSearchedUnit, setFocusUnit } = propertyMapSlice.actions;
export default propertyMapSlice.reducer;
