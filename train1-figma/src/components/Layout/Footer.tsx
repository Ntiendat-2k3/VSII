import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin } from 'lucide-react';
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import { PALETTE, GRADIENT } from '../../theme';

const MotionBox = motion(Box);

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        background: GRADIENT.PRIMARY,
        px: { xs: 1.5, md: 4 },
        py: { xs: 3, md: 4 },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'flex-start',
          gap: 4,
          textAlign: 'left',
        }}
      >
        {/* Company info */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 3, maxWidth: { xs: '100%', md: 373 } }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2, justifyContent: 'flex-start' }}>
            <Box
              component="img"
              src="/logo-white.png"
              alt="Realestate Logo"
              sx={{ width: 60, height: 60, objectFit: 'contain' }}
            />
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: '1rem',
                lineHeight: '24px',
                color: PALETTE.BACKGROUND_PAPER,
              }}
            >
              Nền tảng công nghệ tiên phong & dẫn đầu lĩnh vực kinh doanh bất động sản tại Việt Nam
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, alignItems: 'flex-start' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Phone size={16} color={PALETTE.BACKGROUND_DEFAULT} />
              <Typography
                sx={{
                  fontWeight: 500,
                  fontSize: '0.8125rem',
                  lineHeight: '26px',
                  color: PALETTE.BACKGROUND_DEFAULT,
                }}
              >
                0972 72 9999
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Mail size={16} color={PALETTE.BACKGROUND_DEFAULT} />
              <Typography
                sx={{
                  fontWeight: 500,
                  fontSize: '0.8125rem',
                  lineHeight: '26px',
                  color: PALETTE.BACKGROUND_DEFAULT,
                }}
              >
                Contact@gmail.com
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, pt: 0.5 }}>
              <Box sx={{ display: 'flex', mt: 0.5 }}>
                <MapPin size={16} color={PALETTE.BACKGROUND_DEFAULT} />
              </Box>
              <Typography
                sx={{
                  fontWeight: 500,
                  fontSize: '0.8125rem',
                  lineHeight: '21px',
                  color: PALETTE.BACKGROUND_DEFAULT,
                  textAlign: 'left'
                }}
              >
                SB24-36, Sao Biển 24, KĐT Vinhomes Ocean Park, Xã Gia Lâm, TP Hà Nội, Việt Nam
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 4, md: 8 }, flex: 1, justifyContent: 'flex-end', width: '100%' }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 4, md: 8 }, justifyContent: 'flex-start' }}>
            {/* Menu */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-start' }}>
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: '1.125rem',
                  color: PALETTE.SURFACE_LIGHT,
                }}
              >
                Danh mục
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-start' }}>
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
              </Box>
            </Box>

            {/* Social */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-start' }}>
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: '1.125rem',
                  color: PALETTE.SURFACE_LIGHT,
                }}
              >
                Kết nối
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-start' }}>
                {[
                  { id: 'fb', icon: <FacebookIcon sx={{ fontSize: 18, color: '#fff' }} /> },
                  { id: 'yt', icon: <YouTubeIcon sx={{ fontSize: 18, color: '#fff' }} /> },
                  { id: 'ig', icon: <InstagramIcon sx={{ fontSize: 18, color: '#fff' }} /> },
                  { id: 'tw', icon: <TwitterIcon sx={{ fontSize: 18, color: '#fff' }} /> }
                ].map((item) => (
                  <MotionBox
                    key={item.id}
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                    whileHover={{ backgroundColor: 'rgba(255,255,255,0.3)', y: -3 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {item.icon}
                  </MotionBox>
                ))}
              </Box>
            </Box>
          </Box>

          {/* Map iframe */}
          <Box sx={{ width: { xs: '100%', md: 300 }, height: 200, borderRadius: 2, overflow: 'hidden' }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.811559902302!2d105.93818311540199!3d20.985929986021655!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135a1a1f5928f09%3A0x633d2fc1a11db9d9!2zVmluaG9tZXMgT2NlYW4gUGFyayBHaWEgTMOibQ!5e0!3m2!1svi!2s!4v1689000000000!5m2!1svi!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </Box>
        </Box>
      </Box>

      {/* Copyright */}
      <Box
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
      </Box>
    </Box>
  );
};

export default Footer;
