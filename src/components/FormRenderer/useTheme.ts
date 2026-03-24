export const useTheme = () => {
    return {
      spacing: (mult: number) => mult * 8, // fallback basic spacing
      radius: { md: 8 },
      colors: {
        background: 'transparent',
        text: 'inherit'
      },
      typography: {
        fontFamily: 'inherit'
      },
      className: 'theme-wrapper'
    };
};
