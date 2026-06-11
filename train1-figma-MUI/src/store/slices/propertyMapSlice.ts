import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { mapService } from '../../services/mapService';
import type { UnitItem, MapGetResponse } from '../../features/property-map/types';
import { BACKEND_UNIT_TYPE, FilterType } from '../../constants/map';

/* ===== State ===== */

interface PropertyMapState {
  mapData: MapGetResponse | null;
  units: UnitItem[];
  filteredUnits: UnitItem[];
  filterTypes: FilterType[];
  searchKeyword: string;
  zoom: number;
  focusCoords: { x: number; y: number } | null;
  isLoadingMap: boolean;
  isLoadingUnits: boolean;
  error: string | null;
}

const ALL_FILTERS: FilterType[] = [
  FilterType.HOT,
  FilterType.DON_LAP,
  FilterType.SONG_LAP,
  FilterType.TU_LAP,
  FilterType.LIEN_KE,
  FilterType.SHOPHOUSE,
];

const initialState: PropertyMapState = {
  mapData: null,
  units: [],
  filteredUnits: [],
  filterTypes: [...ALL_FILTERS],
  searchKeyword: '',
  zoom: 1,
  focusCoords: null,
  isLoadingMap: false,
  isLoadingUnits: false,
  error: null,
};

/* ===== Thunks ===== */

export const fetchMapData = createAsyncThunk(
  'propertyMap/fetchMapData',
  async (projectId: number, { rejectWithValue }) => {
    try {
      const result = await mapService.getMapData(projectId);
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
      const result = await mapService.searchUnits(params.projectId, params.keyword);
      return result;
    } catch (error: unknown) {
      return rejectWithValue((error as Error).message || 'Lỗi khi lấy danh sách quỹ căn');
    }
  },
);

/* ===== Filter Helper ===== */

function applyFilters(units: UnitItem[], activeFilters: FilterType[]): UnitItem[] {
  if (activeFilters.length === 0) return [];

  return units.filter((unit) => {
    // 1. Hot filter
    if (unit.isHot && activeFilters.includes(FilterType.HOT)) {
      return true;
    }
    
    // 2. If no unitTypeCode, show it by default so it's not hidden
    if (!unit.unitTypeCode) {
      return true;
    }

    // 3. Map backend unitTypeCode to frontend FilterType
    let typeKey: string = unit.unitTypeCode;
    if (typeKey === BACKEND_UNIT_TYPE.TOWNHOUSE) {
      typeKey = FilterType.LIEN_KE;
    } else if (typeKey === BACKEND_UNIT_TYPE.SEMI_DETACHED) {
      typeKey = FilterType.SONG_LAP;
    } else if (typeKey === BACKEND_UNIT_TYPE.DETACHED) {
      typeKey = FilterType.DON_LAP;
    } else if (typeKey === BACKEND_UNIT_TYPE.QUADRANGLE || typeKey === BACKEND_UNIT_TYPE.TU_LAP) {
      typeKey = FilterType.TU_LAP;
    }

    if (activeFilters.includes(typeKey as FilterType)) {
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
    setFocusUnit: (state, action: PayloadAction<{ x: number; y: number; zoomLevel: number } | null>) => {
      if (action.payload) {
        state.focusCoords = { x: action.payload.x, y: action.payload.y };
        state.zoom = action.payload.zoomLevel;
      } else {
        state.focusCoords = null;
      }
    },
    resetMap: (state) => {
      state.searchKeyword = '';
      state.focusCoords = null;
      state.filteredUnits = applyFilters(state.units, state.filterTypes);
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
        state.filteredUnits = applyFilters(state.units, state.filterTypes);
      })
      .addCase(fetchUnits.rejected, (state, action) => {
        state.isLoadingUnits = false;
        state.error = action.payload as string;
      });
  },
});

export const { setFilters, setSearchKeyword, setFocusUnit, resetMap } = propertyMapSlice.actions;
export default propertyMapSlice.reducer;
