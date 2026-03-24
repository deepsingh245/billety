import { Grid } from '@mui/material';

export const LayoutRenderer = ({ layout, children }: any) => {
  return (
    <Grid container spacing={layout?.gap || 3}>
      {children}
    </Grid>
  );
};
