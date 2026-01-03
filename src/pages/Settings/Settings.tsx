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

export default function Settings() {
    const [notificationsEmail, setNotificationsEmail] = React.useState(true);
    const [notificationsPush, setNotificationsPush] = React.useState(true);
    const [language, setLanguage] = React.useState("en");
    const [currency, setCurrency] = React.useState("USD");

    return (
        <Box sx={{ width: "100%", maxWidth: { xs: "100%", md: "1700px" } }}>
            <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
                Settings
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                <Box sx={{ flex: 1 }}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Notifications
                            </Typography>
                            <List>
                                <ListItem>
                                    <ListItemText primary="Email Notifications" secondary="Receive emails about your account activity" />
                                    <Switch
                                        checked={notificationsEmail}
                                        onChange={(e) => setNotificationsEmail(e.target.checked)}
                                    />
                                </ListItem>
                                <Divider />
                                <ListItem>
                                    <ListItemText primary="Push Notifications" secondary="Receive push notifications on your device" />
                                    <Switch
                                        checked={notificationsPush}
                                        onChange={(e) => setNotificationsPush(e.target.checked)}
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
                                General Preferences
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                <FormControl fullWidth>
                                    <InputLabel id="language-select-label">Language</InputLabel>
                                    <Select
                                        labelId="language-select-label"
                                        id="language-select"
                                        value={language}
                                        label="Language"
                                        onChange={(e) => setLanguage(e.target.value)}
                                    >
                                        <MenuItem value="en">English</MenuItem>
                                        <MenuItem value="es">Spanish</MenuItem>
                                        <MenuItem value="fr">French</MenuItem>
                                        <MenuItem value="de">German</MenuItem>
                                    </Select>
                                </FormControl>

                                <FormControl fullWidth>
                                    <InputLabel id="currency-select-label">Currency</InputLabel>
                                    <Select
                                        labelId="currency-select-label"
                                        id="currency-select"
                                        value={currency}
                                        label="Currency"
                                        onChange={(e) => setCurrency(e.target.value)}
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
