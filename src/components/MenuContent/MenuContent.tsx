
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { ROUTES } from "../../constants/routes.constants";
import { useAuth } from '../../context/AuthContext';

const mainListItems = [
  { text: 'common.dashboard', icon: <HomeRoundedIcon />, path: ROUTES.DASHBOARD.HOME },
  { text: 'common.clients', icon: <PeopleRoundedIcon />, path: ROUTES.DASHBOARD.CLIENTS },
  { text: 'common.items', icon: <AnalyticsRoundedIcon />, path: ROUTES.DASHBOARD.ITEMS },
  { text: 'common.invoices', icon: <AssignmentRoundedIcon />, path: ROUTES.DASHBOARD.INVOICES.ROOT },
  { text: 'common.settings', icon: <SettingsRoundedIcon />, path: ROUTES.DASHBOARD.SETTINGS },
  { text: 'common.profile', icon: <AssignmentRoundedIcon />, path: ROUTES.DASHBOARD.PROFILE },
];

const secondaryListItems = [
  { text: 'common.logout', icon: <SettingsRoundedIcon /> },
];

export default function MenuContent() {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const navigate = useNavigate()
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const onItemClick = (item: any, index: number) => {
    setSelectedIndex(index)
    navigate(item.path)
  }

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
      <List dense>
        {mainListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <ListItemButton selected={index === selectedIndex} onClick={() => onItemClick(item, index)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={t(item.text)} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <List dense>
        {secondaryListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <ListItemButton onClick={() => {
              if (item.text === 'common.logout') {
                logout();
              }
            }}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={t(item.text)} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
