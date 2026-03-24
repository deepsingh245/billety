import { Paper, Typography, Box, Divider, Grid } from '@mui/material';

export const GroupRenderer = ({ groups, renderField }: any) => {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {groups.map((g: any) => (
          <Paper key={g.id} variant="outlined" sx={{ p: 3, borderRadius: 2, bgcolor: 'background.paper' }}>
             {g.title && <Typography variant="h6" gutterBottom>{g.title}</Typography>}
             {g.subtitle && <Typography variant="body2" color="text.secondary" gutterBottom mb={2}>{g.subtitle}</Typography>}
             {g.title && <Divider sx={{ mb: 3 }} />}
             <Grid container spacing={3}>
                {(g.fields || []).map((f: string) => renderField({ id: f }))}
             </Grid>
          </Paper>
        ))}
      </Box>
    );
};
