import { useForm, type Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { Lock } from 'lucide-react';
import FormTextField from '@/components/form/FormTextField';
import { PALETTE, GRADIENT, SHADOW, BORDER_RADIUS } from '@/theme';

const loginSchema = yup.object({
  username: yup.string().required('Vui lòng nhập tên đăng nhập'),
  password: yup.string().required('Vui lòng nhập mật khẩu'),
}).required();

export type LoginFormData = yup.InferType<typeof loginSchema>;

interface LoginFormProps {
  onLogin: (data: LoginFormData) => Promise<void>;
  isLoggingIn: boolean;
}

const LoginForm = ({ onLogin, isLoggingIn }: LoginFormProps) => {
  const { control, handleSubmit } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema) as unknown as Resolver<LoginFormData>,
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginFormData) => {
    onLogin(data);
  };

  return (
    <Stack
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      spacing={2.5}
      sx={{
        alignItems: 'center',
        p: 4,
        borderRadius: `${BORDER_RADIUS.LARGE}px`,
        backgroundColor: 'rgba(255, 255, 255, 0.92)',
        boxShadow: SHADOW.POPUP,
        maxWidth: 360,
        width: '90%',
      }}
    >
      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: GRADIENT.PRIMARY,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Lock size={28} color={PALETTE.WHITE} />
      </Box>

      <Typography
        variant="h2"
        sx={{
          color: PALETTE.TEXT_PRIMARY,
          textAlign: 'center',
        }}
      >
        Yêu cầu đăng nhập
      </Typography>

      <Typography
        variant="body2"
        sx={{
          color: PALETTE.TEXT_SECONDARY,
          textAlign: 'center',
        }}
      >
        Vui lòng đăng nhập để xem thông tin mặt bằng quỹ căn dự án.
      </Typography>

      <Stack spacing={2} sx={{ width: '100%', mt: 1 }}>
        <FormTextField
          name="username"
          control={control}
          fullWidth
          placeholder="Tên đăng nhập"
          disabled={isLoggingIn}
        />
        <FormTextField
          name="password"
          control={control}
          type="password"
          fullWidth
          placeholder="Mật khẩu"
          disabled={isLoggingIn}
        />
      </Stack>

      <Button
        fullWidth
        type="submit"
        variant="contained"
        disabled={isLoggingIn}
        sx={{
          background: GRADIENT.PRIMARY,
          color: PALETTE.WHITE,
          py: 1.25,
          fontWeight: 600,
          boxShadow: 'none',
          '&:hover': {
            background: GRADIENT.PRIMARY,
            opacity: 0.9,
            boxShadow: 'none',
          },
          ...(isLoggingIn && {
            background: 'rgba(0, 0, 0, 0.12)',
            color: 'rgba(0, 0, 0, 0.26)',
          }),
        }}
      >
        {isLoggingIn ? <CircularProgress size={24} color="inherit" /> : 'Đăng nhập'}
      </Button>
    </Stack>
  );
};

export default LoginForm;
