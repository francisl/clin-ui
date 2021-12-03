import React from 'react';
import intl from 'react-intl-universal';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';

import StackLayout from '@ferlab/ui/core/layout/StackLayout';

import { AutoComplete, Button, Col, Input, Row, Typography } from 'antd';

// import PatientCreation from 'components/screens/PatientCreation';
import { GqlResults } from 'store/graphql/models';
import { PatientResult } from 'store/graphql/patients/models/Patient';
import { createPrescription } from 'utils/bridge';
import { redirectParent } from 'utils/bridge';

import './ContentHeader.scss';

export type PrescriptionResultsContainerProps = {
  searchResults: GqlResults<PatientResult> | null;
};

const autoCompleteResults = (data: PatientResult[]) => {
  console.log('data : ', data);
  return data.map((result) => ({
    label: (
      <>
        <Row className="autocomplete-row">
          <Col>
            <Typography.Text className="autocomplete-row__name">
              {result.lastName.toUpperCase()} {result.firstName}{' '}
              {result.fetus && <i>({intl.get('screen.patient.details.fetus')})</i>}
            </Typography.Text>
          </Col>
          <Col>
            <Typography.Text className="autocomplete-row__mrn">
              {intl.get('screen.patientsearch.table.ramq')}: {result.ramq}
            </Typography.Text>
          </Col>
        </Row>
      </>
    ),
    value: result.id,
  }));
};

const ContentHeader = ({
  searchResults,
}: PrescriptionResultsContainerProps): React.ReactElement => {
  return (
    <StackLayout horizontal>
      <AutoComplete
        allowClear
        autoFocus
        className="auto-complete"
        defaultActiveFirstOption={false}
        onChange={() => {}}
        onSelect={(id) => {
          redirectParent(`/patient/${id}`);
        }}
        options={autoCompleteResults(searchResults?.data || [])}
      >
        <Input
          placeholder={intl.get('screen.patientsearch.placeholder')}
          prefix={<SearchOutlined />}
        />
      </AutoComplete>
      <Button
        className="buttonCreatePrescription"
        onClick={(e) => {
          createPrescription();
        }}
        type="primary"
        size="large"
      >
        <PlusOutlined />
        {intl.get(`screen.patient.creation.createPrescription`)}
      </Button>
    </StackLayout>
  );
};
export default ContentHeader;
