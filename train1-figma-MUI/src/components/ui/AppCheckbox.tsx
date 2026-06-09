import Checkbox, { type CheckboxProps } from '@mui/material/Checkbox';
import { SquareCheck, Square } from 'lucide-react';
import { PALETTE } from '../../theme';

export type AppCheckboxProps = CheckboxProps;

const AppCheckbox = ({ icon, checkedIcon, sx, ...props }: AppCheckboxProps) => {
  return (
    <Checkbox
      icon={icon || <Square size={18} color={PALETTE.TEXT_SECONDARY} />}
      checkedIcon={checkedIcon || <SquareCheck size={18} color={PALETTE.SURFACE_LIGHT} />}
      sx={{ p: 0, ...sx }}
      {...props}
    />
  );
};

export default AppCheckbox;
