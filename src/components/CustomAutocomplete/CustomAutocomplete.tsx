import { Autocomplete, Box, TextField, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";

interface CustomAutocompleteProps<T> {
    options: T[];
    value: T | null;
    onChange: (newValue: T | null) => void;
    getOptionLabel: (option: T) => string;
    renderOptionContent: (option: T) => React.ReactNode;
    label?: string;
    placeholder?: string;
    sx?: any;
}

export function CustomAutocomplete<T>({
    options,
    value,
    onChange,
    getOptionLabel,
    renderOptionContent,
    label,
    placeholder,
    disabled,
    sx = {}
}: CustomAutocompleteProps<T>) {
    return (
        <Autocomplete
            options={options}
            autoHighlight
            disabled={disabled}
            popupIcon={<ExpandMoreIcon />}
            clearIcon={<CloseIcon fontSize="small" />}
            getOptionLabel={getOptionLabel}
            value={value}
            onChange={(_, newValue) => onChange(newValue)}
            fullWidth
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    size="small"
                    placeholder={placeholder}
                    variant="outlined"
                    fullWidth
                    slotProps={{
                        htmlInput: {
                            ...params.inputProps,
                        }
                    }}
                    sx={{
                        ...sx,
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            paddingRight: '30px !important',
                            '& .MuiAutocomplete-endAdornment': {
                                right: '4px',
                                '& .MuiAutocomplete-popupIndicator': {
                                    border: 'none',
                                    backgroundColor: 'transparent',
                                },
                                '& .MuiAutocomplete-clearIndicator': {
                                    border: 'none',
                                    backgroundColor: 'transparent',
                                }
                            }
                        },
                    }}
                />
            )}
            renderOption={(props, option) => (
                <Box component="li" {...props} sx={{ '& > img': { mr: 2, flexShrink: 0 } }}>
                    {renderOptionContent(option)}
                </Box>
            )}
        />
    );
}
