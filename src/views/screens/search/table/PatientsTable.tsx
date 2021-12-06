import React, { useState } from 'react';
import { patientsColumns } from './patientsColumns';
import Table, { Props } from './Table';

const PatientsTable = ({ results }: Props): React.ReactElement => {
  const [currentPage, setCurrentPage] = useState(1);

  const columns = patientsColumns([]);
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

export default PatientsTable;
