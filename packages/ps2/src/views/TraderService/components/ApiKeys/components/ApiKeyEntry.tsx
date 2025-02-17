import React from 'react';
import {
  CloneIcon,
  dark,
  InputText,
  ZigButton,
  ZigTypography,
} from '@zignaly-open/ui';
import { Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PencilIcon from '@mui/icons-material/Create';
import { useTranslation } from 'react-i18next';
import { ApiKey, TextWrapperRow } from '../atoms';
import { useParams } from 'react-router-dom';
import copy from 'copy-to-clipboard';
import { useToast } from '../../../../../util/hooks/useToast';
import { addReadIfMissing } from '../util';
import {
  useZModal,
  useZTypeWordConfirm,
} from '../../../../../components/ZModal/use';
import EditApiKey from '../modals/EditApiKey';
import { useServiceApiKeyDeleteMutation } from '../../../../../apis/serviceApiKey/api';
import { useCheck2FA } from '../../../../../apis/user/use';
import {
  ServiceApiKey,
  ServiceApiKeyDeletePayload,
} from '../../../../../apis/serviceApiKey/types';
import { useRefetchIfDesynchronizedState } from '../../../../../apis/serviceApiKey/use';
import { BackendErrorResponse } from '../../../../../util/errors';

const ApiKeyEntry: React.FC<{ apiKey: ServiceApiKey }> = ({ apiKey }) => {
  const { t, i18n } = useTranslation(['management', 'actions']);
  const { serviceId } = useParams();
  const refetchIfDesyncronized = useRefetchIfDesynchronizedState();
  const { showModal } = useZModal();
  const askConfirm = useZTypeWordConfirm();
  const toast = useToast();
  const [deleteKey, deleteStatus] = useServiceApiKeyDeleteMutation();
  const delete2FA = useCheck2FA({
    status: deleteStatus,
  });

  const handleDeleteWrapper = async (args: ServiceApiKeyDeletePayload) => {
    const result = await deleteKey(args);
    'error' in result && refetchIfDesyncronized(result as BackendErrorResponse);
  };

  return (
    <ApiKey>
      <ZigTypography variant='h3' sx={{ mb: 1.5 }}>
        {apiKey.alias}
      </ZigTypography>
      <Box sx={{ flexDirection: 'row', display: 'flex', gap: 3 }}>
        <Box sx={{ flex: 5, mr: 2 }}>
          <InputText
            placeholder={t('api-keys.api-key')}
            label={t('api-keys.api-key')}
            readOnly={true}
            value={apiKey.key}
            rightSideElement={
              <CloneIcon width={40} height={40} color={dark.neutral300} />
            }
            onClickRightSideElement={() => {
              copy(apiKey.key);
              toast.success(t('action:copied'));
            }}
          />
        </Box>
        <Box sx={{ flex: 2 }}>
          <ZigTypography color={'neutral200'}>
            {t('api-keys.permission-label')}
          </ZigTypography>
          <TextWrapperRow>
            <ZigTypography color={'neutral100'}>
              {addReadIfMissing(apiKey.permissions)
                .map((p) =>
                  i18n.exists(`management:api-keys.permissions.${p}`)
                    ? t(`api-keys.permissions.${p}`)
                    : p,
                )
                .join(', ')}
            </ZigTypography>
          </TextWrapperRow>
        </Box>
        <Box sx={{ flex: 2 }}>
          <ZigTypography color={'neutral200'}>
            {t('api-keys.ip-restrictions')}
          </ZigTypography>
          <TextWrapperRow>
            <ZigTypography color={'neutral100'}>
              {apiKey.ips.join(', ') || t('api-keys.ip-restrictions-none')}
            </ZigTypography>
          </TextWrapperRow>
        </Box>
        <Box sx={{ alignSelf: 'center' }}>
          <ZigButton
            id={'trader-api__edit-key'}
            sx={{ mr: 2 }}
            onClick={() => showModal(EditApiKey, { apiKey, serviceId })}
            startIcon={<PencilIcon />}
            variant={'outlined'}
          >
            {t('action:edit')}
          </ZigButton>
          <ZigButton
            id={'trader-api__delete-key'}
            sx={{ mr: 2 }}
            onClick={() =>
              askConfirm({
                title: t('api-keys.delete-title', {
                  title: apiKey.alias,
                }),
                safeWord: t('action:delete'),
                yesLabel: t('action:delete'),
                yesButtonProps: {
                  color: 'danger',
                  variant: 'outlined',
                },
                description: t('api-keys.delete-description'),
                yesAction: () => {
                  delete2FA((code) =>
                    handleDeleteWrapper({ serviceId, keyId: apiKey.id, code }),
                  );
                },
              })
            }
            color={'danger'}
            startIcon={<DeleteIcon />}
            variant={'outlined'}
          >
            {t('action:delete')}
          </ZigButton>
        </Box>
      </Box>
    </ApiKey>
  );
};

export default ApiKeyEntry;
