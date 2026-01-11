import { Box, Paper, Typography, Button, Radio } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface TemplateCardProps {
    id: string;
    name: string;
    thumbnail: string;
    selected: boolean;
    onSelect: () => void;
    onPreview: () => void;
}

export default function TemplateCard({ name, thumbnail, selected, onSelect, onPreview }: TemplateCardProps) {
    return (
        <Paper
            elevation={selected ? 4 : 1}
            sx={{
                position: 'relative',
                cursor: 'pointer',
                border: selected ? '2px solid' : '1px solid',
                borderColor: selected ? 'primary.main' : 'divider',
                borderRadius: 2,
                overflow: 'hidden',
                transition: 'all 0.2s',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 3
                }
            }}
            onClick={onSelect}
        >
            {/* Thumbnail Area - Aspect Ratio of A4 */}
            <Box sx={{
                height: 200,
                background: thumbnail,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
            }}>
                {selected && (
                    <Box sx={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        bgcolor: 'background.paper',
                        borderRadius: '50%',
                        display: 'flex'
                    }}>
                        <CheckCircleIcon color="primary" />
                    </Box>
                )}
            </Box>

            {/* Content */}
            <Box sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold">{name}</Typography>
                    <Radio checked={selected} size="small" />
                </Box>

                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                    <Button
                        variant="outlined"
                        size="small"
                        fullWidth
                        onClick={(e) => {
                            e.stopPropagation();
                            onPreview();
                        }}
                    >
                        Preview
                    </Button>
                    <Button
                        variant="contained"
                        size="small"
                        fullWidth
                        onClick={(e) => {
                            e.stopPropagation();
                            onSelect();
                        }}
                    >
                        Select
                    </Button>
                </Box>
            </Box>
        </Paper>
    );
}
