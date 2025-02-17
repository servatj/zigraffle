import React from 'react';
import { Service } from '../../../../../apis/service/types';
import {
  useInvestedAccountsCount,
  useIsInvestedInService,
  useSetSelectedInvestment,
} from '../../../../../apis/investment/use';
import { useZModal } from '../../../../../components/ZModal/use';
import { serviceToInvestmentServiceDetail } from '../../../../../apis/investment/util';
import EditInvestmentModal from '../../../../Dashboard/components/ManageInvestmentModals/EditInvestmentModal';
import { useTranslation } from 'react-i18next';
import {
  BigNumberWrapper,
  BigNumberWrapperInvested,
  InvestButtonContainer,
  StyledPencilIcon,
} from '../styles';
import {
  TextButton,
  Typography,
  ZigPriceLabel,
  ZigTypography,
} from '@zignaly-open/ui';
import { Box } from '@mui/system';
import OtherAccountsButton from './OtherAccountsButton';

const BigNumber: React.FC<{
  ssc?: string;
  green?: boolean;
  shorten?: boolean;
  red?: boolean;
  value: string;
}> = ({ ssc, green = false, shorten, red = false, value }) => {
  return (
    <BigNumberWrapper>
      <ZigPriceLabel
        value={value}
        coin={ssc}
        shorten={shorten}
        color={green ? 'greenGraph' : red ? 'redGraphOrError' : undefined}
      />
    </BigNumberWrapper>
  );
};

const InvestedButton: React.FC<{
  id?: string;
  service: Service;
  ctaId?: string;
}> = ({ id, ctaId, service }) => {
  const { investedAmount } = useIsInvestedInService(service.id);
  return (
    <InvestedButtonBase
      id={id}
      ctaId={ctaId}
      showMultipleAccountButton
      service={service}
      investedAmount={investedAmount}
    />
  );
};

export const InvestedButtonBase: React.FC<{
  id?: string;
  service: Service;
  ctaId?: string;
  investedAmount: string;
  showMultipleAccountButton?: boolean;
}> = ({ id, service, investedAmount, ctaId, showMultipleAccountButton }) => {
  const { showModal } = useZModal({ disableAutoDestroy: true });
  const selectInvestment = useSetSelectedInvestment();
  const investedFromAccounts = useInvestedAccountsCount(service.id, {
    skip: !showMultipleAccountButton,
  });

  const onClickEditInvestment = () => {
    selectInvestment(serviceToInvestmentServiceDetail(service));
    showModal(EditInvestmentModal, { ctaId });
  };

  const { t } = useTranslation(['service', 'action']);

  const showOtherAccounts =
    investedFromAccounts > 1 && showMultipleAccountButton;

  return (
    <InvestButtonContainer>
      <Typography variant={'body2'} color='neutral200'>
        {t('invested-label')}
      </Typography>

      <BigNumberWrapperInvested>
        <BigNumber ssc={service.ssc} shorten value={investedAmount} green />
      </BigNumberWrapperInvested>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-around',
        }}
      >
        <TextButton
          id={id}
          leftElement={
            <Box>
              <StyledPencilIcon />
            </Box>
          }
          caption={t('action:edit')}
          color={'links'}
          onClick={onClickEditInvestment}
        />
        {showOtherAccounts && (
          <ZigTypography color={'neutral500'}>|</ZigTypography>
        )}
        {showOtherAccounts && <OtherAccountsButton service={service} />}
      </Box>
    </InvestButtonContainer>
  );
};

export default InvestedButton;
