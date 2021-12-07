import { ArrangerNodeData, ArrangerResultsTree } from 'store/graphql/models';
import {
  HealthProfessional,
  Organization,
  PatientResult,
} from 'store/graphql/patients/models/Patient';

export type DataCategory = {
  data_category: string;
  count: number;
};

type HitsResultsDataCategory = {
  hits: {
    edges: [
      {
        node: DataCategory;
      },
    ];
  };
};
export interface PrescriptionResult extends ArrangerNodeData {
  mrn: string;
  ethnicity: string;
  bloodRelationship: string;
  status: string;
  timestamp: string;
  analysis: {
    code: string;
    display: string;
  };
  submitted: string;
  authoredOn: string;
  approver: ArrangerResultsTree<HealthProfessional>;
  prescriber: ArrangerResultsTree<HealthProfessional>;
  organization: ArrangerResultsTree<Organization>;
  familyInfo: {
    cid: string;
    type: string;
  };
  patientInfo: PatientResult;
}

export const fields = [
  'status',
  'analysis__code',
  'prescriber__lastNameFirstName',
  'approver__lastNameFirstName',
  'organization__name',
];
