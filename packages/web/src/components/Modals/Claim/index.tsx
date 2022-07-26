import { useMutation } from '@apollo/client';
import { Box } from '@mui/material';
import useCurrentUser from 'hooks/useCurrentUser';
import { CLAIM } from 'queries/auctions';
import React, { FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, ErrorMessage, InputText, Typography } from 'zignaly-ui';
import DialogContainer from '../DialogContainer';
import { Form } from './styles';
import { ClaimModalProps } from './types';

const CongratulationsModal = ({ auction, ...props }: ClaimModalProps) => {
  const { t } = useTranslation('claim');

  return (
    <DialogContainer title={t('congratulations')} {...props}>
      <Typography color='neutral200'>{t('claim-success')}</Typography>
      <Box
        gap='12px'
        display='flex'
        justifyContent='center'
        sx={{ flexDirection: { xs: 'column', sm: 'row' } }}
        mt='94px'
      >
        <Button
          caption={t('close')}
          size='large'
          onClick={(e) => props.onClose(e, 'escapeKeyDown')}
        />
      </Box>
    </DialogContainer>
  );
};

const ClaimModal = ({ auction, ...props }: ClaimModalProps) => {
  const { t } = useTranslation(['claim', 'user-settings', 'global']);
  const {
    user: { discordName, publicAddress },
  } = useCurrentUser();
  const [errorMessage, setErrorMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [claim, { loading }] = useMutation(CLAIM);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await claim({
        variables: { id: auction.id },
      });
      setSuccess(true);
    } catch (_) {
      setErrorMessage('Something went wrong');
    }
  };

  if (success) {
    return <CongratulationsModal auction={auction} {...props} />;
  }

  return (
    <DialogContainer title={t('claim-instructions')} {...props}>
      <Typography color='neutral200'>{t('congratulations-winner')}</Typography>
      <br />
      <br />
      <Typography color='neutral200'>{t('verify')}</Typography>
      <Form onSubmit={submit}>
        <Typography color='neutral200'>{t('connected-wallet')}</Typography>
        <InputText
          value={publicAddress}
          placeholder={t('connected-wallet')}
          disabled={true}
          minHeight={1}
        />
        <Typography color='neutral200'>{t('discord-user')}</Typography>
        <Box mt='-8px'>
          <Typography color='neutral400' variant='h4'>
            {t('change')}
          </Typography>
        </Box>
        <InputText
          value={discordName}
          placeholder={t('please-enter-discord-user', {
            ns: 'user-settings',
          })}
          disabled={true}
          minHeight={1}
        />
        <Box
          gap='12px'
          display='flex'
          justifyContent='center'
          sx={{ flexDirection: { xs: 'column', sm: 'row' } }}
          mt='40px'
        >
          <Button
            caption={t('cancel', {
              ns: 'global',
            })}
            variant='secondary'
            size='large'
            onClick={(e) => props.onClose(e, 'escapeKeyDown')}
            type='button'
          />
          <Button
            type='submit'
            loading={loading}
            caption={t('claim')}
            size='large'
            disabled={!discordName}
          />
        </Box>
        {errorMessage && (
          <Box mt='9px'>
            <ErrorMessage text={errorMessage} />
          </Box>
        )}
      </Form>
    </DialogContainer>
  );
};

export default ClaimModal;
