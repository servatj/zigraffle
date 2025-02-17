import React from 'react';
import { useServiceDetails } from '../../../../../apis/service/use';
import { useSelectedInvestment } from '../../../../../apis/investment/use';
import InvestorDetailsForService from './InvestorDetailsForService';

const InvestorDetails: React.FC = () => {
  const service = useSelectedInvestment();
  const { data } = useServiceDetails(service.serviceId);
  return (
    <InvestorDetailsForService
      service={{
        serviceLogo: service.serviceLogo,
        serviceName: service.serviceName,
        successFee: data.successFee,
      }}
    />
  );
};

export default InvestorDetails;
