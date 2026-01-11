import { Dialog, DialogTitle, DialogContent, Grid, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { INVOICE_TEMPLATES } from './templates';
import TemplateCard from './TemplateCard';

interface TemplateSelectionModalProps {
    open: boolean;
    onClose: () => void;
    selectedTemplateId: string;
    onSelect: (templateId: string) => void;
    onPreview: (templateId: string) => void;
}

export default function TemplateSelectionModal({
    open,
    onClose,
    selectedTemplateId,
    onSelect,
    onPreview
}: TemplateSelectionModalProps) {

    const templates = Object.values(INVOICE_TEMPLATES);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: { borderRadius: 2, minHeight: '60vh' }
            }}
        >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3 }}>
                <Typography variant="h6" fontWeight="bold">Choose Invoice Template</Typography>
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 3, bgcolor: 'background.default' }}>
                <Grid container spacing={3}>
                    {templates.map((template) => (
                        <Grid key={template.id} size={{ xs: 12, sm: 6, md: 4 }}>
                            <TemplateCard
                                id={template.id}
                                name={template.name}
                                thumbnail={template.thumbnail}
                                selected={template.id === selectedTemplateId}
                                onSelect={() => onSelect(template.id)}
                                onPreview={() => onPreview(template.id)}
                            />
                        </Grid>
                    ))}
                </Grid>
            </DialogContent>
        </Dialog>
    );
}
