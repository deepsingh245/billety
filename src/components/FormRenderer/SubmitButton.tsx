import { Button } from '@mui/material';

export const SubmitButton = ({ label, loadingLabel, isLoading, isSuccess, fullWidth, style }: any) => {
  return (
    <Button 
      type="submit" 
      variant="contained" 
      color={isSuccess ? "success" : "primary"}
      disabled={isLoading}
      fullWidth={fullWidth}
      sx={{ color: 'white', ...(style || {}) }}
    >
      {isLoading ? (loadingLabel || 'Submitting...') : (label || 'Submit')}
    </Button>
  );
};
