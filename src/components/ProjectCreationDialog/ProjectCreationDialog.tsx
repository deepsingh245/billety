import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    Button,
    TextField,
    Stack,
    Typography,
    Box,
    // Paper,
    Avatar,
    Stepper,
    Step,
    StepLabel,
    Divider
} from '@mui/material';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import BusinessIcon from '@mui/icons-material/Business';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckIcon from '@mui/icons-material/Check';
import PersonIcon from '@mui/icons-material/Person';
import { useData } from '../../context/dataContext';
import { useAuth } from '../../context/AuthContext';
import { GlobalUIService } from '../../utils/GlobalUIService';
import { updateDocument } from '../../firebase/firebaseUtils';
// import { APP_CONSTANTS } from '../../constants/app.constants';

const steps = ['Creator Profile', 'First Workspace'];

export default function ProjectCreationDialog() {
    const { projects, addProject, loading: dataLoading } = useData();
    const { user } = useAuth();

    // Dialog visibility
    const open = !dataLoading && projects.length === 0;

    const [activeStep, setActiveStep] = useState(0);
    const [submitting, setSubmitting] = useState(false);

    // Step 1: User/Company Details
    const [userData, setUserData] = useState({
        name: user?.displayName || '', // Pre-fill name
        phone: '',
        address: '',
        gst: '',
        profile: '', // Optional bio/desc
    });

    // Step 2: Site/Project Details
    const [siteData, setSiteData] = useState({
        name: '',
        category: ''
    });

    const handleBack = () => {
        setActiveStep((prev) => prev - 1);
    };

    const handleNext = async () => {
        if (activeStep === 0) {
            // Validate Step 1
            if (!userData.name.trim() || !userData.phone.trim()) {
                GlobalUIService.showError("Please fill in required fields (Name, Phone)");
                return;
            }
            setActiveStep(1);
        } else {
            // Submit Final
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        if (!siteData.name.trim() || !siteData.category.trim()) {
            GlobalUIService.showError("Please fill in required workspace fields");
            return;
        }

        if (!user) return;

        setSubmitting(true);
        GlobalUIService.setLoading(true);

        try {
            // 1. Update User Profile with generic company info
            await updateDocument('users', user.uid, {
                displayName: userData.name, // Sync name
                phone: userData.phone,
                address: userData.address,
                gst: userData.gst,
                profile: userData.profile
            });

            // 2. Create First Project/Site
            await addProject({
                name: siteData.name,
                category: siteData.category,
                plan: 'Free'
            });

            GlobalUIService.showSuccess("Setup complete! Welcome aboard.");
        } catch (error) {
            console.error(error);
            GlobalUIService.showError("Setup failed. Please try again.");
        } finally {
            setSubmitting(false);
            GlobalUIService.setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <Dialog
            open={open}
            maxWidth="md"
            fullWidth
            onClose={() => { }} // Persistent
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    maxWidth: 900,
                    m: 2,
                    minHeight: 500
                }
            }}
        >
            {/* Left Side: Branding / Stepper Info */}
            <Box sx={{
                width: { xs: '100%', md: '35%' },
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
            }}>
                <Box>
                    <Stack direction="row" alignItems="center" spacing={2} mb={4}>
                        <Avatar sx={{ bgcolor: 'white', color: 'primary.main' }}>
                            <RocketLaunchIcon />
                        </Avatar>
                        <Typography variant="h6" fontWeight="bold">Billety</Typography>
                    </Stack>

                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        {activeStep === 0 ? "Let's get to know you" : "Name your workspace"}
                    </Typography>

                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                        {activeStep === 0
                            ? "Tell us a bit about yourself or your company to customize your experience."
                            : "Your workspace is where you manage your clients, items, and billing."}
                    </Typography>
                </Box>

                <Box>
                    <Stepper activeStep={activeStep} orientation="vertical" sx={{
                        '& .MuiStepLabel-label': { color: 'rgba(255,255,255,0.7) !important' },
                        '& .MuiStepLabel-label.Mui-active': { color: 'white !important', fontWeight: 'bold' },
                        '& .MuiStepLabel-label.Mui-completed': { color: 'white !important' },
                        '& .MuiStepIcon-root': { color: 'rgba(255,255,255,0.3)' },
                        '& .MuiStepIcon-root.Mui-active': { color: 'white', '& .MuiStepIcon-text': { fill: 'var(--mui-palette-primary-main)' } },
                        '& .MuiStepIcon-root.Mui-completed': { color: 'white' }
                    }} connector={<span style={{ backgroundColor: 'var(--template-palette-divider)', height: 50, width: '2px', marginLeft: '5px' }} />}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Box>
            </Box>

            {/* Right Side: Form Content */}
            <Box sx={{
                width: { xs: '100%', md: '65%' },
                display: 'flex',
                flexDirection: 'column'
            }}>
                <DialogContent sx={{ p: { xs: 3, md: 5 }, flex: 1, backgroundColor: 'primary.dark' }}>

                    {activeStep === 0 && (
                        <Stack spacing={3}>
                            <Typography variant="h6">Creator Profile</Typography>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                <TextField
                                    label="Full Name / Company Name"
                                    placeholder="e.g. John Doe / Acme Corp"
                                    fullWidth
                                    value={userData.name}
                                    onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                                    required
                                    InputProps={{ startAdornment: <PersonIcon color="action" sx={{ mr: 1, opacity: 0.7 }} /> }}
                                />
                                <TextField
                                    label="Phone Number"
                                    placeholder="+1 234 567 890"
                                    fullWidth
                                    value={userData.phone}
                                    onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                                    required
                                />
                            </Stack>

                            <TextField
                                label="Address"
                                placeholder="123 Business Rd, Tech City"
                                fullWidth
                                multiline
                                rows={2}
                                value={userData.address}
                                onChange={(e) => setUserData({ ...userData, address: e.target.value })}
                            />

                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                <TextField
                                    label="GST / Tax ID"
                                    placeholder="Optional"
                                    fullWidth
                                    value={userData.gst}
                                    onChange={(e) => setUserData({ ...userData, gst: e.target.value })}
                                />
                                <TextField
                                    label="Profile / Bio"
                                    placeholder="Short description (Optional)"
                                    fullWidth
                                    value={userData.profile}
                                    onChange={(e) => setUserData({ ...userData, profile: e.target.value })}
                                />
                            </Stack>
                            {/* Placeholder for Logo - could be a file upload in future */}
                            <Typography variant="caption" color="text.secondary">
                                * Detailed profile settings can be updated later.
                            </Typography>
                        </Stack>
                    )}

                    {activeStep === 1 && (
                        <Stack spacing={3}>
                            <Typography variant="h6">First Workspace Details</Typography>
                            <Typography variant="body2" color="text.secondary">
                                This will be your primary site for managing business operations.
                            </Typography>
                            <TextField
                                autoFocus
                                label="Workspace / Site Name"
                                placeholder="e.g. Head Office, Warehouse A"
                                fullWidth
                                value={siteData.name}
                                onChange={(e) => setSiteData({ ...siteData, name: e.target.value })}
                                required
                                InputProps={{ startAdornment: <BusinessIcon color="action" sx={{ mr: 1, opacity: 0.7 }} /> }}
                            />
                            <TextField
                                label="Industry / Category"
                                placeholder="e.g. Retail, Manufacturing"
                                fullWidth
                                value={siteData.category}
                                onChange={(e) => setSiteData({ ...siteData, category: e.target.value })}
                                required
                            />
                        </Stack>
                    )}

                </DialogContent>

                <Divider />

                <Box sx={{ p: 3, display: 'flex', justifyContent: 'flex-end', gap: 2, bgcolor: 'background.default' }}>
                    <Button
                        disabled={activeStep === 0 || submitting}
                        onClick={handleBack}
                        startIcon={<ArrowBackIcon />}
                    >
                        Back
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleNext}
                        disabled={submitting}
                        endIcon={activeStep === steps.length - 1 ? <CheckIcon /> : <ArrowForwardIcon />}
                        sx={{ px: 4 }}
                    >
                        {activeStep === steps.length - 1 ? 'Finish & Start' : 'Next Step'}
                    </Button>
                </Box>
            </Box>
        </Dialog>
    );
}
