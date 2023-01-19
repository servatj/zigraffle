import React, { useMemo, useState } from 'react';
import {
  EditServicePayload,
  Service,
  TraderServiceAccessLevel,
} from '../../../../apis/service/types';
import { Box, Grid, InputAdornment } from '@mui/material';
import {
  ZigButton,
  ZigInput,
  ZigSelect,
  ZigTypography,
} from '@zignaly-open/ui';
import { Trans, useTranslation } from 'react-i18next';
import ServiceLogo from './atoms/ServiceLogo';
import { yupResolver } from '@hookform/resolvers/yup';
import { EditServiceValidation } from './validations';
import { Controller, useForm } from 'react-hook-form';
import { useTraderServiceEditMutation } from 'apis/service/api';
import { VISIBILITY_LABEL } from './types';
import { StyledZigSelect } from './styles';
import { ExternalLink } from 'components/AnchorLink';
import { HELP_CREATE_SERVICE_MARKETPLACE_URL } from 'util/constants';
import { useNavigate } from 'react-router-dom';
import { useUpdateEffect } from 'react-use';

const getVisibility = (level: number) => {
  if (level < 100) {
    return 0;
  } else if (level < 200) {
    return 100;
  } else if (level < 500) {
    return 200;
  } else {
    return 500;
  }
};

const EditServiceProfileContainer: React.FC<{ service: Service }> = ({
  service,
}) => {
  const { t } = useTranslation('service');
  const defaultValues = {
    name: service.name,
    description: service.description,
    maximumSbt: service.maximumSbt,
    successFee: service.successFee,
  };
  const {
    handleSubmit,
    control,
    setError,
    formState: { errors },
    register,
    reset,
  } = useForm<EditServicePayload>({
    mode: 'onTouched',
    reValidateMode: 'onBlur',
    defaultValues,
    resolver: yupResolver(EditServiceValidation),
  });
  const [edit, editStatus] = useTraderServiceEditMutation();
  const [visibility, setVisibility] = useState(getVisibility(service.level));
  const navigate = useNavigate();

  const submit = async (data: EditServicePayload) => {
    console.log(data);
    await edit({ id: service.id, ...data, level: visibility });
    back();
  };

  useUpdateEffect(() => {
    reset(defaultValues);
    setVisibility(getVisibility(service.level));
  }, [service.id]);

  const visibilityOptions = useMemo(
    () => [
      {
        value: TraderServiceAccessLevel.Solo,
        label: t('edit.visibility.unlisted'),
        disabled: true,
      },
      {
        value: TraderServiceAccessLevel.Private,
        label: t('edit.visibility.private'),
      },
      {
        value: TraderServiceAccessLevel.Public,
        label: t('edit.visibility.public'),
      },
      {
        value: TraderServiceAccessLevel.Marketplace,
        label: t('edit.visibility.marketplace'),
        disabled: true,
      },
    ],
    [t],
  );

  const selectStyles: React.ComponentProps<typeof ZigSelect>['styles'] = {
    option: (styles, { data }) => {
      const { value } = data as { value: number };
      if (value === 0 || value === 500) {
        return {
          display: 'none',
        };
      }
      return {
        ...styles,
        cursor: 'pointer',
        color: VISIBILITY_LABEL[value].color,
        fontSize: '17px',
        padding: '16px 14px',
      };
    },
  };

  const back = () => navigate(`/profit-sharing/${service.id}`);

  return (
    <Box onSubmit={handleSubmit(submit)} component='form' pt={7}>
      <ZigTypography textAlign='center' variant='h1'>
        {t('edit.title')}
      </ZigTypography>
      <Grid container mt={8}>
        <Grid item xs={12} md={2} pb={2} pr={7.5}>
          <ServiceLogo service={service} />
        </Grid>
        <Grid container xs={12} md={7} pb={2} alignItems='flex-start' gap={6}>
          <Controller
            name='name'
            control={control}
            render={({ field }) => (
              <ZigInput
                fullWidth
                label={t('edit.name')}
                error={t(errors.name?.message)}
                {...field}
              />
            )}
          />
          <Controller
            name='description'
            control={control}
            render={({ field }) => (
              <ZigInput
                fullWidth
                label={t('edit.description')}
                error={t(errors.description?.message)}
                multiline
                inputProps={{
                  style: {
                    height: '384px',
                  },
                }}
                {...field}
              />
            )}
          />
          <Grid item container columnSpacing={6}>
            <Grid item md={6} sm={12}>
              <Controller
                name='successFee'
                control={control}
                render={({ field }) => (
                  <ZigInput
                    type='number'
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>%</InputAdornment>
                      ),
                    }}
                    fullWidth
                    label={
                      <div>
                        {t('summary.success-fee')}
                        <ZigTypography variant='h4' color='neutral400'>
                          {t('edit.success-fee-desc')}
                        </ZigTypography>
                      </div>
                    }
                    error={t(errors.successFee?.message)}
                    {...field}
                  />
                )}
              />
            </Grid>
            <Grid item md={6} sm={12}>
              <Controller
                name='maximumSbt'
                control={control}
                render={({ field }) => (
                  <ZigInput
                    type='number'
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          {service.ssc}
                        </InputAdornment>
                      ),
                    }}
                    fullWidth
                    label={
                      <div>
                        {t('edit.pool-size')}
                        <ZigTypography variant='h4' color='neutral400'>
                          {t('edit.pool-size-desc')}
                        </ZigTypography>
                      </div>
                    }
                    error={t(errors.maximumSbt?.message)}
                    {...field}
                  />
                )}
              />
            </Grid>
          </Grid>
          <Grid item container columnSpacing={6} alignItems='center'>
            <Grid item md={6} sm={12}>
              <StyledZigSelect
                options={visibilityOptions}
                label={t('edit.visibility.visibility')}
                value={visibility}
                onChange={setVisibility}
                styles={selectStyles}
              />
              <ZigTypography variant='h4' color='neutral400'>
                {t(`edit.visibility.${VISIBILITY_LABEL[visibility].key}-desc`)}
              </ZigTypography>
            </Grid>
            <Grid
              item
              md={6}
              sm={12}
              alignItems='center'
              justifyContent='center'
              display='flex'
              pt={1}
            >
              <ZigTypography variant='h4' color='neutral400'>
                <Trans
                  i18nKey={'edit.visibility.marketplace-requirements'}
                  t={t}
                  components={[
                    <ExternalLink href={HELP_CREATE_SERVICE_MARKETPLACE_URL} />,
                  ]}
                />
              </ZigTypography>
            </Grid>
          </Grid>
          <Grid item container justifyContent='flex-end' spacing={1} gap={2}>
            <ZigButton variant='outlined' size='large' onClick={back}>
              {t('action:cancel')}
            </ZigButton>
            <ZigButton
              variant='contained'
              type='submit'
              loading={editStatus.isLoading}
              size='large'
            >
              {t('edit.save')}
            </ZigButton>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EditServiceProfileContainer;
