
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

import { ROUTES } from "../../constants/routes.constants";

const mainListItems = [
  { text: 'Home', icon: <HomeRoundedIcon />, path: ROUTES.DASHBOARD.HOME },
  { text: 'Clients', icon: <PeopleRoundedIcon />, path: ROUTES.DASHBOARD.CLIENTS },
  { text: 'Items', icon: <AnalyticsRoundedIcon />, path: ROUTES.DASHBOARD.ITEMS },
  { text: 'Invoices', icon: <AssignmentRoundedIcon />, path: ROUTES.DASHBOARD.INVOICES.ROOT },
];

const secondaryListItems = [
  { text: 'Settings', icon: <SettingsRoundedIcon />, path: ROUTES.DASHBOARD.SETTINGS },
  { text: 'Profile', icon: <AssignmentRoundedIcon />, path: ROUTES.DASHBOARD.PROFILE },
  { text: 'Logout', icon: <SettingsRoundedIcon /> },
];

export default function MenuContent() {
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
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <List dense>
        {secondaryListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <ListItemButton onClick={() => navigate(item.path)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
