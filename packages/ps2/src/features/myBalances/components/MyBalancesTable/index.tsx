import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components';
import { useActiveExchange } from '../../../auth/use';
import { useFetchMyBalances, useSelectMyBalances } from '../../use';
import {
  Table,
  PriceLabel,
  CoinLabel,
  customSort,
  Loader,
  ExpandableInput,
  SearchIcon,
} from '@zignaly-open/ui';
import Theme from '@zignaly-open/ui/lib/theme/theme';
import { MyBalancesTableDataType } from './types';
import { TableProps } from '@zignaly-open/ui/lib/components/display/Table/types';
import { TableHead } from './styles';

const MyBalancesTable = (): JSX.Element => {
  const theme = useTheme() as Theme;
  const { t } = useTranslation('my-balances');

  const currentExchange = useActiveExchange();

  const balances = useSelectMyBalances();
  const [{ isLoading }, fetchBalances] = useFetchMyBalances();

  const [searchBy, setSearchBy] = useState('');

  /**
   * Fetch the myBalances of the user.
   */
  useEffect(() => {
    if (currentExchange) {
      fetchBalances(currentExchange);
    }
  }, [currentExchange?.internalId, currentExchange?.exchangeType]);

  /**
   * @name columns
   * @description Set the columns for balance table.
   */
  const columns: TableProps<MyBalancesTableDataType>['columns'] = useMemo(
    () => [
      {
        Header: t('my-balances.tableHeader.coin'),
        accessor: 'coin',
        Cell: ({ cell: { value } }) => (
          <CoinLabel coin={value.symbol} name={value.name} />
        ),
        sortType: (a, b) => customSort(a.values.symbol, b.values.symbol),
      },
      {
        Header: t('my-balances.tableHeader.totalBalance'),
        accessor: 'total',
        Cell: ({ cell: { value } }) => (
          <PriceLabel coin={value.symbol} value={value.balanceTotal} />
        ),
        sortType: (a, b) =>
          customSort(a.values.total.balanceTotal, b.values.total.balanceTotal),
      },
      {
        Header: t('my-balances.tableHeader.availableBalance'),
        accessor: 'available',
        Cell: ({ cell: { value } }) => (
          <PriceLabel coin={value.symbol} value={value.balanceFree} />
        ),
        sortType: (a, b) =>
          customSort(
            a.values.available.balanceFree,
            b.values.available.balanceFree,
          ),
      },
      {
        Header: t('my-balances.tableHeader.lockedBalance'),
        accessor: 'locked',
        Cell: ({ cell: { value } }) => (
          <PriceLabel coin={value.symbol} value={value.balanceLocked} />
        ),
        sortType: (a, b) =>
          customSort(a.values.balanceLocked, b.values.balanceLocked),
      },
      {
        Header: t('my-balances.tableHeader.valueBTC'),
        accessor: 'valueBTC',
        Cell: ({ cell: { value } }) => (
          <PriceLabel coin={'btc'} value={value.balanceTotalBTC} />
        ),
        sortType: (a, b) =>
          customSort(
            a.values.valueBTC.balanceTotalBTC,
            b.values.valueBTC.balanceTotalBTC,
          ),
      },
      {
        Header: t('my-balances.tableHeader.valueUSD'),
        accessor: 'valueUSD',
        Cell: ({ cell: { value } }) => (
          <PriceLabel coin={value.symbol} value={value.balanceTotalUSDT} />
        ),
        sortType: (a, b) =>
          customSort(
            a.values.valueUSD.balanceTotalUSDT,
            b.values.valueUSD.balanceTotalUSDT,
          ),
      },
    ],
    [t],
  );

  /**
   * @name data
   * @description Format and serialize data for the balances table columns.
   */
  const data = useMemo(
    () =>
      Object.entries(balances)
        .filter((coin) => {
          const symbol = String(coin[0]);
          const { name } = coin[1];

          if (
            searchBy.trim().length &&
            !(symbol.toLowerCase().indexOf(searchBy.toLowerCase()) > -1) &&
            !(String(name.toLowerCase()).indexOf(searchBy.toLowerCase()) > -1)
          ) {
            return null;
          }
          return coin;
        })
        .map(([coin, balance]) => ({
          coin: { symbol: coin, name: balance.name },
          total: {
            symbol: coin,
            balanceTotal: balance.balanceTotal,
          },
          available: {
            symbol: coin,
            balanceFree: balance.balanceFree,
          },
          locked: {
            symbol: coin,
            balanceLocked: balance.balanceLocked,
          },
          valueBTC: {
            symbol: coin,
            balanceTotalBTC: balance.balanceTotalBTC,
          },
          valueUSD: {
            symbol: coin,
            balanceTotalUSDT: balance.balanceTotalUSDT,
          },
        })),
    [balances, searchBy],
  );

  /**
   * @name initialStateTable
   * @description Set the default configuration for the table component.
   */
  const initialStateTable = {
    sortBy: [
      {
        id: 'totalBalance',
        desc: false,
      },
    ],
  };

  const handleSearchCoin = useCallback((value) => {
    setSearchBy(value);
  }, []);

  if (isLoading) {
    return <Loader color={theme.neutral300} ariaLabel={'Loading myBalances'} />;
  }

  return (
    <>
      <TableHead>
        <ExpandableInput
          icon={<SearchIcon width={14} height={14} color={theme.neutral300} />}
          value={searchBy}
          onChange={handleSearchCoin}
          placeholder={t('my-balances.table-search-placeholder')}
        />
      </TableHead>
      <Table
        type={'pagedWithData'}
        columns={columns}
        data={data}
        initialState={initialStateTable}
        hideOptionsButton={false}
        isUserTable={false}
      />
    </>
  );
};

export default MyBalancesTable;
