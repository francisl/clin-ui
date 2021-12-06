import React from 'react';
import intl from 'react-intl-universal';
import { InfoCircleFilled } from '@ant-design/icons';
import QueryBuilder from '@ferlab/ui/core/components/QueryBuilder';
import { IDictionary } from '@ferlab/ui/core/components/QueryBuilder/types';
import { ISyntheticSqon } from '@ferlab/ui/core/data/sqon/types';
import StackLayout from '@ferlab/ui/core/layout/StackLayout';
import { TablePaginationConfig, Tabs } from 'antd';
import { MedicineBoxFilled } from '@ant-design/icons';
import { ic_people } from 'react-icons-kit/md';
import IconKit from 'react-icons-kit';

import { GqlResults } from 'store/graphql/models';
import { ExtendedMapping, ExtendedMappingResults } from 'store/graphql/models';
import { PatientResult } from 'store/graphql/patients/models/Patient';
import { PrescriptionResult } from 'store/graphql/prescriptions/models/Prescription';

import PatientsTable from './table/PatientsTable';
import PrescriptionsTable from './table/PrescriptionsTable';
import ContentHeader from './ContentHeader';
import history from 'utils/history';

import styles from './ContentContainer.module.scss';

const { TabPane } = Tabs;

export enum TableTabs {
  Patients = 'patients',
  Prescriptions = 'prescriptions',
}
export type PrescriptionResultsContainerProps = {
  prescriptions: GqlResults<PrescriptionResult>;
  extendedMapping: ExtendedMappingResults;
  filters: ISyntheticSqon;
  pagination: TablePaginationConfig;
  patients: GqlResults<PatientResult> | null;
  searchResults: GqlResults<PatientResult> | null;
  tabs: {
    currentTab: TableTabs;
    setCurrentTab: (t: TableTabs) => void;
  };
};

const ContentContainer = ({
  extendedMapping,
  filters,
  pagination,
  patients,
  prescriptions,
  searchResults,
  tabs,
}: PrescriptionResultsContainerProps): React.ReactElement => {
  const total = prescriptions.total || 0;
  const dictionary: IDictionary = {
    query: {
      facet: (key) =>
        extendedMapping?.data?.find((filter: ExtendedMapping) => key === filter.field)
          ?.displayName || key,
    },
  };

  return (
    <StackLayout className={styles.containerLayout} vertical>
      <ContentHeader searchResults={searchResults} />
      <Tabs onChange={(v) => tabs.setCurrentTab(v as TableTabs)} type="card">
        <TabPane
          key={TableTabs.Prescriptions}
          tab={
            <>
              <MedicineBoxFilled />
              {intl.get('screen.patient.tab.prescriptions')}
            </>
          }
        >
          <StackLayout className={styles.tableContainer} vertical>
            <PrescriptionsTable pagination={pagination} results={prescriptions} total={total} />
          </StackLayout>
        </TabPane>
        <TabPane
          key={TableTabs.Patients}
          tab={
            <>
              <IconKit icon={ic_people} />
              {intl.get('header.navigation.patient')}
            </>
          }
        >
          <StackLayout className={styles.tableContainer} vertical>
            <PatientsTable pagination={pagination} results={patients} total={total} />
          </StackLayout>
        </TabPane>
      </Tabs>
    </StackLayout>
  );
};

export default ContentContainer;
