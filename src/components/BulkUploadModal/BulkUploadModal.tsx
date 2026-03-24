import { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    LinearProgress,
    Stack,
    IconButton
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DownloadIcon from '@mui/icons-material/Download';
import CloseIcon from '@mui/icons-material/Close';
import { GlobalUIService } from '../../utils/GlobalUIService';
import {
    parseExcelFile,
    validateClientData,
    validateItemData,
    bulkUploadData,
    downloadTemplate,
    UploadType
} from '../../services/bulkUpload.service';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/dataContext';

interface BulkUploadModalProps {
    open: boolean;
    onClose: () => void;
    type: UploadType;
}

export default function BulkUploadModal({ open, onClose, type }: BulkUploadModalProps) {
    const { user } = useAuth();
    const { refreshData } = useData();
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0); // Mock progress for now
    const [result, setResult] = useState<{ success: number; errors: number } | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setResult(null);
        }
    };

    const handleUpload = async () => {
        if (!file || !user) return;

        setUploading(true);
        GlobalUIService.setLoading(true);
        try {
            const rawData = await parseExcelFile(file);
            let validatedData = [];

            if (type === 'client') {
                validatedData = validateClientData(rawData);
            } else {
                validatedData = validateItemData(rawData);
            }

            if (validatedData.length === 0) {
                GlobalUIService.showError("No valid data found in file");
                setUploading(false);
                GlobalUIService.setLoading(false);
                return;
            }

            // Mock progress simulation since actual batch upload is atomic per chunk
            const timer = setInterval(() => {
                setProgress((oldProgress) => {
                    if (oldProgress === 100) {
                        return 100;
                    }
                    const diff = Math.random() * 10;
                    return Math.min(oldProgress + diff, 90);
                });
            }, 500);

            const uploadResult = await bulkUploadData(validatedData, type, user.uid);

            clearInterval(timer);
            setProgress(100);
            setResult(uploadResult);
            await refreshData();
            GlobalUIService.showSuccess(`Successfully uploaded ${uploadResult.success} records`);

        } catch (error) {
            console.error("Upload failed:", error);
            GlobalUIService.showError("Failed to upload data");
        } finally {
            setUploading(false);
            GlobalUIService.setLoading(false);
        }
    };

    const handleDownloadTemplate = () => {
        downloadTemplate(type);
    };

    const handleClose = () => {
        setFile(null);
        setResult(null);
        setProgress(0);
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                Bulk Upload {type === 'client' ? 'Clients' : 'Items'}
                <IconButton onClick={handleClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <Stack spacing={3} alignItems="center" sx={{ py: 2 }}>

                    <Button
                        startIcon={<DownloadIcon />}
                        onClick={handleDownloadTemplate}
                        variant="text"
                        size="small"
                        sx={{ alignSelf: 'flex-end' }}
                    >
                        Download Template
                    </Button>

                    <Box
                        sx={{
                            border: '2px dashed',
                            borderColor: 'divider',
                            borderRadius: 2,
                            p: 4,
                            width: '100%',
                            textAlign: 'center',
                            bgcolor: 'background.default',
                            cursor: 'pointer'
                        }}
                        component="label"
                    >
                        <input
                            type="file"
                            accept=".xlsx, .xls"
                            hidden
                            onChange={handleFileChange}
                        />
                        <CloudUploadIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                        <Typography variant="body1" color="text.secondary">
                            {file ? file.name : "Click to select Excel file"}
                        </Typography>
                    </Box>

                    {uploading && (
                        <Box sx={{ width: '100%' }}>
                            <LinearProgress variant="determinate" value={progress} />
                            <Typography variant="caption" color="text.secondary" align="center" display="block" mt={1}>
                                Uploading...
                            </Typography>
                        </Box>
                    )}

                    {result && (
                        <Box sx={{ width: '100%', bgcolor: 'success.light', p: 2, borderRadius: 1, color: 'success.contrastText' }}>
                            <Typography variant="subtitle2">Upload Complete!</Typography>
                            <Typography variant="body2">Successfully added: <b>{result.success}</b></Typography>
                            {result.errors > 0 && (
                                <Typography variant="body2" color="error.dark">Failed: <b>{result.errors}</b></Typography>
                            )}
                        </Box>
                    )}
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} disabled={uploading}>Close</Button>
                <Button
                    variant="contained"
                    onClick={handleUpload}
                    disabled={!file || uploading}
                >
                    {uploading ? 'Uploading...' : 'Upload'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
