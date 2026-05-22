import Box from '@mui/material/Box';
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
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', md: 'center' },
        gap: { xs: 2, md: 0 },
        width: '100%',
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

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: { xs: '100%', md: 'auto' } }}>
        <TextField
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
          }}
          sx={{
            width: { xs: '100%', md: 350 },
            '& .MuiOutlinedInput-root': {
              backgroundColor: PALETTE.BACKGROUND_DEFAULT,
              height: 46,
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default MapHeader;
