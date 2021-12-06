import React, { useState } from 'react';
import { prescriptionsColumns } from './prescriptionColumns';
import Table, { Props } from './Table';

const PrescriptionsTable = ({ results }: Props): React.ReactElement => {
  const [currentPage, setCurrentPage] = useState(1);

  const columns = prescriptionsColumns([]);

  return (
    <Table
      columns={columns}
      pagination={{
        current: currentPage,
        onChange: (page, _pageSize) => setCurrentPage(page),
      }}
      results={results}
      total={results?.total || 0}
    />
  );
};

export default PrescriptionsTable;
