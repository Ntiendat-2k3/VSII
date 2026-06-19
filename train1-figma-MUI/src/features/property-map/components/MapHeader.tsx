import { useState, useEffect, useCallback, useRef } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import { Search } from 'lucide-react';
import { PALETTE } from '@/theme';
import { propertyMapQueryApi } from '../requests/propertyMapQuery';

const DEBOUNCE_MS = 300;

interface MapHeaderProps {
  projectId: number;
  onSelectUnit: (unitCode: string) => void;
}

const MapHeader = ({ projectId, onSelectUnit }: MapHeaderProps) => {
  const [inputValue, setInputValue] = useState('');
  const [fetchedOptions, setFetchedOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const options = inputValue.trim() ? fetchedOptions : [];

  /* ── Debounced fetch suggestions ── */
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (!inputValue.trim()) {
      return;
    }

    debounceTimerRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const codes = await propertyMapQueryApi.getUnitCodes(projectId, inputValue);
        setFetchedOptions(codes);
      } catch {
        setFetchedOptions([]);
      } finally {
        setLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [inputValue, projectId]);

  const handleInputChange = useCallback(
    (_event: React.SyntheticEvent, value: string) => {
      setInputValue(value);
    },
    [],
  );

  const handleChange = useCallback(
    (_event: React.SyntheticEvent, value: string | null) => {
      if (value) {
        onSelectUnit(value);
      }
    },
    [onSelectUnit],
  );

  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={{ xs: 2, md: 0 }}
      sx={{
        width: '100%',
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', md: 'center' },
      }}
    >
      <Typography
        variant="h1"
        sx={{
          fontWeight: 700,
          fontSize: { xs: '1.5rem', md: '2rem' },
          color: PALETTE.PRIMARY,
          textTransform: 'uppercase',
        }}
      >
        Mặt bằng quỹ căn
      </Typography>

      <Stack
        direction="row"
        spacing={2}
        sx={{
          width: { xs: '100%', md: 'auto' },
          alignItems: 'center',
        }}
      >
        <Autocomplete
          id="search-property-autocomplete"
          freeSolo
          options={options}
          loading={loading}
          inputValue={inputValue}
          onInputChange={handleInputChange}
          onChange={handleChange}
          noOptionsText="Không tìm thấy mã căn"
          loadingText="Đang tìm..."
          sx={{ width: { xs: '100%', md: 350 } }}
          slotProps={{
            paper: {
              sx: {
                '& .MuiAutocomplete-option': {
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 500,
                  fontSize: '0.9375rem',
                },
              },
            },
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              size="small"
              placeholder="Tìm vị trí căn theo mã căn"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: PALETTE.BACKGROUND_DEFAULT,
                  height: 46,
                },
              }}
              slotProps={{
                ...params.slotProps,
                input: {
                  ...params.slotProps.input,
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={20} color={PALETTE.TEXT_HINT} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <>
                      {loading ? <CircularProgress size={18} /> : null}
                      {params.slotProps.input.endAdornment}
                    </>
                  ),
                },
                htmlInput: {
                  ...params.slotProps.htmlInput,
                  'aria-label': 'Tìm vị trí căn theo mã căn',
                },
              }}
            />
          )}
        />
      </Stack>
    </Stack>
  );
};

export default MapHeader;
