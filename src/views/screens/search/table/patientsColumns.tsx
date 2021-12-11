import intl from 'react-intl-universal';
import { Tooltip } from 'antd';
import { ISyntheticSqon } from '@ferlab/ui/core/data/sqon/types';
import { PatientIdCell } from './cell/LinkCell';

import { TColumn } from './columns';
import { formatDate } from 'utils/date';

import './tableColumn.scss';

export const patientsColumns = (
  sqons: ISyntheticSqon[],
  onLinkClick?: (sqons: ISyntheticSqon[]) => void,
): TColumn[] =>
  [
    {
      name: 'cid',
      summary: false,
      title: intl.get('screen.patientsearch.table.patient'),
      render: (cid: string) => <PatientIdCell id={cid} />,
    },
    {
      name: 'ramq',
      summary: false,
      title: intl.get('screen.patientsearch.table.ramq'),
    },
    {
      name: 'lastName',
      summary: false,
      title: intl.get('screen.patient.details.edit.lastname'),
    },
    {
      name: 'firstName',
      summary: true,
      title: intl.get('screen.patient.details.edit.firstname'),
    },
    {
      name: 'gender',
      summary: true,
      title: intl.get('screen.patientsearch.table.gender'),
    },
    {
      name: 'birthDate',
      summary: false,
      title: (
        <Tooltip placement="topLeft" title={intl.get('standard.format.date')} arrowPointAtCenter>
          {intl.get('screen.patientsearch.table.dob')}
        </Tooltip>
      ),
      render: (date: string) => formatDate(date),
    },
    {
      name: 'timestamp',
      summary: false,
      title: (
        <Tooltip placement="topLeft" title={intl.get('standard.format.date')} arrowPointAtCenter>
          {intl.get('screen.patientsearch.table.dateCreation')}
        </Tooltip>
      ),
      render: (date: string) => formatDate(date),
    },
  ].map((c) => ({
    ...c,
    dataIndex: c.name,
    key: Array.isArray(c.name) ? c.name.join('.') : c.name,
  }));
