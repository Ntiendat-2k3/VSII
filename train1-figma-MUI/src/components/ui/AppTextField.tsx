import TextField, { type TextFieldProps } from '@mui/material/TextField';
import { PALETTE } from '../../theme';

export type AppTextFieldProps = TextFieldProps;

const AppTextField = ({ sx, ...props }: AppTextFieldProps) => {
  return (
    <TextField
      sx={{
        '& .MuiOutlinedInput-root': {
          backgroundColor: PALETTE.BACKGROUND_DEFAULT,
          height: 46,
        },
        ...sx,
      }}
      {...props}
    />
  );
};

export default AppTextField;
