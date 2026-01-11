import React from "react";
import Box from "@mui/material/Box";

import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Switch from "@mui/material/Switch";
import Divider from "@mui/material/Divider";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { useTranslation } from 'react-i18next';
import { useData } from "../../context/dataContext";

export default function Settings() {
    const { settings, updateSettings } = useData();
    const { t } = useTranslation();

    const handleNotificationChange = (type: 'email' | 'push', value: boolean) => {
        updateSettings({
            notifications: {
                ...settings.notifications,
                [type]: value
            }
        });
    };

    return (
        <Box sx={{ width: "100%", maxWidth: { xs: "100%", md: "1700px" } }}>
            <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
                {t('settings.title')}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                <Box sx={{ flex: 1 }}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                {t('settings.notifications')}
                            </Typography>
                            <List>
                                <ListItem>
                                    <ListItemText primary={t('settings.emailNotifications')} secondary={t('settings.emailNotificationsDesc')} />
                                    <Switch
                                        checked={settings.notifications.email}
                                        onChange={(e) => handleNotificationChange('email', e.target.checked)}
                                    />
                                </ListItem>
                                <Divider />
                                <ListItem>
                                    <ListItemText primary={t('settings.pushNotifications')} secondary={t('settings.pushNotificationsDesc')} />
                                    <Switch
                                        checked={settings.notifications.push}
                                        onChange={(e) => handleNotificationChange('push', e.target.checked)}
                                    />
                                </ListItem>
                            </List>
                        </CardContent>
                    </Card>
                </Box>

                <Box sx={{ flex: 1 }}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                {t('settings.generalPreferences')}
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                <FormControl fullWidth>
                                    <InputLabel id="language-select-label">{t('settings.language')}</InputLabel>
                                    <Select
                                        labelId="language-select-label"
                                        id="language-select"
                                        value={settings.language}
                                        label={t('settings.language')}
                                        onChange={(e) => updateSettings({ language: e.target.value })}
                                    >
                                        <MenuItem value="en">English</MenuItem>
                                        <MenuItem value="es">Spanish</MenuItem>
                                        <MenuItem value="fr">French</MenuItem>
                                        <MenuItem value="de">German</MenuItem>
                                    </Select>
                                </FormControl>

                                <FormControl fullWidth>
                                    <InputLabel id="currency-select-label">{t('settings.currency')}</InputLabel>
                                    <Select
                                        labelId="currency-select-label"
                                        id="currency-select"
                                        value={settings.currency}
                                        label={t('settings.currency')}
                                        onChange={(e) => updateSettings({ currency: e.target.value })}
                                    >
                                        <MenuItem value="USD">USD ($)</MenuItem>
                                        <MenuItem value="EUR">EUR (€)</MenuItem>
                                        <MenuItem value="INR">INR (₹)</MenuItem>
                                        <MenuItem value="GBP">GBP (£)</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
            </Box>
        </Box>
    );
}
