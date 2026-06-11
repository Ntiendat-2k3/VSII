import { Controller } from 'react-hook-form';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import AppTextField, { type AppTextFieldProps } from '../ui/AppTextField';

export type FormTextFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = Omit<AppTextFieldProps, 'name'> & {
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
  ...props
}: FormTextFieldProps<TFieldValues, TName>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <AppTextField
          {...({
            ...field,
            ...props,
            error: !!fieldState.error,
            helperText: fieldState.error ? fieldState.error.message : helperText,
          } as AppTextFieldProps)}
        />
      )}
    />
  );
};

export default FormTextField;
