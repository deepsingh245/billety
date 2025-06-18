import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography';
import CustomizedDataGrid from '../../components/CustomizedDataGrid/CustomizedDataGrid'
import Stack from '@mui/material/Stack'

function Clients() {
  return (
    <Stack width={'100%'}>
    <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Details
      </Typography>
      <Grid container spacing={2} columns={12}>
        <Grid size={{ xs: 12, lg: 12 }}>
          <CustomizedDataGrid />
        </Grid>
        <Grid size={{ xs: 12, lg: 3 }}>
          <Stack gap={2} direction={{ xs: 'column', sm: 'row', lg: 'column' }}>
            {/* <CustomizedTreeView /> */}
          </Stack>
        </Grid>
      </Grid>
      </Stack>
  )
}

export default Clients