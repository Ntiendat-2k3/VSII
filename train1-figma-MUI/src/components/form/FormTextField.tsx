import { Controller } from 'react-hook-form';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import TextField, { type TextFieldProps } from '@mui/material/TextField';
import { PALETTE } from '../../theme';

export type FormTextFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = Omit<TextFieldProps, 'name'> & {
  name: TName;
  control: Control<TFieldValues>;
};

const FormTextField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  control,
  helperText,
  sx,
  ...props
}: FormTextFieldProps<TFieldValues, TName>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          {...props}
          error={!!fieldState.error}
          helperText={fieldState.error ? fieldState.error.message : helperText}
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: PALETTE.BACKGROUND_DEFAULT,
              height: 46,
            },
            ...sx,
          }}
        />
      )}
    />
  );
};

export default FormTextField;
