import React from 'react';
import { Table as AntTable, TablePaginationConfig } from 'antd';

import { ItemsCount } from 'components/table/ItemsCount';
import { GqlResults } from 'store/graphql/models';
import { PatientResult } from 'store/graphql/patients/models/Patient';
import { PrescriptionResult } from 'store/graphql/prescriptions/models/Prescription';

import { TColumn } from './columns';

import styles from './table.module.scss';

export type Props = {
  results: GqlResults<PrescriptionResult | PatientResult> | null;
  total: number;
  pagination: TablePaginationConfig;
};

type TableProps = Props & {
  columns: TColumn[];
};

const ITEM_PER_PAGE = 25;

const Table = ({ columns, pagination, results, total }: TableProps): React.ReactElement => (
  <>
    <ItemsCount page={pagination.current || 1} size={ITEM_PER_PAGE} total={total} />
    <AntTable
      className={styles.table}
      columns={columns}
      dataSource={results?.data || []}
      pagination={{
        ...pagination,
        pageSize: ITEM_PER_PAGE,
        position: ['bottomRight'],
        size: 'small',
      }}
    />
  </>
);

export default Table;
