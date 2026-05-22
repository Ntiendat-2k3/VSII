import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import FooterCompanyInfo from './FooterCompanyInfo';
import { PALETTE, GRADIENT } from '../../theme';

const MotionStack = motion(Stack);

const Footer = () => {
  return (
    <Stack
      component="footer"
      sx={{
        background: GRADIENT.PRIMARY,
        py: { xs: 3, md: 4 },
        width: '100%',
      }}
    >
      <Stack
        spacing={3}
        sx={{
          maxWidth: 1440,
          mx: 'auto',
          width: '100%',
          px: { xs: 1.5, md: 4 },
        }}
      >
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={4}
          sx={{
            textAlign: 'left',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          {/* Company info subcomponent */}
          <FooterCompanyInfo />

          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={{ xs: 4, md: 8 }}
            sx={{ flex: 1, justifyContent: 'flex-end', width: '100%' }}
          >
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={{ xs: 4, md: 8 }}
              sx={{ justifyContent: 'flex-start' }}
            >
              {/* Menu */}
              <Stack spacing={2} sx={{ alignItems: 'flex-start' }}>
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: '1.125rem',
                    color: PALETTE.SURFACE_LIGHT,
                  }}
                >
                  Danh mục
                </Typography>
                <Stack spacing={1} sx={{ alignItems: 'flex-start' }}>
                  {['Giới thiệu', 'Dự án', 'Liên hệ'].map((item) => (
                    <Typography
                      key={item}
                      sx={{
                        fontWeight: 500,
                        fontSize: '0.9375rem',
                        color: PALETTE.BACKGROUND_DEFAULT,
                        cursor: 'pointer',
                        '&:hover': { opacity: 0.8 },
                      }}
                    >
                      - {item}
                    </Typography>
                  ))}
                </Stack>
              </Stack>

              {/* Social */}
              <Stack spacing={2} sx={{ alignItems: 'flex-start' }}>
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: '1.125rem',
                    color: PALETTE.SURFACE_LIGHT,
                  }}
                >
                  Kết nối
                </Typography>
                <Stack
                  direction="row"
                  spacing={2}
                  sx={{ justifyContent: 'flex-start' }}
                >
                  {[
                    { id: 'fb', icon: <FacebookIcon sx={{ fontSize: 18, color: PALETTE.WHITE }} /> },
                    { id: 'yt', icon: <YouTubeIcon sx={{ fontSize: 18, color: PALETTE.WHITE }} /> },
                    { id: 'ig', icon: <InstagramIcon sx={{ fontSize: 18, color: PALETTE.WHITE }} /> },
                    { id: 'tw', icon: <TwitterIcon sx={{ fontSize: 18, color: PALETTE.WHITE }} /> }
                  ].map((item) => (
                    <MotionStack
                      key={item.id}
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        backgroundColor: PALETTE.WHITE_ALPHA_10,
                        cursor: 'pointer',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      whileHover={{ backgroundColor: PALETTE.WHITE_ALPHA_30, y: -3 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {item.icon}
                    </MotionStack>
                  ))}
                </Stack>
              </Stack>
            </Stack>

            {/* Map iframe */}
            <Box sx={{ width: { xs: '100%', md: 300 }, height: 200, borderRadius: 2, overflow: 'hidden' }}>
              <Box
                component="iframe"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.811559902302!2d105.93818311540199!3d20.985929986021655!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135a1a1f5928f09%3A0x633d2fc1a11db9d9!2zVmluaG9tZXMgT2NlYW4gUGFyayBHaWEgTMOibQ!5e0!3m2!1svi!2s!4v1689000000000!5m2!1svi!2s"
                width="100%"
                height="100%"
                sx={{ border: 0 }}
                title="Vinhomes Ocean Park Map Location"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </Box>
          </Stack>
        </Stack>

        {/* Copyright */}
        <Stack
          sx={{
            borderTop: `1px solid ${PALETTE.SURFACE_LIGHT}`,
            pt: 2,
          }}
        >
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: '1.125rem',
              lineHeight: '26px',
              color: PALETTE.BACKGROUND_DEFAULT,
              textAlign: 'left'
            }}
          >
            © 2026 - Realestate. All rights reserved.
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Footer;
