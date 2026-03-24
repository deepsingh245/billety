import { FormControl, FormLabel, FormHelperText, Checkbox, FormControlLabel } from '@mui/material';
import CustomTextField from '../CustomTextField';
export const FieldComponents = {
  text: ({ error, label, required, placeholder, value, onChange, ...props }: any) => (
    <CustomTextField
      fullWidth
      label={label}
      required={required}
      shrinkLabel
      placeholder={placeholder}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      error={!!error}
      helperText={error?.message || error}
      {...props}
    />
  ),
  number: ({ error, label, required, placeholder, value, onChange, ...props }: any) => (
    <CustomTextField
      fullWidth
      type="number"
      label={label}
      required={required}
      shrinkLabel
      placeholder={placeholder}
      value={value || ''}
      onChange={(e) => onChange(Number(e.target.value))}
      error={!!error}
      helperText={error?.message || error}
      {...props}
    />
  ),
  email: ({ error, label, required, placeholder, value, onChange, ...props }: any) => (
    <CustomTextField
      fullWidth
      type="email"
      label={label}
      required={required}
      shrinkLabel
      placeholder={placeholder}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      error={!!error}
      helperText={error?.message || error}
      {...props}
    />
  ),
  checkbox: ({ error, label, value, onChange, ...props }: any) => (
    <FormControl fullWidth error={!!error}>
      <FormControlLabel 
        control={<Checkbox checked={!!value} onChange={(e) => onChange(e.target.checked)} {...props} />} 
        label={label} 
      />
      {error && <FormHelperText>{error.message || error}</FormHelperText>}
    </FormControl>
  )
};
