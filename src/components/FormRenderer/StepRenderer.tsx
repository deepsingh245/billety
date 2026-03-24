import { Stepper, Step, StepLabel, Box } from '@mui/material';

export const StepRenderer = ({ steps, renderField }: any) => {
    return (
      <Box sx={{ width: '100%' }}>
        <Stepper activeStep={0} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((step: any) => (
            <Step key={step.id}>
              <StepLabel>{step.title}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {/* Render only first step for now in this naive stepper */}
        <Box sx={{ mt: 3 }}>
           {steps[0]?.fields?.map((f: string) => renderField({ id: f }))}
        </Box>
      </Box>
    );
};
