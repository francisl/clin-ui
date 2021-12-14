import React from 'react';
import intl from 'react-intl-universal';
import StackLayout from '@ferlab/ui/core/layout/StackLayout';
import { Tabs } from 'antd';
import { MedicineBoxFilled } from '@ant-design/icons';
import { ic_people } from 'react-icons-kit/md';
import IconKit from 'react-icons-kit';

import { GqlResults } from 'store/graphql/models';
import { ExtendedMappingResults } from 'store/graphql/models';
import { PatientResult } from 'store/graphql/patients/models/Patient';
import { PrescriptionResult } from 'store/graphql/prescriptions/models/Prescription';

import PatientsTable from './table/PatientsTable';
import PrescriptionsTable from './table/PrescriptionsTable';
import ContentHeader from './ContentHeader';

import styles from './ContentContainer.module.scss';

const { TabPane } = Tabs;

export enum TableTabs {
  Patients = 'patients',
  Prescriptions = 'prescriptions',
}
export type PrescriptionResultsContainerProps = {
  prescriptions: GqlResults<PrescriptionResult>;
  extendedMapping: ExtendedMappingResults;
  patients: GqlResults<PatientResult> | null;
  searchResults: GqlResults<PatientResult> | null;
  isLoading?: boolean;
  tabs: {
    currentTab: TableTabs;
    setCurrentTab: (t: TableTabs) => void;
  };
};

const ContentContainer = ({
  patients,
  prescriptions,
  searchResults,
  tabs,
  isLoading = false,
}: PrescriptionResultsContainerProps): React.ReactElement => (
  <StackLayout className={styles.containerLayout} vertical>
    <ContentHeader searchResults={searchResults} />
    <Tabs onChange={(v) => tabs.setCurrentTab(v as TableTabs)} type="card">
      <TabPane
        key={TableTabs.Prescriptions}
        tab={
          <>
            <MedicineBoxFilled />
            {intl.get('screen.patient.tab.prescriptions')}{' '}
            {prescriptions?.total && ` (${prescriptions?.total})`}
          </>
        }
      >
        <StackLayout className={styles.tableContainer} vertical>
          <PrescriptionsTable results={prescriptions} loading={isLoading} />
        </StackLayout>
      </TabPane>
      <TabPane
        key={TableTabs.Patients}
        tab={
          <>
            <IconKit icon={ic_people} />
            {intl.get('header.navigation.patient')} {patients?.total && ` (${patients?.total})`}
          </>
        }
      >
        <StackLayout className={styles.tableContainer} vertical>
          <PatientsTable results={patients} loading={isLoading} />
        </StackLayout>
      </TabPane>
    </Tabs>
  </StackLayout>
);

export default ContentContainer;
