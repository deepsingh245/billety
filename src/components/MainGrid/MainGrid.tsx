import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Copyright from '../internals/components/Copyright';
import { GlobeFlag } from '../internals/components/CustomIcons';
import ChartUserByCountry from '../ChartUserByCountry/ChartUserByCountry';
import PageViewsBarChart from '../PageViewsBarChart/PageViewsBarChart';
import SessionsChart from '../SessionsChart/SessionsChart';
import StatCard, { StatCardProps } from '../StatCard/StatCard';
import { useData } from '../../context/dataContext';

export default function MainGrid() {
  const { clients, invoices, items } = useData();

  const data: StatCardProps[] = [
    {
      title: 'Total Clients',
      value: clients.length.toString(),
      interval: 'All time',
      trend: 'neutral',
      data: [0, clients.length], // Simplified trend
    },
    {
      title: 'Total Invoices',
      value: invoices.length.toString(),
      interval: 'All time',
      trend: 'neutral',
      data: [0, invoices.length],
    },
    {
      title: 'Total Items',
      value: items.length.toString(),
      interval: 'All time',
      trend: 'neutral',
      data: [0, items.length],
    },
  ];

  // Prepare data for SessionsChart (Invoice Trend - simplified)
  const invoiceTrendData = invoices.map(inv => inv.totalAmount || 0);
  const invoiceLabels = invoices.map((_, i) => (i + 1).toString());

  // Prepare data for PageViewsBarChart (Items price point)
  const itemNames = items.slice(0, 5).map(i => i.name);
  const itemRates = items.slice(0, 5).map(i => i.ratePerPiece || i.ratePerKg || 0);

  // Prepare data for ChartUserByCountry (Top Clients by Name)
  const topClients = clients.slice(0, 4).map((client, index) => ({
    name: client.name,
    value: 25, // Mock percentage for now as we just list them
    color: `hsl(220, 25%, ${65 - index * 15}%)`,
    flag: <GlobeFlag />,
  }));

  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      {/* cards */}
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Overview
      </Typography>
      <Grid container spacing={2} columns={12} sx={{ mb: (theme) => theme.spacing(2) }}>
        {data.map((card, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard {...card} />
          </Grid>
        ))}
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Revenue (Est)"
            value={`$${invoices.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0).toFixed(0)}`}
            interval="All time"
            trend="neutral"
            data={invoiceTrendData.length > 0 ? invoiceTrendData : [0]}
          />
        </Grid>
      </Grid>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Details
      </Typography>
      <Grid container spacing={2} columns={12}>
        <Grid size={{ xs: 12, lg: 9 }}>
          <SessionsChart
            title="Invoice Values"
            subtitle="Value of recent invoices"
            total={invoices.length.toString()}
            trend=""
            trendColor="default"
            data={invoiceTrendData.length > 0 ? invoiceTrendData : [0]}
            labels={invoiceLabels.length > 0 ? invoiceLabels : ["0"]}
          />
        </Grid>
        <Grid size={{ xs: 12, lg: 3 }}>
          <ChartUserByCountry
            title="Top Clients"
            totalLabel="Clients"
            totalValue={clients.length.toString()}
            data={topClients}
          />
        </Grid>
        <Grid size={{ xs: 12, lg: 12 }}>
          <PageViewsBarChart
            title="Item Rates"
            subtitle="Rates of top items"
            total={items.length.toString() + " Items"}
            trend=""
            trendColor="default"
            xAxisLabels={itemNames}
            series={[
              { id: 'rate', label: 'Rate', data: itemRates }
            ]}
          />
        </Grid>
      </Grid>
      <Copyright sx={{ my: 4 }} />
    </Box>
  );
}
