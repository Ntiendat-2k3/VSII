import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";
import Navbar from "./components/Layout/Navbar";
import HeroSection from "./components/Layout/HeroSection";
import PropertyMap from "./components/PropertyMap";
import Footer from "./components/Layout/Footer";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Stack
        sx={{
          minHeight: "100vh",
          backgroundColor: "background.default",
          width: "100%",
        }}
      >
        <Navbar />

        <Box
          component="main"
          sx={{ flexGrow: 1, display: "flex", flexDirection: "column", width: "100%" }}
        >
          <HeroSection />

          {/* Map Section */}
          <Box
            sx={{
              maxWidth: 1440,
              mx: "auto",
              width: "100%",
              px: { xs: 0, md: 3 },
              pb: { xs: 2, md: 3 },
            }}
          >
            <PropertyMap />
          </Box>
        </Box>

        <Footer />
      </Stack>
    </ThemeProvider>
  );
};

export default App;
