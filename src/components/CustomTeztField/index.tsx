import * as React from 'react';
import TextField, { TextFieldProps } from '@mui/material/TextField';

type CustomTextFieldProps = TextFieldProps & {
  shrinkLabel?: boolean;
};

const CustomTextField = React.forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  CustomTextFieldProps
>(function CustomTextField(
  {
    shrinkLabel = true,
    size = 'small',
    variant = 'outlined',
    multiline = false,
    minRows = 3,
    placeholder,
    slotProps,
    sx,
    ...props
  },
  ref
) {
  return (
    <TextField
      {...props}
      size={size}
      variant={variant}
      multiline={multiline}
      minRows={multiline ? minRows : undefined}
      placeholder={placeholder}

      slotProps={{
        ...slotProps,

        // ✅ Correct label control (v7)
        inputLabel: {
          shrink: shrinkLabel,
        },

        // ✅ Correct ref target (input / textarea)
        input: {
          ref,
          ...slotProps?.input,
        },
      }}

      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: 2,
          alignItems: 'flex-start', // ✅ critical for multiline
        },

        /* ===== SINGLE LINE INPUT ===== */
        '& .MuiOutlinedInput-input:not(textarea)': {
          padding: size === 'small' ? '10.5px 14px' : '16.5px 14px',
        },

        /* ===== MULTILINE TEXTAREA ===== */
        '& .MuiOutlinedInput-inputMultiline': {
          padding: '10.5px 14px',
          lineHeight: 1.5,
          whiteSpace: 'pre-wrap',
        },

        /* ===== LABEL FIX ===== */
        '& .MuiInputLabel-outlined': {
          transform: 'translate(14px, 9px) scale(1)',
        },
        '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
          transform: 'translate(14px, -9px) scale(0.75)',
        },

        ...sx,
      }}

    />
  );
});

export default CustomTextField;
