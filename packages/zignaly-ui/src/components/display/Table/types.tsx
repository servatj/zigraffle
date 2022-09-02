import { ChartsProps } from "../Charts/types";
import { BalanceSummaryProps } from "./components/BalanceSummary/types";
import { PercentageIndicatorProps } from "./components/PercentageIndicator/types";
import { ServiceNameProps } from "./components/ServiceName/types";
import { Column } from "react-table";

export const tableTypes = {
  basic: "basic",
  pagedWithData: "pagedWithData",
  pagedWithOutData: "pagedWithOutData",
};

export interface TableBasicProps<T extends object> {
  columns: Array<Column<T>>;
  data: T[];
  defaultHiddenColumns?: string[];
  onColumnHidden?: (column: string, isHidden: boolean) => void;
  hideOptionsButton: boolean;
  isUserTable: boolean;
  maxWidth?: number;
  initialState?: object;
  emptyMessage?: string | JSX.Element;
  isPagingWithAllData?: boolean;
  hasFooter?: boolean;
}

export interface TableProps<T extends object> extends TableBasicProps<T> {
  type?: keyof typeof tableTypes;
}

export interface UserTableData {
  summary: BalanceSummaryProps;
  serviceName: ServiceNameProps;
  chart: ChartsProps;
  dailyAvg: PercentageIndicatorProps;
  oneMonth: PercentageIndicatorProps;
  threeMonths: PercentageIndicatorProps;
  all: PercentageIndicatorProps;
}
