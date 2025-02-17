import React, { useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Typography, ZigButton } from '@zignaly-open/ui';
import {
  Layout,
  Header,
  Wrapper,
  Side,
  SideImage,
  Margin,
  Center,
  WrapperList,
  WrapperItem,
  WrapperAction,
  InfoBar,
  InfoBarList,
  InfoBarListItem,
  Sections,
  Section,
  FeaturesList,
  Feature,
  FeatureImage,
  FeatureData,
  StepList,
  Step,
  StepImage,
  Box,
  Separator,
} from './styles';
import { FeatureItem, InfoBarItem, HowWorksItem } from './types';
import { useIsAuthenticated } from '../../../../apis/user/use';
import { ROUTE_SIGNUP } from '../../../../routes';
import { useNavigate } from 'react-router-dom';
import { Link } from '@mui/material';
import { useZModal } from '../../../../components/ZModal/use';
import CreateServiceModal from './modals/CreateServiceModal';

const BecomeTraderLanding: React.FC = () => {
  const { t } = useTranslation('offer-your-trading-service');
  const { showModal } = useZModal();
  const isAuthenticated = useIsAuthenticated();
  const navigate = useNavigate();

  const infoBarItems: InfoBarItem[] = useMemo(
    () => [
      {
        title: t('infoBar.item1.title'),
        description: t('infoBar.item1.description'),
      },
      {
        title: t('infoBar.item2.title'),
        description: t('infoBar.item2.description'),
      },
      {
        title: t('infoBar.item3.title'),
        description: t('infoBar.item3.description'),
      },
    ],
    [t],
  );

  const featuresItems: FeatureItem[] = useMemo(
    () => [
      {
        title: t('features.list.item1.title'),
        description: t('features.list.item1.description'),
        image: 'icon-analytics.png',
      },
      {
        title: t('features.list.item2.title'),
        description: t('features.list.item2.description'),
        image: 'icon-tools.png',
      },
      {
        title: t('features.list.item3.title'),
        description: t('features.list.item3.description'),
        image: 'icon-payouts.png',
      },
      {
        title: t('features.list.item4.title'),
        description: t('features.list.item4.description'),
        image: 'icon-marketplace.png',
      },
    ],
    [t],
  );

  const howWorksItems: HowWorksItem[] = useMemo(
    () => [
      {
        title: t('howWorks.list.item1.title'),
        description: t('howWorks.list.item1.description'),
        image: 'pool-funds.png',
      },
      {
        title: t('howWorks.list.item2.title'),
        description: t('howWorks.list.item2.description'),
        image: 'trade.png',
      },
      {
        title: t('howWorks.list.item3.title'),
        description: t('howWorks.list.item3.description'),
        image: 'split-profits.png',
      },
    ],
    [t],
  );

  const onClickCreateService = () => {
    if (isAuthenticated) {
      showModal(CreateServiceModal, {
        ctaId: 'create-service',
      });
    } else {
      navigate(ROUTE_SIGNUP);
    }
  };

  return (
    <Layout>
      <Header>
        <Typography variant={'h1'} color={'neutral100'}>
          {t('header.title')}
        </Typography>
      </Header>

      <Sections>
        <Section>
          <Wrapper>
            <Side>
              <Typography variant={'h2'} color={'neutral100'}>
                {t('wrapper.title')}
              </Typography>
              <WrapperList>
                <WrapperItem>
                  <Typography variant={'body1'} color={'neutral300'}>
                    {t('wrapper.list.item1')}
                  </Typography>
                </WrapperItem>
                <WrapperItem>
                  <Typography variant={'body1'} color={'neutral300'}>
                    {t('wrapper.list.item2')}
                  </Typography>
                </WrapperItem>
                <WrapperItem>
                  <Typography variant={'body1'} color={'neutral300'}>
                    <Trans i18nKey={'wrapper.list.item3'} t={t}>
                      <Link
                        underline={'hover'}
                        href={
                          'https://help.zignaly.com/en/articles/6845502-rules-for-being-listed-in-the-marketplace'
                        }
                        target={'_blank'}
                      />
                    </Trans>
                  </Typography>
                </WrapperItem>
              </WrapperList>
              <WrapperAction>
                <ZigButton
                  id={'offer-service__create-service'}
                  size={'large'}
                  variant={'contained'}
                  onClick={onClickCreateService}
                >
                  {t('wrapper.action')}
                </ZigButton>
              </WrapperAction>
            </Side>
            <SideImage />
          </Wrapper>
        </Section>

        <InfoBar>
          <Margin>
            <InfoBarList itemsLength={infoBarItems.length}>
              {infoBarItems.map((item, index) => (
                <InfoBarListItem key={`--info-bar-item-${index.toString()}`}>
                  <Typography variant={'bigNumber'} color={'neutral100'}>
                    {item.title}
                  </Typography>
                  <Typography variant={'body1'} color={'neutral400'}>
                    {item.description.toUpperCase()}
                  </Typography>
                </InfoBarListItem>
              ))}
            </InfoBarList>
          </Margin>
        </InfoBar>

        <Section>
          <Typography variant={'h2'} color={'neutral100'}>
            {t('howWorks.title')}
          </Typography>

          <StepList itemsLength={howWorksItems.length}>
            {howWorksItems.map((howWorkItem, index) => (
              <React.Fragment key={`--how-works-item-${index.toString()}`}>
                <Step>
                  <Box>
                    <Center>
                      <Typography variant={'h2'} color={'neutral100'}>
                        {howWorkItem.title.toUpperCase()}
                      </Typography>
                      <StepImage
                        src={'/images/service-provider/' + howWorkItem.image}
                      />
                    </Center>
                    <Typography variant={'body2'} color={'neutral400'}>
                      {howWorkItem.description}
                    </Typography>
                  </Box>
                </Step>
                {index < howWorksItems.length - 1 && <Separator />}
              </React.Fragment>
            ))}
          </StepList>
        </Section>

        <Section>
          <Typography variant={'h2'} color={'neutral100'}>
            {t('features.title')}
          </Typography>

          <FeaturesList itemsLength={featuresItems.length}>
            {featuresItems.map((feature, index) => (
              <Feature key={`--features-item-${index.toString()}`}>
                <FeatureImage
                  src={'/images/service-provider/' + feature.image}
                />
                <FeatureData>
                  <Typography variant={'h3'} color={'neutral200'}>
                    {feature.title}
                  </Typography>
                  <Typography variant={'body2'} color={'neutral400'}>
                    {feature.description}
                  </Typography>
                </FeatureData>
              </Feature>
            ))}
          </FeaturesList>
        </Section>
      </Sections>
    </Layout>
  );
};

export default BecomeTraderLanding;
