
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Breadcrumbs, { breadcrumbsClasses } from '@mui/material/Breadcrumbs';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import Link from '@mui/material/Link';

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  margin: theme.spacing(1, 0),
  [`& .${breadcrumbsClasses.separator}`]: {
    color: (theme.vars || theme).palette.action.disabled,
    margin: 1,
  },
  [`& .${breadcrumbsClasses.ol}`]: {
    alignItems: 'center',
  },
}));

export default function NavbarBreadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <StyledBreadcrumbs
      aria-label="breadcrumb"
      separator={<NavigateNextRoundedIcon fontSize="small" />}
    >
      <Typography variant="body1">Dashboard</Typography>
      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        if (value === 'dashboard') return null;

        // Check if value looks like an ID (basic alphanumeric check or length)
        // Adjust logic as needed for your ID format (e.g., Firebase IDs are usually ~20 chars)
        const isId = value.length > 20 || /\d/.test(value);

        let displayName = value.charAt(0).toUpperCase() + value.slice(1);
        if (isId) {
          const prevSegment = pathnames[index - 1];
          // Simple mapping based on parent route. Add more cases as needed.
          if (prevSegment === 'invoices') displayName = 'Invoice Details';
          else if (prevSegment === 'clients') displayName = 'Client Details';
          else if (prevSegment === 'items') displayName = 'Item Details';
          else displayName = 'Details';
        }

        return last ? (
          <Typography key={to} variant="body1" sx={{ color: 'text.primary', fontWeight: 600 }}>
            {displayName}
          </Typography>
        ) : (
          <Link component={RouterLink} underline="hover" color="inherit" to={to} key={to}>
            <Typography variant="body1">{displayName}</Typography>
          </Link>
        );
      })}
    </StyledBreadcrumbs>
  );
}
