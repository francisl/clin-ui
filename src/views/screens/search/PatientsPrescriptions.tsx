import React, { useState } from 'react';
import intl from 'react-intl-universal';
import { getQueryBuilderCache, useFilters } from '@ferlab/ui/core/data/filters/utils';
import { resolveSyntheticSqon } from '@ferlab/ui/core/data/sqon/utils';
import ScrollView from '@ferlab/ui/core/layout/ScrollView';
import StackLayout, { StackOrientation } from '@ferlab/ui/core/layout/StackLayout';

import { mappedFilters, usePatients } from 'store/graphql/patients/actions';
import { usePrescription, usePrescriptionMapping } from 'store/graphql/prescriptions/actions';

import { TableTabs } from './ContentContainer';
import ContentContainer from './ContentContainer';
import Sidebar from './Sidebar';
import ContentHeader from 'components/Layout/Content/Header';
import styles from './PatientsPrescriptions.module.scss';
import { useParams } from 'react-router';

export const MAX_NUMBER_RESULTS = 1000;

const PrescriptionSearch = (): React.ReactElement => {
  useParams();
  const [currentTab, setCurrentTab] = useState(TableTabs.Prescriptions);
  const { filters: sqonFilters } = useFilters();
  const allSqons = getQueryBuilderCache('prescription-repo').state;

  const newFilters = mappedFilters(sqonFilters);
  const patientQueryConfig = {
    first: MAX_NUMBER_RESULTS,
    offset: 0,
    sqon: resolveSyntheticSqon(allSqons, newFilters),
  };

  const searchResults = usePatients(patientQueryConfig);
  const patients = usePatients(patientQueryConfig);

  const arrangerQueryConfig = {
    first: MAX_NUMBER_RESULTS,
    offset: 0,
    sqon: resolveSyntheticSqon(allSqons, sqonFilters),
  };
  const prescriptions = usePrescription(arrangerQueryConfig);
  const extendedMapping = usePrescriptionMapping();

  return (
    <StackLayout className={styles.layout} orientation={StackOrientation.Vertical}>
      <ContentHeader title={intl.get('screen.patientsearch.title')} />
      <StackLayout className={styles.pageWrapper} orientation={StackOrientation.Horizontal}>
        <Sidebar
          isLoading={prescriptions.loading}
          aggregations={prescriptions.aggregations}
          extendedMapping={extendedMapping}
          filters={sqonFilters}
        />
        <ScrollView className={styles.scrollContent}>
          <ContentContainer
            extendedMapping={extendedMapping}
            filters={sqonFilters}
            patients={patients}
            prescriptions={prescriptions}
            searchResults={searchResults}
            tabs={{
              currentTab,
              setCurrentTab,
            }}
          />
        </ScrollView>
      </StackLayout>
    </StackLayout>
  );
};

export default PrescriptionSearch;
