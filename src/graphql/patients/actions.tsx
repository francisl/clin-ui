import { GqlResults, hydrateResults } from 'graphql/models';
import { ExtendedMapping } from 'graphql/models';
import { PatientFileResults, PatientResult } from 'graphql/patients/models/Patient';
import { QueryVariable } from 'graphql/queries';
import { INDEX_EXTENDED_MAPPING } from 'graphql/queries';
import { useLazyResultQuery, useLazyResultQueryOnLoadOnly } from 'graphql/utils/query';

import { IValueContent, ISyntheticSqon } from '@ferlab/ui/core/data/sqon/types';
import { PATIENTS_QUERY, PATIENT_FILES_QUERY } from './queries';

export const mappedFilters = (sqonFilters: ISyntheticSqon): ISyntheticSqon => {
  const mappedPrescriptionsToPatients = {
    ...sqonFilters,
  };

  const newContent = mappedPrescriptionsToPatients.content.map((c) => {
    if (typeof c !== 'object') {
      return c;
    }

    const cc = c.content as IValueContent;
    return {
      ...c,
      content: {
        ...cc,
        field: `requests.${cc.field}`,
      },
    };
  });

  mappedPrescriptionsToPatients.content = newContent;
  return mappedPrescriptionsToPatients;
};

export const usePatients = (variables: QueryVariable): GqlResults<PatientResult> => {
  const { loading, result, refetch } = useLazyResultQuery<any>(PATIENTS_QUERY, {
    variables: variables,
  });
  const patients = result?.Patients;

  return {
    aggregations: patients?.aggregations,
    data: hydrateResults(patients?.hits?.edges || []),
    loading,
    total: patients?.hits.total,
    refetch
  };
};

export type ExtendedMappingResults = {
  loading: boolean;
  data: ExtendedMapping[];
};

export const usePatientsMapping = (): ExtendedMappingResults => {
  const { loading, result } = useLazyResultQuery<any>(INDEX_EXTENDED_MAPPING('Patients'), {
    variables: [],
  });

  return {
    data: result?.Patients.extended,
    loading: loading,
  };
};

export const usePatientFilesData = (
  patientId: string,
  skip?: boolean
): {
  loading: boolean;
  results: PatientFileResults;
  error: any;
} => {
  const { loading, data, error } = useLazyResultQueryOnLoadOnly<any>(
    PATIENT_FILES_QUERY(patientId),
    {
      variables: {
        patientId: patientId,
      },
      skip: skip
    },
  );

  return {
    loading,
    results: data?.Patient,
    error,
  };
};
