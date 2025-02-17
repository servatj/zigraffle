import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DialogProps } from '@mui/material/Dialog';
import ZModal from 'components/ZModal';
import { useExchangeCoinsList } from '../../../../../apis/coin/use';
import CenteredLoader from '../../../../../components/CenteredLoader';
// import CreateServiceForm from './forms/CreateServiceForm';
import InvestInYourServiceForm from './forms/InvestInYourServiceForm';
import CreateServiceForm from './forms/CreateServiceForm';
import { ServiceFormData } from './forms/types';
import { useCurrentBalance } from '../../../../../apis/investment/use';
import {
  useCreateTraderServiceMutation,
  useGetServiceTypesInfoQuery,
} from '../../../../../apis/service/api';

function CreateServiceModal({
  close,
  ...props
}: {
  close: () => void;
} & DialogProps): React.ReactElement {
  const { t } = useTranslation('service');
  const { isLoading: isLoadingCoins } = useExchangeCoinsList();
  const [, { isLoading: isCreating }] = useCreateTraderServiceMutation();
  const [step, setStep] = useState(0);
  const { isLoading: isLoadingServiceTypes } = useGetServiceTypesInfoQuery();
  const [service, setService] = useState<Partial<ServiceFormData>>({});
  const { isFetching: isLoadingBalances } = useCurrentBalance(
    service.baseCurrency,
  );
  const isLoading =
    isLoadingCoins ||
    isCreating ||
    isLoadingServiceTypes ||
    (isLoadingBalances && step === 1);

  const goBack = () => !isLoading && setStep(0);

  return (
    <ZModal
      onGoBack={step === 1 && goBack}
      onBackdropClick={(e) => {
        e.stopPropagation();
        return false;
      }}
      wide
      {...props}
      close={close}
      title={
        step === 1 ? t('create.invest-in-your-service') : t('create.title')
      }
    >
      {isLoading && <CenteredLoader />}
      {!isLoading && step === 0 && (
        <CreateServiceForm
          service={service}
          onSubmit={(s) => {
            setService(s);
            setStep(1);
          }}
        />
      )}
      {!isLoading && step === 1 && (
        <InvestInYourServiceForm
          goBack={goBack}
          service={service as ServiceFormData}
        />
      )}
    </ZModal>
  );
}

CreateServiceModal.trackId = 'create-service';

export default CreateServiceModal;
