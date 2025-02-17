import Theme from '@zignaly-open/ui/lib/theme/theme';
import { TransactionStateType } from 'apis/coin/types';

export const transactionStateName: {
  [key in TransactionStateType]: string;
} = {
  [TransactionStateType.COMPLETED]: 'status.completed',
  [TransactionStateType.PENDING]: 'status.pending',
  [TransactionStateType.ERROR]: 'status.error',
};

export const transactionStateColor: {
  [key in TransactionStateType]: keyof Theme;
} = {
  [TransactionStateType.COMPLETED]: 'greenGraph',
  [TransactionStateType.PENDING]: 'yellow',
  [TransactionStateType.ERROR]: 'red',
};
