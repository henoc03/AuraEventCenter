import * as React from 'react';
import PropTypes from 'prop-types';
import { Stepper, Step, StepLabel, Box} from '@mui/material';

const steps = ['Datos de reserva', 'Salas', 'Servicios', 'Pago'];

export default function StepBar({ currentStep }) {
  return (
    <Box sx={{ width: '100%', padding: '5px 250px', marginTop: '40px' }}>
      <Stepper activeStep={currentStep}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel
              sx={{
                '& .MuiStepLabel-label': {
                  fontFamily: 'Merriweather Sans, sans-serif',
                  fontSize: '1.1rem',
                },
              }}
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}

StepBar.propTypes = {
  currentStep: PropTypes.number.isRequired,
};
