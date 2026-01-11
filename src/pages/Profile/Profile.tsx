import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { useTranslation } from 'react-i18next';
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import SmartphoneRoundedIcon from '@mui/icons-material/SmartphoneRounded';
import DevicesRoundedIcon from '@mui/icons-material/DevicesRounded';
import ConstructionRoundedIcon from '@mui/icons-material/ConstructionRounded';

import { updateProfile } from "firebase/auth";
import { useAuth } from "../../context/AuthContext";
import { useGlobalUI } from "../../context/globalUIContext";
import { createDocument, getDocument, updateDocument } from "../../firebase/firebaseUtils";
import { useData } from "../../context/dataContext";
import { Project } from "../../interfaces/project.interface";
import { indexedDBService } from "../../services/indexedDB.service";
import { useRef } from "react";
import CustomTextField from "../../components/CustomTextField";

export default function Profile() {
    const { t } = useTranslation();
    const { user } = useAuth();
    const { showToast, openAlert, setLoading } = useGlobalUI();
    const { projects, addProject } = useData();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Profile State
    const [name, setName] = useState("");
    const [photoURL, setPhotoURL] = useState("");
    const [phone, setPhone] = useState("");
    const [company, setCompany] = useState("");
    const [address, setAddress] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    // Add Site State
    const [openAddSite, setOpenAddSite] = useState(false);
    const [newSiteName, setNewSiteName] = useState("");
    const [newSiteCategory, setNewSiteCategory] = useState("");
    const [newSitePlan, setNewSitePlan] = useState("");

    useEffect(() => {
        if (user) {
            setName(user.displayName || "");
            const loadProfileImage = async () => {
                const storedImage = await indexedDBService.getImage(user.uid);
                if (storedImage) {
                    setPhotoURL(storedImage);
                } else {
                    setPhotoURL(user.photoURL || "");
                }
            };
            loadProfileImage();
            fetchExtraDetails();
        }
    }, [user]);

    const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0] && user) {
            const file = event.target.files[0];
            setLoading(true);
            try {
                await indexedDBService.saveImage(user.uid, file);
                const newImage = await indexedDBService.getImage(user.uid);
                if (newImage) setPhotoURL(newImage);
                showToast("Photo updated in local storage!");
            } catch (error) {
                console.error("Error saving image:", error);
                openAlert("Failed to save image locally.");
            } finally {
                setLoading(false);
            }
        }
    };

    const handleEditPhotoClick = () => {
        fileInputRef.current?.click();
    };

    const fetchExtraDetails = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const doc = await getDocument<{ phone: string; company: string; address: string }>(
                "users",
                user.uid
            );
            if (doc) {
                setPhone(doc.phone || "");
                setCompany(doc.company || "");
                setAddress(doc.address || "");
            }
        } catch (error) {
            console.error("Error fetching user details", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveProfile = async () => {
        if (!user) return;
        setLoading(true);
        try {
            // Update Firebase Auth Profile
            if (name !== user.displayName) {
                await updateProfile(user, {
                    displayName: name,
                    // We don't update photoURL here as it is stored locally in IndexedDB for now
                    // If we wanted to sync, we would upload to Storage and get a URL
                });
            }

            // Update/Create Firestore Document
            const userRef = await getDocument("users", user.uid);
            const data = { phone, company, address };

            if (userRef) {
                await updateDocument("users", user.uid, data);
            } else {
                await createDocument("users", data, user.uid);
            }

            showToast(t('profile.save') + " success!");
            setIsEditing(false);
        } catch (error: any) {
            openAlert(`Failed to update profile: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateSite = async () => {
        if (!newSiteName) return;
        setLoading(true);
        try {
            const newProject: Project = {
                id: Math.random().toString(36).substr(2, 9),
                name: newSiteName,
                category: newSiteCategory || 'Development',
                plan: newSitePlan || 'Free'
            };
            addProject(newProject);
            showToast("Site created successfully!");
            setOpenAddSite(false);
            setNewSiteName("");
            setNewSiteCategory("");
            setNewSitePlan("");
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Box sx={{ width: "100%", maxWidth: { xs: "100%", md: "1700px" } }}>
            <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
                {t('profile.title')}
            </Typography>

            <Grid container spacing={3}>
                {/* Personal Details Section */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6">{t('profile.personalDetails')}</Typography>
                                <IconButton onClick={() => setIsEditing(!isEditing)} color={isEditing ? "primary" : "default"}>
                                    <EditRoundedIcon />
                                </IconButton>
                            </Box>

                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                                <Box sx={{ position: 'relative' }}>
                                    <Avatar
                                        src={photoURL || user?.photoURL || ""}
                                        alt={name}
                                        sx={{ width: 100, height: 100, mb: 1, boxShadow: 3 }}
                                    />
                                    {isEditing && (
                                        <IconButton
                                            sx={{
                                                position: 'absolute',
                                                bottom: 0,
                                                right: 0,
                                                bgcolor: 'background.paper',
                                                boxShadow: 1,
                                                '&:hover': { bgcolor: 'background.default' }
                                            }}
                                            size="small"
                                            onClick={handleEditPhotoClick}
                                        >
                                            <EditRoundedIcon fontSize="small" />
                                        </IconButton>
                                    )}
                                </Box>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                                {isEditing && (
                                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                                        {t('profile.editPhoto')}
                                    </Typography>
                                )}
                            </Box>

                            <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                <TextField
                                    label={t('profile.name')}
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    disabled={!isEditing}
                                    fullWidth
                                    size="small"
                                />
                                <TextField
                                    label="Email"
                                    value={user?.email || ""}
                                    disabled
                                    fullWidth
                                    size="small"
                                    helperText={t('profile.emailReadOnly')}
                                />
                                <TextField
                                    label={t('profile.phone')}
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    disabled={!isEditing}
                                    fullWidth
                                    size="small"
                                />
                                <TextField
                                    label={t('profile.companyName')}
                                    value={company}
                                    onChange={(e) => setCompany(e.target.value)}
                                    disabled={!isEditing}
                                    fullWidth
                                    size="small"

                                />
                                <TextField
                                    label={t('profile.companyAddress')}
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    disabled={!isEditing}
                                    fullWidth
                                    multiline
                                />
                                {isEditing && (
                                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                        <Button variant="contained" onClick={handleSaveProfile}>{t('profile.save')}</Button>
                                        <Button variant="outlined" onClick={() => setIsEditing(false)}>{t('profile.cancel')}</Button>
                                    </Box>
                                )}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* My Sites Section */}
                <Grid size={{ xs: 12, md: 8 }}>
                    <Card variant="outlined" sx={{ height: '100%', bgcolor: 'transparent', border: 'none' }}>
                        {/* Header for Sites */}
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="h6">{t('profile.mySites')}</Typography>
                        </Box>

                        <Grid container spacing={2}>
                            {/* Add New Site Card */}
                            <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
                                <Card
                                    variant="outlined"
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderStyle: 'dashed',
                                        cursor: 'pointer',
                                        transition: '0.2s',
                                        '&:hover': { bgcolor: 'action.hover' },
                                        minHeight: 140
                                    }}
                                    onClick={() => setOpenAddSite(true)}
                                >
                                    <Box sx={{ textAlign: 'center', color: 'text.secondary' }}>
                                        <AddRoundedIcon sx={{ fontSize: 40, mb: 1 }} />
                                        <Typography variant="body1" fontWeight="bold">{t('profile.addSite')}</Typography>
                                    </Box>
                                </Card>
                            </Grid>

                            {/* Existing Sites */}
                            {projects.map((project) => (
                                <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={project.id}>
                                    <Card variant="outlined" sx={{ height: '100%', minHeight: 140, display: 'flex', flexDirection: 'column' }}>
                                        <CardContent sx={{ flexGrow: 1 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                                                <Avatar variant="rounded" sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
                                                    {project.name.toLowerCase().includes('app') ? <SmartphoneRoundedIcon /> :
                                                        project.name.toLowerCase().includes('web') ? <DevicesRoundedIcon /> :
                                                            <ConstructionRoundedIcon />
                                                    }
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="subtitle1" fontWeight="bold" noWrap sx={{ maxWidth: 120 }}>{project.name}</Typography>
                                                    <Typography variant="caption" color="text.secondary">{project.category}</Typography>
                                                </Box>
                                            </Box>
                                            <Box sx={{ mt: 'auto' }}>
                                                <Typography variant="caption" sx={{ bgcolor: 'action.selected', px: 1, py: 0.5, borderRadius: 1 }}>
                                                    {project.plan || 'Free Plan'}
                                                </Typography>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Card>
                </Grid>
            </Grid>

            {/* Add Site Dialog */}
            <Dialog open={openAddSite} onClose={() => setOpenAddSite(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{t('profile.addSite')}</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        <TextField
                            label={t('profile.siteName')}
                            placeholder={t('profile.enterSiteName')}
                            value={newSiteName}
                            onChange={(e) => setNewSiteName(e.target.value)}
                            fullWidth
                            autoFocus
                        />
                        <TextField
                            label={t('profile.category')}
                            placeholder={t('profile.enterCategory')}
                            value={newSiteCategory}
                            onChange={(e) => setNewSiteCategory(e.target.value)}
                            fullWidth
                        />
                        <TextField
                            label={t('profile.plan')}
                            placeholder={t('profile.enterPlan')}
                            value={newSitePlan}
                            onChange={(e) => setNewSitePlan(e.target.value)}
                            fullWidth
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAddSite(false)}>{t('profile.cancel')}</Button>
                    <Button variant="contained" onClick={handleCreateSite} disabled={!newSiteName}>{t('profile.create')}</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
