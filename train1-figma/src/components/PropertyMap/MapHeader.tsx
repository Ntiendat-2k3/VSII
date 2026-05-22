import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { Search } from 'lucide-react';
import { PALETTE } from '../../theme';

interface MapHeaderProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
}

const MapHeader = ({ searchValue, onSearchChange }: MapHeaderProps) => {
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
        <TextField
          id="search-property-input"
          size="small"
          placeholder="Tìm vị trí căn theo mã căn"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={20} color={PALETTE.TEXT_HINT} />
                </InputAdornment>
              ),
            },
            htmlInput: {
              'aria-label': 'Tìm vị trí căn theo mã căn',
            },
          }}
          sx={{
            width: { xs: '100%', md: 350 },
            '& .MuiOutlinedInput-root': {
              backgroundColor: PALETTE.BACKGROUND_DEFAULT,
              height: 46,
            },
          }}
        />
      </Stack>
    </Stack>
  );
};

export default MapHeader;
