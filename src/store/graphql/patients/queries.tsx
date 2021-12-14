import { gql } from '@apollo/client';

export const PATIENTS_QUERY = gql`
  query PatientsInformation($sqon: JSON, $first: Int, $offset: Int, $sort: [Sort]) {
    Patients {
      hits(filters: $sqon, first: $first, offset: $offset, sort: $sort) {
        edges {
          node {
            id
            cid
            score
            birthDate
            bloodRelationship
            ethnicity
            familyId
            familyType
            fetus
            firstName
            gender
            lastName
            position
            ramq
            timestamp
            mrn
            organization {
              cid
              name
            }
            requests {
              status
              submitted
              analysis {
                code
                display
              }
            }
            practitioner {
              cid
              firstName
              lastName
            }
          }
        }
        total
      }
    }
  }
`;

export const PATIENT_FILES_QUERY = (patientID: string) => gql`
  {
    Patient(id: "${patientID}") {
      id
      docs: DocumentReferenceList(_reference: subject) {
        id
        type @flatten {
          coding @flatten {
            type: code @first @singleton
          }
        }
        context @flatten
        {
          related@first @flatten {
            sample:resource @flatten {
              accessionIdentifier @flatten{value}
            }
          }
        }
        content {
          attachment {
            url
            hash
            title
          }
          format @flatten {
            format: code
          }
        }
      }
    }
  }
`;
