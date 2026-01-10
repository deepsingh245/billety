import Stack from '@mui/material/Stack';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import CustomDatePicker from '../CustomDatePicker/CustomDatePicker';
import NavbarBreadcrumbs from '../NavbarBreadcrumbs/NavbarBreadcrumbs';
import MenuButton from '../MenuButton/MenuButton';
import ColorModeIconDropdown from '../../shared/ColorModeIconDropdown';
import Search from '../Search/Search';
import { useLocation } from 'react-router-dom';

export default function Header() {
  const location = useLocation();
  const showDatePicker = location.pathname.includes('/invoices');

  return (
    <Stack
      direction="row"
      sx={{
        display: { xs: 'none', md: 'flex' },
        width: '100%',
        alignItems: { xs: 'flex-start', md: 'center' },
        justifyContent: 'space-between',
        maxWidth: { sm: '100%', md: '1700px' },
        pt: 1.5,
      }}
      spacing={2}
    >
      <NavbarBreadcrumbs />
      <Stack direction="row" sx={{ gap: 1 }}>
        <Search disabled />
        {showDatePicker && <CustomDatePicker />}
        <MenuButton aria-label="Open notifications" disabled>
          <NotificationsRoundedIcon />
        </MenuButton>
        <ColorModeIconDropdown />
      </Stack>
    </Stack>
  );
}
