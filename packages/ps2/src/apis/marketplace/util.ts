import { Investment } from '../investment/types';
import { MarketplaceService } from './types';
import { AxisFormat } from '@zignaly-open/ui/lib/components/display/Charts/types';

export function marketplaceServiceToInvestmentType(
  service: MarketplaceService,
): Partial<Investment> {
  return {
    ssc: service.service_type.split('_')[0],
    serviceName: service.name,
    ownerName: service.owner_id,
    sparklines: service.sparklines as unknown as AxisFormat[],
    createdAt: service.created_at,
    pnl30dPct: service.pnl_pct_30t.toString(),
    pnl90dPct: service.pnl_pct_90t.toString(),
    pnl180dPct: service.pnl_pct_180t.toString(),
  };
}
