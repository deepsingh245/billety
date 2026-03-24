import React from 'react';
import { useData } from '../../context/dataContext';
import AppTheme from '../../shared/AppTheme';
import { chartsCustomizations, dataGridCustomizations, datePickersCustomizations, treeViewCustomizations } from '../../shared/theme/customizations';

const xThemeComponents = {
    ...chartsCustomizations,
    ...dataGridCustomizations,
    ...datePickersCustomizations,
    ...treeViewCustomizations,
};

export default function ThemeWrapper({ children }: { children: React.ReactNode }) {
    const { currentTheme } = useData();

    // Pass themeComponents globally if desired, or keep them specific to Dashboard
    // Passing them here ensures all components (like Dialogs) get the overrides.
    return (
        <AppTheme themeName={currentTheme} themeComponents={xThemeComponents}>
            {children}
        </AppTheme>
    );
}
