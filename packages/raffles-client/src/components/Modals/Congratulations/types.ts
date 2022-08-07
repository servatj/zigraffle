import { DialogProps } from '@mui/material';
import { AuctionType } from '@zignaly-open/raffles-shared/types';

export type CongratulationsModalProps = DialogProps & {
  auction: AuctionType;
};
