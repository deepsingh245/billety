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
  // ref
) {
  return (
    <TextField
      {...props}
      size={size}
      variant={variant}
      multiline={multiline}
      minRows={multiline ? minRows : undefined}
      placeholder={placeholder}

      sx={{
        //   '& .MuiOutlinedInput-root': {
        //     // height: 'fit-content !important',
        //     alignItems: 'flex-start', // ✅ critical for multiline
        //   },

        //   /* ===== SINGLE LINE INPUT ===== */
        //   '& .MuiOutlinedInput-input:not(textarea)': {
        //     padding: size === 'small' ? '10.5px 14px' : '16.5px 14px',
        //   },

        //   /* ===== MULTILINE TEXTAREA ===== */
        //   '& .MuiOutlinedInput-inputMultiline': {
        //     padding: '10.5px 14px',
        //     lineHeight: 1.5,
        //     whiteSpace: 'pre-wrap',
        //     // height: 'fit-content !important',
        //     overflow: 'auto !important',
        //   },

        '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
          padding: '2px',
          backgroundColor: 'background.default',
        },
        //   '& .MuiInputBase-input': {
        //     // height: 'fit-content !important',
        //     overflow: 'auto !important',
        //   },

        ...sx,
      }}

    />
  );
});

export default CustomTextField;
