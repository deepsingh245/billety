import * as React from 'react';
import MuiAvatar from '@mui/material/Avatar';
import MuiListItemAvatar from '@mui/material/ListItemAvatar';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListSubheader from '@mui/material/ListSubheader';
import Select, { SelectChangeEvent, selectClasses } from '@mui/material/Select';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DevicesRoundedIcon from '@mui/icons-material/DevicesRounded';
import SmartphoneRoundedIcon from '@mui/icons-material/SmartphoneRounded';
import ConstructionRoundedIcon from '@mui/icons-material/ConstructionRounded';
import { useData } from '../../context/dataContext';
import { Project } from '../../interfaces/project.interface';

const Avatar = styled(MuiAvatar)(({ theme }) => ({
  width: 28,
  height: 28,
  backgroundColor: (theme.vars || theme).palette.background.paper,
  color: (theme.vars || theme).palette.text.secondary,
  border: `1px solid ${(theme.vars || theme).palette.divider}`,
}));

const ListItemAvatar = styled(MuiListItemAvatar)({
  minWidth: 0,
  marginRight: 12,
});

export default function SelectContent() {
  const { projects, currentProject, setProject } = useData();

  const handleChange = (event: SelectChangeEvent) => {
    const selectedId = event.target.value as string;
    if (selectedId === 'add-new') {
      // Handle add new project logic if needed
      return;
    }
    const project = projects.find(p => p.id === selectedId);
    if (project) {
      setProject(project);
    }
  };

  // Group projects by category
  const groupedProjects = React.useMemo(() => {
    return projects.reduce((acc, project) => {
      const category = project.category || 'Other';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(project);
      return acc;
    }, {} as Record<string, Project[]>);
  }, [projects]);


  return (
    <Select
      labelId="company-select"
      id="company-simple-select"
      value={currentProject?.id || ''}
      onChange={handleChange}
      displayEmpty
      inputProps={{ 'aria-label': 'Select company' }}
      fullWidth
      sx={{
        maxHeight: 56,
        width: 215,
        '&.MuiList-root': {
          p: '8px',
        },
        [`& .${selectClasses.select}`]: {
          display: 'flex',
          alignItems: 'center',
          gap: '2px',
          pl: 1,
        },
      }}
    >
      {Object.entries(groupedProjects).map(([category, categoryProjects]) => [
        <ListSubheader key={category} sx={{ pt: 0 }}>{category}</ListSubheader>,
        ...categoryProjects.map((project) => (
          <MenuItem key={project.id} value={project.id}>
            <ListItemAvatar>
              <Avatar alt={project.name}>
                {/* Simple logic to pick an icon based on name/category for visual variety */}
                {project.name.toLowerCase().includes('app') ? <SmartphoneRoundedIcon sx={{ fontSize: '1rem' }} /> :
                  project.name.toLowerCase().includes('web') ? <DevicesRoundedIcon sx={{ fontSize: '1rem' }} /> :
                    <ConstructionRoundedIcon sx={{ fontSize: '1rem' }} />
                }
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={project.name} secondary={project.plan || "Free"} />
          </MenuItem>
        ))
      ])}

      <Divider sx={{ mx: -1 }} />
      <MenuItem value="add-new">
        <ListItemIcon>
          <AddRoundedIcon />
        </ListItemIcon>
        <ListItemText primary="Add product" secondary="Create new workspace" />
      </MenuItem>
    </Select>
  );
}
