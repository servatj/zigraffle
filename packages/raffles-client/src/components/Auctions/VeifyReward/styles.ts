import { Box, styled } from '@mui/material';
import { Typography } from '@zignaly-open/ui';

export const Step = styled(Box)`
  flex-direction: column;
  align-items: center;
  display: flex;
  text-align: center;
  flex: 1;
  flex-direction: column;

  ${({ theme }) => theme.breakpoints.down('md')} {
    flex-direction: row;
    justify-content: space-between;
    padding: 0 24px;
  }
`;

export const StepDetails = styled(Box)`
  display: flex;
  flex-direction: column;
  flex: 1;

  ${({ theme }) => theme.breakpoints.down('md')} {
    padding: 0 24px;
  }
`;

export const TypographyTitle = styled(Typography)`
  margin-bottom: 6px !important;
`;

export const TypographyStep = styled(Typography)``;

export const Layout = styled(Box)`
  max-width: 1280px;
`;
