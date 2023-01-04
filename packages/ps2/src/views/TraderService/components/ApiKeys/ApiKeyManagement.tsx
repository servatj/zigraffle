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
import { Trans, useTranslation } from 'react-i18next';
import { ROUTE_TRADING_SERVICE_POSITIONS } from '../../../../routes';
import AnchorLink from '../../../../components/AnchorLink';
import { ApiKey, ApiKeysContainer, TitleBox } from './atoms';
import { generatePath, useParams } from 'react-router-dom';
import { useServiceApiKeysQuery } from '../../../../apis/serviceApiKey/api';
import CenteredLoader from '../../../../components/CenteredLoader';
import copy from 'copy-to-clipboard';
import { useToast } from '../../../../util/hooks/useToast';
import { addReadIfMissing } from './util';

const ApiKeyManagement: React.FC = () => {
  const { t, i18n } = useTranslation(['management', 'actions']);
  const { serviceId } = useParams();
  const toast = useToast();
  const { isLoading, data: keys } = useServiceApiKeysQuery({ serviceId });

  return (
    <>
      <TitleBox
        sx={{
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <Box
          sx={{
            flex: 1,
            mr: 5,
          }}
        >
          <ZigTypography variant={'h1'}>{t('api-keys.title')}</ZigTypography>
          <ZigTypography variant={'body1'}>
            <Trans i18nKey='api-keys.description' t={t}>
              <AnchorLink
                to={generatePath(ROUTE_TRADING_SERVICE_POSITIONS, {
                  serviceId,
                })}
              />
            </Trans>
          </ZigTypography>
        </Box>
        <Box
          sx={{
            alignSelf: 'center',
          }}
        >
          <ZigButton onClick={() => alert()} variant='contained' size='large'>
            {t('api-keys.create-key')}
          </ZigButton>
        </Box>
      </TitleBox>

      <ZigTypography color='neutral200' variant={'h2'}>
        {t('api-keys.manage-keys')}
      </ZigTypography>

      {isLoading ? (
        <CenteredLoader />
      ) : (
        <ApiKeysContainer>
          {keys.map((k) => (
            <ApiKey key={k.id}>
              <ZigTypography variant='h3'>{k.alias}</ZigTypography>
              <Box sx={{ flexDirection: 'row', display: 'flex' }}>
                <Box>
                  <InputText
                    placeholder={t('api-keys.api-key')}
                    label={t('api-keys.api-key')}
                    readOnly={true}
                    value={k.key}
                    rightSideElement={
                      <CloneIcon
                        width={40}
                        height={40}
                        color={dark.neutral300}
                      />
                    }
                    onClickRightSideElement={() => {
                      copy(k.key);
                      toast.success(t('actions:copied'));
                    }}
                  />
                </Box>
                <Box>
                  <ZigTypography color={'neutral200'}>
                    {t('api-keys.permission-label')}
                  </ZigTypography>
                  <Box>
                    <ZigTypography color={'neutral100'}>
                      {addReadIfMissing(k.permissions)
                        .map((p) =>
                          i18n.exists(`management:api-keys.permissions.${p}`)
                            ? t(`api-keys.permissions.${p}`)
                            : p,
                        )
                        .join(', ')}
                    </ZigTypography>
                  </Box>
                </Box>
                <Box>
                  <ZigTypography color={'neutral200'}>
                    {t('api-keys.ip-restrictions')}
                  </ZigTypography>
                  <Box>
                    <ZigTypography color={'neutral100'}>
                      {k.ips.join(', ') || t('api-keys.ip-restrictions-none')}
                    </ZigTypography>
                  </Box>
                </Box>
                <Box sx={{ alignSelf: 'center' }}>
                  <ZigButton
                    sx={{ mr: 2 }}
                    startIcon={<PencilIcon />}
                    variant={'outlined'}
                  >
                    {t('action:edit')}
                  </ZigButton>
                  <ZigButton
                    sx={{ mr: 2 }}
                    color={'danger'}
                    startIcon={<DeleteIcon />}
                    variant={'outlined'}
                  >
                    {t('action:delete')}
                  </ZigButton>
                </Box>
              </Box>
            </ApiKey>
          ))}
        </ApiKeysContainer>
      )}
    </>
  );
};

export default ApiKeyManagement;
