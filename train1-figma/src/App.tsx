import Box from '@mui/material/Box';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import Navbar from './components/Layout/Navbar';
import HeroSection from './components/Layout/HeroSection';
import PropertyMap from './components/PropertyMap';
import Footer from './components/Layout/Footer';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          maxWidth: 1440,
          mx: 'auto',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          backgroundColor: 'background.default',
        }}
      >
        <Navbar />
        <HeroSection />

        {/* Map Section */}
        <Box sx={{ px: { xs: 0, md: 3 }, pb: { xs: 2, md: 3 } }}>
          <PropertyMap />
        </Box>

        <Footer />
      </Box>
    </ThemeProvider>
  );
};

export default App;
