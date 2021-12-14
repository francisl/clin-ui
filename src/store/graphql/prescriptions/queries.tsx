import { gql } from '@apollo/client';

import { fields } from './models/Prescription';

export const PRESCRIPTIONS_QUERY = gql`
  query PrescriptionsInformation ($sqon: JSON, $first: Int, $offset: Int, $sort: [Sort]) {
    Prescriptions {
      hits(filters: $sqon, first: $first, offset: $offset, sort: $sort) {
        edges {
          node {
            id
            cid
            mrn
            ethnicity
            bloodRelationship
            status
            state
            timestamp
            analysis{
              code
              display
            }
            submitted
            authoredOn
            approver{
              cid
              lastName
              firstName
              lastNameFirstName
            }
            prescriber {
              cid
              firstName
              lastName
              lastNameFirstName
            }
            organization {
              cid
              name
            }
            familyInfo {
              cid
              type
            }
            patientInfo {
              cid
              lastName
              firstName
              lastNameFirstName
              gender
              ramq
              position
              fetus
              birthDate
              familyId
              cidText
              organization {
                cid
                name
              }
            }
          }
        }
        total
      }
      aggregations (filters: $sqon){
        ${fields.map(
          (f) =>
            f +
            ' {\n          buckets {\n            key\n            doc_count\n          }\n        }',
        )}
      }
    }
  }
`;

export const PRESCRIPTIONS_SEARCH_QUERY = gql`
  query PrescriptionsInformationSearch($sqon: JSON, $first: Int, $offset: Int) {
    Prescriptions {
      hits(filters: $sqon, first: $first, offset: $offset) {
        edges {
          node {
            cid
            status
            timestamp
            practitioner {
              cid
              firstName
              lastName
            }
            familyInfo {
              cid
              type
            }
            patientInfo {
              cid
              organization {
                name
              }
            }
          }
        }
        total
      }
    }
  }
`;
