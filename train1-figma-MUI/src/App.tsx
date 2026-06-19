import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { MotionConfig, LazyMotion, domAnimation } from "framer-motion";
import { Toaster } from "sonner";
import { Suspense, lazy } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import theme from "./theme";
import Navbar from "./components/common/Layout/Navbar";
import HeroSection from "./components/common/HeroSection";
import Footer from "./components/common/Layout/Footer";

const PropertyMap = lazy(() => import("./features/property-map/components/PropertyMap"));
import ErrorBoundary from "./components/ErrorBoundary";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MotionConfig reducedMotion="user">
        <LazyMotion features={domAnimation}>
          <Toaster
        position="top-right"
        richColors
        toastOptions={{
          style: { fontFamily: '"Inter", sans-serif' },
        }}
      />
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
            <ErrorBoundary>
              <Suspense fallback={<Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>}>
                <PropertyMap />
              </Suspense>
            </ErrorBoundary>
          </Box>
        </Box>

        <Footer />
      </Stack>
        </LazyMotion>
      </MotionConfig>
    </ThemeProvider>
  );
};

export default App;
